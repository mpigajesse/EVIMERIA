FROM python:3.11-slim

WORKDIR /app

# Outils essentiels et netcat
RUN apt-get update && apt-get install -y --no-install-recommends \
    postgresql-client \
    netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

# Copier le code source
COPY . .

# Variables d'environnement essentielles
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV DJANGO_SETTINGS_MODULE=jaelleshop.settings
ENV PORT=8000

# Installer les dépendances
RUN pip install --no-cache-dir -r requirements.txt

# Script de démarrage ultra-simplifié
RUN echo '#!/bin/sh\n\
echo "=== DÉMARRAGE EVIMERIA (BACKEND) ==="\n\
echo "DJANGO_SETTINGS_MODULE=$DJANGO_SETTINGS_MODULE"\n\
\n\
echo "Exécution des migrations..."\n\
python manage.py migrate --noinput\n\
\n\
echo "Collecte des fichiers statiques..."\n\
python manage.py collectstatic --noinput\n\
\n\
echo "Démarrage de Gunicorn..."\n\
exec gunicorn jaelleshop.wsgi:application --bind 0.0.0.0:$PORT\n\
' > /app/start.sh

RUN chmod +x /app/start.sh

# Exposer le port
EXPOSE $PORT

# Commande de démarrage
CMD ["/app/start.sh"]