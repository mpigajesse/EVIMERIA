from django.core.management.base import BaseCommand
from django.utils.text import slugify
from products.models import Category, SubCategory, Product, ProductImage
import random
from decimal import Decimal

class Command(BaseCommand):
    help = 'Peuple la base de données avec des produits pour toutes les sous-catégories'

    def add_arguments(self, parser):
        parser.add_argument(
            '--number',
            type=int,
            default=3,
            help='Nombre de produits à créer par sous-catégorie'
        )

    def handle(self, *args, **options):
        count_per_subcategory = options['number']

        # Données de base pour la génération de produits
        product_data = {
            'Vêtements': {
                'types': ['T-shirt', 'Chemise', 'Pantalon', 'Veste', 'Pull', 'Sweat', 'Jean', 'Polo'],
                'marques': ['EVIMERIA', 'Nike', 'Adidas', 'Zara', 'H&M', 'Uniqlo', 'Tommy Hilfiger'],
                'matériaux': ['Coton', 'Lin', 'Laine', 'Polyester', 'Jean', 'Soie'],
                'couleurs': ['Noir', 'Blanc', 'Bleu', 'Rouge', 'Gris', 'Beige', 'Marine', 'Vert'],
                'prix_min': 19.99,
                'prix_max': 99.99
            },
            'Chaussures': {
                'types': ['Sneakers', 'Bottes', 'Mocassins', 'Sandales', 'Baskets', 'Escarpins', 'Derbies'],
                'marques': ['Nike', 'Adidas', 'Puma', 'New Balance', 'Converse', 'Vans', 'Reebok'],
                'matériaux': ['Cuir', 'Toile', 'Synthétique', 'Daim', 'Textile'],
                'couleurs': ['Noir', 'Blanc', 'Bleu', 'Gris', 'Marron', 'Rouge'],
                'prix_min': 49.99,
                'prix_max': 149.99
            },
            'Accessoires': {
                'types': ['Ceinture', 'Écharpe', 'Gants', 'Bracelet', 'Collier', 'Boucles d\'oreilles', 'Portefeuille'],
                'marques': ['EVIMERIA', 'Fossil', 'Calvin Klein', 'Tommy Hilfiger', 'Michael Kors'],
                'matériaux': ['Cuir', 'Tissu', 'Métal', 'Argent', 'Or'],
                'couleurs': ['Noir', 'Marron', 'Argent', 'Or', 'Bronze', 'Rouge'],
                'prix_min': 14.99,
                'prix_max': 79.99
            },
            'Montres': {
                'types': ['Montre analogique', 'Montre digitale', 'Smartwatch', 'Montre sport'],
                'marques': ['Casio', 'Fossil', 'Daniel Wellington', 'Apple', 'Samsung', 'Garmin'],
                'matériaux': ['Acier', 'Cuir', 'Silicone', 'Titane', 'Céramique'],
                'couleurs': ['Noir', 'Argent', 'Or', 'Rose Gold', 'Bleu'],
                'prix_min': 79.99,
                'prix_max': 399.99
            },
            'Casquettes/Sacs': {
                'types': ['Casquette', 'Sac à dos', 'Sac bandoulière', 'Sacoche', 'Sac de sport', 'Bob'],
                'marques': ['EVIMERIA', 'Nike', 'Adidas', 'Eastpak', 'Herschel', 'Puma'],
                'matériaux': ['Coton', 'Polyester', 'Cuir', 'Toile', 'Nylon'],
                'couleurs': ['Noir', 'Bleu', 'Gris', 'Kaki', 'Marine', 'Rouge'],
                'prix_min': 24.99,
                'prix_max': 89.99
            },
            'Produits cosmétiques': {
                'types': ['Parfum', 'Crème hydratante', 'Lotion', 'Gel douche', 'Déodorant', 'Shampoing'],
                'marques': ['L\'Oréal', 'Nivea', 'Dove', 'Axe', 'Old Spice', 'Chanel', 'Dior'],
                'contenances': ['50ml', '100ml', '200ml', '250ml', '500ml'],
                'prix_min': 9.99,
                'prix_max': 89.99
            }
        }

        # Données spécifiques pour les enfants
        enfants_data = {
            'Vêtements garçons': {
                'types': ['T-shirt', 'Pantalon', 'Short', 'Sweat', 'Pyjama', 'Polo', 'Bermuda'],
                'marques': ['EVIMERIA Kids', 'Nike Kids', 'Zara Kids', 'H&M Kids', 'Disney'],
                'matériaux': ['Coton', 'Jersey', 'Polyester', 'Velours'],
                'couleurs': ['Bleu', 'Rouge', 'Vert', 'Gris', 'Marine', 'Jaune'],
                'prix_min': 12.99,
                'prix_max': 39.99
            },
            'Vêtements filles': {
                'types': ['Robe', 'T-shirt', 'Jupe', 'Legging', 'Pyjama', 'Blouse', 'Short'],
                'marques': ['EVIMERIA Kids', 'Zara Kids', 'H&M Kids', 'Disney', 'Hello Kitty'],
                'matériaux': ['Coton', 'Jersey', 'Tulle', 'Polyester', 'Velours'],
                'couleurs': ['Rose', 'Violet', 'Blanc', 'Bleu ciel', 'Rouge', 'Jaune'],
                'prix_min': 12.99,
                'prix_max': 39.99
            },
            'Jouets': {
                'types': ['Peluche', 'Jeu de société', 'Puzzle', 'Poupée', 'Voiture', 'LEGO', 'Figurine'],
                'marques': ['LEGO', 'Playmobil', 'Fisher-Price', 'Mattel', 'Hasbro', 'Disney'],
                'age': ['0-2 ans', '2-4 ans', '4-6 ans', '6-8 ans', '8+ ans'],
                'prix_min': 9.99,
                'prix_max': 79.99
            }
        }

        self.stdout.write('=== Création des produits pour chaque sous-catégorie ===\n')

        # Parcourir toutes les sous-catégories
        subcategories = SubCategory.objects.select_related('category').all().order_by('category__name', 'name')
        total_products = 0

        for subcategory in subcategories:
            self.stdout.write(f'\nPeuplement de : {subcategory.category.name} > {subcategory.name}')
            
            # Choisir les données appropriées selon la sous-catégorie
            if subcategory.name in enfants_data:
                data = enfants_data[subcategory.name]
            elif subcategory.name in product_data:
                data = product_data[subcategory.name]
            else:
                # Utiliser les données de base si la sous-catégorie n'a pas de données spécifiques
                data = product_data['Accessoires']

            # Créer les produits pour cette sous-catégorie
            for i in range(count_per_subcategory):
                try:
                    # Générer les détails du produit
                    type_produit = random.choice(data['types'])
                    marque = random.choice(data['marques'])
                    prix = round(random.uniform(data['prix_min'], data['prix_max']), 2)
                    
                    # Générer le nom du produit
                    nom = f"{marque} {type_produit}"
                    if 'couleurs' in data:
                        couleur = random.choice(data['couleurs'])
                        nom = f"{marque} {type_produit} {couleur}"

                    # Générer le slug unique
                    base_slug = slugify(f"{subcategory.category.name}-{subcategory.name}-{nom}")
                    slug = base_slug
                    counter = 1
                    while Product.objects.filter(slug=slug).exists():
                        slug = f"{base_slug}-{counter}"
                        counter += 1

                    # Générer la description
                    description = f"""**{nom}**

**Caractéristiques :**
• Marque : {marque}
• Type : {type_produit}"""

                    if 'matériaux' in data:
                        materiau = random.choice(data['matériaux'])
                        description += f"\n• Matériau : {materiau}"
                    
                    if 'couleurs' in data:
                        description += f"\n• Couleur : {couleur}"

                    if 'contenances' in data:
                        contenance = random.choice(data['contenances'])
                        description += f"\n• Contenance : {contenance}"

                    if 'age' in data:
                        age = random.choice(data['age'])
                        description += f"\n• Âge recommandé : {age}"

                    description += f"""

**Prix : {prix}€**

Produit de qualité supérieure EVIMERIA.
Stock disponible - Livraison rapide."""

                    # Créer le produit
                    product = Product.objects.create(
                        category=subcategory.category,
                        subcategory=subcategory,
                        name=nom,
                        slug=slug,
                        description=description.strip(),
                        price=Decimal(str(prix)),
                        stock=random.randint(5, 50),
                        available=True,
                        is_published=True,
                        featured=random.random() < 0.15  # 15% de chance d'être mis en avant
                    )

                    # Ajouter des images placeholder avec des seeds différentes
                    num_images = random.randint(2, 4)
                    for j in range(1, num_images + 1):
                        ProductImage.objects.create(
                            product=product,
                            image=f"https://picsum.photos/seed/{slug}-{j}/800/600",
                            is_main=(j == 1)
                        )

                    total_products += 1
                    self.stdout.write(f"  ✓ {nom} - {prix}€")

                except Exception as e:
                    self.stdout.write(self.style.ERROR(f"  ✗ Erreur : {str(e)}"))

        # Afficher le résumé final
        self.stdout.write(self.style.SUCCESS(f'\n=== RÉSUMÉ FINAL ==='))
        self.stdout.write(f'✓ Total des produits créés : {total_products}')
        self.stdout.write(f'✓ Sous-catégories peuplées : {subcategories.count()}')
        
        # Statistiques par catégorie
        for category in Category.objects.all():
            count = Product.objects.filter(category=category).count()
            self.stdout.write(f'  - {category.name} : {count} produits')
        
        self.stdout.write(self.style.SUCCESS('\n🎉 Base de données peuplée avec succès !'))
