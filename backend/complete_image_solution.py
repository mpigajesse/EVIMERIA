#!/usr/bin/env python
import os
import django
import sys
import requests
import re
import cloudinary
import cloudinary.uploader
import time
import random
from collections import defaultdict

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jaelleshop.settings')
django.setup()

from products.models import Product, Category, ProductImage

# Configuration Cloudinary
cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
    api_key=os.getenv('CLOUDINARY_API_KEY'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET'),
    secure=True
)

# Clé Unsplash (remplacez par votre vraie clé si vous en avez une)
UNSPLASH_ACCESS_KEY = "your_unsplash_access_key_here"

# URLs d'images Unsplash organisées par type de produit
UNSPLASH_IMAGES = {
    # Vêtements Homme
    'T-Shirt': [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
        'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800',
        'https://images.unsplash.com/photo-1583743814966-8936f37f4678?w=800',
        'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800',
        'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800'
    ],
    'Pull': [
        'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800',
        'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800',
        'https://images.unsplash.com/photo-1585487000143-6d4592a7c4b0?w=800'
    ],
    'Chemise': [
        'https://images.unsplash.com/photo-1564859228273-274232fdb516?w=800',
        'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800',
        'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800'
    ],
    'Sweat': [
        'https://images.unsplash.com/photo-1556821840-3a9c6e1fcb84?w=800',
        'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800',
        'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800'
    ],
    'Veste': [
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
        'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800',
        'https://images.unsplash.com/photo-1520975954732-35dd22299614?w=800'
    ],
    'Pantalon': [
        'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800',
        'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800',
        'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800'
    ],
    
    # Vêtements Femme
    'Jupe': [
        'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800',
        'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800',
        'https://images.unsplash.com/photo-1564859228273-274232fdb516?w=800'
    ],
    'Robe': [
        'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800',
        'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800',
        'https://images.unsplash.com/photo-1566479179817-c91e6b6e4c4f?w=800'
    ],
    
    # Enfants
    'Pyjama': [
        'https://images.unsplash.com/photo-1596208124854-66b87a5e4bb1?w=800',
        'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800'
    ],
    'Kids': [
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
        'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800',
        'https://images.unsplash.com/photo-1596208124854-66b87a5e4bb1?w=800'
    ],
    'Jouet': [
        'https://images.unsplash.com/photo-1558877385-8c5e9f0a4306?w=800',
        'https://images.unsplash.com/photo-1515824264358-d4315a6b85d6?w=800',
        'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800'
    ],
    
    # Chaussures
    'Sneakers': [
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800',
        'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800',
        'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800',
        'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800'
    ],
    'Baskets': [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
        'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800',
        'https://images.unsplash.com/photo-1605408499391-6368c628ef42?w=800'
    ],
    'Sandales': [
        'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=800',
        'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=800',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800'
    ],
    'Bottes': [
        'https://images.unsplash.com/photo-1608256246200-53e8b47b2342?w=800',
        'https://images.unsplash.com/photo-1605812230347-27ad5827cb8a?w=800',
        'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800'
    ],
    
    # Accessoires
    'Sac': [
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800',
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800',
        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800',
        'https://images.unsplash.com/photo-1566934302623-3a31af6b31b8?w=800'
    ],
    'Casquette': [
        'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800',
        'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800',
        'https://images.unsplash.com/photo-1575428652377-a2d80b2463f2?w=800'
    ],
    'Ceinture': [
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800',
        'https://images.unsplash.com/photo-1594989872901-e34a2e6c9bb1?w=800',
        'https://images.unsplash.com/photo-1506629905057-f15ed7a8fb8a?w=800'
    ],
    'Écharpe': [
        'https://images.unsplash.com/photo-1581795669633-91ef7c9d8cc6?w=800',
        'https://images.unsplash.com/photo-1578598711303-7a4e6fb10cb8?w=800',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800'
    ],
    'Gants': [
        'https://images.unsplash.com/photo-1578598711303-7a4e6fb10cb8?w=800',
        'https://images.unsplash.com/photo-1581795669633-91ef7c8cc6a6?w=800',
        'https://images.unsplash.com/photo-1605963982633-2527e4a22ed0?w=800'
    ],
    'Collier': [
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800',
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800',
        'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800'
    ],
    
    # Montres
    'Montre': [
        'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800',
        'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=800',
        'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800',
        'https://images.unsplash.com/photo-1606242076368-9d77dbb73015?w=800'
    ],
    'Smartwatch': [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
        'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800',
        'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800'
    ],
    
    # Cosmétiques
    'Parfum': [
        'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800',
        'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=800',
        'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800',
        'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800'
    ],
    'Crème': [
        'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800',
        'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=800',
        'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800'
    ],
    'Lotion': [
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
        'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800',
        'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800'
    ],
    'Gel Douche': [
        'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800',
        'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800',
        'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=800'
    ],
    'Déodorant': [
        'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800',
        'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800',
        'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=800'
    ]
}

