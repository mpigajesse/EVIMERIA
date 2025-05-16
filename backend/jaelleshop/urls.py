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
import os
import logging
import socket
import sys
import django

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
    django_version = django.__version__
    
    # Informations sur la base de données
    db_config = settings.DATABASES.get('default', {})
    db_engine = db_config.get('ENGINE', 'unknown')
    db_name = db_config.get('NAME', 'unknown')
    db_host = db_config.get('HOST', 'unknown')
    
    # Ne pas inclure les données sensibles comme les mots de passe
    if 'PASSWORD' in db_config:
        db_config_safe = {k: v for k, v in db_config.items() if k != 'PASSWORD'}
    else:
        db_config_safe = db_config
    
    # Logging détaillé
    logger.info(f"Health check from {request.META.get('REMOTE_ADDR')} - Hostname: {hostname}, IP: {ip}")
    logger.info(f"ALLOWED_HOSTS: {allowed_hosts}")
    logger.info(f"Database config: {db_config_safe}")
    
    # Retourner une réponse JSON plus détaillée pour le débogage
    response = JsonResponse({
        "status": "OK",
        "message": "Service is healthy",
        "environment": "production" if not settings.DEBUG else "development",
        "host_info": {
            "hostname": hostname,
            "ip": ip,
            "allowed_hosts": allowed_hosts,
            "django_settings": django_settings_module,
        },
        "versions": {
            "python": python_version,
            "django": django_version,
        },
        "database": {
            "engine": db_engine,
            "name": db_name,
            "host": db_host,
            "connected": check_db_connection(),
        }
    })
    response["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response["Pragma"] = "no-cache"
    response["Expires"] = "0"
    return response

def check_db_connection():
    """Vérifie la connexion à la base de données"""
    from django.db import connections
    try:
        for name in connections:
            cursor = connections[name].cursor()
            cursor.execute("SELECT 1")
            row = cursor.fetchone()
            if row is None:
                return False
        return True
    except Exception as e:
        logger.error(f"Database connection error: {e}")
        return False

def debug_info(request):
    logger.info("Debug info endpoint accessed")
    env_vars = {k: v for k, v in os.environ.items() if not k.startswith('SECRET') and not 'PASSWORD' in k.upper()}
    
    # Ajouter des informations sur la base de données (sans mot de passe)
    database_url = os.environ.get('DATABASE_URL', '')
    if database_url:
        # Masquer le mot de passe dans l'URL
        masked_url = database_url.replace('//', '//<masked>@' if '@' in database_url else '//')
        env_vars['DATABASE_URL_MASKED'] = masked_url
    
    info = {
        "environment": env_vars,
        "settings": {
            "DEBUG": settings.DEBUG,
            "ALLOWED_HOSTS": settings.ALLOWED_HOSTS,
            "STATIC_URL": settings.STATIC_URL,
            "MEDIA_URL": settings.MEDIA_URL,
            "DATABASE_ENGINE": settings.DATABASES['default'].get('ENGINE', ''),
        },
        "database_connection": check_db_connection(),
    }
    return JsonResponse(info)

def db_tables(request):
    """Liste les tables dans la base de données"""
    from django.db import connection
    cursor = connection.cursor()
    
    tables = []
    try:
        # Requête pour PostgreSQL
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name;
        """)
        tables = [row[0] for row in cursor.fetchall()]
    except Exception as e:
        return JsonResponse({"error": str(e), "tables": []})
    
    return JsonResponse({"tables": tables})

def simple_test(request):
    """Point de terminaison très simple pour tester"""
    import django
    import sys
    import os
    
    settings_module = os.environ.get('DJANGO_SETTINGS_MODULE', 'unknown')
    
    response_text = f"""
EVIMERIA fonctionne!
Python: {sys.version}
Django: {django.__version__}
Settings: {settings_module}
"""
    return HttpResponse(response_text, content_type="text/plain")

urlpatterns = [
    # Route de test simple
    path('test/', simple_test, name='simple-test'),
    
    # API endpoints
    path('', api_root_view),
    path('api-info/', api_root_view, name='api-info'),
    path('health/', health_check, name='health'),
    path('debug-info/', debug_info, name='debug-info'),
    path('db-tables/', db_tables, name='db-tables'),
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
