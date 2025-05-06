from django.core.management.base import BaseCommand
from products.api.product_seeder import run_seeder

class Command(BaseCommand):
    help = 'Peuple la base de données avec des produits de démonstration'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS('Début du seeding des produits...'))
        try:
            run_seeder()
            self.stdout.write(self.style.SUCCESS('Opération réussie! La base de données a été peuplée avec des produits de démonstration.'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Une erreur est survenue: {str(e)}')) 