#!/usr/bin/env python3
"""
Script de debug pour identifier les problèmes de déploiement Railway
"""

import os
import sys
import subprocess

def check_environment():
    """Vérifie les variables d'environnement critiques"""
    print("🔍 Vérification des variables d'environnement...")
    
    critical_vars = [
        'DATABASE_URL',
        'SECRET_KEY', 
        'DEBUG',
        'CLOUDINARY_CLOUD_NAME',
        'CLOUDINARY_API_KEY',
        'CLOUDINARY_API_SECRET'
    ]
    
    for var in critical_vars:
        value = os.environ.get(var)
        if value:
            # Masquer les valeurs sensibles
            if 'SECRET' in var or 'PASSWORD' in var or 'KEY' in var:
                print(f"✅ {var}: {'*' * len(value[:10])}...")
            else:
                print(f"✅ {var}: {value}")
        else:
            print(f"❌ {var}: MANQUANT")

def test_database_connection():
    """Test la connexion à la base de données"""
    print("\n🔗 Test de connexion à la base de données...")
    
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        print("❌ DATABASE_URL manquante")
        return False
    
    try:
        import dj_database_url
        db_config = dj_database_url.parse(database_url)
        print(f"✅ Configuration DB parsée: {db_config['HOST']}:{db_config['PORT']}")
        
        # Test de connexion simple
        import psycopg2
        conn = psycopg2.connect(database_url)
        conn.close()
        print("✅ Connexion PostgreSQL réussie")
        return True
        
    except ImportError as e:
        print(f"❌ Import manquant: {e}")
        return False
    except Exception as e:
        print(f"❌ Erreur de connexion DB: {e}")
        return False

def test_django_import():
    """Test les imports Django"""
    print("\n📦 Test des imports Django...")
    
    try:
        import django
        print(f"✅ Django version: {django.get_version()}")
        
        # Test import du settings
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jaelleshop.settings')
        django.setup()
        print("✅ Django setup réussi")
        
        # Test import des modèles
        from products.models import Product, Category
        print("✅ Imports models réussis")
        
        return True
        
    except ImportError as e:
        print(f"❌ Erreur d'import: {e}")
        return False
    except Exception as e:
        print(f"❌ Erreur Django: {e}")
        return False

def check_static_files():
    """Vérifie la configuration des fichiers statiques"""
    print("\n📁 Vérification des fichiers statiques...")
    
    try:
        static_root = os.environ.get('STATIC_ROOT', '/app/backend/staticfiles')
        if os.path.exists(static_root):
            files = os.listdir(static_root)
            print(f"✅ STATIC_ROOT existe: {len(files)} fichiers")
        else:
            print(f"⚠️ STATIC_ROOT n'existe pas: {static_root}")
            
        # Vérifier le dossier frontend/dist
        frontend_dist = '/app/frontend/dist'
        if os.path.exists(frontend_dist):
            files = os.listdir(frontend_dist)
            print(f"✅ Frontend dist existe: {len(files)} fichiers")
        else:
            print(f"❌ Frontend dist manquant: {frontend_dist}")
            
    except Exception as e:
        print(f"❌ Erreur fichiers statiques: {e}")

def simulate_django_check():
    """Simule django check pour détecter les erreurs"""
    print("\n🔧 Simulation Django system check...")
    
    try:
        result = subprocess.run([
            'python', 'manage.py', 'check', '--deploy'
        ], capture_output=True, text=True, timeout=30)
        
        if result.returncode == 0:
            print("✅ Django check réussi")
        else:
            print(f"❌ Django check échoué:")
            print(result.stderr)
            
    except subprocess.TimeoutExpired:
        print("⏰ Django check timeout")
    except Exception as e:
        print(f"❌ Erreur Django check: {e}")

def main():
    print("🚨 EVIMERIA - Debug Déploiement Railway")
    print("=" * 50)
    
    # Changer vers le répertoire backend
    backend_dir = '/app/backend' if os.path.exists('/app/backend') else './backend'
    if os.path.exists(backend_dir):
        os.chdir(backend_dir)
        print(f"📂 Répertoire: {os.getcwd()}")
    
    check_environment()
    test_database_connection() 
    test_django_import()
    check_static_files()
    simulate_django_check()
    
    print("\n" + "=" * 50)
    print("🔍 Debug terminé. Consultez les erreurs ci-dessus.")

if __name__ == "__main__":
    main() 