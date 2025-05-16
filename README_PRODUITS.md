# Guide d'ajout de produits pour EVIMERIA

Ce guide explique comment ajouter de nouveaux produits au site EVIMERIA (anciennement JaelleShop) en utilisant les scripts fournis.

## Prérequis

- Python 3.8 ou supérieur
- Django
- Cloudinary configuré dans le projet

## Procédure d'ajout de produits

### 1. Préparation des images

1. Placez les images des produits dans le dossier `Mesproduits` à la racine du projet
2. Assurez-vous que les images sont nommées de manière descriptive car le nom du fichier sera utilisé comme nom du produit
   - Exemple: `robe_elegante_blanche.jpg` deviendra "Robe Elegante Blanche"
3. Utilisez uniquement des fichiers au format `.jpg`, `.jpeg` ou `.png`

### 2. Exécution du script d'importation

1. Ouvrez un terminal à la racine du projet
2. Exécutez la commande:

```bash
python upload_products.py
```

3. Sélectionnez la catégorie à laquelle vous souhaitez ajouter les produits en entrant le numéro correspondant
4. Le script téléchargera les images vers Cloudinary et créera les produits dans la base de données

### 3. Vérification et édition des produits

Après l'importation, connectez-vous à l'interface d'administration pour:
1. Vérifier que les produits ont été correctement ajoutés
2. Modifier les descriptions, prix et autres détails si nécessaire
3. Publier les produits (ils sont automatiquement marqués comme publiés lors de l'importation)

## Structure des catégories disponibles

Les catégories disponibles sont:
1. Hommes
2. Femmes
3. Chaussures
4. Montres
5. Casquettes
6. Baskets

## Remarques importantes

- Toutes les images sont stockées sur Cloudinary dans le dossier `jaelleshop/products/{nom_categorie}`
- Les produits sont créés avec un prix aléatoire entre 20€ et 100€, pensez à les ajuster
- Le stock est défini aléatoirement entre 5 et 20 unités
- Certains produits sont automatiquement marqués comme "mis en avant" (featured) de manière aléatoire

## Résolution des problèmes

- Si l'upload échoue, vérifiez la connexion internet et les paramètres Cloudinary
- Si un produit existe déjà avec le même nom, il sera ignoré
- En cas d'erreur lors de l'upload, le produit est automatiquement supprimé de la base de données 