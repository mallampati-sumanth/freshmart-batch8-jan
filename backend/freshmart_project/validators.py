"""
Enterprise-grade input validation utilities for FreshMart
"""
import re
from rest_framework import serializers


def validate_phone_number(value):
    """Validate phone number format"""
    if value:
        # Remove spaces and dashes
        cleaned = re.sub(r'[\s-]', '', value)
        # Check if it's a valid phone number (10-15 digits, optionally starting with +)
        if not re.match(r'^\+?\d{10,15}$', cleaned):
            raise serializers.ValidationError("Invalid phone number format")
    return value


def validate_email_domain(value, allowed_domains=None):
    """Validate email domain (optional restriction)"""
    if allowed_domains:
        domain = value.split('@')[-1].lower()
        if domain not in allowed_domains:
            raise serializers.ValidationError(f"Email domain must be one of: {', '.join(allowed_domains)}")
    return value


def validate_positive_number(value):
    """Ensure number is positive"""
    if value < 0:
        raise serializers.ValidationError("Value must be positive")
    return value


def validate_rating(value):
    """Validate rating is between 1 and 5"""
    if not 1 <= value <= 5:
        raise serializers.ValidationError("Rating must be between 1 and 5")
    return value


def validate_password_strength(password):
    """
    Validate password strength:
    - At least 8 characters
    - Contains uppercase and lowercase letters
    - Contains at least one digit
    - Contains at least one special character
    """
    errors = []
    
    if len(password) < 8:
        errors.append("Password must be at least 8 characters long")
    
    if not re.search(r'[A-Z]', password):
        errors.append("Password must contain at least one uppercase letter")
    
    if not re.search(r'[a-z]', password):
        errors.append("Password must contain at least one lowercase letter")
    
    if not re.search(r'\d', password):
        errors.append("Password must contain at least one digit")
    
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        errors.append("Password must contain at least one special character")
    
    if errors:
        raise serializers.ValidationError(errors)
    
    return password


def sanitize_html(value):
    """Remove HTML tags from input"""
    if value:
        return re.sub(r'<[^>]+>', '', value)
    return value


def validate_aisle_location(value):
    """Validate aisle location format (e.g., A-12, B-5)"""
    if value:
        if not re.match(r'^[A-Z]-\d{1,3}$', value.upper()):
            raise serializers.ValidationError("Aisle location must be in format: A-12")
    return value.upper() if value else value


def validate_loyalty_card(value):
    """Validate loyalty card format (LC followed by 6 digits)"""
    if value:
        if not re.match(r'^LC\d{6}$', value.upper()):
            raise serializers.ValidationError("Loyalty card must be in format: LC000001")
    return value.upper() if value else value


class StrictCharField(serializers.CharField):
    """CharField with automatic HTML sanitization"""
    
    def to_internal_value(self, data):
        value = super().to_internal_value(data)
        return sanitize_html(value)


class PositiveDecimalField(serializers.DecimalField):
    """DecimalField that only accepts positive values"""
    
    def to_internal_value(self, data):
        value = super().to_internal_value(data)
        if value < 0:
            raise serializers.ValidationError("Value must be positive")
        return value
