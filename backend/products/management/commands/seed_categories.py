from django.core.management.base import BaseCommand
from django.utils.text import slugify
from products.models import Category, SubCategory

class Command(BaseCommand):
    help = 'Crée les catégories principales et leurs sous-catégories pour EVIMERIA (structure propre et cohérente)'

    def handle(self, *args, **options):
        categories_data = {
            'Hommes': {
                'description': 'Mode et accessoires pour hommes',
                'subcategories': [
                    'Vêtements',
                    'Chaussures',
                    'Accessoires',
                    'Montres',
                    'Casquettes/Sacs',
                    'Produits cosmétiques'
                ]
            },
            'Femmes': {
                'description': 'Mode et accessoires pour femmes',
                'subcategories': [
                    'Vêtements',
                    'Chaussures',
                    'Accessoires',
                    'Montres',
                    'Casquettes/Sacs',
                    'Produits cosmétiques'
                ]
            },
            'Enfants': {
                'description': 'Mode et accessoires pour enfants',
                'subcategories': [
                    'Vêtements garçons',
                    'Vêtements filles',
                    'Chaussures',
                    'Accessoires',
                    'Jouets'
                ]
            }
        }

        self.stdout.write('=== Création des catégories et sous-catégories EVIMERIA ===\n')

        for category_name, category_info in categories_data.items():
            category_slug = slugify(category_name)
            category, created = Category.objects.get_or_create(
                name=category_name,
                slug=category_slug,
                defaults={
                    'description': category_info['description'],
                    'is_published': True
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'✓ Catégorie créée : {category_name}'))
            else:
                self.stdout.write(self.style.WARNING(f'→ La catégorie {category_name} existe déjà'))

            subcategories_created = 0
            subcategories_existing = 0
            for subcategory_name in category_info['subcategories']:
                subcategory_slug = slugify(subcategory_name)
                subcategory, sub_created = SubCategory.objects.get_or_create(
                    category=category,
                    name=subcategory_name,
                    slug=subcategory_slug,
                    defaults={
                        'description': f'{subcategory_name} pour {category_name.lower()}',
                        'is_published': True
                    }
                )
                if sub_created:
                    subcategories_created += 1
                    self.stdout.write(f'  ✓ Sous-catégorie créée : {subcategory_name}')
                else:
                    self.stdout.write(f'  → Sous-catégorie existante : {subcategory_name}')
            self.stdout.write(f'  Résumé pour {category_name}: {subcategories_created} créées, {len(category_info["subcategories"])-subcategories_created} existantes\n')

        total_categories = Category.objects.count()
        total_subcategories = SubCategory.objects.count()
        self.stdout.write(self.style.SUCCESS(f'\n=== Résumé final ==='))
        self.stdout.write(f'Total catégories : {total_categories}')
        self.stdout.write(f'Total sous-catégories : {total_subcategories}')
        self.stdout.write(self.style.SUCCESS(f'\n✓ Configuration terminée avec succès !')) 