from django.contrib import admin
from .models import KioskSession, KioskInteraction


class KioskInteractionInline(admin.TabularInline):
    """Inline admin for kiosk interactions"""
    model = KioskInteraction
    extra = 0
    readonly_fields = ['interaction_type', 'product_id', 'search_query', 'created_at']


@admin.register(KioskSession)
class KioskSessionAdmin(admin.ModelAdmin):
    """Admin configuration for KioskSession model"""
    list_display = ['session_id', 'customer', 'loyalty_card', 'email', 'started_at', 'ended_at', 'duration_seconds']
    list_filter = ['started_at', 'ended_at']
    search_fields = ['customer__username', 'loyalty_card', 'email', 'session_id']
    ordering = ['-started_at']
    readonly_fields = ['started_at', 'ended_at', 'duration_seconds']
    inlines = [KioskInteractionInline]


@admin.register(KioskInteraction)
class KioskInteractionAdmin(admin.ModelAdmin):
    """Admin configuration for KioskInteraction model"""
    list_display = ['session', 'interaction_type', 'product_id', 'search_query', 'created_at']
    list_filter = ['interaction_type', 'created_at']
    search_fields = ['session__customer__username', 'search_query']
    ordering = ['-created_at']
    readonly_fields = ['created_at']
