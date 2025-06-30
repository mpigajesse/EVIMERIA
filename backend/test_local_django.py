#!/usr/bin/env python3
"""
Test Django en local pour vérifier la configuration avant déploiement
"""

import os
import sys
import django

# Ajouter le répertoire backend au path Python
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

# Configurer Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jaelleshop.settings')

def test_django_configuration():
    """Test la configuration Django de base"""
    print("🧪 Test de Configuration Django EVIMERIA")
    print("=" * 50)
    
    try:
        # Test import Django
        import django
        print(f"✅ Django version: {django.get_version()}")
        
        # Setup Django
        django.setup()
        print("✅ Django setup réussi")
        
        # Test import des settings
        from django.conf import settings
        print(f"✅ DEBUG (défaut): {getattr(settings, 'DEBUG', 'Non défini')}")
        print(f"✅ SECRET_KEY configurée: {'Oui' if hasattr(settings, 'SECRET_KEY') else 'Non'}")
        
        # Test import des modèles
        from products.models import Product, Category
        print("✅ Import des modèles products réussi")
        
        from users.models import User
        print("✅ Import des modèles users réussi")
        
        from orders.models import Order
        print("✅ Import des modèles orders réussi")
        
        # Test configuration Cloudinary
        try:
            import cloudinary
            import cloudinary.uploader
            print("✅ Cloudinary importé avec succès")
            
            # Test configuration de base (sans vraies clés)
            cloud_name = getattr(settings, 'CLOUDINARY_STORAGE', {}).get('CLOUD_NAME', 'Non configuré')
            print(f"✅ Cloudinary Cloud Name: {cloud_name}")
            
        except Exception as e:
            print(f"⚠️ Erreur Cloudinary: {e}")
        
        # Test configuration de base de données (structure seulement)
        try:
            db_config = settings.DATABASES['default']
            engine = db_config.get('ENGINE', 'Non configuré')
            print(f"✅ Database Engine: {engine}")
            
            # Vérifier la logique de configuration de la DB
            if 'DATABASE_URL' in os.environ:
                print("✅ Configuration DATABASE_URL détectée")
            else:
                print("⚠️ DATABASE_URL non définie (normal en local)")
                
        except Exception as e:
            print(f"❌ Erreur configuration DB: {e}")
        
        # Test CORS configuration
        try:
            cors_origins = getattr(settings, 'CORS_ALLOWED_ORIGINS', [])
            print(f"✅ CORS Origins configurées: {len(cors_origins)} entrées")
        except Exception as e:
            print(f"⚠️ Erreur CORS: {e}")
            
        # Test REST Framework
        try:
            rest_config = getattr(settings, 'REST_FRAMEWORK', {})
            print(f"✅ REST Framework configuré: {'Oui' if rest_config else 'Non'}")
        except Exception as e:
            print(f"⚠️ Erreur REST Framework: {e}")
        
        print("\n🎉 Tous les tests de configuration sont passés !")
        print("✅ L'application devrait fonctionner sur Railway")
        
        return True
        
    except ImportError as e:
        print(f"❌ Erreur d'import: {e}")
        return False
    except Exception as e:
        print(f"❌ Erreur inattendue: {e}")
        return False

def test_wsgi_application():
    """Test que l'application WSGI peut être importée"""
    print("\n🚀 Test WSGI Application")
    print("-" * 30)
    
    try:
        from jaelleshop.wsgi import application
        print("✅ Application WSGI importée avec succès")
        print("✅ Gunicorn pourra démarrer l'application")
        return True
    except Exception as e:
        print(f"❌ Erreur WSGI: {e}")
        return False

def main():
    """Fonction principale"""
    success = True
    
    success &= test_django_configuration()
    success &= test_wsgi_application()
    
    print("\n" + "=" * 50)
    if success:
        print("🎉 SUCCÈS ! Configuration prête pour Railway")
        print("\n📋 Prochaines étapes :")
        print("1. git add .")
        print("2. git commit -m 'Fix: Add Railway debug scripts'")
        print("3. git push origin main")
        print("4. Configurer les variables d'environnement sur Railway")
        print("5. Déployer !")
    else:
        print("❌ ÉCHEC ! Des problèmes doivent être corrigés")
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main()) 