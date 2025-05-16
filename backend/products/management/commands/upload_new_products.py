import os
import sys
import random
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.utils.text import slugify
import cloudinary.uploader
from products.models import Category, Product, ProductImage

# Descriptions par type de produit
DESCRIPTIONS = {
    # Vêtements hommes
    "Chemise": "Chemise élégante pour homme. Coupe ajustée, parfaite pour toutes les occasions. Tissu de haute qualité, confortable et facile à entretenir.",
    "Costume": "Costume de qualité supérieure pour homme. Confection soignée avec des tissus premium. Idéal pour les occasions formelles.",
    "Ensemble": "Ensemble coordonné pour homme. Un look complet et élégant sans effort. Parfait pour les événements professionnels et cérémonies.",
    "Cravate": "Cravate en soie de qualité supérieure. Finitions impeccables et motifs élégants. Le complément parfait pour une tenue formelle.",
    "Jean": "Jean de qualité supérieure pour homme. Coupe moderne et confortable. Tissu durable et résistant pour un usage quotidien.",
    "Pantalon": "Pantalon élégant pour homme. Coupe impeccable et tissu de qualité. Parfait pour un style professionnel ou décontracté chic.",
    "Soutane": "Soutane traditionnelle de haute qualité. Confection soignée avec des matériaux durables. Idéale pour les cérémonies religieuses.",
    
    # Accessoires
    "Lunettes": "Lunettes tendance pour homme. Design contemporain et matériaux de qualité. Protection UV complète pour un style et un confort optimaux.",
    "Casquette": "Casquette stylée et confortable. Ajustable pour un confort parfait. Complétez votre look avec cet accessoire indispensable.",
    "Accessoire": "Accessoire de mode de qualité supérieure. Design contemporain et finitions soignées. Complétez votre style avec cette pièce tendance.",
    
    # Par défaut
    "default": "Produit de qualité supérieure sélectionné avec soin. Matériaux durables et design élégant. Une addition parfaite à votre garde-robe."
}

# Prix par type de produit
PRICE_RANGES = {
    "Chemise": (29.99, 59.99),
    "Costume": (149.99, 299.99),
    "Ensemble": (99.99, 199.99),
    "Cravate": (19.99, 39.99),
    "Jean": (49.99, 89.99),
    "Pantalon": (39.99, 79.99),
    "Soutane": (99.99, 149.99),
    "Lunettes": (29.99, 69.99),
    "Casquette": (19.99, 34.99),
    "Accessoire": (14.99, 49.99),
    "default": (29.99, 99.99)
}

class Command(BaseCommand):
    help = 'Upload de nouvelles images de produits depuis un dossier local vers Cloudinary et création des produits'

    def add_arguments(self, parser):
        parser.add_argument('folder_path', type=str, help='Chemin vers le dossier contenant les images')
        parser.add_argument('--category', type=str, help='Catégorie à laquelle ajouter les produits')

    def handle(self, *args, **options):
        folder_path = options['folder_path']
        category_name = options.get('category')

        if not os.path.exists(folder_path):
            self.stdout.write(self.style.ERROR(f'Le dossier {folder_path} n\'existe pas'))
            return

        # Vérifier si la catégorie existe
        if category_name:
            try:
                category = Category.objects.get(name=category_name)
                self.stdout.write(self.style.SUCCESS(f'Catégorie trouvée: {category.name}'))
            except Category.DoesNotExist:
                self.stdout.write(self.style.ERROR(f'La catégorie {category_name} n\'existe pas'))
                return
        else:
            # Afficher les catégories disponibles
            categories = Category.objects.all()
            self.stdout.write(self.style.WARNING('Aucune catégorie spécifiée. Catégories disponibles:'))
            for cat in categories:
                self.stdout.write(f'- {cat.name}')
            return

        # Liste des fichiers d'images dans le dossier
        image_files = [f for f in os.listdir(folder_path) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
        
        if not image_files:
            self.stdout.write(self.style.ERROR(f'Aucune image trouvée dans le dossier {folder_path}'))
            return

        self.stdout.write(self.style.SUCCESS(f'Trouvé {len(image_files)} images à traiter'))

        # Pour chaque image, créer un nouveau produit
        for i, image_file in enumerate(image_files):
            # Nom du produit basé sur le nom du fichier
            product_name = os.path.splitext(image_file)[0].replace('_', ' ').title()
            
            # Vérifier si le produit existe déjà
            slug = slugify(product_name)
            if Product.objects.filter(slug=slug).exists():
                self.stdout.write(self.style.WARNING(f'Le produit {product_name} existe déjà. Ignoré.'))
                continue
            
            # Chemin complet de l'image
            image_path = os.path.join(folder_path, image_file)
            
            # Déterminer le type de produit pour la description et le prix
            product_type = "default"
            for key in DESCRIPTIONS.keys():
                if key.lower() in product_name.lower():
                    product_type = key
                    break
            
            # Définir la description
            description = DESCRIPTIONS[product_type]
            
            # Définir le prix
            min_price, max_price = PRICE_RANGES[product_type]
            price = round(random.uniform(min_price, max_price), 2)
            
            # Créer le produit
            product = Product(
                category=category,
                name=product_name,
                slug=slug,
                description=description,
                price=Decimal(str(price)),
                stock=random.randint(5, 20),  # Stock aléatoire
                featured=random.choice([True, False]),
                is_published=True
            )
            product.save()
            
            try:
                # Upload de l'image vers Cloudinary
                upload_result = cloudinary.uploader.upload(
                    image_path,
                    folder=f'jaelleshop/products/{category.name.lower()}',
                    public_id=slug,
                    resource_type="image"
                )
                
                # Créer l'image du produit
                product_image = ProductImage(
                    product=product,
                    is_main=True  # Image principale
                )
                product_image.image = upload_result['url']
                product_image.save()
                
                self.stdout.write(self.style.SUCCESS(f'Produit {product_name} créé avec succès avec image'))
                self.stdout.write(self.style.SUCCESS(f'   - Prix: {price} €'))
                self.stdout.write(self.style.SUCCESS(f'   - Type: {product_type}'))
            except Exception as e:
                # Supprimer le produit si l'upload a échoué
                product.delete()
                self.stdout.write(self.style.ERROR(f'Erreur lors de l\'upload de l\'image pour {product_name}: {str(e)}'))
        
        self.stdout.write(self.style.SUCCESS('Importation terminée')) 