#!/usr/bin/env python
import os
import django
import sys
from collections import defaultdict

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jaelleshop.settings')
django.setup()

from products.models import Product, Category, ProductImage

def main():
    print("🔍 === Exploration complète de la base de données ===\n")
    
    # Statistiques générales
    total_products = Product.objects.count()
    total_categories = Category.objects.count()
    total_images = ProductImage.objects.count()
    
    print(f"📊 Statistiques générales:")
    print(f"  • Total produits: {total_products}")
    print(f"  • Total catégories: {total_categories}")
    print(f"  • Total images: {total_images}")
    print()
    
    # Explorer toutes les catégories et leurs produits
    categories = Category.objects.all()
    category_data = {}
    
    for category in categories:
        products = Product.objects.filter(category=category)
        product_names = [p.name for p in products]
        
        category_data[category.name] = {
            'count': len(product_names),
            'products': product_names
        }
        
        print(f"📁 Catégorie: {category.name}")
        print(f"  📦 {len(product_names)} produits")
        
        # Analyser les types de produits par nom
        product_types = defaultdict(list)
        for name in product_names:
            product_type = detect_product_type(name)
            product_types[product_type].append(name)
        
        print(f"  🔍 Types de produits détectés:")
        for ptype, names in product_types.items():
            print(f"    • {ptype}: {len(names)} produits")
            for name in names[:3]:  # Afficher les 3 premiers
                print(f"      - {name}")
            if len(names) > 3:
                print(f"      ... (+{len(names)-3} autres)")
        print()
    
    # Analyser les produits avec/sans images
    products_with_images = Product.objects.filter(images__isnull=False).distinct()
    products_without_images = Product.objects.filter(images__isnull=True)
    
    print(f"📸 Répartition des images:")
    print(f"  ✅ Produits avec images: {products_with_images.count()}")
    print(f"  ❌ Produits sans images: {products_without_images.count()}")
    print()
    
    if products_without_images.exists():
        print("❌ Produits sans images:")
        for product in products_without_images[:10]:  # Afficher les 10 premiers
            print(f"  • {product.name} ({product.category.name})")
        if products_without_images.count() > 10:
            print(f"  ... (+{products_without_images.count()-10} autres)")
        print()
    
    # Sauvegarder tous les noms de produits pour référence
    all_products = Product.objects.all().order_by('category__name', 'name')
    print("💾 Sauvegarde de tous les produits...")
    
    with open('/app/all_products_list.txt', 'w', encoding='utf-8') as f:
        current_category = None
        for product in all_products:
            if current_category != product.category.name:
                current_category = product.category.name
                f.write(f"\n=== {current_category} ===\n")
            f.write(f"{product.name}\n")
    
    print("✅ Liste complète sauvegardée dans all_products_list.txt")

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

if __name__ == "__main__":
    main() 