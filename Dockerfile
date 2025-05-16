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

# Créer un script d'initialisation de la base de données - Plus simple
COPY <<EOF /app/init_db.sh
#!/bin/bash
echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.filter(username='admin').exists() or User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword123')" | python manage.py shell
echo "Superuser admin created successfully"
EOF

RUN chmod +x /app/init_db.sh

# Créer un script de démarrage - Plus simple
COPY <<EOF /app/start.sh
#!/bin/bash
echo "Starting EVIMERIA on Railway..."
echo "Environment: Railway Deployment"
echo "PORT: \$PORT"
echo "ALLOWED_HOSTS: \$DJANGO_ALLOWED_HOSTS"

# Vérifier la connexion à la base de données
if [ -n "\$DATABASE_URL" ]; then
  echo "Database connection configured"
  
  # Attendre que la base de données soit disponible
  echo "Waiting for PostgreSQL database..."
  for i in {1..30}; do
    echo "Attempt \$i/30..."
    python -c "import psycopg2, os, time; time.sleep(1); 
    try:
        conn=psycopg2.connect(os.environ['DATABASE_URL'])
        conn.close()
        print('Connected!')
        exit(0)
    except Exception as e:
        print(f'Error: {e}')
        exit(1)" && break || echo "Connection failed, retrying..."
    
    if [ \$i -eq 30 ]; then
      echo "Database connection failed after 30 attempts. Proceeding anyway..."
    fi
    sleep 1
  done
else
  echo "No DATABASE_URL found. Using default database."
fi

# Exécuter les migrations
echo "Running migrations..."
python manage.py migrate --noinput

# Initialiser la base de données avec un superutilisateur
echo "Initializing database with default data..."
/app/init_db.sh

# Vérifier l'application Django
echo "Checking Django application..."
python manage.py check

# Liste des tables dans la base de données
echo "Listing database tables..."
python -c "from django.db import connection; cursor = connection.cursor(); cursor.execute('SELECT table_name FROM information_schema.tables WHERE table_schema = \\'public\\''); print([x[0] for x in cursor.fetchall()])"

# Démarrer Gunicorn
if [ -n "\$PORT" ] && [ "\$PORT" != "8000" ]; then
  echo "Binding to Railway PORT: \$PORT"
  gunicorn jaelleshop.wsgi:application --bind 0.0.0.0:\$PORT --log-level debug
else
  echo "Binding to default port: 8000"
  gunicorn jaelleshop.wsgi:application --bind 0.0.0.0:8000 --log-level debug
fi
EOF

RUN chmod +x /app/start.sh

# Commande de démarrage
CMD ["/app/start.sh"]