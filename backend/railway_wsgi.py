"""
WSGI config for Railway deployment.
"""

import os

# Définir explicitement le module de paramètres
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jaelleshop.settings')

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application() 