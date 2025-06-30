#!/usr/bin/env python
import os
import sys
import django
import cloudinary.api
import cloudinary.uploader
import requests
from io import BytesIO
from PIL import Image
import re

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jaelleshop.settings')
django.setup()

from products.models import Category, Product, ProductImage

# Images par TYPE DE PRODUIT (détection intelligente)
PRODUCT_TYPE_IMAGES = {
    # Vêtements Hommes
    'T-shirt': {
        'hommes': [
            'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800',
        ]
    },
    'Chemise': {
        'hommes': [
            'https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1192609/pexels-photo-1192609.jpeg?auto=compress&cs=tinysrgb&w=800',
        ]
    },
    'Sweat': {
        'hommes': [
            'https://images.pexels.com/photos/1758144/pexels-photo-1758144.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1670766/pexels-photo-1670766.jpeg?auto=compress&cs=tinysrgb&w=800',
        ]
    },
    'Veste': {
        'hommes': [
            'https://images.pexels.com/photos/1580267/pexels-photo-1580267.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/2529157/pexels-photo-2529157.jpeg?auto=compress&cs=tinysrgb&w=800',
        ]
    },
    'Pantalon': {
        'hommes': [
            'https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg?auto=compress&cs=tinysrgb&w=800',
        ]
    },
    
    # Vêtements Femmes
    'Pull': {
        'femmes': [
            'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800',
        ]
    },
    'Robe': {
        'femmes': [
            'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800',
        ]
    },
    
    # Produits cosmétiques
    'Parfum': {
        'all': [
            'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/3738673/pexels-photo-3738673.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=800',
        ]
    },
    'Crème': {
        'all': [
            'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/3738673/pexels-photo-3738673.jpeg?auto=compress&cs=tinysrgb&w=800',
        ]
    },
    'Lotion': {
        'all': [
            'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=800',
        ]
    },
    'Gel douche': {
        'all': [
            'https://images.pexels.com/photos/4465831/pexels-photo-4465831.jpeg?auto=compress&cs=tinysrgb&w=800',
        ]
    },
    'Déodorant': {
        'all': [
            'https://images.pexels.com/photos/4465831/pexels-photo-4465831.jpeg?auto=compress&cs=tinysrgb&w=800',
        ]
    },
    
    # Montres
    'Montre': {
        'all': [
            'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/364819/pexels-photo-364819.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/125779/pexels-photo-125779.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/47856/rolex-1149718-960-720-47856.jpeg?auto=compress&cs=tinysrgb&w=800',
        ]
    },
    'Smartwatch': {
        'all': [
            'https://images.pexels.com/photos/1697214/pexels-photo-1697214.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=800',
        ]
    },
    
    # Chaussures
    'Sneakers': {
        'all': [
            'https://images.pexels.com/photos/2385477/pexels-photo-2385477.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1456706/pexels-photo-1456706.jpeg?auto=compress&cs=tinysrgb&w=800',
        ]
    },
    'Baskets': {
        'all': [
            'https://images.pexels.com/photos/1670766/pexels-photo-1670766.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1580267/pexels-photo-1580267.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/2529157/pexels-photo-2529157.jpeg?auto=compress&cs=tinysrgb&w=800',
        ]
    },
    'Sandales': {
        'all': [
            'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=800',
        ]
    },
    'Bottes': {
        'all': [
            'https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?auto=compress&cs=tinysrgb&w=800',
        ]
    },
    
    # Accessoires
    'Sac': {
        'all': [
            'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1445696/pexels-photo-1445696.jpeg?auto=compress&cs=tinysrgb&w=800',
        ]
    },
    'Casquette': {
        'all': [
            'https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1124466/pexels-photo-1124466.jpeg?auto=compress&cs=tinysrgb&w=800',
        ]
    },
    'Ceinture': {
        'all': [
            'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800',
        ]
    },
    'Gants': {
        'all': [
            'https://images.pexels.com/photos/1445696/pexels-photo-1445696.jpeg?auto=compress&cs=tinysrgb&w=800',
        ]
    },
    'Écharpe': {
        'all': [
            'https://images.pexels.com/photos/1445696/pexels-photo-1445696.jpeg?auto=compress&cs=tinysrgb&w=800',
        ]
    },
    'Collier': {
        'all': [
            'https://images.pexels.com/photos/1445696/pexels-photo-1445696.jpeg?auto=compress&cs=tinysrgb&w=800',
        ]
    },
    
    # Enfants
    'Kids': {
        'enfants': [
            'https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1648377/pexels-photo-1648377.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1715137/pexels-photo-1715137.jpeg?auto=compress&cs=tinysrgb&w=800',
        ]
    },
    'Jupe': {
        'enfants': [
            'https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg?auto=compress&cs=tinysrgb&w=800',
        ]
    },
    'Pyjama': {
        'enfants': [
            'https://images.pexels.com/photos/1648377/pexels-photo-1648377.jpeg?auto=compress&cs=tinysrgb&w=800',
        ]
    },
}

