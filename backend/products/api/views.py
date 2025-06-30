from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404
from django.db.models import Q, Count
from django.conf import settings
from django.core.management import call_command
from rest_framework.generics import ListAPIView

from products.models import Category, SubCategory, Product, ProductImage
from products.serializers import (
    CategorySerializer,
    SubCategorySerializer,
    ProductSerializer, 
    ProductDetailSerializer,
    ProductImageSerializer
)

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 100
    page_size_query_param = 'page_size'
    max_page_size = 1000

class CategoryListAPIView(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = CategorySerializer
    pagination_class = StandardResultsSetPagination
    
    def get_queryset(self):
        """Récupère la liste de toutes les catégories publiées"""
        return Category.objects.filter(is_published=True).annotate(
            products_count=Count('products', filter=Q(products__is_published=True))
        ).order_by('-products_count')

class CategoryDetailAPIView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, slug):
        """Récupère les détails d'une catégorie spécifique publiée"""
        category = get_object_or_404(Category, slug=slug, is_published=True)
        serializer = CategorySerializer(category)
        return Response(serializer.data)

class CategoryProductsAPIView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, slug):
        """Récupère tous les produits d'une catégorie spécifique publiée"""
        category = get_object_or_404(Category, slug=slug, is_published=True)
        products = Product.objects.filter(category=category, available=True, is_published=True)
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

class SubCategoryListAPIView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        """Récupère la liste de toutes les sous-catégories publiées"""
        subcategories = SubCategory.objects.filter(is_published=True)
        serializer = SubCategorySerializer(subcategories, many=True)
        return Response(serializer.data)

class SubCategoryByCategoryAPIView(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = SubCategorySerializer
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        """Récupère les sous-catégories d'une catégorie spécifique."""
        category_slug = self.request.query_params.get('category')
        if not category_slug:
            return SubCategory.objects.none()

        category = get_object_or_404(Category, slug=category_slug, is_published=True)
        return SubCategory.objects.filter(
            category=category, 
            is_published=True
        ).annotate(
            products_count=Count('products', filter=Q(products__is_published=True))
        ).order_by('name')

class SubCategoryDetailAPIView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, slug):
        """Récupère les détails d'une sous-catégorie spécifique publiée"""
        subcategory = get_object_or_404(SubCategory, slug=slug, is_published=True)
        serializer = SubCategorySerializer(subcategory)
        return Response(serializer.data)

class SubCategoryProductsAPIView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, slug):
        """Récupère tous les produits d'une sous-catégorie spécifique publiée"""
        subcategory = get_object_or_404(SubCategory, slug=slug, is_published=True)
        products = Product.objects.filter(subcategory=subcategory, available=True, is_published=True)
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

class ProductListAPIView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        """Récupère la liste de tous les produits publiés"""
        products = Product.objects.filter(available=True, is_published=True)
        
        # Filtrage par catégorie
        category = request.query_params.get('category')
        if category:
            products = products.filter(category__slug=category, category__is_published=True)
            
        # Filtrage par prix
        min_price = request.query_params.get('min_price')
        if min_price:
            products = products.filter(price__gte=min_price)
            
        max_price = request.query_params.get('max_price')
        if max_price:
            products = products.filter(price__lte=max_price)
            
        # Recherche
        search = request.query_params.get('search')
        if search:
            products = products.filter(
                Q(name__icontains=search) |
                Q(description__icontains=search)
            )
            
        # Tri
        sort_by = request.query_params.get('sort_by', 'created_at')
        sort_order = request.query_params.get('sort_order', 'desc')
        
        if sort_order == 'desc':
            sort_by = f'-{sort_by}'
            
        products = products.order_by(sort_by)
        
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

class ProductDetailAPIView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, slug):
        """Récupère les détails d'un produit spécifique publié"""
        product = get_object_or_404(Product, slug=slug, available=True, is_published=True)
        serializer = ProductDetailSerializer(product)
        return Response(serializer.data)

class FeaturedProductsAPIView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        """Récupère les produits mis en avant et publiés"""
        products = Product.objects.filter(featured=True, available=True, is_published=True)[:8]
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

class ProductSearchAPIView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        """Recherche de produits publiés"""
        query = request.query_params.get('q', '')
        if not query:
            return Response(
                {"error": "Paramètre de recherche 'q' requis"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        products = Product.objects.filter(
            Q(name__icontains=query) | Q(description__icontains=query),
            available=True,
            is_published=True
        )
        
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def seed_products(request):
    """Endpoint pour peupler la base de données avec des produits de démonstration"""
    try:
        # Utilise notre nouvelle commande de seeding
        call_command('seed_products')
        return Response(
            {"message": "Base de données peuplée avec succès"}, 
            status=status.HTTP_200_OK
        )
    except Exception as e:
        return Response(
            {"error": str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        ) 