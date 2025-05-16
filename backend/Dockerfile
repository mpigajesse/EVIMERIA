FROM python:3.11-slim

WORKDIR /app

# Installer les outils nécessaires
RUN apt-get update && apt-get install -y --no-install-recommends \
    postgresql-client \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copier et installer les dépendances
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copier le code source
COPY . .

# Collectstatic (avant le démarrage pour optimiser)
RUN python manage.py collectstatic --noinput

# Variables d'environnement
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=8000

# Exposer le port
EXPOSE 8000

# Script de démarrage
RUN echo '#!/bin/bash \n\
echo "Démarrage de EVIMERIA sur Railway..." \n\
echo "Exécution des migrations..." \n\
python manage.py migrate --noinput \n\
echo "Démarrage du serveur..." \n\
gunicorn jaelleshop.wsgi:application --bind 0.0.0.0:$PORT --log-level info \n\
' > /app/start.sh && chmod +x /app/start.sh

# Démarrer l'application
CMD ["/app/start.sh"]