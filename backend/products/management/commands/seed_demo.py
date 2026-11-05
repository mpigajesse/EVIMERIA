"""
Catalogue de démonstration pour la démo publique (Render + Neon).

Lancée à chaque démarrage (render.yaml) : elle ne remplit la base que si
elle est vide, pour ne jamais dupliquer le catalogue ni écraser des
modifications faites depuis l'admin. Les images sont des URL (picsum.photos) :
aucun identifiant Cloudinary n'est nécessaire.
"""
from django.core import management
from django.core.management.base import BaseCommand

from products.models import Product


class Command(BaseCommand):
    help = "Remplit le catalogue de démonstration si la base est vide."

    def handle(self, *args, **options):
        if Product.objects.exists():
            self.stdout.write(f"Catalogue déjà présent ({Product.objects.count()} produits) : rien à faire.")
            return
        management.call_command("seed_categories")
        management.call_command("populate_all_products")
        self.stdout.write(self.style.SUCCESS(f"Catalogue de démo créé : {Product.objects.count()} produits."))
