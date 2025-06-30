#!/usr/bin/env python
import os
import django
from collections import defaultdict

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jaelleshop.settings')
django.setup()

from products.models import Category, SubCategory, Product

def create_subcategories():
    """Créer des sous-catégories basées sur les types de produits"""
    
    print("🏗️ === Création des sous-catégories ===\n")
    
    # Mapping des sous-catégories par catégorie principale
    SUBCATEGORIES_MAPPING = {
        'Enfants': [
            ('Vêtements filles', 'Robes, jupes, t-shirts et vêtements pour filles'),
            ('Vêtements garçons', 'T-shirts, pantalons et vêtements pour garçons'),
            ('Chaussures', 'Sneakers, baskets, sandales et bottes pour enfants'),
            ('Accessoires', 'Ceintures, écharpes et accessoires pour enfants'),
        ],
        'Femmes': [
            ('Vêtements', 'T-shirts, pulls, chemises, robes et pantalons'),
            ('Chaussures', 'Sneakers, baskets, sandales et bottes'),
            ('Montres', 'Montres analogiques et smartwatches'),
            ('Casquettes/Sacs', 'Casquettes, sacs à main et sacs à dos'),
            ('Accessoires', 'Ceintures, colliers, gants et bijoux'),
            ('Produits cosmétiques', 'Parfums, crèmes et produits de beauté')
        ],
        'Hommes': [
            ('Vêtements', 'T-shirts, pulls, chemises, vestes et pantalons'),
            ('Chaussures', 'Sneakers, baskets, sandales et bottes'),
            ('Montres', 'Montres analogiques et smartwatches'),
            ('Casquettes/Sacs', 'Casquettes, sacs à dos et sacs de sport'),
            ('Accessoires', 'Ceintures, colliers, gants et écharpes'),
            ('Produits cosmétiques', 'Parfums, gels douche et déodorants')
        ]
    }
    
    created_count = 0
    updated_count = 0
    
    for category_name, subcategories in SUBCATEGORIES_MAPPING.items():
        try:
            category = Category.objects.get(name=category_name)
            print(f"📁 Catégorie: {category.name}")
            
            for subcategory_name, description in subcategories:
                subcategory, created = SubCategory.objects.get_or_create(
                    category=category,
                    name=subcategory_name,
                    defaults={
                        'description': description,
                        'is_published': True
                    }
                )
                
                if created:
                    print(f"  ✅ Créé: {subcategory_name}")
                    created_count += 1
                else:
                    # Mettre à jour la description et publier
                    subcategory.description = description
                    subcategory.is_published = True
                    subcategory.save()
                    print(f"  🔄 Mis à jour: {subcategory_name}")
                    updated_count += 1
            
            print()
            
        except Category.DoesNotExist:
            print(f"❌ Catégorie '{category_name}' non trouvée")
    
    # Assigner automatiquement les produits aux sous-catégories
    print("🔗 === Assignment automatique des produits ===\n")
    assign_products_to_subcategories()
    
    print(f"📊 === Résultats ===")
    print(f"Sous-catégories créées: {created_count}")
    print(f"Sous-catégories mises à jour: {updated_count}")
    print(f"Total sous-catégories: {SubCategory.objects.count()}")
    print("\n✨ Création des sous-catégories terminée ! ✨")

def detect_subcategory_from_product(product, category_name):
    """Détecte la sous-catégorie appropriée pour un produit"""
    name_lower = product.name.lower()
    
    if category_name == 'Enfants':
        if any(word in name_lower for word in ['jupe', 'robe']) or 'filles' in name_lower:
            return 'Vêtements filles'
        elif any(word in name_lower for word in ['t-shirt', 'pantalon', 'pyjama']) or 'garçons' in name_lower:
            return 'Vêtements garçons'
        elif any(word in name_lower for word in ['sneakers', 'baskets', 'sandales', 'bottes']):
            return 'Chaussures'
        elif any(word in name_lower for word in ['ceinture', 'écharpe']):
            return 'Accessoires'
        elif any(word in name_lower for word in ['jeu', 'puzzle', 'voiture', 'fisher', 'playmobil', 'mattel']):
            return 'Jouets'
        else:
            return 'Vêtements garçons'  # Par défaut
    
    elif category_name == 'Femmes':
        if any(word in name_lower for word in ['sneakers', 'baskets', 'sandales', 'bottes']):
            return 'Chaussures'
        elif any(word in name_lower for word in ['montre', 'smartwatch']):
            return 'Montres'
        elif any(word in name_lower for word in ['sac', 'casquette']):
            return 'Casquettes/Sacs'
        elif any(word in name_lower for word in ['parfum', 'crème', 'lotion']):
            return 'Produits cosmétiques'
        elif any(word in name_lower for word in ['ceinture', 'collier', 'gants', 'bracelet']):
            return 'Accessoires'
        else:
            return 'Vêtements'  # Par défaut
    
    elif category_name == 'Hommes':
        if any(word in name_lower for word in ['sneakers', 'baskets', 'sandales', 'bottes', 'mocassins']):
            return 'Chaussures'
        elif any(word in name_lower for word in ['montre', 'smartwatch']):
            return 'Montres'
        elif any(word in name_lower for word in ['sac', 'casquette']):
            return 'Casquettes/Sacs'
        elif any(word in name_lower for word in ['parfum', 'gel douche', 'déodorant']):
            return 'Produits cosmétiques'
        elif any(word in name_lower for word in ['ceinture', 'collier', 'gants', 'écharpe']):
            return 'Accessoires'
        else:
            return 'Vêtements'  # Par défaut
    
    return None

def assign_products_to_subcategories():
    """Assigner automatiquement les produits aux sous-catégories"""
    products = Product.objects.all()
    assigned_count = 0
    
    for product in products:
        category_name = product.category.name
        subcategory_name = detect_subcategory_from_product(product, category_name)
        
        if subcategory_name:
            try:
                subcategory = SubCategory.objects.get(
                    category=product.category,
                    name=subcategory_name
                )
                
                if product.subcategory != subcategory:
                    product.subcategory = subcategory
                    product.save()
                    print(f"  🔗 {product.name} → {subcategory_name}")
                    assigned_count += 1
                    
            except SubCategory.DoesNotExist:
                print(f"  ❌ Sous-catégorie '{subcategory_name}' non trouvée pour {product.name}")
    
    print(f"\n📊 {assigned_count} produits assignés aux sous-catégories")

if __name__ == "__main__":
    create_subcategories() 