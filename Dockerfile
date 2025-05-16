FROM python:3.11-slim

WORKDIR /app

# Installer les utilitaires pour le débogage
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    procps \
    net-tools \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Installer les dépendances Python
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copier le code source du backend
COPY backend/ .

# Créer les répertoires nécessaires
RUN mkdir -p /app/static /app/media && chmod -R 755 /app/static /app/media

# Variables d'environnement
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV DEBUG=False
ENV DJANGO_ALLOWED_HOSTS=*.up.railway.app,localhost,127.0.0.1,0.0.0.0,evimeria-production.up.railway.app
ENV RAILWAY_DEPLOYMENT=True
ENV PORT=8000

# Exposer le port (à la fois 8000 pour Gunicorn et le PORT de Railway)
EXPOSE 8000
EXPOSE ${PORT}

# Healthcheck Docker
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/health/ || exit 1

# Collectstatic avant le démarrage
RUN python manage.py collectstatic --noinput

# Créer un script de démarrage
RUN echo '#!/bin/bash\n\
echo "Starting EVIMERIA on Railway..."\n\
echo "Environment: Railway Deployment"\n\
echo "PORT: $PORT"\n\
echo "ALLOWED_HOSTS: $DJANGO_ALLOWED_HOSTS"\n\
\n\
# Vérifier la connexion à la base de données\n\
if [ -n "$DATABASE_URL" ]; then\n\
  echo "Database connection configured. Attempting to connect..."\n\
  # Extraire les informations de connexion de DATABASE_URL\n\
  DB_HOST=$(echo $DATABASE_URL | sed -n "s/^.*@\\(.*\\):.*/\\1/p")\n\
  DB_PORT=$(echo $DATABASE_URL | sed -n "s/^.*:$$\([0-9]*\).*/\\1/p")\n\
  DB_NAME=$(echo $DATABASE_URL | sed -n "s/^.*\\/\\(.*\\)?.*/\\1/p")\n\
  \n\
  # Attendre que la base de données soit disponible\n\
  echo "Waiting for PostgreSQL database..."\n\
  for i in {1..30}; do\n\
    pg_isready -h $DB_HOST -p $DB_PORT && break\n\
    echo "Waiting for database connection... ($i/30)"\n\
    sleep 1\n\
  done\n\
  \n\
  # Vérifier si la base de données est disponible\n\
  if pg_isready -h $DB_HOST -p $DB_PORT; then\n\
    echo "Database is ready. Proceeding with migrations."\n\
    \n\
    # Vérifier si la base de données est initialisée\n\
    echo "Checking if database is initialized..."\n\
    if python manage.py showmigrations | grep -q "[X]"; then\n\
      echo "Database already has some migrations applied."\n\
    else\n\
      echo "Database seems empty. Running initial migrations..."\n\
      python manage.py migrate auth\n\
      python manage.py migrate admin\n\
      python manage.py migrate contenttypes\n\
      python manage.py migrate sessions\n\
    fi\n\
    \n\
    # Exécuter toutes les migrations\n\
    echo "Running all migrations..."\n\
    python manage.py migrate\n\
    \n\
    # Vérifier si un superuser existe déjà\n\
    echo "Checking if superuser exists..."\n\
    if ! python manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); exit(User.objects.filter(is_superuser=True).exists())"; then\n\
      echo "Creating initial superuser..."\n\
      python manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.create_superuser(\"admin\", \"admin@evimeria.com\", \"admin123\") if not User.objects.filter(username=\"admin\").exists() else None"\n\
    fi\n\
  else\n\
    echo "Database connection failed after 30 attempts. Proceeding anyway..."\n\
  fi\n\
else\n\
  echo "No DATABASE_URL found. Using default database."\n\
  python manage.py migrate\n\
fi\n\
\n\
# Vérifier l\'état de l\'application Django\n\
echo "Checking Django application..."\n\
python manage.py check\n\
\n\
# Démarrer avec le mode de débogage pour voir les erreurs\n\
echo "Starting with debug mode for first-time setup..."\n\
python manage.py runserver 0.0.0.0:$PORT &\n\
echo "Waiting for Django to initialize (5 seconds)..."\n\
sleep 5\n\
kill $!\n\
\n\
# Si Railway définit un PORT différent, utilisez-le\n\
if [ -n "$PORT" ] && [ "$PORT" != "8000" ]; then\n\
  echo "Binding to Railway PORT: $PORT"\n\
  gunicorn jaelleshop.wsgi:application --bind 0.0.0.0:$PORT --log-level debug --timeout 120\n\
else\n\
  echo "Binding to default port: 8000"\n\
  gunicorn jaelleshop.wsgi:application --bind 0.0.0.0:8000 --log-level debug --timeout 120\n\
fi' > /app/start.sh && chmod +x /app/start.sh

# Commande de démarrage
CMD ["/app/start.sh"]