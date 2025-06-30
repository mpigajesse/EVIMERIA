#!/usr/bin/env python
import os
import sys
import django
import cloudinary.api

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jaelleshop.settings')
django.setup()

from products.models import Category, Product, ProductImage

def main():
    print("=== Correction des images des produits ===\n")
    
    try:
        # Lister la structure Cloudinary
        print("Structure Cloudinary:")
        folders = cloudinary.api.subfolders('jaelleshop')
        for folder in folders['folders']:
            print(f"  {folder['name']}/")
            try:
                subfolders = cloudinary.api.subfolders(f"jaelleshop/{folder['name']}")
                for subfolder in subfolders['folders']:
                    # Compter les images
                    result = cloudinary.api.resources(
                        type="upload",
                        prefix=f"jaelleshop/{folder['name']}/{subfolder['name']}",
                        max_results=1
                    )
                    print(f"    {subfolder['name']}/ ({result['total_count']} images)")
            except:
                pass
        
        print("\n=== Récupération des images ===")
        
        # Récupérer les images du dossier products
        folders = cloudinary.api.subfolders('jaelleshop/products')
        
        total_assigned = 0
        
        for folder_info in folders['folders']:
            folder_name = folder_info['name']
            print(f"\nTraitement du dossier: {folder_name}")
            
            # Trouver la catégorie correspondante
            try:
                category = Category.objects.get(name__iexact=folder_name)
                print(f"  Catégorie trouvée: {category.name}")
            except Category.DoesNotExist:
                print(f"  ❌ Catégorie '{folder_name}' non trouvée")
                continue
            
            # Récupérer les images de ce dossier
            try:
                result = cloudinary.api.resources(
                    type="upload",
                    prefix=f"jaelleshop/products/{folder_name}",
                    max_results=50
                )
                
                images = [r['secure_url'] for r in result['resources']]
                print(f"  {len(images)} images trouvées")
                
                # Récupérer les produits de cette catégorie
                products = Product.objects.filter(category=category, is_published=True)
                print(f"  {products.count()} produits dans cette catégorie")
                
                # Assigner les images aux produits
                for i, product in enumerate(products):
                    if i >= len(images):
                        print(f"  ⚠️  Plus d'images pour {product.name}")
                        break
                    
                    # Supprimer les anciennes images
                    ProductImage.objects.filter(product=product).delete()
                    
                    # Créer la nouvelle image
                    ProductImage.objects.create(
                        product=product,
                        image=images[i],
                        is_main=True
                    )
                    
                    print(f"  ✅ {product.name} -> image assignée")
                    total_assigned += 1
                    
            except Exception as e:
                print(f"  ❌ Erreur: {e}")
        
        print(f"\n=== Résumé ===")
        print(f"Total d'images assignées: {total_assigned}")
        
        # Statistiques finales
        total_products = Product.objects.filter(is_published=True).count()
        products_with_images = Product.objects.filter(is_published=True, images__isnull=False).distinct().count()
        
        print(f"Produits publiés: {total_products}")
        print(f"Produits avec images: {products_with_images}")
        if total_products > 0:
            percentage = (products_with_images/total_products*100)
            print(f"Pourcentage: {percentage:.1f}%")
            
    except Exception as e:
        print(f"Erreur: {e}")

if __name__ == '__main__':
    main() 