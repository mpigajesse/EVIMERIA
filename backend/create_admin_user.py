#!/usr/bin/env python3
"""
Script pour créer un superuser Django pour EVIMERIA
"""

import os
import sys
import django

# Configurer Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jaelleshop.settings')
django.setup()

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

def create_admin_user():
    """Créer un superuser admin"""
    User = get_user_model()
    
    # Identifiants par défaut
    username = 'admin'
    email = 'admin@evimeria.com'
    # Jamais de mot de passe par défaut dans un dépôt public : variable
    # d'environnement, sinon saisie au clavier (sans écho).
    import getpass
    password = os.environ.get('DJANGO_SUPERUSER_PASSWORD') or getpass.getpass('Mot de passe admin : ')
    
    print("🔐 Création du Superuser EVIMERIA")
    print("=" * 40)
    
    # Vérifier si l'utilisateur existe déjà
    if User.objects.filter(username=username).exists():
        print(f"✅ L'utilisateur '{username}' existe déjà")
        user = User.objects.get(username=username)
        print(f"📧 Email: {user.email}")
        print(f"🔑 Superuser: {'Oui' if user.is_superuser else 'Non'}")
        return user
    
    # Créer le superuser
    try:
        user = User.objects.create_superuser(
            username=username,
            email=email,
            password=password
        )
        print(f"✅ Superuser créé avec succès !")
        print(f"👤 Nom d'utilisateur: {username}")
        print(f"📧 Email: {email}")
        print(f"🔑 Mot de passe: {password}")
        print(f"\n⚠️ IMPORTANT: Changez ce mot de passe après connexion !")
        
        return user
        
    except Exception as e:
        print(f"❌ Erreur lors de la création: {e}")
        return None

def test_admin_access():
    """Tester l'accès admin"""
    print(f"\n🌐 Accès Admin:")
    print(f"URL: https://evimeria-production.up.railway.app/admin/")
    print(f"👤 Utilisateur: admin")
    print(f"🔑 Mot de passe: admin123456")

def main():
    """Fonction principale"""
    try:
        user = create_admin_user()
        if user:
            test_admin_access()
            print(f"\n🎉 Prêt ! Vous pouvez maintenant accéder à l'admin Django")
            return 0
        else:
            print(f"❌ Échec de la création du superuser")
            return 1
            
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return 1

if __name__ == "__main__":
    sys.exit(main()) 