def detect_product_type(product_name):
    """Détecte le type de produit à partir du nom"""
    name_lower = product_name.lower()
    
    # Recherche par ordre de priorité
    type_keywords = [
        'smartwatch', 'montre', 't-shirt', 'chemise', 'sweat', 'veste', 'pantalon',
        'pull', 'robe', 'parfum', 'crème', 'lotion', 'gel douche', 'déodorant',
        'sneakers', 'baskets', 'sandales', 'bottes', 'sac', 'casquette', 'ceinture',
        'gants', 'écharpe', 'collier', 'kids', 'jupe', 'pyjama'
    ]
    
    for keyword in type_keywords:
        if keyword in name_lower:
            return keyword.title()
    
    return 'default'

def get_image_for_product(product, category_name):
    """Récupère l'image appropriée pour un produit selon son type"""
    product_type = detect_product_type(product.name)
    category_lower = category_name.lower()
    
    if product_type in PRODUCT_TYPE_IMAGES:
        type_images = PRODUCT_TYPE_IMAGES[product_type]
        
        # Chercher d'abord les images spécifiques à la catégorie
        if category_lower in type_images:
            return type_images[category_lower]
        # Puis les images génériques
        elif 'all' in type_images:
            return type_images['all']
    
    return None

def clean_all():
    """Supprime tout complètement"""
    print("🧹 Nettoyage complet...")
    
    # Supprimer de la DB
    deleted_count = ProductImage.objects.all().delete()[0]
    print(f"  ✅ {deleted_count} images supprimées de la DB")
    
    # Supprimer de Cloudinary
    try:
        result = cloudinary.api.delete_resources_by_prefix('evimeria')
        print(f"  ✅ {len(result.get('deleted', []))} images supprimées de Cloudinary")
        
        try:
            cloudinary.api.delete_folder('evimeria/categories')
            cloudinary.api.delete_folder('evimeria')
        except:
            pass
    except Exception as e:
        print(f"  ⚠️  Erreur Cloudinary: {e}")

def download_and_upload_image(image_url, product, category_name):
    """Télécharge et upload une image vers Cloudinary"""
    try:
        print(f"    📸 Téléchargement pour {product.name}...")
        
        # Télécharger l'image
        response = requests.get(image_url, stream=True, timeout=30)
        response.raise_for_status()
        
        # Traitement PIL
        image = Image.open(BytesIO(response.content))
        if image.width > 800 or image.height > 800:
            image.thumbnail((800, 800), Image.Resampling.LANCZOS)
        
        if image.mode in ('RGBA', 'LA'):
            background = Image.new('RGB', image.size, (255, 255, 255))
            background.paste(image, mask=image.split()[-1] if image.mode == 'RGBA' else None)
            image = background
        elif image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Sauvegarder
        img_byte_arr = BytesIO()
        image.save(img_byte_arr, format='JPEG', quality=85, optimize=True)
        img_byte_arr.seek(0)
        
        # Upload vers Cloudinary avec nom propre
        safe_name = re.sub(r'[^a-zA-Z0-9_-]', '_', product.name.lower())
        public_id = f"product_{product.id}_{safe_name}"
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
        print(f"    ❌ Erreur upload pour {product.name}: {str(e)}")
        return None

def smart_assign_images():
    """Assigne intelligemment les images selon le type de produit"""
    print("\n🧠 Assignment intelligent des images...")
    
    categories = Category.objects.filter(is_published=True)
    total_assigned = 0
    
    for category in categories:
        print(f"\n📁 Catégorie: {category.name}")
        products = Product.objects.filter(category=category, is_published=True)
        print(f"  📦 {products.count()} produits")
        
        # Grouper par type de produit détecté
        products_by_type = {}
        for product in products:
            product_type = detect_product_type(product.name)
            if product_type not in products_by_type:
                products_by_type[product_type] = []
            products_by_type[product_type].append(product)
        
        print(f"  🔍 Types détectés: {list(products_by_type.keys())}")
        
        # Assigner pour chaque type
        for product_type, type_products in products_by_type.items():
            print(f"\n    📝 Type: {product_type} ({len(type_products)} produits)")
            
            # Récupérer les images pour ce type
            images = get_image_for_product(type_products[0], category.name)
            if not images:
                print(f"      ⚠️  Aucune image définie pour {product_type}")
                continue
            
            # Assigner aux produits de ce type
            for i, product in enumerate(type_products):
                image_url = images[i % len(images)]  # Cycle si pas assez d'images
                
                cloudinary_url = download_and_upload_image(image_url, product, category.name)
                
                if cloudinary_url:
                    ProductImage.objects.create(
                        product=product,
                        image=cloudinary_url,
                        is_main=True
                    )
                    print(f"      ✅ {product.name} -> image {product_type}")
                    total_assigned += 1
                else:
                    print(f"      ❌ Échec pour {product.name}")
    
    return total_assigned

def main():
    print("🎯 === Assignment intelligent des images par type de produit ===\n")
    
    # Nettoyage complet
    clean_all()
    
    # Assignment intelligent
    total_assigned = smart_assign_images()
    
    # Statistiques
    print(f"\n📊 === Résultats ===")
    print(f"Images assignées: {total_assigned}")
    
    total_products = Product.objects.filter(is_published=True).count()
    products_with_images = Product.objects.filter(is_published=True, images__isnull=False).distinct().count()
    
    print(f"Produits publiés: {total_products}")
    print(f"Produits avec images: {products_with_images}")
    if total_products > 0:
        percentage = (products_with_images/total_products*100)
        print(f"Pourcentage: {percentage:.1f}%")
    
    print("\n✨ Assignment intelligent terminé ! ✨")

if __name__ == '__main__':
    main() 