def clean_filename(name):
    """Nettoie le nom pour Cloudinary"""
    # Remplacer les caractères spéciaux
    name = re.sub(r'[^\w\s-]', '', name)
    name = re.sub(r'[-\s]+', '_', name)
    return name.lower()

def detect_product_type(name):
    """Détecte le type de produit basé sur le nom"""
    name_lower = name.lower()
    
    # Vêtements
    if any(word in name_lower for word in ['t-shirt', 'tee-shirt', 'tshirt']):
        return 'T-Shirt'
    elif any(word in name_lower for word in ['pull', 'pullover']):
        return 'Pull'
    elif any(word in name_lower for word in ['chemise', 'shirt']):
        return 'Chemise'
    elif any(word in name_lower for word in ['sweat', 'sweatshirt']):
        return 'Sweat'
    elif any(word in name_lower for word in ['veste', 'jacket']):
        return 'Veste'
    elif any(word in name_lower for word in ['pantalon', 'jean', 'trouser']):
        return 'Pantalon'
    elif any(word in name_lower for word in ['jupe', 'skirt']):
        return 'Jupe'
    elif any(word in name_lower for word in ['robe', 'dress']):
        return 'Robe'
    elif any(word in name_lower for word in ['pyjama']):
        return 'Pyjama'
    
    # Chaussures
    elif any(word in name_lower for word in ['sneakers', 'sneaker']):
        return 'Sneakers'
    elif any(word in name_lower for word in ['baskets', 'basket']):
        return 'Baskets'
    elif any(word in name_lower for word in ['sandales', 'sandale']):
        return 'Sandales'
    elif any(word in name_lower for word in ['bottes', 'botte', 'boots']):
        return 'Bottes'
    
    # Accessoires
    elif any(word in name_lower for word in ['sac', 'bag']):
        return 'Sac'
    elif any(word in name_lower for word in ['casquette', 'cap']):
        return 'Casquette'
    elif any(word in name_lower for word in ['ceinture', 'belt']):
        return 'Ceinture'
    elif any(word in name_lower for word in ['écharpe', 'scarf']):
        return 'Écharpe'
    elif any(word in name_lower for word in ['gants', 'gloves']):
        return 'Gants'
    elif any(word in name_lower for word in ['collier', 'necklace']):
        return 'Collier'
    
    # Montres
    elif any(word in name_lower for word in ['smartwatch', 'smart watch']):
        return 'Smartwatch'
    elif any(word in name_lower for word in ['montre', 'watch']):
        return 'Montre'
    
    # Cosmétiques
    elif any(word in name_lower for word in ['parfum', 'perfume']):
        return 'Parfum'
    elif any(word in name_lower for word in ['crème', 'cream']):
        return 'Crème'
    elif any(word in name_lower for word in ['lotion']):
        return 'Lotion'
    elif any(word in name_lower for word in ['gel douche', 'body wash']):
        return 'Gel Douche'
    elif any(word in name_lower for word in ['déodorant', 'deodorant']):
        return 'Déodorant'
    
    # Enfants
    elif any(word in name_lower for word in ['kids', 'enfant']):
        return 'Kids'
    elif any(word in name_lower for word in ['jouet', 'toy']):
        return 'Jouet'
    
    return 'Autre'

def download_and_upload_image(image_url, cloudinary_path):
    """Télécharge une image depuis Unsplash et l'uploade vers Cloudinary"""
    try:
        # Télécharger l'image
        response = requests.get(image_url, timeout=10)
        response.raise_for_status()
        
        # Upload vers Cloudinary
        result = cloudinary.uploader.upload(
            response.content,
            public_id=cloudinary_path,
            overwrite=True,
            resource_type="image",
            format="jpg"
        )
        
        return result['secure_url']
        
    except Exception as e:
        print(f"❌ Erreur upload: {str(e)}")
        return None

