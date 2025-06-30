#!/bin/bash
set -e

echo "🚀 EVIMERIA - Démarrage Railway"
echo "================================"

# Vérifier l'environnement
echo "📍 Répertoire courant: $(pwd)"
echo "🐍 Version Python: $(python --version)"
echo "🔧 Variables d'environnement critiques:"

# Vérifier les variables essentielles
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL manquante"
    exit 1
else
    echo "✅ DATABASE_URL: ${DATABASE_URL:0:50}..."
fi

if [ -z "$SECRET_KEY" ]; then
    echo "❌ SECRET_KEY manquante"
    exit 1
else
    echo "✅ SECRET_KEY: ${SECRET_KEY:0:20}..."
fi

echo "✅ DEBUG: $DEBUG"
echo "✅ CLOUDINARY_CLOUD_NAME: $CLOUDINARY_CLOUD_NAME"

# Test de connexion à la base de données
echo ""
echo "🔗 Test de connexion base de données..."
python -c "
import os
import dj_database_url
import psycopg2

try:
    db_url = os.environ['DATABASE_URL']
    config = dj_database_url.parse(db_url)
    print(f'📊 DB Host: {config[\"HOST\"]}:{config[\"PORT\"]}')
    print(f'📊 DB Name: {config[\"NAME\"]}')
    
    # Test simple de connexion
    conn = psycopg2.connect(db_url)
    conn.close()
    print('✅ Connexion PostgreSQL réussie')
except Exception as e:
    print(f'❌ Erreur DB: {e}')
    exit(1)
"

# Vérifier Django
echo ""
echo "⚙️ Vérification Django..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jaelleshop.settings')

try:
    import django
    django.setup()
    print(f'✅ Django {django.get_version()} configuré')
    
    from django.conf import settings
    print(f'✅ DEBUG: {settings.DEBUG}')
    print(f'✅ ALLOWED_HOSTS: {settings.ALLOWED_HOSTS}')
    
except Exception as e:
    print(f'❌ Erreur Django: {e}')
    exit(1)
"

# Test système Django
echo ""
echo "🔧 Django system check..."
python manage.py check --deploy || {
    echo "❌ Django check échoué"
    echo "Continuons malgré tout pour voir l'erreur..."
}

# Collectstatic
echo ""
echo "📁 Collection des fichiers statiques..."
python manage.py collectstatic --noinput --clear

# Migrations
echo ""
echo "🗄️ Exécution des migrations..."
python manage.py migrate --noinput

# Vérifier que Gunicorn peut démarrer
echo ""
echo "🚀 Test de démarrage Gunicorn..."
python -c "
from jaelleshop.wsgi import application
print('✅ WSGI application importée avec succès')
"

# Démarrer l'application
echo ""
echo "🎯 Démarrage de l'application..."
echo "Port: $PORT"
echo "Workers: 2"

exec python -m gunicorn jaelleshop.wsgi:application \
    --bind 0.0.0.0:$PORT \
    --workers=2 \
    --timeout=120 \
    --max-requests=1000 \
    --max-requests-jitter=100 \
    --access-logfile=- \
    --error-logfile=- \
    --log-level=info 