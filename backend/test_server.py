#!/usr/bin/env python
"""
Script simple pour tester le serveur Django localement sans Gunicorn.
"""
import os
import sys
import django

# Configurer l'environnement
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jaelleshop.settings')

# Ajouter le répertoire courant au chemin de recherche Python
path = os.path.dirname(os.path.abspath(__file__))
if path not in sys.path:
    sys.path.append(path)

# Initialiser Django
django.setup()

# Créer un serveur de test simple
from django.core.management import execute_from_command_line

if __name__ == '__main__':
    print("\n=== SERVEUR DE TEST DJANGO ===")
    print(f"DJANGO_SETTINGS_MODULE: {os.environ.get('DJANGO_SETTINGS_MODULE')}")
    print(f"DATABASE_URL: {'Configuré' if os.environ.get('DATABASE_URL') else 'Non configuré'}")
    print(f"DEBUG: {os.environ.get('DEBUG', 'False')}")
    print("\nDémarrage du serveur de test...")
    
    # Exécuter le serveur de développement Django sur le port 8000
    sys.argv = ['manage.py', 'runserver', '0.0.0.0:8000']
    execute_from_command_line(sys.argv) 