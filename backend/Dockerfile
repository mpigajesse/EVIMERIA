FROM python:3.11-slim

WORKDIR /app

# Outils essentiels
RUN apt-get update && apt-get install -y --no-install-recommends \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copier le code source
COPY . .

# Rendre le script d'entrée exécutable
RUN chmod +x /app/railway_entrypoint.sh

# Installer les dépendances
RUN pip install --no-cache-dir -r requirements.txt

# Variables d'environnement
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV DJANGO_SETTINGS_MODULE=jaelleshop.settings
ENV PORT=8000

# Collecte statique
RUN python manage.py collectstatic --noinput

# Exposer le port
EXPOSE $PORT

# Utiliser le script d'entrée
CMD ["/app/railway_entrypoint.sh"]