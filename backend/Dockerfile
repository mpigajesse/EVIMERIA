FROM python:3.11-slim

WORKDIR /app

# Installer les outils nécessaires
RUN apt-get update && apt-get install -y --no-install-recommends \
    postgresql-client \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copier et installer les dépendances
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn psycopg2-binary dj-database-url whitenoise

# Copier le code source
COPY . .

# Variables d'environnement
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=8000
ENV DJANGO_ALLOWED_HOSTS=*.up.railway.app,*.railway.app,localhost,127.0.0.1,0.0.0.0
ENV ALLOWED_HOSTS=*.up.railway.app,*.railway.app,localhost,127.0.0.1,0.0.0.0

# Collectstatic (avant le démarrage pour optimiser)
RUN python manage.py collectstatic --noinput

# Exposer le port
EXPOSE 8000

# Script Python pour vérifier la connexion à la base de données
RUN echo 'import os\nimport sys\nimport time\nimport psycopg2\n\n\
try:\n\
    db_url = os.environ.get("DATABASE_URL")\n\
    if not db_url:\n\
        print("Aucune URL de base de données trouvée")\n\
        sys.exit(1)\n\
    \n\
    print(f"Tentative de connexion à la base de données: {db_url[:30]}...")\n\
    \n\
    # Tentatives de connexion\n\
    max_attempts = 10\n\
    for i in range(max_attempts):\n\
        try:\n\
            conn = psycopg2.connect(db_url)\n\
            conn.close()\n\
            print("Connexion à la base de données réussie!")\n\
            sys.exit(0)\n\
        except Exception as e:\n\
            print(f"Tentative {i+1}/{max_attempts}: Erreur de connexion: {e}")\n\
            if i < max_attempts - 1:\n\
                time.sleep(2)\n\
    \n\
    print("Impossible de se connecter à la base de données après plusieurs tentatives")\n\
    sys.exit(1)\n\
except Exception as e:\n\
    print(f"Erreur inattendue: {e}")\n\
    sys.exit(1)' > /app/check_db.py

# Fichier de démarrage simple
RUN echo '#!/bin/bash\n\
echo "Démarrage de EVIMERIA sur Railway..."\n\
echo "ENV: $RAILWAY_ENVIRONMENT"\n\
\n\
# Vérifier la connexion à la base de données\n\
echo "Vérification de la connexion à la base de données..."\n\
python /app/check_db.py\n\
\n\
# Si nous sommes dans Railway, utiliser la connexion interne si possible\n\
if [ -n "$RAILWAY_PRIVATE_DOMAIN" ] && [ -n "$POSTGRES_PASSWORD" ]; then\n\
    echo "Environnement Railway détecté, utilisation de la connexion interne..."\n\
    export DATABASE_URL="postgresql://postgres:$POSTGRES_PASSWORD@$RAILWAY_PRIVATE_DOMAIN:5432/railway"\n\
    echo "DATABASE_URL mis à jour pour la connexion interne"\n\
fi\n\
\n\
echo "Exécution des migrations..."\n\
python manage.py migrate\n\
\n\
# Créer un superutilisateur\n\
echo "Création du superutilisateur si nécessaire..."\n\
python create_superuser.py\n\
\n\
echo "Démarrage de Gunicorn..."\n\
exec gunicorn jaelleshop.wsgi:application --bind 0.0.0.0:$PORT --log-level debug\n\
' > /app/start.sh && chmod +x /app/start.sh

# Commande de démarrage
CMD ["/app/start.sh"]