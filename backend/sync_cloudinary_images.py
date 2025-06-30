#!/usr/bin/env python
import os
import sys
import django
import cloudinary.api
import cloudinary

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jaelleshop.settings')
django.setup()

from products.models import Category, Product, ProductImage

def get_cloudinary_images_by_folder():
    """Récupère toutes les images de Cloudinary organisées par dossier"""
    try:
        print("Récupération des images depuis Cloudinary...")
        
        # Récupérer toutes les images du dossier jaelleshop/products
        images_by_folder = {}
        
        # Lister tous les dossiers de catégories
        folders = cloudinary.api.subfolders('jaelleshop/products')
        
        for folder_info in folders['folders']:
            folder_name = folder_info['name']
            folder_path = f"jaelleshop/products/{folder_name}"
            
            print(f"Traitement du dossier: {folder_path}")
            
            # Récupérer les images de ce dossier
            try:
                result = cloudinary.api.resources(
                    type="upload",
                    prefix=folder_path,
                    max_results=100
                )
                
                images_by_folder[folder_name] = []
                for resource in result['resources']:
                    images_by_folder[folder_name].append({
                        'public_id': resource['public_id'],
                        'secure_url': resource['secure_url'],
                        'created_at': resource['created_at']
                    })
                
                print(f"  - {len(images_by_folder[folder_name])} images trouvées")
                
            except Exception as e:
                print(f"  - Erreur lors du traitement du dossier {folder_path}: {e}")
                images_by_folder[folder_name] = []
        
        return images_by_folder
        
    except Exception as e:
        print(f"Erreur lors de la récupération des images Cloudinary: {e}")
        return {}

def sync_images_to_products():
    """Synchronise les images Cloudinary avec les produits"""
    print("\n=== Synchronisation des images Cloudinary avec les produits ===")
    
    # Récupérer les images de Cloudinary
    cloudinary_images = get_cloudinary_images_by_folder()
    
    if not cloudinary_images:
        print("Aucune image trouvée dans Cloudinary")
        return
    
    # Traiter chaque catégorie
    for category_folder, images in cloudinary_images.items():
        print(f"\n--- Traitement de la catégorie: {category_folder} ---")
        
        # Trouver la catégorie correspondante
        try:
            category = Category.objects.get(name__iexact=category_folder)
        except Category.DoesNotExist:
            print(f"Catégorie '{category_folder}' non trouvée en base de données")
            continue
        
        # Récupérer les produits de cette catégorie
        products = Product.objects.filter(category=category, is_published=True)
        
        if not products.exists():
            print(f"Aucun produit trouvé pour la catégorie {category_folder}")
            continue
        
        print(f"Produits trouvés: {products.count()}")
        print(f"Images disponibles: {len(images)}")
        
        # Assigner les images aux produits
        for i, product in enumerate(products):
            if i >= len(images):
                print(f"Plus d'images disponibles pour le produit: {product.name}")
                break
            
            # Supprimer les anciennes images du produit
            ProductImage.objects.filter(product=product).delete()
            
            # Assigner la nouvelle image
            image_data = images[i]
            product_image = ProductImage.objects.create(
                product=product,
                image=image_data['secure_url'],
                is_main=True
            )
            
            print(f"✓ Image assignée au produit: {product.name}")
            print(f"  URL: {image_data['secure_url']}")
    
    print("\n=== Synchronisation terminée ===")

def list_cloudinary_structure():
    """Affiche la structure des dossiers Cloudinary"""
    print("\n=== Structure des dossiers Cloudinary ===")
    
    try:
        # Lister le dossier racine jaelleshop
        folders = cloudinary.api.subfolders('jaelleshop')
        print("Dossier racine: jaelleshop/")
        
        for folder in folders['folders']:
            print(f"  └── {folder['name']}/")
            
            # Lister les sous-dossiers
            try:
                subfolders = cloudinary.api.subfolders(f"jaelleshop/{folder['name']}")
                for subfolder in subfolders['folders']:
                    print(f"      └── {subfolder['name']}/")
                    
                    # Compter les images dans ce sous-dossier
                    try:
                        result = cloudinary.api.resources(
                            type="upload",
                            prefix=f"jaelleshop/{folder['name']}/{subfolder['name']}",
                            max_results=1
                        )
                        total_count = result['total_count']
                        print(f"          ({total_count} images)")
                    except:
                        print("          (erreur de comptage)")
                        
            except:
                # Pas de sous-dossiers, compter les images directement
                try:
                    result = cloudinary.api.resources(
                        type="upload",
                        prefix=f"jaelleshop/{folder['name']}",
                        max_results=1
                    )
                    total_count = result['total_count']
                    print(f"      ({total_count} images)")
                except:
                    print("      (erreur de comptage)")
                    
    except Exception as e:
        print(f"Erreur lors de l'exploration: {e}")

def main():
    print("=== Synchronisation des images Cloudinary ===\n")
    
    # Afficher la structure actuelle
    list_cloudinary_structure()
    
    # Synchroniser les images
    sync_images_to_products()
    
    # Vérifier le résultat
    print("\n=== Vérification finale ===")
    total_products = Product.objects.filter(is_published=True).count()
    products_with_images = Product.objects.filter(is_published=True, images__isnull=False).distinct().count()
    
    print(f"Produits publiés: {total_products}")
    print(f"Produits avec images: {products_with_images}")
    print(f"Pourcentage: {(products_with_images/total_products*100):.1f}%" if total_products > 0 else "0%")

if __name__ == '__main__':
    main() 