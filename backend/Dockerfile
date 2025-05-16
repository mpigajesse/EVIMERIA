FROM python:3.11-slim

WORKDIR /app

# Installer les outils nécessaires
RUN apt-get update && apt-get install -y --no-install-recommends \
    postgresql-client \
    curl \
    netcat-traditional \
    && rm -rf /var/lib/apt/lists/*

# Copier et installer les dépendances
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copier le code source
COPY . .

# Variables d'environnement
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=8000
ENV DJANGO_ALLOWED_HOSTS="*.up.railway.app,*.railway.app,localhost,127.0.0.1,0.0.0.0"
ENV ALLOWED_HOSTS="*.up.railway.app,*.railway.app,localhost,127.0.0.1,0.0.0.0"

# Créer un script d'attente pour PostgreSQL
RUN echo '#!/bin/bash\n\
# Extraire les informations de connexion\n\
if [[ $DATABASE_URL == *"@"* ]]; then\n\
  # Récupérer l\'hôte et le port\n\
  HOST=$(echo $DATABASE_URL | sed -e "s/.*@\\(.*\\):\\(.*\\)\\/.*/\\1/")\n\
  PORT=$(echo $DATABASE_URL | sed -e "s/.*@\\(.*\\):\\(.*\\)\\/.*/\\2/")\n\
  \n\
  echo "Attente de PostgreSQL ($HOST:$PORT)..."\n\
  \n\
  # Attendre que PostgreSQL soit disponible\n\
  for i in {1..30}; do\n\
    nc -z $HOST $PORT && echo "PostgreSQL est prêt!" && exit 0\n\
    echo "Tentative $i/30..."\n\
    sleep 2\n\
  done\n\
  \n\
  echo "PostgreSQL n\'est pas disponible après 30 tentatives. Continuons quand même..."\n\
  exit 1\n\
else\n\
  echo "DATABASE_URL non définie correctement. Continuons sans vérifier..."\n\
  exit 0\n\
fi' > /app/wait-for-postgres.sh && chmod +x /app/wait-for-postgres.sh

# Créer un script de démarrage
RUN echo '#!/bin/bash\n\
echo "Démarrage de EVIMERIA sur Railway..."\n\
echo "DATABASE_URL configurée: ${DATABASE_URL:0:30}..."\n\
\n\
# Attendre que PostgreSQL soit prêt\n\
/app/wait-for-postgres.sh\n\
\n\
# Exécuter les migrations\n\
echo "Exécution des migrations..."\n\
python manage.py migrate --noinput\n\
\n\
# Exécuter collectstatic\n\
echo "Collecte des fichiers statiques..."\n\
python manage.py collectstatic --noinput\n\
\n\
# Créer un superutilisateur si nécessaire\n\
echo "Vérification du superutilisateur..."\n\
python create_superuser.py\n\
\n\
# Démarrer Gunicorn\n\
echo "Démarrage du serveur sur le port $PORT..."\n\
gunicorn jaelleshop.wsgi:application --bind 0.0.0.0:$PORT --log-level debug\n\
' > /app/start.sh && chmod +x /app/start.sh

# Exposer le port
EXPOSE 8000

# Commande de démarrage
CMD ["/app/start.sh"]