from rest_framework import serializers
from .models import Package, PackageItem, CustomerPackageOrder
from products.serializers import ProductSerializer


class PackageItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    
    class Meta:
        model = PackageItem
        fields = ['id', 'product', 'quantity']


class PackageSerializer(serializers.ModelSerializer):
    items = PackageItemSerializer(many=True, read_only=True)
    savings = serializers.SerializerMethodField()
    
    class Meta:
        model = Package
        fields = [
            'id', 'name', 'package_type', 'description', 'people_count', 
            'days', 'total_price', 'discount_percentage', 'final_price',
            'icon', 'items', 'savings', 'is_active'
        ]
    
    def get_savings(self, obj):
        return float(obj.total_price - obj.final_price)


class CustomerPackageOrderSerializer(serializers.ModelSerializer):
    package = PackageSerializer(read_only=True)
    
    class Meta:
        model = CustomerPackageOrder
        fields = ['id', 'package', 'ordered_at']
