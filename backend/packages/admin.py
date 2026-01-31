from django.contrib import admin
from .models import Package, PackageItem, CustomerPackageOrder


class PackageItemInline(admin.TabularInline):
    model = PackageItem
    extra = 1
    raw_id_fields = ['product']


@admin.register(Package)
class PackageAdmin(admin.ModelAdmin):
    list_display = ['name', 'package_type', 'people_count', 'days', 'final_price', 'is_active']
    list_filter = ['package_type', 'is_active', 'people_count']
    search_fields = ['name', 'description']
    inlines = [PackageItemInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'package_type', 'description', 'icon')
        }),
        ('Package Details', {
            'fields': ('people_count', 'days', 'is_active')
        }),
        ('Pricing', {
            'fields': ('total_price', 'discount_percentage', 'final_price')
        }),
    )
    readonly_fields = ['final_price']


@admin.register(CustomerPackageOrder)
class CustomerPackageOrderAdmin(admin.ModelAdmin):
    list_display = ['customer', 'package', 'ordered_at']
    list_filter = ['ordered_at', 'package__package_type']
    search_fields = ['customer__username', 'package__name']
    date_hierarchy = 'ordered_at'
