from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from django.shortcuts import get_object_or_404
from django.db.models import Q, Count
from django.conf import settings

from products.models import Category, Product, ProductImage
from products.serializers import (
    CategorySerializer,
    ProductSerializer, 
    ProductDetailSerializer,
    ProductImageSerializer
)
from .product_seeder import run_seeder

class CategoryListAPIView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        """Récupère la liste de toutes les catégories"""
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

class CategoryDetailAPIView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, slug):
        """Récupère les détails d'une catégorie spécifique"""
        category = get_object_or_404(Category, slug=slug)
        serializer = CategorySerializer(category)
        return Response(serializer.data)

class CategoryProductsAPIView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, slug):
        """Récupère tous les produits d'une catégorie spécifique"""
        category = get_object_or_404(Category, slug=slug)
        products = Product.objects.filter(category=category, available=True)
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

class ProductListAPIView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        """Récupère la liste de tous les produits"""
        products = Product.objects.filter(available=True)
        
        # Filtrage par catégorie
        category = request.query_params.get('category')
        if category:
            products = products.filter(category__slug=category)
            
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
        """Récupère les détails d'un produit spécifique"""
        product = get_object_or_404(Product, slug=slug, available=True)
        serializer = ProductDetailSerializer(product)
        return Response(serializer.data)

class FeaturedProductsAPIView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        """Récupère les produits mis en avant"""
        products = Product.objects.filter(featured=True, available=True)[:8]
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

class ProductSearchAPIView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        """Recherche de produits"""
        query = request.query_params.get('q', '')
        if not query:
            return Response(
                {"error": "Paramètre de recherche 'q' requis"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        products = Product.objects.filter(
            Q(name__icontains=query) | Q(description__icontains=query),
            available=True
        )
        
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def seed_products(request):
    """Endpoint pour peupler la base de données avec des produits de démonstration"""
    try:
        run_seeder()
        return Response(
            {"message": "Base de données peuplée avec succès"}, 
            status=status.HTTP_200_OK
        )
    except Exception as e:
        return Response(
            {"error": str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        ) 