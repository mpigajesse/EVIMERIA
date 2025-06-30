import os
import django
from django.conf import settings
import cloudinary
import cloudinary.uploader
import cloudinary.api

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'evimeria.settings')
django.setup()

from products.models import ProductImage

# Configuration Cloudinary
cloudinary.config(
    cloud_name="dmcaguchx",
    api_key="238869761337271",
    api_secret="G1AQ85xIMHSFSLgPOXeNsGFnfJA"
)

def reorganize_images():
    """Réorganise les images existantes dans de vrais dossiers Cloudinary"""
    
    images = ProductImage.objects.all()
    
    print(f"🔄 Réorganisation de {images.count()} images...")
    
    for i, image in enumerate(images):
        try:
            # Extraire l'ancien public_id depuis l'URL
            url_parts = image.image.split('/')
            if 'upload' in url_parts:
                upload_index = url_parts.index('upload')
                if upload_index + 2 < len(url_parts):
                    # Récupérer le public_id (sans l'extension)
                    old_public_id = '/'.join(url_parts[upload_index + 2:]).split('.')[0]
                    
                    # Créer le nouveau public_id avec une vraie structure de dossier
                    # Format: categories/categorie/sous-categorie/nom-produit
                    path_parts = old_public_id.split('/')
                    if len(path_parts) >= 4:  # evimeria/products/categorie/sous-cat/nom
                        categorie = path_parts[2]  # enfants, femmes, hommes
                        sous_categorie = path_parts[3]  # jupe, sneakers, etc.
                        nom_fichier = path_parts[4]  # nom du produit
                        
                        # Nouveau public_id avec structure claire
                        new_public_id = f"categories/{categorie}/{sous_categorie}/{nom_fichier}"
                        
                        print(f"📁 [{i+1}/{images.count()}] Déplacement: {old_public_id} -> {new_public_id}")
                        
                        # Renommer/déplacer l'image dans Cloudinary
                        result = cloudinary.uploader.rename(
                            old_public_id, 
                            new_public_id,
                            resource_type="image"
                        )
                        
                        # Mettre à jour l'URL dans la base de données
                        new_url = result['secure_url']
                        image.image = new_url
                        image.save()
                        
                        print(f"✅ Succès: {new_url}")
                        
        except Exception as e:
            print(f"❌ Erreur pour l'image {image.id}: {e}")
            continue
    
    print("🎉 Réorganisation terminée!")

def create_folder_structure():
    """Crée la structure de dossiers de base"""
    folders_to_create = [
        "categories",
        "categories/enfants", 
        "categories/femmes",
        "categories/hommes",
        "categories/enfants/sneakers",
        "categories/enfants/baskets", 
        "categories/enfants/jupe",
        "categories/enfants/bracelet",
        "categories/enfants/ceinture",
        "categories/femmes/robes",
        "categories/femmes/sacs", 
        "categories/femmes/chaussures",
        "categories/femmes/accessoires",
        "categories/hommes/chemises",
        "categories/hommes/montres",
        "categories/hommes/chaussures",
        "categories/hommes/accessoires"
    ]
    
    print("📁 Création de la structure de dossiers...")
    
    for folder in folders_to_create:
        try:
            # Cloudinary crée automatiquement les dossiers quand on upload des fichiers
            # Ici on pourrait créer un fichier temporaire pour forcer la création
            print(f"   📂 Dossier: {folder}")
        except Exception as e:
            print(f"❌ Erreur pour le dossier {folder}: {e}")

if __name__ == "__main__":
    print("🚀 Démarrage de la réorganisation Cloudinary...")
    print()
    print("⚠️  IMPORTANT: Assurez-vous d'avoir configuré vos clés Cloudinary!")
    print("   - Remplacez YOUR_API_KEY et YOUR_API_SECRET par vos vraies clés")
    print()
    
    choice = input("Voulez-vous continuer? (y/N): ")
    if choice.lower() == 'y':
        create_folder_structure()
        reorganize_images()
    else:
        print("❌ Opération annulée") 