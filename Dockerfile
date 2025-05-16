FROM python:3.11-slim

WORKDIR /app

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
ENV DJANGO_ALLOWED_HOSTS=*.up.railway.app,localhost,127.0.0.1
ENV RAILWAY_DEPLOYMENT=True

# Exposer le port
EXPOSE 8000

# Collectstatic avant le démarrage
RUN python manage.py collectstatic --noinput

# Commande de démarrage
CMD ["sh", "-c", "python manage.py migrate && gunicorn jaelleshop.wsgi:application --bind 0.0.0.0:8000"]