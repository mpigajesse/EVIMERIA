#!/usr/bin/env python
import os
import sys
import django

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jaelleshop.settings')
django.setup()

from products.models import Category
import cloudinary
import cloudinary.uploader
from cloudinary.utils import cloudinary_url

# Configuration Cloudinary
cloudinary.config(
    cloud_name="dmcaguchx",
    api_key="238869761337271", 
    api_secret="G1AQ85xIMHSFSLgPOXeNsGFnfJA",
    secure=True
)

def assign_category_images():
    """Assigne des images appropriées aux catégories depuis des URLs d'images de qualité"""
    
    # Images de qualité pour chaque catégorie
    category_images = {
        'enfants': 'https://images.unsplash.com/photo-1503919005314-30d93d07d823?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        'femmes': 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        'hommes': 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    }
    
    print("🎨 Assignation d'images aux catégories...")
    
    for category in Category.objects.all():
        category_slug = category.slug.lower()
        
        if category_slug in category_images:
            image_url = category_images[category_slug]
            
            try:
                print(f"📸 Upload image pour {category.name}...")
                
                # Upload l'image vers Cloudinary avec un nom approprié
                upload_result = cloudinary.uploader.upload(
                    image_url,
                    folder="evimeria/categories",
                    public_id=f"category_{category_slug}",
                    overwrite=True,
                    resource_type="image",
                    format="jpg",
                    quality="auto",
                    width=1200,
                    height=400,
                    crop="fill",
                    gravity="center"
                )
                
                # Assigner l'URL Cloudinary à la catégorie
                category.image = upload_result['secure_url']
                category.save()
                
                print(f"✅ Image assignée à {category.name}: {category.image}")
                
            except Exception as e:
                print(f"❌ Erreur lors de l'upload pour {category.name}: {str(e)}")
        else:
            print(f"⚠️  Aucune image définie pour la catégorie: {category.name}")
    
    print("\n📊 Résumé des catégories:")
    for category in Category.objects.all():
        print(f"- {category.name}: {'✅ Image assignée' if category.image else '❌ Pas d\'image'}")

if __name__ == '__main__':
    assign_category_images() 