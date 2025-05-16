#!/usr/bin/env python
"""
Script simple pour créer un superutilisateur.
Peut être exécuté manuellement après le déploiement.
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jaelleshop.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

username = 'admin'
email = 'admin@example.com'
password = 'adminpassword123'

if not User.objects.filter(username=username).exists():
    print(f"Création du superutilisateur: {username}")
    User.objects.create_superuser(username, email, password)
    print("Superutilisateur créé avec succès!")
else:
    print(f"Le superutilisateur '{username}' existe déjà.") 