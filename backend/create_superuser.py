#!/usr/bin/env python
"""
Script pour créer un superutilisateur Django si aucun n'existe.
Ce script peut être exécuté dans le cadre du processus de déploiement.
"""
import os
import django

# Configurer Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jaelleshop.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

# Paramètres par défaut (peuvent être remplacés par des variables d'environnement)
DEFAULT_ADMIN_USERNAME = os.environ.get('DJANGO_SUPERUSER_USERNAME', 'admin')
DEFAULT_ADMIN_EMAIL = os.environ.get('DJANGO_SUPERUSER_EMAIL', 'admin@example.com')
DEFAULT_ADMIN_PASSWORD = os.environ.get('DJANGO_SUPERUSER_PASSWORD', 'adminpassword123')

def create_superuser():
    """Crée un superutilisateur s'il n'existe pas déjà."""
    if not User.objects.filter(username=DEFAULT_ADMIN_USERNAME).exists():
        print(f"Création du superutilisateur: {DEFAULT_ADMIN_USERNAME}")
        User.objects.create_superuser(
            username=DEFAULT_ADMIN_USERNAME,
            email=DEFAULT_ADMIN_EMAIL,
            password=DEFAULT_ADMIN_PASSWORD
        )
        print("Superutilisateur créé avec succès")
    else:
        print(f"Le superutilisateur '{DEFAULT_ADMIN_USERNAME}' existe déjà")

if __name__ == '__main__':
    create_superuser() 