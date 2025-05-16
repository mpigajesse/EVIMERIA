FROM python:3.11-slim

WORKDIR /app

# Outils essentiels
RUN apt-get update && apt-get install -y --no-install-recommends \
    postgresql-client \
    netcat-openbsd \
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

# Script d'attente pour PostgreSQL
RUN echo '#!/bin/bash\n\
set -e\n\
\n\
echo "Attente de PostgreSQL..."\n\
\n\
if [ -z "$DATABASE_URL" ]; then\n\
  echo "AVERTISSEMENT: Variable DATABASE_URL non définie"\n\
  exit 0\n\
fi\n\
\n\
# Extraire les informations de connexion depuis DATABASE_URL\n\
URI=$(echo $DATABASE_URL | sed -e "s/^postgres:\/\///g")\n\
USER=$(echo $URI | sed -e "s/:.*@.*\\/.*$//g")\n\
PASSWORD=$(echo $URI | sed -e "s/^$USER://g" | sed -e "s/@.*\\/.*$//g")\n\
HOST=$(echo $URI | sed -e "s/^.*@//g" | sed -e "s/:.*\\/.*$//g")\n\
PORT=$(echo $URI | sed -e "s/^.*://g" | sed -e "s/\\/.*$//g")\n\
DB=$(echo $URI | sed -e "s/^.*\\/\\(.*\\)$/\\1/g")\n\
\n\
echo "Tentative de connexion à PostgreSQL sur $HOST:$PORT..."\n\
\n\
for i in $(seq 1 30); do\n\
  echo "Tentative $i/30..."\n\
  nc -z -w1 $HOST $PORT && echo "PostgreSQL est disponible!" && exit 0\n\
  sleep 1\n\
done\n\
\n\
echo "Impossible de se connecter à PostgreSQL après 30 tentatives"\n\
exit 1\n\
' > /app/wait-for-postgres.sh

RUN chmod +x /app/wait-for-postgres.sh

# Script de démarrage simplifié
RUN echo '#!/bin/bash\n\
set -e\n\
\n\
echo "==== DÉMARRAGE DE EVIMERIA (BACKEND) ===="\n\
echo "DJANGO_SETTINGS_MODULE=$DJANGO_SETTINGS_MODULE"\n\
echo "PORT=$PORT"\n\
\n\
# Attendre que PostgreSQL soit disponible\n\
/app/wait-for-postgres.sh\n\
\n\
# Exécuter les migrations\n\
echo "Exécution des migrations..."\n\
python manage.py migrate --noinput\n\
\n\
# Créer un superutilisateur\n\
echo "Création du superutilisateur si nécessaire..."\n\
echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.filter(username='\''admin'\'').exists() or User.objects.create_superuser('\''admin'\'', '\''admin@example.com'\'', '\''adminpassword123'\'')" | python manage.py shell\n\
\n\
# Collecte des fichiers statiques\n\
echo "Collecte des fichiers statiques..."\n\
python manage.py collectstatic --noinput\n\
\n\
# Démarrer Gunicorn\n\
echo "Démarrage de Gunicorn sur le port ${PORT:-8000}..."\n\
exec gunicorn jaelleshop.wsgi:application --bind 0.0.0.0:${PORT:-8000} --log-level debug\n\
' > /app/start.sh

RUN chmod +x /app/start.sh

# Exposer le port
EXPOSE 8000
EXPOSE ${PORT}

# Commande de démarrage
CMD ["/app/start.sh"]