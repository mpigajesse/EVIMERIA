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

# URLs d'images Unsplash VALIDES (testées)
PRODUCT_IMAGES = {
    # === VÊTEMENTS ===
    'T-Shirt': {
        'product': [
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
            'https://images.unsplash.com/photo-1576566588028-4147f3842f27',
            'https://images.unsplash.com/photo-1562157873-818bc0726f68',
            'https://images.unsplash.com/photo-1618354691373-d851c5c3a990'
        ],
        'model': [
            'https://images.unsplash.com/photo-1581803118522-7b72a50f7e9f',
            'https://images.unsplash.com/photo-1564859228273-274232fdb516',
            'https://images.unsplash.com/photo-1506629905057-f15ed7a8fb8a'
        ]
    },
    'Pull': {
        'product': [
            'https://images.unsplash.com/photo-1434389677669-e08b4cac3105',
            'https://images.unsplash.com/photo-1576871337622-98d48d1cf531'
        ],
        'model': [
            'https://images.unsplash.com/photo-1434389677669-e08b4cac3105',
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'
        ]
    },
    'Chemise': {
        'product': [
            'https://images.unsplash.com/photo-1564859228273-274232fdb516',
            'https://images.unsplash.com/photo-1562157873-818bc0726f68'
        ],
        'model': [
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
            'https://images.unsplash.com/photo-1581803118522-7b72a50f7e9f'
        ]
    },
    'Sweat': {
        'product': [
            'https://images.unsplash.com/photo-1556821840-3a9c6e1fcb84',
            'https://images.unsplash.com/photo-1578587018452-892bacefd3f2'
        ],
        'model': [
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
            'https://images.unsplash.com/photo-1581803118522-7b72a50f7e9f'
        ]
    },
    'Veste': {
        'product': [
            'https://images.unsplash.com/photo-1551028719-00167b16eac5',
            'https://images.unsplash.com/photo-1520975954732-35dd22299614'
        ],
        'model': [
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
            'https://images.unsplash.com/photo-1581803118522-7b72a50f7e9f'
        ]
    },
    'Pantalon': {
        'product': [
            'https://images.unsplash.com/photo-1542272604-787c3835535d',
            'https://images.unsplash.com/photo-1473966968600-fa801b869a1a'
        ],
        'model': [
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
            'https://images.unsplash.com/photo-1581803118522-7b72a50f7e9f'
        ]
    },
    'Jupe': {
        'product': [
            'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1',
            'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446'
        ],
        'model': [
            'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446',
            'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1'
        ]
    },
    'Robe': {
        'product': [
            'https://images.unsplash.com/photo-1595777457583-95e059d581b8',
            'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1'
        ],
        'model': [
            'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1',
            'https://images.unsplash.com/photo-1595777457583-95e059d581b8'
        ]
    },
    
    # === ENFANTS ===
    'Pyjama': {
        'product': [
            'https://images.unsplash.com/photo-1503919545889-aef636e10ad4',
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96'
        ],
        'model': [
            'https://images.unsplash.com/photo-1503919545889-aef636e10ad4',
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96'
        ]
    },
    'Jouet': {
        'product': [
            'https://images.unsplash.com/photo-1558877385-8c5e9f0a4306',
            'https://images.unsplash.com/photo-1515824264358-d4315a6b85d6',
            'https://images.unsplash.com/photo-1566302811714-025e6e7cf8b4'
        ],
        'model': [
            'https://images.unsplash.com/photo-1558877385-8c5e9f0a4306',
            'https://images.unsplash.com/photo-1515824264358-d4315a6b85d6'
        ]
    },
    
    # === CHAUSSURES ===
    'Sneakers': {
        'product': [
            'https://images.unsplash.com/photo-1549298916-b41d501d3772',
            'https://images.unsplash.com/photo-1560769629-975ec94e6a86',
            'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa'
        ],
        'model': [
            'https://images.unsplash.com/photo-1549298916-b41d501d3772',
            'https://images.unsplash.com/photo-1560769629-975ec94e6a86'
        ]
    },
    'Baskets': {
        'product': [
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
            'https://images.unsplash.com/photo-1608231387042-66d1773070a5'
        ],
        'model': [
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
            'https://images.unsplash.com/photo-1608231387042-66d1773070a5'
        ]
    },
    'Sandales': {
        'product': [
            'https://images.unsplash.com/photo-1603487742131-4160ec999306',
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b'
        ],
        'model': [
            'https://images.unsplash.com/photo-1603487742131-4160ec999306',
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b'
        ]
    },
    'Bottes': {
        'product': [
            'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f',
            'https://images.unsplash.com/photo-1605463100876-e2c8dd27c9d2'
        ],
        'model': [
            'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f',
            'https://images.unsplash.com/photo-1605463100876-e2c8dd27c9d2'
        ]
    },
    
    # === ACCESSOIRES ===
    'Sac': {
        'product': [
            'https://images.unsplash.com/photo-1553062407-98eeb64c6a62',
            'https://images.unsplash.com/photo-1584917865442-de89df76afd3',
            'https://images.unsplash.com/photo-1548036328-c9fa89d128fa'
        ],
        'model': [
            'https://images.unsplash.com/photo-1553062407-98eeb64c6a62',
            'https://images.unsplash.com/photo-1584917865442-de89df76afd3'
        ]
    },
    'Casquette': {
        'product': [
            'https://images.unsplash.com/photo-1588850561407-ed78c282e89b',
            'https://images.unsplash.com/photo-1521369909029-2afed882baee'
        ],
        'model': [
            'https://images.unsplash.com/photo-1588850561407-ed78c282e89b',
            'https://images.unsplash.com/photo-1521369909029-2afed882baee'
        ]
    },
    'Ceinture': {
        'product': [
            'https://images.unsplash.com/photo-1553062407-98eeb64c6a62',
            'https://images.unsplash.com/photo-1506629905057-f15ed7a8fb8a'
        ],
        'model': [
            'https://images.unsplash.com/photo-1506629905057-f15ed7a8fb8a',
            'https://images.unsplash.com/photo-1553062407-98eeb64c6a62'
        ]
    },
    'Écharpe': {
        'product': [
            'https://images.unsplash.com/photo-1578598711303-7a4e6fb10cb8',
            'https://images.unsplash.com/photo-1605963982633-2527e4a22ed0'
        ],
        'model': [
            'https://images.unsplash.com/photo-1578598711303-7a4e6fb10cb8',
            'https://images.unsplash.com/photo-1605963982633-2527e4a22ed0'
        ]
    },
    'Gants': {
        'product': [
            'https://images.unsplash.com/photo-1578598711303-7a4e6fb10cb8',
            'https://images.unsplash.com/photo-1605963982633-2527e4a22ed0'
        ],
        'model': [
            'https://images.unsplash.com/photo-1578598711303-7a4e6fb10cb8',
            'https://images.unsplash.com/photo-1605963982633-2527e4a22ed0'
        ]
    },
    'Collier': {
        'product': [
            'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f',
            'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338'
        ],
        'model': [
            'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f',
            'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338'
        ]
    },
    
    # === MONTRES ===
    'Montre': {
        'product': [
            'https://images.unsplash.com/photo-1524805444758-089113d48a6d',
            'https://images.unsplash.com/photo-1508057198894-247b23fe5ade',
            'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d'
        ],
        'model': [
            'https://images.unsplash.com/photo-1524805444758-089113d48a6d',
            'https://images.unsplash.com/photo-1508057198894-247b23fe5ade'
        ]
    },
    'Smartwatch': {
        'product': [
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
            'https://images.unsplash.com/photo-1546868871-7041f2a55e12'
        ],
        'model': [
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
            'https://images.unsplash.com/photo-1546868871-7041f2a55e12'
        ]
    },
    
    # === COSMÉTIQUES ===
    'Parfum': {
        'product': [
            'https://images.unsplash.com/photo-1541643600914-78b084683601',
            'https://images.unsplash.com/photo-1615634260167-c8cdede054de',
            'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539'
        ],
        'model': [
            'https://images.unsplash.com/photo-1541643600914-78b084683601',
            'https://images.unsplash.com/photo-1615634260167-c8cdede054de'
        ]
    },
    'Crème': {
        'product': [
            'https://images.unsplash.com/photo-1556228578-8c89e6adf883',
            'https://images.unsplash.com/photo-1612817288484-6f916006741a'
        ],
        'model': [
            'https://images.unsplash.com/photo-1556228578-8c89e6adf883',
            'https://images.unsplash.com/photo-1612817288484-6f916006741a'
        ]
    },
    'Lotion': {
        'product': [
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b',
            'https://images.unsplash.com/photo-1612817288484-6f916006741a'
        ],
        'model': [
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b',
            'https://images.unsplash.com/photo-1612817288484-6f916006741a'
        ]
    },
    'Gel Douche': {
        'product': [
            'https://images.unsplash.com/photo-1556228578-8c89e6adf883',
            'https://images.unsplash.com/photo-1612817288484-6f916006741a'
        ],
        'model': [
            'https://images.unsplash.com/photo-1556228578-8c89e6adf883',
            'https://images.unsplash.com/photo-1612817288484-6f916006741a'
        ]
    },
    'Déodorant': {
        'product': [
            'https://images.unsplash.com/photo-1556228578-8c89e6adf883',
            'https://images.unsplash.com/photo-1612817288484-6f916006741a'
        ],
        'model': [
            'https://images.unsplash.com/photo-1556228578-8c89e6adf883',
            'https://images.unsplash.com/photo-1612817288484-6f916006741a'
        ]
    },
    
    # === TYPES SPÉCIAUX (pour remplacer "Autre") ===
    'Jeu': {
        'product': [
            'https://images.unsplash.com/photo-1558877385-8c5e9f0a4306',
            'https://images.unsplash.com/photo-1515824264358-d4315a6b85d6'
        ],
        'model': [
            'https://images.unsplash.com/photo-1558877385-8c5e9f0a4306',
            'https://images.unsplash.com/photo-1515824264358-d4315a6b85d6'
        ]
    },
    'Voiture': {
        'product': [
            'https://images.unsplash.com/photo-1558877385-8c5e9f0a4306',
            'https://images.unsplash.com/photo-1566302811714-025e6e7cf8b4'
        ],
        'model': [
            'https://images.unsplash.com/photo-1558877385-8c5e9f0a4306',
            'https://images.unsplash.com/photo-1566302811714-025e6e7cf8b4'
        ]
    },
    'Puzzle': {
        'product': [
            'https://images.unsplash.com/photo-1558877385-8c5e9f0a4306',
            'https://images.unsplash.com/photo-1515824264358-d4315a6b85d6'
        ],
        'model': [
            'https://images.unsplash.com/photo-1558877385-8c5e9f0a4306',
            'https://images.unsplash.com/photo-1515824264358-d4315a6b85d6'
        ]
    },
    'Bracelet': {
        'product': [
            'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f',
            'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338'
        ],
        'model': [
            'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f',
            'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338'
        ]
    },
    'Mocassins': {
        'product': [
            'https://images.unsplash.com/photo-1549298916-b41d501d3772',
            'https://images.unsplash.com/photo-1560769629-975ec94e6a86'
        ],
        'model': [
            'https://images.unsplash.com/photo-1549298916-b41d501d3772',
            'https://images.unsplash.com/photo-1560769629-975ec94e6a86'
        ]
    }
}

