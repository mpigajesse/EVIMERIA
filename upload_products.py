import os
import sys
import subprocess

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

def main():
    # Vérifier que le dossier Mesproduits existe
    products_dir = os.path.join(current_dir, 'Mesproduits')
    if not os.path.exists(products_dir):
        print(f"Erreur: Le dossier 'Mesproduits' n'existe pas dans {current_dir}")
        return
    
    # Demander la catégorie à l'utilisateur
    print("Veuillez choisir une catégorie pour les produits:")
    for i, category in enumerate(CATEGORIES):
        print(f"{i+1}. {category}")
    
    choice = input("Entrez le numéro de la catégorie (1-6): ")
    try:
        index = int(choice) - 1
        if index < 0 or index >= len(CATEGORIES):
            raise ValueError("Numéro de catégorie invalide")
        selected_category = CATEGORIES[index]
    except ValueError:
        print("Erreur: Veuillez entrer un numéro valide.")
        return
    
    # Construire la commande
    cmd = [
        sys.executable,
        'backend/manage.py',
        'upload_new_products',
        products_dir,
        '--category',
        selected_category
    ]
    
    # Exécuter la commande
    try:
        subprocess.run(cmd, check=True)
        print(f"Importation des produits terminée avec succès pour la catégorie '{selected_category}'!")
    except subprocess.CalledProcessError as e:
        print(f"Erreur lors de l'exécution de la commande: {e}")

if __name__ == "__main__":
    main() 