from django.core.management.base import BaseCommand
import cloudinary.api
import cloudinary
from products.models import Category, Product, ProductImage

class Command(BaseCommand):
    help = 'Synchronise les images Cloudinary existantes avec les produits'

    def handle(self, *args, **options):
        self.stdout.write("=== Synchronisation des images Cloudinary ===\n")
        
        # Afficher la structure actuelle
        self.list_cloudinary_structure()
        
        # Synchroniser les images
        self.sync_images_to_products()
        
        # Vérifier le résultat
        self.stdout.write("\n=== Vérification finale ===")
        total_products = Product.objects.filter(is_published=True).count()
        products_with_images = Product.objects.filter(is_published=True, images__isnull=False).distinct().count()
        
        self.stdout.write(f"Produits publiés: {total_products}")
        self.stdout.write(f"Produits avec images: {products_with_images}")
        if total_products > 0:
            percentage = (products_with_images/total_products*100)
            self.stdout.write(f"Pourcentage: {percentage:.1f}%")

    def get_cloudinary_images_by_folder(self):
        """Récupère toutes les images de Cloudinary organisées par dossier"""
        try:
            self.stdout.write("Récupération des images depuis Cloudinary...")
            
            # Récupérer toutes les images du dossier jaelleshop/products
            images_by_folder = {}
            
            # Lister tous les dossiers de catégories
            folders = cloudinary.api.subfolders('jaelleshop/products')
            
            for folder_info in folders['folders']:
                folder_name = folder_info['name']
                folder_path = f"jaelleshop/products/{folder_name}"
                
                self.stdout.write(f"Traitement du dossier: {folder_path}")
                
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
                    
                    self.stdout.write(f"  - {len(images_by_folder[folder_name])} images trouvées")
                    
                except Exception as e:
                    self.stdout.write(f"  - Erreur lors du traitement du dossier {folder_path}: {e}")
                    images_by_folder[folder_name] = []
            
            return images_by_folder
            
        except Exception as e:
            self.stdout.write(f"Erreur lors de la récupération des images Cloudinary: {e}")
            return {}

    def sync_images_to_products(self):
        """Synchronise les images Cloudinary avec les produits"""
        self.stdout.write("\n=== Synchronisation des images Cloudinary avec les produits ===")
        
        # Récupérer les images de Cloudinary
        cloudinary_images = self.get_cloudinary_images_by_folder()
        
        if not cloudinary_images:
            self.stdout.write("Aucune image trouvée dans Cloudinary")
            return
        
        # Traiter chaque catégorie
        for category_folder, images in cloudinary_images.items():
            self.stdout.write(f"\n--- Traitement de la catégorie: {category_folder} ---")
            
            # Trouver la catégorie correspondante
            try:
                category = Category.objects.get(name__iexact=category_folder)
            except Category.DoesNotExist:
                self.stdout.write(f"Catégorie '{category_folder}' non trouvée en base de données")
                continue
            
            # Récupérer les produits de cette catégorie
            products = Product.objects.filter(category=category, is_published=True)
            
            if not products.exists():
                self.stdout.write(f"Aucun produit trouvé pour la catégorie {category_folder}")
                continue
            
            self.stdout.write(f"Produits trouvés: {products.count()}")
            self.stdout.write(f"Images disponibles: {len(images)}")
            
            # Assigner les images aux produits
            for i, product in enumerate(products):
                if i >= len(images):
                    self.stdout.write(f"Plus d'images disponibles pour le produit: {product.name}")
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
                
                self.stdout.write(f"✓ Image assignée au produit: {product.name}")
                self.stdout.write(f"  URL: {image_data['secure_url']}")
        
        self.stdout.write("\n=== Synchronisation terminée ===")

    def list_cloudinary_structure(self):
        """Affiche la structure des dossiers Cloudinary"""
        self.stdout.write("\n=== Structure des dossiers Cloudinary ===")
        
        try:
            # Lister le dossier racine jaelleshop
            folders = cloudinary.api.subfolders('jaelleshop')
            self.stdout.write("Dossier racine: jaelleshop/")
            
            for folder in folders['folders']:
                self.stdout.write(f"  └── {folder['name']}/")
                
                # Lister les sous-dossiers
                try:
                    subfolders = cloudinary.api.subfolders(f"jaelleshop/{folder['name']}")
                    for subfolder in subfolders['folders']:
                        self.stdout.write(f"      └── {subfolder['name']}/")
                        
                        # Compter les images dans ce sous-dossier
                        try:
                            result = cloudinary.api.resources(
                                type="upload",
                                prefix=f"jaelleshop/{folder['name']}/{subfolder['name']}",
                                max_results=1
                            )
                            total_count = result['total_count']
                            self.stdout.write(f"          ({total_count} images)")
                        except:
                            self.stdout.write("          (erreur de comptage)")
                            
                except:
                    # Pas de sous-dossiers, compter les images directement
                    try:
                        result = cloudinary.api.resources(
                            type="upload",
                            prefix=f"jaelleshop/{folder['name']}",
                            max_results=1
                        )
                        total_count = result['total_count']
                        self.stdout.write(f"      ({total_count} images)")
                    except:
                        self.stdout.write("      (erreur de comptage)")
                        
        except Exception as e:
            self.stdout.write(f"Erreur lors de l'exploration: {e}") 