def clean_filename(name):
    """Nettoie le nom pour Cloudinary"""
    name = re.sub(r'[^\w\s-]', '', name)
    name = re.sub(r'[-\s]+', '_', name)
    return name.lower()

def detect_product_type(name):
    """Détecte le type de produit basé sur le nom (amélioré)"""
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
    elif any(word in name_lower for word in ['pantalon', 'jean', 'trouser', 'chino']):
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
    elif any(word in name_lower for word in ['mocassins', 'mocassin']):
        return 'Mocassins'
    
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
    elif any(word in name_lower for word in ['bracelet']):
        return 'Bracelet'
    
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
    
    # Enfants et jouets
    elif any(word in name_lower for word in ['kids', 'enfant']):
        return 'Kids'
    elif any(word in name_lower for word in ['jeu de société', 'jeu']):
        return 'Jeu'
    elif any(word in name_lower for word in ['voiture']):
        return 'Voiture'
    elif any(word in name_lower for word in ['puzzle']):
        return 'Puzzle'
    elif any(word in name_lower for word in ['jouet', 'toy']):
        return 'Jouet'
    
    return 'T-Shirt'  # Par défaut, plus de "Autre"

def download_and_upload_image(image_url, cloudinary_path):
    """Télécharge une image depuis Unsplash et l'uploade vers Cloudinary"""
    try:
        # Ajouter paramètres Unsplash pour optimiser
        if 'unsplash.com' in image_url:
            image_url += '?w=800&q=80&auto=format'
        
        response = requests.get(image_url, timeout=15)
        response.raise_for_status()
        
        result = cloudinary.uploader.upload(
            response.content,
            public_id=cloudinary_path,
            overwrite=True,
            resource_type="image",
            format="jpg"
        )
        
        return result['secure_url']
        
    except Exception as e:
        print(f"        ❌ Erreur: {str(e)}")
        return None

