FROM python:3.11-slim

WORKDIR /app

# Outils essentiels
RUN apt-get update && apt-get install -y --no-install-recommends \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copier et installer les dépendances
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copier le code source
COPY . .

# Variables d'environnement essentielles
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV DJANGO_SETTINGS_MODULE=jaelleshop.settings
ENV PORT=8000

# Exécution pre-démarrage
RUN python manage.py collectstatic --noinput

# Exposer le port
EXPOSE 8000
EXPOSE ${PORT}

# Script de démarrage simplifié
RUN echo '#!/bin/bash\necho "DJANGO_SETTINGS_MODULE=$DJANGO_SETTINGS_MODULE"\necho "APPLICATION_WSGI=railway_wsgi"\necho "PORT=$PORT"\npython manage.py migrate\necho "Démarrage de Gunicorn..."\nexec gunicorn railway_wsgi:application --bind 0.0.0.0:${PORT:-8000} --log-level debug' > /app/start.sh
RUN chmod +x /app/start.sh

# Commande de démarrage (simple)
CMD ["/app/start.sh"]