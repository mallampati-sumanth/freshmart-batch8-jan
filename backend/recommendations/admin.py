from django.contrib import admin
from .models import Recommendation, RecommendationClick


@admin.register(Recommendation)
class RecommendationAdmin(admin.ModelAdmin):
    """Admin configuration for Recommendation model"""
    list_display = ['customer', 'product', 'score', 'reason', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['customer__username', 'product__name', 'reason']
    ordering = ['-score', '-created_at']
    list_editable = ['is_active']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(RecommendationClick)
class RecommendationClickAdmin(admin.ModelAdmin):
    """Admin configuration for RecommendationClick model"""
    list_display = ['recommendation', 'clicked_at']
    list_filter = ['clicked_at']
    search_fields = ['recommendation__customer__username', 'recommendation__product__name']
    ordering = ['-clicked_at']
    readonly_fields = ['clicked_at']
