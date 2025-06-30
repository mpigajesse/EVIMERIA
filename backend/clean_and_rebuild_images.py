#!/usr/bin/env python
import os
import sys
import django
import cloudinary.api
import cloudinary.uploader
import requests
from io import BytesIO
from PIL import Image

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jaelleshop.settings')
django.setup()

from products.models import Category, Product, ProductImage

# Images de qualité par catégorie (URLs Pexels)
QUALITY_IMAGES = {
    'Hommes': [
        'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1192609/pexels-photo-1192609.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1758144/pexels-photo-1758144.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1580267/pexels-photo-1580267.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1670766/pexels-photo-1670766.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/2529157/pexels-photo-2529157.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    'Femmes': [
        'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1381553/pexels-photo-1381553.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1848565/pexels-photo-1848565.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/3755706/pexels-photo-3755706.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/3755744/pexels-photo-3755744.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    'Chaussures': [
        'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/2385477/pexels-photo-2385477.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1456706/pexels-photo-1456706.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1670766/pexels-photo-1670766.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1580267/pexels-photo-1580267.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/2529157/pexels-photo-2529157.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    'Montres': [
        'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/364819/pexels-photo-364819.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/125779/pexels-photo-125779.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/47856/rolex-1149718-960-720-47856.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1697214/pexels-photo-1697214.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    'Casquettes': [
        'https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1124466/pexels-photo-1124466.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1134204/pexels-photo-1134204.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1631677/pexels-photo-1631677.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1687675/pexels-photo-1687675.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    'Baskets': [
        'https://images.pexels.com/photos/2385477/pexels-photo-2385477.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1456706/pexels-photo-1456706.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1670766/pexels-photo-1670766.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1580267/pexels-photo-1580267.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/2529157/pexels-photo-2529157.jpeg?auto=compress&cs=tinysrgb&w=800',
    ]
}

def clean_cloudinary():
    """Supprime toutes les images du dossier jaelleshop dans Cloudinary"""
    print("🧹 Nettoyage de Cloudinary...")
    
    try:
        # Supprimer toutes les images du dossier jaelleshop
        print("Suppression des images existantes...")
        result = cloudinary.api.delete_resources_by_prefix('jaelleshop')
        print(f"  ✅ {len(result.get('deleted', []))} images supprimées")
        
        # Supprimer les dossiers vides
        try:
            cloudinary.api.delete_folder('jaelleshop/products')
            cloudinary.api.delete_folder('jaelleshop/categories')
            cloudinary.api.delete_folder('jaelleshop')
            print("  ✅ Dossiers supprimés")
        except:
            print("  ℹ️  Certains dossiers étaient déjà supprimés")
            
    except Exception as e:
        print(f"  ⚠️  Erreur lors du nettoyage: {e}")

def download_and_upload_image(image_url, category_name, product_name, product_id):
    """Télécharge une image et l'upload vers Cloudinary"""
    try:
        print(f"    📸 Téléchargement pour {product_name}...")
        
        # Télécharger l'image
        response = requests.get(image_url, stream=True, timeout=30)
        response.raise_for_status()
        
        # Convertir en image PIL pour optimisation
        image = Image.open(BytesIO(response.content))
        
        # Redimensionner si nécessaire (max 800x800)
        if image.width > 800 or image.height > 800:
            image.thumbnail((800, 800), Image.Resampling.LANCZOS)
        
        # Convertir en RGB si nécessaire
        if image.mode in ('RGBA', 'LA'):
            background = Image.new('RGB', image.size, (255, 255, 255))
            background.paste(image, mask=image.split()[-1] if image.mode == 'RGBA' else None)
            image = background
        elif image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Sauvegarder l'image optimisée en mémoire
        img_byte_arr = BytesIO()
        image.save(img_byte_arr, format='JPEG', quality=85, optimize=True)
        img_byte_arr.seek(0)
        
        # Upload vers Cloudinary avec une structure propre
        public_id = f"product_{product_id}_{product_name.lower().replace(' ', '_')}"
        folder_path = f"evimeria/categories/{category_name.lower()}"
        
        upload_result = cloudinary.uploader.upload(
            img_byte_arr,
            folder=folder_path,
            public_id=public_id,
            resource_type="image",
            format="jpg",
            quality="auto:good",
            fetch_format="auto"
        )
        
        return upload_result['secure_url']
        
    except Exception as e:
        print(f"    ❌ Erreur upload: {str(e)}")
        return None

def rebuild_images():
    """Reconstruit toutes les images proprement"""
    print("\n🏗️  Reconstruction des images...")
    
    categories = Category.objects.filter(is_published=True)
    total_assigned = 0
    
    for category in categories:
        print(f"\n📁 Catégorie: {category.name}")
        
        # Récupérer les produits de cette catégorie
        products = Product.objects.filter(category=category, is_published=True)
        print(f"  📦 {products.count()} produits trouvés")
        
        if category.name not in QUALITY_IMAGES:
            print(f"  ⚠️  Aucune image définie pour {category.name}")
            continue
        
        images_urls = QUALITY_IMAGES[category.name]
        
        for i, product in enumerate(products):
            if i >= len(images_urls):
                print(f"  ⚠️  Plus d'images disponibles pour {product.name}")
                break
            
            # Supprimer les anciennes images du produit
            ProductImage.objects.filter(product=product).delete()
            
            # Télécharger et uploader la nouvelle image
            cloudinary_url = download_and_upload_image(
                images_urls[i % len(images_urls)],  # Cycle à travers les images si besoin
                category.name,
                product.name,
                product.id
            )
            
            if cloudinary_url:
                # Créer la nouvelle image
                ProductImage.objects.create(
                    product=product,
                    image=cloudinary_url,
                    is_main=True
                )
                print(f"    ✅ {product.name} -> image assignée")
                total_assigned += 1
            else:
                print(f"    ❌ Échec pour {product.name}")
    
    return total_assigned

def main():
    print("🚀 === Nettoyage et reconstruction complète des images ===\n")
    
    # Étape 1: Nettoyer Cloudinary
    clean_cloudinary()
    
    # Étape 2: Supprimer toutes les images de la DB
    print("\n🗑️  Suppression des images de la base de données...")
    deleted_count = ProductImage.objects.all().delete()[0]
    print(f"  ✅ {deleted_count} images supprimées de la DB")
    
    # Étape 3: Reconstruire avec de nouvelles images
    total_assigned = rebuild_images()
    
    # Étape 4: Statistiques finales
    print(f"\n📊 === Résultats finaux ===")
    print(f"Images assignées: {total_assigned}")
    
    total_products = Product.objects.filter(is_published=True).count()
    products_with_images = Product.objects.filter(is_published=True, images__isnull=False).distinct().count()
    
    print(f"Produits publiés: {total_products}")
    print(f"Produits avec images: {products_with_images}")
    if total_products > 0:
        percentage = (products_with_images/total_products*100)
        print(f"Pourcentage: {percentage:.1f}%")
    
    print("\n✨ Reconstruction terminée ! ✨")

if __name__ == '__main__':
    main() 