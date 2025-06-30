#!/usr/bin/env python3
"""
Test des chemins frontend pour EVIMERIA
"""

import os
import sys
import django

# Ajouter le répertoire backend au path Python
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

# Configurer Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jaelleshop.settings')
django.setup()

def test_frontend_paths():
    """Test la configuration des chemins frontend"""
    print("🎨 Test des Chemins Frontend EVIMERIA")
    print("=" * 50)
    
    try:
        from django.conf import settings
        
        # Afficher les chemins configurés
        print(f"📂 BASE_DIR: {settings.BASE_DIR}")
        print(f"📂 FRONTEND_DIR: {settings.FRONTEND_DIR}")
        
        # Vérifier l'existence des dossiers
        frontend_dist = os.path.join(settings.FRONTEND_DIR, 'dist')
        index_path = os.path.join(frontend_dist, 'index.html')
        
        print(f"\n🔍 Vérifications:")
        print(f"Frontend dist path: {frontend_dist}")
        print(f"Index.html path: {index_path}")
        
        if os.path.exists(settings.FRONTEND_DIR):
            print(f"✅ FRONTEND_DIR existe")
            if os.path.exists(frontend_dist):
                print(f"✅ dist/ existe")
                files = os.listdir(frontend_dist)
                print(f"📁 Fichiers dans dist/: {len(files)} fichiers")
                for f in files[:5]:  # Afficher les 5 premiers
                    print(f"   - {f}")
                if len(files) > 5:
                    print(f"   ... et {len(files) - 5} autres")
                    
                if os.path.exists(index_path):
                    print(f"✅ index.html existe")
                else:
                    print(f"❌ index.html manquant")
            else:
                print(f"❌ dist/ n'existe pas")
                print(f"📁 Contenu de FRONTEND_DIR:")
                if os.path.exists(settings.FRONTEND_DIR):
                    for item in os.listdir(settings.FRONTEND_DIR):
                        print(f"   - {item}")
        else:
            print(f"❌ FRONTEND_DIR n'existe pas")
        
        # Test des templates
        print(f"\n📄 Configuration Templates:")
        for template in settings.TEMPLATES:
            for dir_path in template['DIRS']:
                print(f"Template dir: {dir_path}")
                print(f"Existe: {'✅' if os.path.exists(dir_path) else '❌'}")
        
        # Test des fichiers statiques
        print(f"\n📁 Configuration Fichiers Statiques:")
        print(f"STATIC_ROOT: {settings.STATIC_ROOT}")
        print(f"STATICFILES_DIRS: {settings.STATICFILES_DIRS}")
        print(f"WHITENOISE_ROOT: {getattr(settings, 'WHITENOISE_ROOT', 'Non défini')}")
        
        return True
        
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

def main():
    """Fonction principale"""
    success = test_frontend_paths()
    
    print("\n" + "=" * 50)
    if success:
        print("🎉 Tests des chemins frontend terminés")
        print("\n📋 Pour construire le frontend:")
        print("cd ../frontend && npm run build")
    else:
        print("❌ Erreurs détectées dans la configuration")
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main()) 