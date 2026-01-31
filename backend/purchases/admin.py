from django.contrib import admin
from .models import Purchase, PurchaseItem, Cart, CartItem


class PurchaseItemInline(admin.TabularInline):
    """Inline admin for purchase items"""
    model = PurchaseItem
    extra = 0
    readonly_fields = ['product', 'quantity', 'price_at_purchase']


@admin.register(Purchase)
class PurchaseAdmin(admin.ModelAdmin):
    """Admin configuration for Purchase model"""
    list_display = ['id', 'customer', 'total_amount', 'status', 'payment_method', 'created_at']
    list_filter = ['status', 'payment_method', 'created_at']
    search_fields = ['customer__username', 'customer__email']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at']
    inlines = [PurchaseItemInline]
    
    fieldsets = (
        ('Purchase Information', {
            'fields': ('customer', 'total_amount', 'status', 'payment_method')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


class CartItemInline(admin.TabularInline):
    """Inline admin for cart items"""
    model = CartItem
    extra = 0


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    """Admin configuration for Cart model"""
    list_display = ['customer', 'created_at', 'updated_at']
    search_fields = ['customer__username', 'customer__email']
    ordering = ['-updated_at']
    readonly_fields = ['created_at', 'updated_at']
    inlines = [CartItemInline]
