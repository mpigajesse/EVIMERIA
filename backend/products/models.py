from django.db import models
from django.utils.text import slugify

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='categories/', blank=True, null=True)
    is_published = models.BooleanField(default=False, verbose_name="Publié")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Catégorie"
        verbose_name_plural = "Catégories"
        ordering = ['name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    @property
    def get_image_url(self):
        """Retourne l'URL directe si c'est une URL Cloudinary, sinon l'URL classique."""
        if self.image and hasattr(self.image, 'url'):
            url = self.image.url
            # Si l'URL commence par /media/http, c'est probablement une URL Cloudinary
            if url.startswith('/media/http'):
                # Extraire et nettoyer l'URL Cloudinary
                cleaned_url = url.replace('/media/', '')
                from urllib.parse import unquote
                cleaned_url = unquote(cleaned_url)
                
                # Corriger le format de l'URL
                if cleaned_url.startswith('http:/'):
                    cleaned_url = cleaned_url.replace('http:/', 'https://')
                elif cleaned_url.startswith('res.cloudinary.com'):
                    cleaned_url = f'https://{cleaned_url}'
                
                return cleaned_url
            return url
        return None

class Product(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    available = models.BooleanField(default=True)
    featured = models.BooleanField(default=False)
    is_published = models.BooleanField(default=False, verbose_name="Publié")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Produit"
        verbose_name_plural = "Produits"
        ordering = ['-created_at']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='products/')
    is_main = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Image du produit"
        verbose_name_plural = "Images des produits"

    def __str__(self):
        return f"Image de {self.product.name} - {'Principale' if self.is_main else 'Secondaire'}"
    
    @property
    def get_image_url(self):
        """Retourne l'URL directe si c'est une URL Cloudinary, sinon l'URL classique."""
        if self.image and hasattr(self.image, 'url'):
            url = self.image.url
            # Si l'URL commence par /media/http, c'est probablement une URL Cloudinary
            if url.startswith('/media/http'):
                # Extraire et nettoyer l'URL Cloudinary
                cleaned_url = url.replace('/media/', '')
                from urllib.parse import unquote
                cleaned_url = unquote(cleaned_url)
                
                # Corriger le format de l'URL
                if cleaned_url.startswith('http:/'):
                    cleaned_url = cleaned_url.replace('http:/', 'https://')
                elif cleaned_url.startswith('res.cloudinary.com'):
                    cleaned_url = f'https://{cleaned_url}'
                
                return cleaned_url
            return url
        return None
