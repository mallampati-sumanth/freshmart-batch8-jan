from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Customer, CustomerPreference


@admin.register(Customer)
class CustomerAdmin(UserAdmin):
    """Admin configuration for Customer model"""
    list_display = ['username', 'email', 'first_name', 'last_name', 'loyalty_card', 'loyalty_points', 'city', 'created_at']
    list_filter = ['gender', 'city', 'store_branch', 'created_at']
    search_fields = ['username', 'email', 'first_name', 'last_name', 'loyalty_card']
    ordering = ['-created_at']
    
    fieldsets = UserAdmin.fieldsets + (
        ('Customer Info', {
            'fields': ('age', 'gender', 'phone', 'city', 'store_branch', 'loyalty_card', 'loyalty_points', 'profile_picture')
        }),
    )
    
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Customer Info', {
            'fields': ('age', 'gender', 'phone', 'city', 'store_branch')
        }),
    )


@admin.register(CustomerPreference)
class CustomerPreferenceAdmin(admin.ModelAdmin):
    """Admin configuration for CustomerPreference model"""
    list_display = ['customer', 'category', 'brand', 'preference_score', 'created_at']
    list_filter = ['category', 'created_at']
    search_fields = ['customer__username', 'category', 'brand']
    ordering = ['-preference_score', '-created_at']
