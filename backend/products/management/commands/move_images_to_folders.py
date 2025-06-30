import cloudinary
import cloudinary.api
import cloudinary.uploader
from django.core.management.base import BaseCommand
from products.models import ProductImage

class Command(BaseCommand):
    help = 'Moves images from evimeria/products to evimeria/categories subfolders based on their path.'

    def handle(self, *args, **options):
        self.stdout.write("🚀 Démarrage du script de déplacement d'images Cloudinary...")

        try:
            # Récupérer toutes les images du dossier 'products'
            search_expression = 'folder:evimeria/products'
            resources = cloudinary.Search().expression(search_expression).sort_by('public_id', 'desc').max_results(500).execute()
            
            total_images = len(resources['resources'])
            self.stdout.write(f"🔍 {total_images} images trouvées dans 'evimeria/products'.")

            if total_images == 0:
                self.stdout.write(self.style.SUCCESS("✅ Aucune image à déplacer. Le dossier 'products' est déjà vide."))
                return

            count = 0
            for resource in resources['resources']:
                old_id = resource['public_id']
                parts = old_id.split('/')

                # Le format attendu: evimeria/products/categorie/sous_categorie/nom_fichier
                if len(parts) < 5 or parts[1] != 'products':
                    self.stdout.write(self.style.WARNING(f"⏭️  Ignoré (format invalide): {old_id}"))
                    continue

                category = parts[2]
                subcategory = parts[3]
                filename = parts[4]
                
                new_id = f"evimeria/categories/{category}/{subcategory}/{filename}"

                self.stdout.write(f"➡️  Déplacement de '{filename}' vers '{category}/{subcategory}'...")

                try:
                    # 1. Déplacer dans Cloudinary
                    result = cloudinary.uploader.rename(old_id, new_id)
                    new_url = result['secure_url']

                    # 2. Mettre à jour la base de données
                    image_to_update = ProductImage.objects.filter(image__contains=filename).first()
                    if image_to_update:
                        image_to_update.image = new_url
                        image_to_update.save()
                        self.stdout.write(self.style.SUCCESS(f"✅ Image et DB mises à jour pour {filename}"))
                        count += 1
                    else:
                        self.stdout.write(self.style.WARNING(f"⚠️  Image non trouvée dans la DB pour {filename}, mais déplacée sur Cloudinary."))

                except Exception as e:
                    self.stdout.write(self.style.ERROR(f"❌ Erreur lors du déplacement de {filename}: {e}"))

            self.stdout.write(self.style.SUCCESS(f"\n🎉 Opération terminée ! {count}/{total_images} images ont été déplacées avec succès."))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Une erreur critique est survenue: {e}")) 