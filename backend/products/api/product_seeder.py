import os
import random
import requests
import io
from decimal import Decimal
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.utils.text import slugify
from products.models import Category, Product, ProductImage

# Catégories de produits
CATEGORIES = [
    {
        'name': 'Hommes',
        'description': 'Vêtements et accessoires pour hommes',
        'image_url': 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fG1lbnMlMjBmYXNoaW9ufGVufDB8fDB8fHww'
    },
    {
        'name': 'Femmes',
        'description': 'Vêtements et accessoires pour femmes',
        'image_url': 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8d29tZW5zJTIwZmFzaGlvbnxlbnwwfHwwfHx8MA%3D%3D'
    },
    {
        'name': 'Chaussures',
        'description': 'Chaussures pour hommes et femmes',
        'image_url': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2hvZXN8ZW58MHx8MHx8fDA%3D'
    },
    {
        'name': 'Montres',
        'description': 'Montres élégantes pour tous les styles',
        'image_url': 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHdhdGNoZXN8ZW58MHx8MHx8fDA%3D'
    },
    {
        'name': 'Casquettes',
        'description': 'Casquettes et chapeaux tendance',
        'image_url': 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2Fwc3xlbnwwfHwwfHx8MA%3D'
    },
    {
        'name': 'Baskets',
        'description': 'Baskets pour le sport et la mode',
        'image_url': 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHNuZWFrZXJzfGVufDB8fDB8fHww'
    }
]

# Produits par catégorie
PRODUCTS = {
    'Hommes': [
        {
            'name': 'Chemise en lin bleu',
            'description': 'Chemise décontractée en lin pour homme, idéale pour l\'été. Tissu respirant et confortable.',
            'price': '49.99',
            'stock': 20,
            'images': [
                'https://images.unsplash.com/photo-1520367745676-56196632073f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWVucyUyMHNoaXJ0fGVufDB8fDB8fHww',
                'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bWVucyUyMHNoaXJ0fGVufDB8fDB8fHww'
            ]
        },
        {
            'name': 'Pantalon chino beige',
            'description': 'Pantalon chino beige pour homme. Coupe ajustée et confortable pour tous les jours.',
            'price': '59.99',
            'stock': 15,
            'images': [
                'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWVucyUyMHBhbnRzfGVufDB8fDB8fHww',
                'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bWVucyUyMHBhbnRzfGVufDB8fDB8fHww'
            ]
        },
        {
            'name': 'Veste en cuir noir',
            'description': 'Veste en cuir véritable pour homme. Style classique et intemporel.',
            'price': '199.99',
            'stock': 8,
            'images': [
                'https://images.unsplash.com/photo-1559551409-dadc959f76b8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGVhdGhlciUyMGphY2tldHxlbnwwfHwwfHx8MA%3D%3D',
                'https://images.unsplash.com/photo-1585757201892-300bc36ac213?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bGVhdGhlciUyMGphY2tldHxlbnwwfHwwfHx8MA%3D%3D'
            ]
        }
    ],
    'Femmes': [
        {
            'name': 'Robe d\'été fleurie',
            'description': 'Robe légère à motifs floraux pour l\'été. Tissu fluide et confortable.',
            'price': '69.99',
            'stock': 25,
            'images': [
                'https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZmxvcmFsJTIwZHJlc3N8ZW58MHx8MHx8fDA%3D',
                'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZmxvcmFsJTIwZHJlc3N8ZW58MHx8MHx8fDA%3D'
            ]
        },
        {
            'name': 'Jupe midi plissée',
            'description': 'Jupe midi plissée élégante. Parfaite pour toutes les occasions.',
            'price': '49.99',
            'stock': 15,
            'images': [
                'https://images.unsplash.com/photo-1577900232427-18219b9166a0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2tpcnR8ZW58MHx8MHx8fDA%3D',
                'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c2tpcnR8ZW58MHx8MHx8fDA%3D'
            ]
        },
        {
            'name': 'Blouse en soie blanche',
            'description': 'Blouse élégante en soie. Coupe fluide et raffinée pour un style chic.',
            'price': '89.99',
            'stock': 10,
            'images': [
                'https://images.unsplash.com/photo-1551163943-3f7418ae00e7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2hpdGUlMjBibG91c2V8ZW58MHx8MHx8fDA%3D',
                'https://images.unsplash.com/photo-1588190464153-0ccd533f0d5c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8d2hpdGUlMjBibG91c2V8ZW58MHx8MHx8fDA%3D'
            ]
        }
    ],
    'Chaussures': [
        {
            'name': 'Derbies en cuir marron',
            'description': 'Chaussures élégantes en cuir pour homme. Parfaites pour les occasions formelles.',
            'price': '119.99',
            'stock': 12,
            'images': [
                'https://images.unsplash.com/photo-1614252235316-8c857f443c01?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGVhdGhlciUyMHNob2VzfGVufDB8fDB8fHww',
                'https://images.unsplash.com/photo-1531310197839-ccf54634509e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bGVhdGhlciUyMHNob2VzfGVufDB8fDB8fHww'
            ]
        },
        {
            'name': 'Escarpins noirs',
            'description': 'Escarpins noirs élégants avec talon de 7 cm. Parfaits pour toutes les occasions.',
            'price': '99.99',
            'stock': 18,
            'images': [
                'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aGlnaCUyMGhlZWxzfGVufDB8fDB8fHww',
                'https://images.unsplash.com/photo-1525715843408-5c6ec44503b1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8aGlnaCUyMGhlZWxzfGVufDB8fDB8fHww'
            ]
        }
    ],
    'Montres': [
        {
            'name': 'Montre automatique classique',
            'description': 'Montre automatique avec bracelet en cuir. Design intemporel et élégant.',
            'price': '299.99',
            'stock': 7,
            'images': [
                'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bHV4dXJ5JTIwd2F0Y2h8ZW58MHx8MHx8fDA%3D',
                'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bHV4dXJ5JTIwd2F0Y2h8ZW58MHx8MHx8fDA%3D'
            ]
        },
        {
            'name': 'Montre connectée sport',
            'description': 'Montre connectée avec fonctions de suivi d\'activité et notifications.',
            'price': '149.99',
            'stock': 15,
            'images': [
                'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c21hcnQlMjB3YXRjaHxlbnwwfHwwfHx8MA%3D%3D',
                'https://images.unsplash.com/photo-1617043786394-f977fa12eddf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c21hcnQlMjB3YXRjaHxlbnwwfHwwfHx8MA%3D%3D'
            ]
        }
    ],
    'Casquettes': [
        {
            'name': 'Casquette baseball noire',
            'description': 'Casquette baseball classique en coton. Ajustable et confortable pour tous les jours.',
            'price': '29.99',
            'stock': 30,
            'images': [
                'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmFzZWJhbGwlMjBjYXB8ZW58MHx8MHx8fDA%3D',
                'https://images.unsplash.com/photo-1622445275576-721325763afe?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YmFzZWJhbGwlMjBjYXB8ZW58MHx8MHx8fDA%3D'
            ]
        },
        {
            'name': 'Bob réversible',
            'description': 'Bob tendance réversible. Double style pour plus de polyvalence.',
            'price': '24.99',
            'stock': 20,
            'images': [
                'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnVja2V0JTIwaGF0fGVufDB8fDB8fHww',
                'https://images.unsplash.com/photo-1534215754734-18e55d13e346?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YnVja2V0JTIwaGF0fGVufDB8fDB8fHww'
            ]
        }
    ],
    'Baskets': [
        {
            'name': 'Baskets urbaines blanches',
            'description': 'Baskets tendance pour un style urbain. Confortables et polyvalentes.',
            'price': '89.99',
            'stock': 25,
            'images': [
                'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8d2hpdGUlMjBzbmVha2Vyc3xlbnwwfHwwfHx8MA%3D%3D',
                'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8d2hpdGUlMjBzbmVha2Vyc3xlbnwwfHwwfHx8MA%3D%3D'
            ]
        },
        {
            'name': 'Baskets running performance',
            'description': 'Baskets techniques pour la course. Amorti et maintien optimaux pour vos performances.',
            'price': '129.99',
            'stock': 18,
            'images': [
                'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2hvZXN8ZW58MHx8MHx8fDA%3D',
                'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8c2hvZXN8ZW58MHx8MHx8fDA%3D'
            ]
        }
    ]
}

