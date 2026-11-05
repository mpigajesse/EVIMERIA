import os
import django
from django.conf import settings
import cloudinary
import cloudinary.uploader
import cloudinary.api

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jaelleshop.settings')
django.setup()

from products.models import ProductImage

# Configuration Cloudinary
cloudinary.config(
    cloud_name=os.environ["CLOUDINARY_CLOUD_NAME"],
    api_key=os.environ["CLOUDINARY_API_KEY"],
    api_secret=os.environ["CLOUDINARY_API_SECRET"]
)

def test_cloudinary_connection():
    """Test la connexion à Cloudinary"""
    try:
        # Test simple de l'API
        result = cloudinary.api.ping()
        print("✅ Connexion à Cloudinary réussie!")
        return True
    except Exception as e:
        print(f"❌ Erreur de connexion Cloudinary: {e}")
        return False

def explore_current_structure():
    """Explore la structure actuelle dans Cloudinary"""
    print("\n🔍 Exploration de la structure actuelle:")
    
    try:
        # Lister les ressources avec le préfixe evimeria
        result = cloudinary.api.resources(
            type="upload",
            prefix="evimeria",
            max_results=10
        )
        
        print(f"   📊 Trouvé {len(result['resources'])} images (sur {result.get('total_count', '?')} total)")
        
        for i, resource in enumerate(result['resources'][:5]):
            print(f"   📄 {i+1}. {resource['public_id']}")
            
    except Exception as e:
        print(f"   ❌ Erreur: {e}")

def test_move_one_image():
    """Test le déplacement d'une seule image"""
    print("\n🧪 Test de déplacement d'une image:")
    
    try:
        # Prendre la première image de la base
        sample_image = ProductImage.objects.first()
        if not sample_image:
            print("   ❌ Aucune image trouvée en base")
            return
            
        print(f"   📄 Image test: {sample_image.image}")
        
        # Extraire le public_id
        url_parts = sample_image.image.split('/')
        if 'upload' in url_parts:
            upload_index = url_parts.index('upload')
            if upload_index + 2 < len(url_parts):
                old_public_id = '/'.join(url_parts[upload_index + 2:]).split('.')[0]
                
                # Créer nouveau chemin
                path_parts = old_public_id.split('/')
                if len(path_parts) >= 4:
                    categorie = path_parts[2]
                    sous_categorie = path_parts[3] 
                    nom_fichier = path_parts[4]
                    
                    new_public_id = f"categories/{categorie}/{sous_categorie}/{nom_fichier}"
                    
                    print(f"   🔄 Ancien: {old_public_id}")
                    print(f"   📁 Nouveau: {new_public_id}")
                    
                    # ATTENTION: Décommentez cette ligne seulement si vous voulez vraiment déplacer
                    # result = cloudinary.uploader.rename(old_public_id, new_public_id)
                    # print(f"   ✅ Déplacé! Nouvelle URL: {result['secure_url']}")
                    
                    print("   ⚠️  Test de déplacement simulé (pas vraiment exécuté)")
                    
    except Exception as e:
        print(f"   ❌ Erreur: {e}")

def create_test_folder():
    """Crée un dossier de test pour vérifier que ça marche"""
    print("\n📁 Test de création de dossier:")
    
    try:
        # Upload d'une image test pour créer la structure
        # Ici on utiliserait une petite image temporaire
        print("   📂 Les dossiers seront créés automatiquement lors du premier upload")
        print("   📂 Structure prévue: categories/enfants/test/")
        print("   📂 Structure prévue: categories/femmes/test/")
        print("   📂 Structure prévue: categories/hommes/test/")
        
    except Exception as e:
        print(f"   ❌ Erreur: {e}")

if __name__ == "__main__":
    print("🧪 === TEST CLOUDINARY ORGANIZATION ===")
    print()
    
    # Test 1: Connexion
    if not test_cloudinary_connection():
        exit(1)
    
    # Test 2: Explorer la structure actuelle
    explore_current_structure()
    
    # Test 3: Test du dossier
    create_test_folder()
    
    # Test 4: Simulation de déplacement
    test_move_one_image()
    
    print()
    print("🎯 Résumé:")
    print("   - Si tout va bien, vous pouvez maintenant exécuter reorganize_cloudinary.py")
    print("   - Cela déplacera TOUTES vos images vers une structure de dossiers")
    print("   - Vos images seront organisées: categories/enfants/sneakers/, etc.")
    print()
    print("⚠️  ATTENTION: Faites une sauvegarde avant de lancer la réorganisation complète!") 