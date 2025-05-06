from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('categories', views.CategoryViewSet)
router.register('products', views.ProductViewSet)

app_name = 'products'

urlpatterns = [
    path('', include(router.urls)),
    path('api/', include('products.api.urls')),
] 