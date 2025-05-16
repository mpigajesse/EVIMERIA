#!/usr/bin/env python
# -*- coding: utf-8 -*-

print("== Vérification de santé simple ==")

try:
    import os
    import sys
    import django
    print("1. Modules Python importés avec succès")
    
    # Définir les variables d'environnement
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jaelleshop.settings')
    print("2. Module de paramètres Django défini")
    
    # Initialiser Django
    django.setup()
    print("3. Django initialisé avec succès")
    
    # Vérifier la connexion à la base de données
    from django.db import connections
    connection = connections['default']
    cursor = connection.cursor()
    cursor.execute("SELECT 1")
    result = cursor.fetchone()
    assert result[0] == 1
    print("4. Connexion à la base de données réussie")
    
    # Vérifier l'authentification
    from django.contrib.auth import get_user_model
    User = get_user_model()
    user_count = User.objects.count()
    print(f"5. Accès aux utilisateurs OK, {user_count} utilisateurs trouvés")
    
    print("Vérification de santé réussie!")
    sys.exit(0)
except Exception as e:
    print(f"ERREUR: {e}")
    sys.exit(1) 