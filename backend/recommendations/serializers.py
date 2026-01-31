from rest_framework import serializers
from .models import Recommendation, RecommendationClick
from products.serializers import ProductListSerializer

class RecommendationSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)
    
    class Meta:
        model = Recommendation
        fields = ['id', 'customer', 'product', 'score', 'reason', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'customer', 'created_at', 'updated_at']


class RecommendationClickSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecommendationClick
        fields = ['id', 'recommendation', 'clicked_at']
        read_only_fields = ['id', 'clicked_at']
