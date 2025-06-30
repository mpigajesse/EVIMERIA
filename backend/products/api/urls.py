from django.urls import path
from . import views

urlpatterns = [
    # Catégories
    path('categories/', views.CategoryListAPIView.as_view(), name='api-category-list'),
    path('categories/<slug:slug>/', views.CategoryDetailAPIView.as_view(), name='api-category-detail'),
    path('categories/<slug:slug>/products/', views.CategoryProductsAPIView.as_view(), name='api-category-products'),
    
    # Sous-catégories
    path('subcategories/', views.SubCategoryListAPIView.as_view(), name='api-subcategory-list'),
    path('subcategories/by_category/', views.SubCategoryByCategoryAPIView.as_view(), name='api-subcategory-by-category'),
    path('subcategories/<slug:slug>/', views.SubCategoryDetailAPIView.as_view(), name='api-subcategory-detail'),
    path('subcategories/<slug:slug>/products/', views.SubCategoryProductsAPIView.as_view(), name='api-subcategory-products'),
    
    # Produits
    path('products/', views.ProductListAPIView.as_view(), name='api-product-list'),
    path('products/featured/', views.FeaturedProductsAPIView.as_view(), name='api-featured-products'),
    path('products/search/', views.ProductSearchAPIView.as_view(), name='api-product-search'),
    path('products/<slug:slug>/', views.ProductDetailAPIView.as_view(), name='api-product-detail'),
    
    # Seeding des données
    path('seed/', views.seed_products, name='api-seed-products'),
] 