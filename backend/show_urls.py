#!/usr/bin/env python
"""
Script simple pour afficher les URLs disponibles dans l'application Django.
"""
import os
import django

# Configurer Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jaelleshop.settings')
django.setup()

from django.urls import get_resolver

def get_urls():
    """Récupère et affiche les URLs disponibles dans l'application."""
    url_list = []
    
    def traverse_urls(resolver, prefix=''):
        for pattern in resolver.url_patterns:
            if hasattr(pattern, 'url_patterns'):
                traverse_urls(pattern, prefix + str(pattern.pattern))
            else:
                url = prefix + str(pattern.pattern)
                url = url.replace('^', '').replace('$', '')
                if hasattr(pattern, 'name') and pattern.name:
                    url_list.append((url, pattern.name))
                else:
                    url_list.append((url, ''))
    
    traverse_urls(get_resolver())
    return url_list

if __name__ == '__main__':
    print("\n=== URLs disponibles dans l'application ===")
    for url, name in get_urls():
        if name:
            print(f"/{url} \t\t(nom: {name})")
        else:
            print(f"/{url}")
    print("\n=== Points d'entrée importants ===")
    print("/admin/          \t\t(Administration Django)")
    print("/health/         \t\t(Vérification de santé)")
    print("/test/           \t\t(Test simple)")
    print("/railway/        \t\t(Test Railway)")
    print("/db-tables/      \t\t(Liste des tables)")
    print("</api/          \t\t(API racine)")
    print("\n") 