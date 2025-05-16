#!/bin/sh
set -e

# Afficher la configuration
echo "=== DÉMARRAGE EVIMERIA (BACKEND) ==="
echo "DJANGO_SETTINGS_MODULE=$DJANGO_SETTINGS_MODULE"
echo "PORT=$PORT"

# Exécuter la vérification de santé
echo "Vérification de santé du système..."
python health_check.py || echo "Vérification échouée mais on continue..."

# Exécuter les migrations
echo "Exécution des migrations..."
python manage.py migrate --noinput

# Créer superutilisateur
echo "Tentative de création du superutilisateur..."
python manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.filter(username='admin').exists() or User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword123')"

# Démarrer Gunicorn
echo "Démarrage de Gunicorn..."
gunicorn jaelleshop.wsgi:application --bind 0.0.0.0:$PORT 