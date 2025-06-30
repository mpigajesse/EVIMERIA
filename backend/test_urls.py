#!/usr/bin/env python
import os
import sys
import django

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jaelleshop.settings')
django.setup()

# Tests d'importation
print("=== TEST D'IMPORTATION ===")
try:
    from products.api.views import SubCategoryByCategoryAPIView
    print("✅ Import SubCategoryByCategoryAPIView: OK")
except Exception as e:
    print(f"❌ Import SubCategoryByCategoryAPIView: {e}")

try:
    from products.api import urls as api_urls
    print("✅ Import products.api.urls: OK")
    print(f"Patterns: {[str(p.pattern) for p in api_urls.urlpatterns]}")
except Exception as e:
    print(f"❌ Import products.api.urls: {e}")

# Test de résolution d'URL
print("\n=== TEST DE RÉSOLUTION D'URL ===")
try:
    from django.urls import reverse
    url = reverse('api-subcategory-by-category')
    print(f"✅ Reverse api-subcategory-by-category: {url}")
except Exception as e:
    print(f"❌ Reverse api-subcategory-by-category: {e}")

# Test des URL patterns principaux
print("\n=== TEST DES URL PATTERNS PRINCIPAUX ===")
try:
    from django.urls import get_resolver
    resolver = get_resolver()
    print("Patterns API disponibles:")
    for pattern in resolver.url_patterns:
        if hasattr(pattern, 'pattern') and 'api' in str(pattern.pattern):
            print(f"  - {pattern.pattern}")
            if hasattr(pattern, 'url_patterns'):
                print(f"    Sous-patterns: {[str(sub.pattern) for sub in pattern.url_patterns[:5]]}")
except Exception as e:
    print(f"❌ Get resolver: {e}")

# Test avec le client Django
print("\n=== TEST AVEC CLIENT DJANGO ===")
try:
    from django.test import Client
    client = Client()
    
    # Test des catégories (qui fonctionne)
    response = client.get('/api/categories/')
    print(f"✅ GET /api/categories/: {response.status_code}")
    
    # Test des sous-catégories
    response = client.get('/api/subcategories/')
    print(f"{'✅' if response.status_code == 200 else '❌'} GET /api/subcategories/: {response.status_code}")
    
    response = client.get('/api/subcategories/by_category/?category=hommes')
    print(f"{'✅' if response.status_code == 200 else '❌'} GET /api/subcategories/by_category/: {response.status_code}")
    
except Exception as e:
    print(f"❌ Test client: {e}")

print("\n=== DIAGNOSTIC TERMINÉ ===") 