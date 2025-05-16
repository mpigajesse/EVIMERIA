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
from django.views.generic import TemplateView
import os

# Une vue simple pour l'API
def api_root_view(request):
    return JsonResponse({
        "message": "API JaelleShop - Bienvenue",
        "endpoints": {
            "admin": "/admin/",
            "api": "/api/", 
            "produits": "/api/products/",
            "produits_featured": "/api/products/featured/",
            "categories": "/api/categories/"
        }
    })

# Vue pour servir l'application React
frontend_view = TemplateView.as_view(template_name='index.html')

urlpatterns = [
    # API endpoints
    path('api-info/', api_root_view, name='api-info'),
    path('admin/', admin.site.urls),
    path('api/', include('products.api.urls')),
    path('api/users/', include('users.urls')),
    # path('api/orders/', include('orders.urls')),
]

# Ajout des URLs pour les médias et fichiers statiques
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    # Ajout d'une route spécifique pour les assets du frontend
    urlpatterns += static('/assets/', document_root=os.path.join(settings.FRONTEND_DIR, 'dist', 'assets'))

# Toutes les autres routes sont gérées par l'application React
urlpatterns += [
    re_path(r'^$', frontend_view),  # Page d'accueil
    re_path(r'^(?!api|admin|api-info|static|media|assets).*$', frontend_view),  # Toutes les autres routes frontend
]
