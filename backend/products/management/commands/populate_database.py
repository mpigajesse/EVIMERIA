from django.core.management.base import BaseCommand
from django.utils.text import slugify
from products.models import Category, SubCategory

class Command(BaseCommand):
    help = 'Populates the database with initial categories and subcategories.'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS('=== Starting database population ==='))
        self.create_categories_and_subcategories()
        self.stdout.write(self.style.SUCCESS('=== Database population finished successfully! ==='))

    def create_categories_and_subcategories(self):
        """
        Creates categories and subcategories from a predefined structure.
        This method is idempotent, using get_or_create to avoid duplicates.
        """
        categories_data = {
            'Hommes': {
                'description': 'Mode et accessoires pour hommes',
                'subcategories': [
                    ('Vêtements', 'T-shirts, pulls, chemises, vestes et pantalons'),
                    ('Chaussures', 'Sneakers, baskets, sandales et bottes'),
                    ('Accessoires', 'Ceintures, colliers, gants et écharpes'),
                    ('Montres', 'Montres analogiques et smartwatches'),
                    ('Casquettes & Sacs', 'Casquettes, sacs à dos et sacs de sport'),
                    ('Produits cosmétiques', 'Parfums, gels douche et déodorants')
                ]
            },
            'Femmes': {
                'description': 'Mode et accessoires pour femmes',
                'subcategories': [
                    ('Vêtements', 'T-shirts, pulls, chemises, robes et pantalons'),
                    ('Chaussures', 'Sneakers, baskets, sandales et bottes'),
                    ('Accessoires', 'Ceintures, colliers, gants et bijoux'),
                    ('Montres', 'Montres analogiques et smartwatches'),
                    ('Sacs', 'Casquettes, sacs à main et sacs à dos'),
                    ('Produits cosmétiques', 'Parfums, crèmes et produits de beauté')
                ]
            },
            'Enfants': {
                'description': 'Mode et accessoires pour enfants',
                'subcategories': [
                    ('Vêtements garçons', 'T-shirts, pantalons et vêtements pour garçons'),
                    ('Vêtements filles', 'Robes, jupes, t-shirts et vêtements pour filles'),
                    ('Chaussures', 'Sneakers, baskets, sandales et bottes pour enfants'),
                    ('Accessoires', 'Ceintures, écharpes et accessoires pour enfants'),
                ]
            }
        }

        self.stdout.write(self.style.HTTP_INFO('\nCreating categories and subcategories...'))

        for category_name, category_info in categories_data.items():
            category_slug = slugify(category_name)
            category, created = Category.objects.get_or_create(
                name=category_name,
                defaults={
                    'slug': category_slug,
                    'description': category_info['description'],
                    'is_published': True,
                    'meta_title': f'{category_name} - EVIMERIA',
                    'meta_description': f'Découvrez notre collection {category_name.lower()} sur EVIMERIA'
                }
            )
            
            if created:
                self.stdout.write(self.style.SUCCESS(f'✓ Category created: {category_name}'))
            else:
                self.stdout.write(f'→ Category "{category_name}" already exists.')

            subcategories_created_count = 0
            for subcategory_name, sub_description in category_info['subcategories']:
                subcategory_slug = slugify(subcategory_name)
                _, sub_created = SubCategory.objects.get_or_create(
                    category=category,
                    name=subcategory_name,
                    defaults={
                        'slug': subcategory_slug,
                        'description': sub_description,
                        'is_published': True,
                        'meta_title': f'{subcategory_name} {category_name} - EVIMERIA',
                        'meta_description': f'Collection {subcategory_name.lower()} pour {category_name.lower()}'
                    }
                )
                if sub_created:
                    subcategories_created_count += 1
            
            if subcategories_created_count > 0:
                self.stdout.write(self.style.SUCCESS(f'  ✓ Created {subcategories_created_count} new subcategories for {category_name}.\n'))
            else:
                self.stdout.write(f'  → All subcategories for "{category_name}" already exist.\n')

        total_categories = Category.objects.count()
        total_subcategories = SubCategory.objects.count()
        
        self.stdout.write(self.style.HTTP_INFO('=== Final Summary ==='))
        self.stdout.write(f'Total categories: {total_categories}')
        self.stdout.write(f'Total subcategories: {total_subcategories}') 