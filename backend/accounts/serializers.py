from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import Customer, CustomerPreference

class CustomerPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerPreference
        fields = ['id', 'category', 'brand', 'preference_score', 'created_at']
        read_only_fields = ['id', 'created_at']


class CustomerSerializer(serializers.ModelSerializer):
    preferences = CustomerPreferenceSerializer(many=True, read_only=True)
    
    class Meta:
        model = Customer
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'age', 'gender', 'phone', 'city', 'store_branch',
            'role', 'loyalty_card', 'loyalty_points', 'cashback_balance',
            'total_cashback_earned', 'orders_over_minimum', 'profile_picture',
            'preferences', 'is_staff', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'loyalty_points', 'cashback_balance', 
                           'total_cashback_earned', 'orders_over_minimum',
                           'created_at', 'updated_at']
        extra_kwargs = {
            'password': {'write_only': True}
        }


class CustomerRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    preferences = serializers.ListField(
        child=serializers.DictField(),
        write_only=True,
        required=False
    )
    
    class Meta:
        model = Customer
        fields = [
            'username', 'email', 'password', 'password2',
            'first_name', 'last_name', 'age', 'gender',
            'phone', 'city', 'store_branch', 'preferences'
        ]
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password2')
        preferences_data = validated_data.pop('preferences', [])
        
        user = Customer.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            age=validated_data.get('age'),
            gender=validated_data.get('gender'),
            phone=validated_data.get('phone'),
            city=validated_data.get('city'),
            store_branch=validated_data.get('store_branch'),
        )
        
        # Generate loyalty card
        user.loyalty_card = f"LC{user.id:06d}"
        user.save()
        
        # Create preferences
        for pref_data in preferences_data:
            CustomerPreference.objects.create(
                customer=user,
                category=pref_data.get('category'),
                brand=pref_data.get('brand', ''),
                preference_score=pref_data.get('preference_score', 1.0)
            )
        
        return user


class CustomerUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = [
            'first_name', 'last_name', 'age', 'gender',
            'phone', 'city', 'store_branch', 'profile_picture'
        ]
