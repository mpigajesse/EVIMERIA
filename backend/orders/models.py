from django.db import models
from users.models import User, Address
from products.models import Product

class Order(models.Model):
    STATUS_CHOICES = (
        ('pending', 'En attente'),
        ('processing', 'En cours de traitement'),
        ('shipped', 'Expédié'),
        ('delivered', 'Livré'),
        ('cancelled', 'Annulé'),
    )
    
    PAYMENT_METHOD_CHOICES = (
        ('credit_card', 'Carte de crédit'),
        ('paypal', 'PayPal'),
        ('bank_transfer', 'Virement bancaire'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    shipping_address = models.ForeignKey(Address, on_delete=models.SET_NULL, related_name='shipping_orders', null=True)
    billing_address = models.ForeignKey(Address, on_delete=models.SET_NULL, related_name='billing_orders', null=True)
    order_number = models.CharField(max_length=50, unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    payment_status = models.BooleanField(default=False)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Commande"
        verbose_name_plural = "Commandes"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Commande #{self.order_number} - {self.user.email}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)  # Prix au moment de l'achat
    
    class Meta:
        verbose_name = "Produit commandé"
        verbose_name_plural = "Produits commandés"
    
    def __str__(self):
        return f"{self.quantity} x {self.product.name} dans la commande #{self.order.order_number}"
    
    @property
    def total_price(self):
        return self.price * self.quantity
