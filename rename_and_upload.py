import os
import sys
import subprocess
import shutil
from pathlib import Path

# Obtenir le chemin absolu du répertoire de travail actuel
current_dir = os.path.dirname(os.path.abspath(__file__))

# Définir les catégories disponibles
CATEGORIES = [
    'Hommes',
    'Femmes',
    'Chaussures',
    'Montres',
    'Casquettes',
    'Baskets',
]

# Mapping pour les types de produits hommes
PRODUITS_HOMMES = {
    "chemisse carreaule.jpg": "Chemise_Homme_Carreaux_Elegante.jpg",
    "soutanne.jpg": "Soutane_Homme_Ceremonie.jpg",
    "cravatte+chemie1.jpg": "Ensemble_Chemise_Cravate_Blanc_Classique.jpg",
    "cravatte+chemie2.jpg": "Ensemble_Chemise_Cravate_Noir_Elegante.jpg",
    "ensemble=chemise+cravatte+pantalon1.jpg": "Costume_Complet_Chemise_Cravate_Pantalon_Bleu.jpg",
    "ensemble=chemise+cravatte+pantalon2.jpg": "Costume_Complet_Chemise_Cravate_Pantalon_Noir.jpg",
    "ensemble1.jpg": "Ensemble_Costume_Homme_Bleu_Marine.jpg",
    "ensemble2.jpg": "Ensemble_Costume_Homme_Gris_Clair.jpg",
    "ensemble3.jpg": "Ensemble_Costume_Homme_Beige.jpg",
    "ensemble4.jpg": "Ensemble_Costume_Homme_Bleu_Royal.jpg",
    "ensemble5.jpg": "Ensemble_Costume_Homme_Noir_Classique.jpg",
    "ensemble6.jpg": "Ensemble_Costume_Homme_Gris_Fonce.jpg",
    "ensemble7.jpg": "Ensemble_Costume_Homme_Marron.jpg",
    "ensemble8.jpg": "Ensemble_Costume_Homme_Bleu_Ciel.jpg",
    "jeannblanc.jpg": "Jean_Homme_Blanc_Coupe_Droite.jpg",
    "IMG-20250516-WA0002.jpg": "Pantalon_Homme_Costume_Noir.jpg",
    "lunette_casquette.jpg": "Accessoire_Lunettes_Casquette_Homme.jpg",
    "accesoirlunnettte.jpg": "Lunettes_Homme_Style_Moderne.jpg",
    "cravatte.png": "Cravate_Homme_Soie_Bleu_Marine.jpg"
}

def main():
    # Vérifier que le dossier homes existe
    homes_dir = os.path.join(current_dir, 'Mesproduits', 'homes')
    if not os.path.exists(homes_dir):
        print(f"Erreur: Le dossier 'Mesproduits/homes' n'existe pas dans {current_dir}")
        return
    
    # Créer un dossier temporaire pour les fichiers renommés
    temp_dir = os.path.join(current_dir, 'temp_products')
    if os.path.exists(temp_dir):
        shutil.rmtree(temp_dir)
    os.makedirs(temp_dir)
    
    # Renommer et copier les fichiers
    renamed_files = 0
    print("Renommage des fichiers...")
    
    for old_name, new_name in PRODUITS_HOMMES.items():
        old_path = os.path.join(homes_dir, old_name)
        if os.path.exists(old_path):
            new_path = os.path.join(temp_dir, new_name)
            shutil.copy2(old_path, new_path)
            print(f"✓ {old_name} → {new_name}")
            renamed_files += 1
        else:
            print(f"✗ Fichier non trouvé: {old_name}")
    
    print(f"\n{renamed_files} fichiers ont été renommés et copiés dans le dossier temporaire.")
    
    # Demander la catégorie à l'utilisateur (par défaut: Hommes)
    print("\nVeuillez confirmer la catégorie pour les produits:")
    print("1. Hommes (recommandé pour ces produits)")
    for i, category in enumerate(CATEGORIES[1:], 2):
        print(f"{i}. {category}")
    
    choice = input("\nEntrez le numéro de la catégorie (1-6) [1]: ").strip() or "1"
    try:
        index = int(choice) - 1
        if index < 0 or index >= len(CATEGORIES):
            raise ValueError("Numéro de catégorie invalide")
        selected_category = CATEGORIES[index]
    except ValueError:
        print("Numéro invalide, utilisation de la catégorie 'Hommes' par défaut.")
        selected_category = CATEGORIES[0]  # Hommes
    
    # Construire la commande
    cmd = [
        sys.executable,
        'backend/manage.py',
        'upload_new_products',
        temp_dir,
        '--category',
        selected_category
    ]
    
    # Exécuter la commande
    try:
        subprocess.run(cmd, check=True)
        print(f"\nImportation des produits terminée avec succès pour la catégorie '{selected_category}'!")
    except subprocess.CalledProcessError as e:
        print(f"Erreur lors de l'exécution de la commande: {e}")
    
    # Nettoyage du dossier temporaire
    print("\nNettoyage du dossier temporaire...")
    shutil.rmtree(temp_dir)
    print("Terminé.")

if __name__ == "__main__":
    main() 