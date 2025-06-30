#!/usr/bin/env python
import os
import sys
import django
import requests
import cloudinary.uploader
from io import BytesIO
from PIL import Image

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jaelleshop.settings')
django.setup()

from products.models import Category, Product, ProductImage

# URLs d'images de qualité depuis Pexels et Pixabay (libres de droits)
PRODUCT_IMAGES = {
    'hommes': [
        'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1192609/pexels-photo-1192609.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    'femmes': [
        'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1381553/pexels-photo-1381553.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    'chaussures': [
        'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/2385477/pexels-photo-2385477.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1456706/pexels-photo-1456706.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    'montres': [
        'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/364819/pexels-photo-364819.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/125779/pexels-photo-125779.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/47856/rolex-1149718-960-720-47856.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    'casquettes': [
        'https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1124466/pexels-photo-1124466.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1134204/pexels-photo-1134204.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1631677/pexels-photo-1631677.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1687675/pexels-photo-1687675.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    'baskets': [
        'https://images.pexels.com/photos/2385477/pexels-photo-2385477.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1456706/pexels-photo-1456706.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1670766/pexels-photo-1670766.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1580267/pexels-photo-1580267.jpeg?auto=compress&cs=tinysrgb&w=800',
    ]
}

def download_and_upload_image(image_url, category_name, product_name, product_id):
    """Télécharge une image depuis une URL et l'upload vers Cloudinary"""
    try:
        print(f"Téléchargement de l'image depuis: {image_url}")
        
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
        
        # Upload vers Cloudinary
        public_id = f"evimeria_{category_name}_{product_id}"
        folder_path = f"evimeria/categories/{category_name}"
        
        upload_result = cloudinary.uploader.upload(
            img_byte_arr,
            folder=folder_path,
            public_id=public_id,
            resource_type="image",
            format="jpg",
            quality="auto:good",
            fetch_format="auto"
        )
        
        print(f"✓ Image uploadée avec succès: {upload_result['secure_url']}")
        return upload_result['secure_url']
        
    except Exception as e:
        print(f"✗ Erreur lors de l'upload de l'image: {str(e)}")
        return None

def main():
    print("=== Import d'images réelles pour EVIMERIA ===\n")
    
    categories = Category.objects.filter(is_published=True)
    if not categories.exists():
        print("Aucune catégorie trouvée. Veuillez d'abord créer les catégories.")
        return
    
    for category in categories:
        category_name = category.name.lower()
        print(f"\n--- Traitement de la catégorie: {category.name} ---")
        
        if category_name not in PRODUCT_IMAGES:
            print(f"Aucune image définie pour la catégorie {category.name}")
            continue
        
        products = Product.objects.filter(category=category, is_published=True)
        if not products.exists():
            print(f"Aucun produit trouvé dans la catégorie {category.name}")
            continue
        
        image_urls = PRODUCT_IMAGES[category_name]
        
        for i, product in enumerate(products):
            if i >= len(image_urls):
                print(f"Plus d'images disponibles pour le produit {product.name}")
                break
                
            # Supprimer les anciennes images
            ProductImage.objects.filter(product=product).delete()
            
            # Télécharger et uploader la nouvelle image
            cloudinary_url = download_and_upload_image(
                image_urls[i], 
                category_name, 
                product.name, 
                product.id
            )
            
            if cloudinary_url:
                # Créer la nouvelle image
                product_image = ProductImage.objects.create(
                    product=product,
                    image=cloudinary_url,
                    is_main=True
                )
                print(f"✓ Image ajoutée au produit: {product.name}")
            else:
                print(f"✗ Échec pour le produit: {product.name}")
    
    print("\n=== Import terminé ===")
    print("Les images ont été uploadées vers Cloudinary et ajoutées aux produits.")

if __name__ == '__main__':
    main() 