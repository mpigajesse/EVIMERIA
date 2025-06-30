from django.core.management.base import BaseCommand
from django.utils.text import slugify
from products.models import Category, SubCategory

class Command(BaseCommand):
    help = 'Peuple la base de données avec les catégories et sous-catégories'

    def handle(self, *args, **options):
        # Données des catégories et sous-catégories
        categories_data = {
            'Hommes': {
                'description': 'Mode et accessoires pour hommes',
                'subcategories': [
                    ('Vêtements', 'T-shirts, pulls, chemises, vestes et pantalons'),
                    ('Chaussures', 'Sneakers, baskets, sandales et bottes'),
                    ('Montres', 'Montres analogiques et smartwatches'),
                    ('Casquettes/Sacs', 'Casquettes, sacs à dos et sacs de sport'),
                    ('Accessoires', 'Ceintures, colliers, gants et écharpes'),
                    ('Produits cosmétiques', 'Parfums, gels douche et déodorants')
                ]
            },
            'Femmes': {
                'description': 'Mode et accessoires pour femmes',
                'subcategories': [
                    ('Vêtements', 'T-shirts, pulls, chemises, robes et pantalons'),
                    ('Chaussures', 'Sneakers, baskets, sandales et bottes'),
                    ('Montres', 'Montres analogiques et smartwatches'),
                    ('Casquettes/Sacs', 'Casquettes, sacs à main et sacs à dos'),
                    ('Accessoires', 'Ceintures, colliers, gants et bijoux'),
                    ('Produits cosmétiques', 'Parfums, crèmes et produits de beauté')
                ]
            },
            'Enfants': {
                'description': 'Mode et accessoires pour enfants',
                'subcategories': [
                    ('Vêtements filles', 'Robes, jupes, t-shirts et vêtements pour filles'),
                    ('Vêtements garçons', 'T-shirts, pantalons et vêtements pour garçons'),
                    ('Chaussures', 'Sneakers, baskets, sandales et bottes pour enfants'),
                    ('Accessoires', 'Ceintures, écharpes et accessoires pour enfants')
                ]
            }
        }

        self.stdout.write('=== Création des catégories et sous-catégories ===\n')

        for category_name, category_info in categories_data.items():
            # Créer la catégorie principale
            category_slug = slugify(category_name)
            category, created = Category.objects.get_or_create(
                name=category_name,
                slug=category_slug,
                defaults={
                    'description': category_info['description'],
                    'is_published': True,
                    'meta_title': f'{category_name} - EVIMERIA',
                    'meta_description': f'Découvrez notre collection {category_name.lower()} sur EVIMERIA'
                }
            )
            
            if created:
                self.stdout.write(f'✓ Catégorie créée : {category_name}')
            else:
                self.stdout.write(f'→ La catégorie {category_name} existe déjà')

            # Créer les sous-catégories
            for subcategory_name, description in category_info['subcategories']:
                subcategory_slug = slugify(subcategory_name)
                subcategory, sub_created = SubCategory.objects.get_or_create(
                    category=category,
                    name=subcategory_name,
                    slug=subcategory_slug,
                    defaults={
                        'description': description,
                        'is_published': True,
                        'meta_title': f'{subcategory_name} {category_name} - EVIMERIA',
                        'meta_description': f'Collection {subcategory_name.lower()} pour {category_name.lower()}'
                    }
                )
                
                if sub_created:
                    self.stdout.write(f'  ✓ Sous-catégorie créée : {subcategory_name}')
                else:
                    self.stdout.write(f'  → Sous-catégorie mise à jour : {subcategory_name}')

            self.stdout.write('')

        # Afficher un résumé final
        total_categories = Category.objects.count()
        total_subcategories = SubCategory.objects.count()
        
        self.stdout.write('=== Résumé final ===')
        self.stdout.write(f'Total catégories : {total_categories}')
        self.stdout.write(f'Total sous-catégories : {total_subcategories}')
        self.stdout.write(f'✓ Configuration terminée avec succès !') 