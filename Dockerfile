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
RUN pip install --no-cache-dir dj-database-url

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

# Créer un script d'initialisation de la base de données
RUN echo '#!/bin/bash\n\
# Créer un superutilisateur par défaut\n\
echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.filter(username=\"admin\").exists() or User.objects.create_superuser(\"admin\", \"admin@example.com\", \"adminpassword123\")" | python manage.py shell\n\
echo "Superuser admin created successfully"\n\
' > /app/init_db.sh && chmod +x /app/init_db.sh

# Créer un script de démarrage
RUN echo '#!/bin/bash\n\
echo "Starting EVIMERIA on Railway..."\n\
echo "Environment: Railway Deployment"\n\
echo "PORT: $PORT"\n\
echo "ALLOWED_HOSTS: $DJANGO_ALLOWED_HOSTS"\n\
\n\
# Vérifier la connexion à la base de données\n\
if [ -n "$DATABASE_URL" ]; then\n\
  echo "Database connection configured. Analyzing DATABASE_URL..."\n\
  \n\
  # Attendre que la base de données soit disponible\n\
  echo "Waiting for PostgreSQL database..."\n\
  # Technique plus simple pour attendre que la base de données soit prête\n\
  for i in {1..30}; do\n\
    echo "Attempt $i/30..."\n\
    python -c "import psycopg2, os, time; time.sleep(1); conn=psycopg2.connect(os.environ[\"DATABASE_URL\"]); conn.close()" && break || echo "Connection failed, retrying..."\n\
    if [ $i -eq 30 ]; then\n\
      echo "Database connection failed after 30 attempts. Proceeding anyway..."\n\
    fi\n\
    sleep 1\n\
  done\n\
else\n\
  echo "No DATABASE_URL found. Using default database."\n\
fi\n\
\n\
# Exécuter les migrations\n\
echo "Running migrations..."\n\
python manage.py migrate --noinput\n\
\n\
# Initialiser la base de données avec un superutilisateur si nécessaire\n\
echo "Initializing database with default data..."\n\
/app/init_db.sh\n\
\n\
# Vérifier l\'état de l\'application Django\n\
echo "Checking Django application..."\n\
python manage.py check\n\
\n\
# Liste des tables dans la base de données\n\
echo "Listing database tables..."\n\
python -c "from django.db import connection; cursor = connection.cursor(); cursor.execute(\"SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\'\"); print([x[0] for x in cursor.fetchall()])"\n\
\n\
# Si Railway définit un PORT différent, utilisez-le\n\
if [ -n "$PORT" ] && [ "$PORT" != "8000" ]; then\n\
  echo "Binding to Railway PORT: $PORT"\n\
  gunicorn jaelleshop.wsgi:application --bind 0.0.0.0:$PORT --log-level debug\n\
else\n\
  echo "Binding to default port: 8000"\n\
  gunicorn jaelleshop.wsgi:application --bind 0.0.0.0:8000 --log-level debug\n\
fi' > /app/start.sh && chmod +x /app/start.sh

# Commande de démarrage
CMD ["/app/start.sh"]