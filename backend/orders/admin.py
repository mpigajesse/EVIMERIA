from django.contrib import admin
from .models import Order, OrderItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    raw_id_fields = ['product']
    extra = 0

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['order_number', 'user', 'status', 'payment_status', 'total_price', 'created_at']
    list_filter = ['status', 'payment_status', 'payment_method', 'created_at']
    search_fields = ['order_number', 'user__email']
    inlines = [OrderItemInline]
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = (
        ('Informations de commande', {
            'fields': ('order_number', 'user', 'status', 'total_price')
        }),
        ('Paiement', {
            'fields': ('payment_method', 'payment_status')
        }),
        ('Adresses', {
            'fields': ('shipping_address', 'billing_address')
        }),
        ('Informations de suivi', {
            'fields': ('created_at', 'updated_at')
        }),
    )
