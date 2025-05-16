"""
URL configuration for jaelleshop project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from django.shortcuts import redirect

# API root view
def api_root_view(request):
    return JsonResponse({
        "message": "API EVIMERIA - Bienvenue",
        "status": "Backend opérationnel",
        "endpoints": {
            "admin": "/admin/",
            "api": "/api/", 
            "produits": "/api/products/",
            "produits_featured": "/api/products/featured/",
            "categories": "/api/categories/"
        }
    })

# Home view
def home_view(request):
    return redirect('api-info')

urlpatterns = [
    # API endpoints
    path('', home_view),
    path('api-info/', api_root_view, name='api-info'),
    path('admin/', admin.site.urls),
    path('api/', include('products.api.urls')),
    path('api/users/', include('users.urls')),
]

# Static and media files
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
