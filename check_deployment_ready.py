#!/usr/bin/env python3
"""
Script de vérification pour le déploiement Railway d'EVIMERIA
Ce script vérifie que tous les fichiers et configurations nécessaires sont présents.
"""

import os
import sys
from pathlib import Path

def check_file_exists(file_path, description):
    """Vérifie qu'un fichier existe"""
    if os.path.exists(file_path):
        print(f"✅ {description}: {file_path}")
        return True
    else:
        print(f"❌ {description} MANQUANT: {file_path}")
        return False

def check_file_content(file_path, required_content, description):
    """Vérifie qu'un fichier contient du contenu spécifique"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            if required_content in content:
                print(f"✅ {description}: Configuration trouvée")
                return True
            else:
                print(f"❌ {description}: Configuration manquante")
                return False
    except FileNotFoundError:
        print(f"❌ {description}: Fichier non trouvé {file_path}")
        return False

def main():
    print("🚀 Vérification de préparation au déploiement Railway EVIMERIA\n")
    
    all_good = True
    
    # Vérification des fichiers de configuration Railway
    print("📁 Fichiers de configuration Railway:")
    all_good &= check_file_exists("railway.toml", "Configuration Railway")
    all_good &= check_file_exists("nixpacks.toml", "Configuration Nixpacks")
    all_good &= check_file_exists("backend/Procfile", "Procfile")
    
    # Vérification des dépendances
    print("\n📦 Fichiers de dépendances:")
    all_good &= check_file_exists("backend/requirements.txt", "Requirements Python")
    all_good &= check_file_exists("frontend/package.json", "Package.json frontend")
    
    # Vérification du contenu des requirements
    print("\n🔍 Vérification des dépendances critiques:")
    all_good &= check_file_content("backend/requirements.txt", "dj-database-url", "dj-database-url dans requirements.txt")
    all_good &= check_file_content("backend/requirements.txt", "psycopg2-binary", "psycopg2-binary dans requirements.txt")
    all_good &= check_file_content("backend/requirements.txt", "gunicorn", "gunicorn dans requirements.txt")
    all_good &= check_file_content("backend/requirements.txt", "whitenoise", "whitenoise dans requirements.txt")
    
    # Vérification de la configuration Django
    print("\n⚙️ Configuration Django:")
    all_good &= check_file_content("backend/jaelleshop/settings.py", "dj_database_url", "Import dj_database_url")
    all_good &= check_file_content("backend/jaelleshop/settings.py", "DATABASE_URL", "Configuration DATABASE_URL")
    all_good &= check_file_content("backend/jaelleshop/settings.py", "os.environ.get('DEBUG'", "Configuration DEBUG dynamique")
    
    # Vérification de la configuration Railway
    print("\n🚄 Configuration Railway:")
    all_good &= check_file_content("railway.toml", "gunicorn", "Commande Gunicorn dans railway.toml")
    all_good &= check_file_content("railway.toml", "migrate", "Migrations dans railway.toml")
    all_good &= check_file_content("railway.toml", "collectstatic", "Collectstatic dans railway.toml")
    
    # Vérification frontend
    print("\n🎨 Configuration Frontend:")
    all_good &= check_file_exists("frontend/vite.config.ts", "Configuration Vite")
    all_good &= check_file_content("frontend/package.json", "build", "Script build dans package.json")
    
    # Résumé
    print("\n" + "="*50)
    if all_good:
        print("🎉 FÉLICITATIONS ! Votre projet est prêt pour le déploiement Railway!")
        print("\n📋 Prochaines étapes:")
        print("1. Assurez-vous que votre code est poussé sur GitHub")
        print("2. Créez un nouveau projet sur Railway")
        print("3. Configurez les variables d'environnement:")
        print("   - SECRET_KEY")
        print("   - DEBUG=False")
        print("   - CLOUDINARY_CLOUD_NAME")
        print("   - CLOUDINARY_API_KEY")
        print("   - CLOUDINARY_API_SECRET")
        print("4. Lancez le déploiement!")
        return 0
    else:
        print("❌ ATTENTION ! Des problèmes ont été détectés.")
        print("Veuillez corriger les erreurs ci-dessus avant de déployer.")
        return 1

if __name__ == "__main__":
    sys.exit(main()) 