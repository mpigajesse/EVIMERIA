"""
URL configuration for jaelleshop project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.http import HttpResponse, JsonResponse
from django.shortcuts import redirect
import os
import logging
import socket
import sys
import json

logger = logging.getLogger(__name__)

# Une vue simple pour l'API
def api_root_view(request):
    logger.info("API root view accessed")
    return JsonResponse({
        "message": "API JaelleShop - Bienvenue",
        "status": "running",
        "endpoints": {
            "admin": "/admin/",
            "api": "/api/", 
            "produits": "/api/products/",
            "produits_featured": "/api/products/featured/",
            "categories": "/api/categories/"
        }
    })

def health_check(request):
    logger.info("Health check endpoint accessed")
    # Récupération des informations système pour debug
    hostname = socket.gethostname()
    ip = socket.gethostbyname(hostname)
    allowed_hosts = settings.ALLOWED_HOSTS
    django_settings_module = os.environ.get('DJANGO_SETTINGS_MODULE', 'unknown')
    
    # Informations sur les versions
    python_version = sys.version
    
    # Logging détaillé
    logger.info(f"Health check from {request.META.get('REMOTE_ADDR')} - Hostname: {hostname}, IP: {ip}")
    logger.info(f"ALLOWED_HOSTS: {allowed_hosts}")
    
    # Retourner une réponse JSON plus détaillée pour le débogage
    response = JsonResponse({
        "status": "OK",
        "message": "Service is healthy",
        "environment": os.environ.get('RAILWAY_DEPLOYMENT', 'False'),
        "host_info": {
            "hostname": hostname,
            "ip": ip,
            "allowed_hosts": allowed_hosts,
            "django_settings": django_settings_module,
            "python_version": python_version,
        },
    })
    response["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response["Pragma"] = "no-cache"
    response["Expires"] = "0"
    return response

def railway_check(request):
    """Point de terminaison spécifique pour Railway"""
    logger.info("Railway check endpoint accessed")
    return HttpResponse("Railway check OK", content_type="text/plain")

def db_check(request):
    """Point de terminaison pour vérifier la connexion à la base de données"""
    logger.info("Database check endpoint accessed")
    
    from django.db import connections
    from django.db.utils import OperationalError
    
    db_conn = connections['default']
    databases = settings.DATABASES
    db_info = {k: v.copy() for k, v in databases.items()}
    
    # Masquer les mots de passe pour la sécurité
    for db in db_info.values():
        if 'PASSWORD' in db:
            db['PASSWORD'] = '******'
        if 'USER' in db:
            db['USER'] = db['USER']  # Gardez l'utilisateur visible pour le diagnostic
    
    results = {
        "db_config": db_info,
        "engine": db_info['default'].get('ENGINE', 'unknown'),
        "connection": "unknown",
        "models": [],
        "tables": [],
        "environment": {
            "DATABASE_URL": os.environ.get('DATABASE_URL', '').split('@')[0] + '@******' if os.environ.get('DATABASE_URL') else None,
            "PGDATABASE": os.environ.get('PGDATABASE'),
            "PGHOST": os.environ.get('PGHOST'),
            "PGPORT": os.environ.get('PGPORT'),
            "PGUSER": os.environ.get('PGUSER'),
        }
    }
    
    # Vérifier la connexion
    try:
        db_conn.cursor()
        results["connection"] = "OK"
        
        # Récupérer les modèles
        from django.apps import apps
        results["models"] = [model.__name__ for model in apps.get_models()]
        
        # Récupérer les tables
        tables = []
        with db_conn.cursor() as cursor:
            cursor.execute("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
                ORDER BY table_name;
            """)
            tables = [row[0] for row in cursor.fetchall()]
        results["tables"] = tables
        
    except OperationalError as e:
        results["connection"] = f"ERROR: {str(e)}"
    except Exception as e:
        results["connection"] = f"UNKNOWN ERROR: {str(e)}"
    
    response = JsonResponse(results)
    response["Cache-Control"] = "no-cache, no-store, must-revalidate"
    return response

def debug_info(request):
    logger.info("Debug info endpoint accessed")
    env_vars = {k: v for k, v in os.environ.items() if not k.startswith('SECRET') and not 'PASSWORD' in k.upper()}
    info = {
        "environment": env_vars,
        "settings": {
            "DEBUG": settings.DEBUG,
            "ALLOWED_HOSTS": settings.ALLOWED_HOSTS,
            "STATIC_URL": settings.STATIC_URL,
            "MEDIA_URL": settings.MEDIA_URL,
        }
    }
    return JsonResponse(info)

urlpatterns = [
    # API endpoints
    path('', api_root_view),
    path('api-info/', api_root_view, name='api-info'),
    path('health/', health_check, name='health'),
    path('railway/', railway_check, name='railway'),
    path('db-check/', db_check, name='db-check'),
    path('debug-info/', debug_info, name='debug-info'),
    path('admin/', admin.site.urls),
    path('api/', include('products.api.urls')),
    path('api/users/', include('users.urls')),
    # path('api/orders/', include('orders.urls')),
]

# Ajout des URLs pour les médias et fichiers statiques
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
else:
    # En production, servis par whitenoise
    pass
