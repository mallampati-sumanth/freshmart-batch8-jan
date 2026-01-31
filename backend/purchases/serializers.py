from rest_framework import serializers
from .models import Purchase, PurchaseItem, Cart, CartItem
from products.serializers import ProductListSerializer

class PurchaseItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_image = serializers.ImageField(source='product.image', read_only=True)
    subtotal = serializers.ReadOnlyField()
    
    class Meta:
        model = PurchaseItem
        fields = ['id', 'product', 'product_name', 'product_image', 'quantity', 'price_at_purchase', 'subtotal']
        read_only_fields = ['id', 'price_at_purchase']


class PurchaseSerializer(serializers.ModelSerializer):
    items = PurchaseItemSerializer(many=True, read_only=True)
    customer_name = serializers.CharField(source='customer.username', read_only=True)
    
    class Meta:
        model = Purchase
        fields = [
            'id', 'customer', 'customer_name', 'total_amount',
            'status', 'payment_method', 'items',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'customer', 'created_at', 'updated_at']


class CartItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_image = serializers.SerializerMethodField()
    product_brand = serializers.CharField(source='product.brand.name', read_only=True)
    price = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2, read_only=True)
    subtotal = serializers.ReadOnlyField()
    
    # Include full product data with nutrition & eco info
    product = serializers.SerializerMethodField()
    
    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_name', 'product_image', 'product_brand', 'price', 'quantity', 'subtotal', 'added_at']
        read_only_fields = ['id', 'added_at']
    
    def get_product(self, obj):
        """Return full product data including nutrition and eco info"""
        return {
            'id': obj.product.id,
            'name': obj.product.name,
            'price': float(obj.product.price),
            'calories': obj.product.calories,
            'protein': float(obj.product.protein) if obj.product.protein else None,
            'carbs': float(obj.product.carbs) if obj.product.carbs else None,
            'fat': float(obj.product.fat) if obj.product.fat else None,
            'fiber': float(obj.product.fiber) if obj.product.fiber else None,
            'eco_score': obj.product.eco_score,
            'carbon_footprint': float(obj.product.carbon_footprint) if obj.product.carbon_footprint else None,
            'market_avg_price': float(obj.product.market_avg_price) if obj.product.market_avg_price else None,
        }
    
    def get_product_image(self, obj):
        if obj.product.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.product.image.url)
            return obj.product.image.url
        elif obj.product.image_url:
            return obj.product.image_url
        return None


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_amount = serializers.ReadOnlyField(source='total')
    
    class Meta:
        model = Cart
        fields = ['id', 'customer', 'items', 'total_amount', 'created_at', 'updated_at']
        read_only_fields = ['id', 'customer', 'created_at', 'updated_at']


class CheckoutSerializer(serializers.Serializer):
    """Serializer for checkout process"""
    payment_method = serializers.CharField(max_length=50)
    
    def validate(self, attrs):
        user = self.context['request'].user
        try:
            cart = user.cart
            if not cart.items.exists():
                raise serializers.ValidationError("Cart is empty")
        except Cart.DoesNotExist:
            raise serializers.ValidationError("Cart not found")
        return attrs
