from django.contrib import admin
from .models import Category, Product, ProductImage

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 3

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'is_published', 'created_at']
    list_filter = ['is_published', 'created_at', 'updated_at']
    list_editable = ['is_published']
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ['name', 'description']
    actions = ['publish_categories', 'unpublish_categories']
    
    def publish_categories(self, request, queryset):
        queryset.update(is_published=True)
        self.message_user(request, f"{queryset.count()} catégories ont été publiées.")
    publish_categories.short_description = "Publier les catégories sélectionnées"
    
    def unpublish_categories(self, request, queryset):
        queryset.update(is_published=False)
        self.message_user(request, f"{queryset.count()} catégories ont été dépubliées.")
    unpublish_categories.short_description = "Dépublier les catégories sélectionnées"

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'price', 'stock', 'available', 'featured', 'is_published', 'created_at']
    list_filter = ['is_published', 'available', 'featured', 'created_at', 'updated_at', 'category']
    list_editable = ['price', 'stock', 'available', 'featured', 'is_published']
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ['name', 'description']
    inlines = [ProductImageInline]
    actions = ['publish_products', 'unpublish_products']
    
    def publish_products(self, request, queryset):
        queryset.update(is_published=True)
        self.message_user(request, f"{queryset.count()} produits ont été publiés.")
    publish_products.short_description = "Publier les produits sélectionnés"
    
    def unpublish_products(self, request, queryset):
        queryset.update(is_published=False)
        self.message_user(request, f"{queryset.count()} produits ont été dépubliés.")
    unpublish_products.short_description = "Dépublier les produits sélectionnés"

@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ['product', 'is_main', 'created_at']
    list_filter = ['is_main', 'created_at', 'product']
    list_editable = ['is_main']
    search_fields = ['product__name']
