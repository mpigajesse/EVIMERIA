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

# Exécution pre-démarrage
RUN python manage.py collectstatic --noinput

# Exposer le port
EXPOSE 8000

# Commande de démarrage (simple)
CMD python manage.py migrate && gunicorn jaelleshop.wsgi:application --bind 0.0.0.0:${PORT:-8000}