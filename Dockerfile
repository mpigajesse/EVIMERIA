FROM python:3.11-slim

WORKDIR /app

# Installer les utilitaires pour le débogage
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    procps \
    net-tools \
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
python manage.py migrate\n\
python manage.py check\n\
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