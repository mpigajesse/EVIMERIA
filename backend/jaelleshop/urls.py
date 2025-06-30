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
from django.views.generic import TemplateView
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

# Fonction health_check simplifiée
def health_check(request):
    logger.info("Health check endpoint accessed")
    return JsonResponse({
        "status": "OK",
        "message": "Service is healthy"
    })

def simplified_health_check(request):
    """Version ultra-simple du health check pour le déploiement"""
    return HttpResponse("OK", content_type="text/plain")

# Endpoint ultra-minimal pour le healthcheck
def minimal_status(request):
    """Endpoint minimal pour le healthcheck de Railway"""
    return HttpResponse("OK", status=200)

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

# Vue pour servir le frontend React
def serve_react_app(request):
    """Serve the React app"""
    try:
        # Essayer de servir index.html du frontend
        frontend_dist = os.path.join(settings.FRONTEND_DIR, 'dist')
        index_path = os.path.join(frontend_dist, 'index.html')
        
        if os.path.exists(index_path):
            with open(index_path, 'r', encoding='utf-8') as f:
                return HttpResponse(f.read(), content_type='text/html')
        else:
            # Si le frontend n'existe pas, retourner un message d'information
            return HttpResponse(f"""
                <html>
                    <body>
                        <h1>🚀 EVIMERIA Backend</h1>
                        <p>✅ Backend Django fonctionne !</p>
                        <p>⚠️ Frontend React en cours de construction...</p>
                        <p><strong>Chemin recherché :</strong> {index_path}</p>
                        <p><strong>Répertoire frontend :</strong> {settings.FRONTEND_DIR}</p>
                        <hr>
                        <h3>🔗 Liens utiles :</h3>
                        <ul>
                            <li><a href="/admin/">Interface Admin Django</a></li>
                            <li><a href="/api/products/">API Produits</a></li>
                            <li><a href="/status/">Status de l'application</a></li>
                        </ul>
                    </body>
                </html>
            """, content_type='text/html')
    except Exception as e:
        return HttpResponse(f"""
            <html>
                <body>
                    <h1>❌ Erreur</h1>
                    <p>Erreur lors du chargement du frontend : {str(e)}</p>
                    <p><a href="/admin/">Accéder à l'admin Django</a></p>
                </body>
            </html>
        """, content_type='text/html', status=500)

urlpatterns = [
    # Admin doit être en premier
    path('admin/', admin.site.urls),
    
    # Route de test simple
    path('test/', simple_test, name='simple-test'),
    
    # API endpoints
    path('api-info/', api_root_view, name='api-info'),
    path('health/', simplified_health_check, name='health'),
    path('status/', minimal_status, name='status'),
    path('debug-info/', debug_info, name='debug-info'),
    path('db-tables/', db_tables, name='db-tables'),
    path('api/', include('products.api.urls')),
    path('api/users/', include('users.urls')),
    path('api/orders/', include('orders.urls')),
    
    # Fallback pour le frontend React
    re_path(r'^.*$', serve_react_app, name='react_app'),
]

# Servir les fichiers statiques en développement
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
else:
    # En production, servis par whitenoise
    pass
