from rest_framework import serializers
from .models import KioskSession, KioskInteraction

class KioskInteractionSerializer(serializers.ModelSerializer):
    class Meta:
        model = KioskInteraction
        fields = ['id', 'session', 'interaction_type', 'product_id', 'search_query', 'created_at']
        read_only_fields = ['id', 'session', 'created_at']


class KioskSessionSerializer(serializers.ModelSerializer):
    interactions = KioskInteractionSerializer(many=True, read_only=True)
    customer_name = serializers.CharField(source='customer.username', read_only=True)
    
    class Meta:
        model = KioskSession
        fields = [
            'id', 'customer', 'customer_name', 'session_id',
            'loyalty_card', 'email', 'started_at', 'ended_at',
            'duration_seconds', 'interactions'
        ]
        read_only_fields = ['id', 'customer', 'started_at']
