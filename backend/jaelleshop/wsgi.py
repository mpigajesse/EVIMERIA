"""
WSGI config for jaelleshop project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/wsgi/
"""

import os
import sys

# Définir explicitement le module de paramètres
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jaelleshop.settings')

# Ajouter le répertoire courant au chemin de recherche Python
path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if path not in sys.path:
    sys.path.append(path)

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
