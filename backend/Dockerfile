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

# S'assurer que les scripts sont exécutables
RUN chmod +x /app/db_check.py
RUN chmod +x /app/create_superuser.py
RUN chmod +x /app/show_urls.py

# Script de démarrage simplifié
RUN echo '#!/bin/bash\n\
echo "==== DÉMARRAGE DE EVIMERIA (BACKEND) ===="\n\
echo "DJANGO_SETTINGS_MODULE=$DJANGO_SETTINGS_MODULE"\n\
echo "PORT=$PORT"\n\
\n\
# Attendre que la base de données soit disponible\n\
if [ -n "$DATABASE_URL" ]; then\n\
  echo "Vérification de la connexion à la base de données..."\n\
  python /app/db_check.py || echo "Connexion à la base de données échouée, mais on continue..."\n\
else\n\
  echo "Aucune variable DATABASE_URL trouvée"\n\
fi\n\
\n\
# Exécuter les migrations\n\
echo "Exécution des migrations..."\n\
python manage.py migrate --noinput\n\
\n\
# Créer un superutilisateur si nécessaire\n\
echo "Création du superutilisateur..."\n\
python /app/create_superuser.py\n\
\n\
# Vérifier les endpoints disponibles\n\
echo "Endpoints disponibles:"\n\
python /app/show_urls.py\n\
\n\
# Démarrer Gunicorn\n\
echo "Démarrage de Gunicorn sur le port ${PORT:-8000}..."\n\
exec gunicorn railway_wsgi:application --bind 0.0.0.0:${PORT:-8000} --log-level debug\n' > /app/start.sh
RUN chmod +x /app/start.sh

# Commande de démarrage
CMD ["/app/start.sh"]