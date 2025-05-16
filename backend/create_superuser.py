import os
import django

# Configurer Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jaelleshop.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

def create_superuser():
    if not User.objects.filter(username='admin').exists():
        print('Création du superutilisateur admin...')
        User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
        print('Superutilisateur créé avec succès!')
    else:
        print('Le superutilisateur admin existe déjà!')

if __name__ == '__main__':
    create_superuser() 