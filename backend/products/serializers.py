from rest_framework import serializers
from .models import Category, Brand, Product, ProductReview, Promotion

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'image', 'created_at']
        read_only_fields = ['id', 'created_at']


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ['id', 'name', 'description', 'logo', 'created_at']
        read_only_fields = ['id', 'created_at']


class ProductReviewSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.username', read_only=True)
    
    class Meta:
        model = ProductReview
        fields = ['id', 'product', 'customer', 'customer_name', 'rating', 'comment', 'created_at', 'updated_at']
        read_only_fields = ['id', 'customer', 'created_at', 'updated_at']


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    brand_name = serializers.CharField(source='brand.name', read_only=True)
    reviews = ProductReviewSerializer(many=True, read_only=True)
    average_rating = serializers.ReadOnlyField()
    in_stock = serializers.ReadOnlyField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'category', 'category_name',
            'brand', 'brand_name', 'price', 'stock_quantity', 'image',
            'qr_code', 'aisle_location', 'is_active', 'featured',
            'in_stock', 'average_rating', 'reviews',
            # Nutrition fields
            'calories', 'protein', 'carbs', 'fat', 'fiber',
            # Eco & Market data
            'eco_score', 'carbon_footprint', 'market_avg_price',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'qr_code', 'created_at', 'updated_at']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if not data['image'] and instance.image_url:
            data['image'] = instance.image_url
        return data


class ProductListSerializer(serializers.ModelSerializer):
    """Lighter serializer for product lists"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    brand_name = serializers.CharField(source='brand.name', read_only=True)
    average_rating = serializers.ReadOnlyField()
    in_stock = serializers.ReadOnlyField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'category_name', 'brand_name', 'price',
            'stock_quantity', 'image', 'is_active', 'featured',
            'in_stock', 'average_rating', 'aisle_location'
        ]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if not data['image'] and instance.image_url:
            data['image'] = instance.image_url
        return data


class PromotionSerializer(serializers.ModelSerializer):
    products = ProductListSerializer(many=True, read_only=True)
    categories = CategorySerializer(many=True, read_only=True)
    
    class Meta:
        model = Promotion
        fields = [
            'id', 'title', 'description', 'discount_percentage',
            'products', 'categories', 'start_date', 'end_date',
            'is_active', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