def clean_all_images():
    """Supprime toutes les images existantes"""
    print("🧹 Nettoyage complet...")
    
    deleted_count = ProductImage.objects.all().delete()[0]
    print(f"  ✅ {deleted_count} images supprimées de la DB")
    
    try:
        cloudinary.api.delete_resources_by_prefix("evimeria/")
        print("  ✅ Images Cloudinary supprimées")
    except Exception as e:
        print(f"  ⚠️  Erreur Cloudinary: {e}")

def main():
    print("🎯 === SOLUTION ULTIME D'IMAGES ===\n")
    
    # Exploration et nettoyage
    all_products = Product.objects.all().order_by('category__name', 'name')
    categories = defaultdict(list)
    
    for product in all_products:
        categories[product.category.name].append(product)
    
    print(f"🔍 {all_products.count()} produits dans {len(categories)} catégories")
    
    clean_all_images()
    
    print("\n🎨 Assignment avec images multiples (produit + mannequin)...")
    
    total_assigned = 0
    total_images_created = 0
    
    for category_name, products in categories.items():
        print(f"\n📁 Catégorie: {category_name}")
        print(f"  📦 {len(products)} produits")
        
        products_by_type = defaultdict(list)
        for product in products:
            product_type = detect_product_type(product.name)
            products_by_type[product_type].append(product)
        
        for product_type, type_products in products_by_type.items():
            print(f"\n    📝 Type: {product_type} ({len(type_products)} produits)")
            
            if product_type not in PRODUCT_IMAGES:
                print(f"      ⚠️  Type non mappé: {product_type}")
                continue
            
            product_imgs = PRODUCT_IMAGES[product_type]['product']
            model_imgs = PRODUCT_IMAGES[product_type]['model']
            
            for i, product in enumerate(type_products):
                print(f"      📸 {product.name}...")
                
                success_count = 0
                
                # Image 1: Produit seul (principale)
                product_img_url = product_imgs[i % len(product_imgs)]
                clean_name = clean_filename(product.name)
                cloudinary_path = f"evimeria/products/{category_name.lower()}/{product_type.lower()}/{clean_name}_{product.id}_product"
                
                secure_url = download_and_upload_image(product_img_url, cloudinary_path)
                if secure_url:
                    ProductImage.objects.create(
                        product=product,
                        image=secure_url,
                        is_main=True
                    )
                    success_count += 1
                    total_images_created += 1
                    print(f"        ✅ Image produit créée")
                
                # Image 2: Mannequin (secondaire)
                model_img_url = model_imgs[i % len(model_imgs)]
                cloudinary_path_model = f"evimeria/products/{category_name.lower()}/{product_type.lower()}/{clean_name}_{product.id}_model"
                
                secure_url_model = download_and_upload_image(model_img_url, cloudinary_path_model)
                if secure_url_model:
                    ProductImage.objects.create(
                        product=product,
                        image=secure_url_model,
                        is_main=False
                    )
                    success_count += 1
                    total_images_created += 1
                    print(f"        ✅ Image mannequin créée")
                
                if success_count > 0:
                    total_assigned += 1
                    print(f"        🎯 {success_count} images assignées")
                else:
                    print(f"        ❌ Échec complet")
                
                time.sleep(1)  # Pause pour éviter les limites
    
    # Rapport final
    total_products = Product.objects.count()
    products_with_images = Product.objects.filter(images__isnull=False).distinct().count()
    
    print(f"\n📊 === RÉSULTATS FINAUX ===")
    print(f"Produits traités: {total_assigned}")
    print(f"Images créées: {total_images_created}")
    print(f"Produits avec images: {products_with_images}/{total_products}")
    print(f"Taux de réussite: {(products_with_images/total_products)*100:.1f}%")
    
    # Produits sans images
    products_without_images = Product.objects.filter(images__isnull=True)
    if products_without_images.exists():
        print(f"\n❌ Produits sans images ({products_without_images.count()}):")
        for product in products_without_images[:5]:
            product_type = detect_product_type(product.name)
            print(f"  • {product.name} (Type: {product_type})")
        if products_without_images.count() > 5:
            print(f"  ... (+{products_without_images.count()-5} autres)")
    
    print("\n✨ Solution ultime terminée ! ✨")

if __name__ == "__main__":
    main() 