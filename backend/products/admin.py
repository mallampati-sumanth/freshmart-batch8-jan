from django.contrib import admin
from .models import Category, Brand, Product, ProductReview, Promotion


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """Admin configuration for Category model"""
    list_display = ['name', 'created_at']
    search_fields = ['name']
    ordering = ['name']


@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    """Admin configuration for Brand model"""
    list_display = ['name', 'created_at']
    search_fields = ['name']
    ordering = ['name']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    """Admin configuration for Product model"""
    list_display = ['name', 'category', 'brand', 'price', 'stock_quantity', 'aisle_location', 'is_active', 'featured', 'created_at']
    list_filter = ['category', 'brand', 'is_active', 'featured', 'created_at']
    search_fields = ['name', 'description', 'category__name', 'brand__name']
    ordering = ['-created_at']
    list_editable = ['price', 'stock_quantity', 'is_active', 'featured']
    readonly_fields = ['qr_code', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'description', 'category', 'brand')
        }),
        ('Pricing & Inventory', {
            'fields': ('price', 'stock_quantity', 'aisle_location')
        }),
        ('Media', {
            'fields': ('image', 'qr_code')
        }),
        ('Status', {
            'fields': ('is_active', 'featured')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(ProductReview)
class ProductReviewAdmin(admin.ModelAdmin):
    """Admin configuration for ProductReview model"""
    list_display = ['product', 'customer', 'rating', 'created_at']
    list_filter = ['rating', 'created_at']
    search_fields = ['product__name', 'customer__username', 'comment']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Promotion)
class PromotionAdmin(admin.ModelAdmin):
    """Admin configuration for Promotion model"""
    list_display = ['title', 'discount_percentage', 'start_date', 'end_date', 'is_active', 'created_at']
    list_filter = ['is_active', 'start_date', 'end_date']
    search_fields = ['title', 'description']
    ordering = ['-created_at']
    filter_horizontal = ['products', 'categories']
    list_editable = ['is_active']
