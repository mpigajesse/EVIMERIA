FROM python:3.11-slim

WORKDIR /app

# Installer les outils nécessaires
RUN apt-get update && apt-get install -y --no-install-recommends \
    postgresql-client \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copier et installer les dépendances
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn psycopg2-binary dj-database-url whitenoise

# Copier le code source
COPY . .

# Variables d'environnement
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=8000
ENV DJANGO_ALLOWED_HOSTS=*.up.railway.app,*.railway.app,localhost,127.0.0.1,0.0.0.0
ENV ALLOWED_HOSTS=*.up.railway.app,*.railway.app,localhost,127.0.0.1,0.0.0.0

# Collectstatic (avant le démarrage pour optimiser)
RUN python manage.py collectstatic --noinput

# Exposer le port
EXPOSE 8000

# Commande de démarrage simplifiée
CMD python manage.py migrate && gunicorn jaelleshop.wsgi:application --bind 0.0.0.0:$PORT --log-level debug