def download_image(url):
    """Télécharge une image depuis une URL"""
    response = requests.get(url)
    if response.status_code == 200:
        file_name = os.path.basename(url.split('?')[0])
        if not file_name.endswith(('.jpg', '.jpeg', '.png')):
            file_name += '.jpg'
        
        return InMemoryUploadedFile(
            io.BytesIO(response.content),
            None,  # field_name
            file_name,  # file_name
            'image/jpeg',  # content_type
            len(response.content),  # size
            None  # charset
        )
    return None

def seed_categories():
    """Crée les catégories de produits"""
    print("Création des catégories...")
    created_categories = []
    
    for category_data in CATEGORIES:
        # Vérifie si la catégorie existe déjà
        if not Category.objects.filter(name=category_data['name']).exists():
            # Télécharge l'image de la catégorie
            image_file = download_image(category_data['image_url'])
            
            # Crée la catégorie avec l'image
            category = Category(
                name=category_data['name'],
                description=category_data['description']
            )
            
            if image_file:
                category.image = image_file
            
            category.save()
            created_categories.append(category)
            print(f"Catégorie '{category.name}' créée avec succès.")
        else:
            category = Category.objects.get(name=category_data['name'])
            created_categories.append(category)
            print(f"Catégorie '{category.name}' existe déjà.")
    
    return created_categories

def seed_products(categories):
    """Crée les produits pour chaque catégorie"""
    print("\nCréation des produits...")
    
    for category in categories:
        category_products = PRODUCTS.get(category.name, [])
        if not category_products:
            print(f"Aucun produit défini pour la catégorie '{category.name}'.")
            continue
        
        for product_data in category_products:
            # Vérifie si le produit existe déjà
            slug = slugify(product_data['name'])
            if not Product.objects.filter(slug=slug).exists():
                # Crée le produit
                product = Product(
                    category=category,
                    name=product_data['name'],
                    slug=slug,
                    description=product_data['description'],
                    price=Decimal(product_data['price']),
                    stock=product_data['stock'],
                    featured=random.choice([True, False])
                )
                product.save()
                
                # Ajoute les images au produit
                for i, image_url in enumerate(product_data['images']):
                    image_file = download_image(image_url)
                    if image_file:
                        product_image = ProductImage(
                            product=product,
                            is_main=(i == 0)  # première image définie comme principale
                        )
                        product_image.image = image_file
                        product_image.save()
                
                print(f"Produit '{product.name}' créé avec succès.")
            else:
                print(f"Produit '{product_data['name']}' existe déjà.")

def run_seeder():
    """Exécute le script de seeding complet"""
    print("Début du seeding de la base de données...")
    
    # Crée les catégories
    categories = seed_categories()
    
    # Crée les produits
    seed_products(categories)
    
    print("\nSeeding terminé avec succès!")

if __name__ == "__main__":
    run_seeder() 