def clean_all_images():
    """Supprime toutes les images existantes"""
    print("🧹 Nettoyage complet de toutes les images...")
    
    # Supprimer de la DB
    deleted_count = ProductImage.objects.all().delete()[0]
    print(f"  ✅ {deleted_count} images supprimées de la DB")
    
    # Supprimer de Cloudinary (dossier evimeria)
    try:
        result = cloudinary.api.delete_resources_by_prefix("evimeria/")
        print(f"  ✅ Images Cloudinary supprimées")
    except Exception as e:
        print(f"  ⚠️  Erreur Cloudinary: {e}")

def main():
    print("🎯 === Solution complète d'images avec Unsplash ===\n")
    
    # 1. Exploration de la DB
    print("🔍 Exploration de la base de données...")
    all_products = Product.objects.all().order_by('category__name', 'name')
    categories = defaultdict(list)
    
    for product in all_products:
        categories[product.category.name].append(product)
    
    print(f"  📊 {all_products.count()} produits dans {len(categories)} catégories")
    
    # 2. Nettoyage complet
    clean_all_images()
    
    # 3. Assignment intelligent avec Unsplash
    print("\n🎨 Assignment intelligent avec Unsplash...")
    
    total_assigned = 0
    image_counters = defaultdict(int)  # Pour éviter les doublons
    
    for category_name, products in categories.items():
        print(f"\n📁 Catégorie: {category_name}")
        print(f"  📦 {len(products)} produits")
        
        # Grouper par type de produit
        products_by_type = defaultdict(list)
        for product in products:
            product_type = detect_product_type(product.name)
            products_by_type[product_type].append(product)
        
        print(f"  🔍 Types détectés: {list(products_by_type.keys())}")
        
        for product_type, type_products in products_by_type.items():
            print(f"\n    📝 Type: {product_type} ({len(type_products)} produits)")
            
            if product_type not in UNSPLASH_IMAGES:
                print(f"      ⚠️  Aucune image définie pour {product_type}")
                continue
            
            available_images = UNSPLASH_IMAGES[product_type]
            
            for i, product in enumerate(type_products):
                # Sélectionner une image (cyclique pour éviter les répétitions)
                image_url = available_images[i % len(available_images)]
                
                # Générer un nom unique pour Cloudinary
                clean_name = clean_filename(product.name)
                cloudinary_path = f"evimeria/categories/{category_name.lower()}/{product_type.lower()}/{clean_name}_{product.id}"
                
                print(f"      📸 {product.name}...")
                
                # Upload vers Cloudinary
                secure_url = download_and_upload_image(image_url, cloudinary_path)
                
                if secure_url:
                    # Créer l'entrée en DB
                    ProductImage.objects.create(
                        product=product,
                        image=secure_url,
                        is_main=True
                    )
                    print(f"        ✅ Assigné -> {product_type}")
                    total_assigned += 1
                else:
                    print(f"        ❌ Échec")
                
                # Pause pour éviter les limites de taux
                time.sleep(0.5)
    
    # 4. Rapport final
    total_products = Product.objects.count()
    products_with_images = Product.objects.filter(images__isnull=False).distinct().count()
    
    print(f"\n📊 === Résultats finaux ===")
    print(f"Images assignées: {total_assigned}")
    print(f"Produits totaux: {total_products}")
    print(f"Produits avec images: {products_with_images}")
    print(f"Pourcentage: {(products_with_images/total_products)*100:.1f}%")
    
    # Produits sans images
    products_without_images = Product.objects.filter(images__isnull=True)
    if products_without_images.exists():
        print(f"\n❌ Produits sans images ({products_without_images.count()}):")
        for product in products_without_images[:10]:
            product_type = detect_product_type(product.name)
            print(f"  • {product.name} (Type: {product_type})")
        if products_without_images.count() > 10:
            print(f"  ... (+{products_without_images.count()-10} autres)")
    
    print("\n✨ Solution complète terminée ! ✨")

if __name__ == "__main__":
    main() 