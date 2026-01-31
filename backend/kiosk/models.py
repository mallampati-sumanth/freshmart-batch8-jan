from django.db import models
from django.utils import timezone
from datetime import timedelta
import random
import string
from accounts.models import Customer


class OTPVerification(models.Model):
    """OTP verification for loyalty card kiosk login"""
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='otp_verifications')
    otp_code = models.CharField(max_length=6)
    email = models.EmailField()
    phone = models.CharField(max_length=15, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'OTP Verification'
        verbose_name_plural = 'OTP Verifications'
    
    def __str__(self):
        return f"{self.customer.username} - {self.otp_code} ({'Used' if self.is_used else 'Active'})"
    
    def is_expired(self):
        """Check if OTP has expired"""
        return timezone.now() > self.expires_at
    
    def is_valid(self):
        """Check if OTP is valid (not used and not expired)"""
        return not self.is_used and not self.is_expired()
    
    @staticmethod
    def generate_otp():
        """Generate 6-digit OTP"""
        return ''.join(random.choices(string.digits, k=6))
    
    def save(self, *args, **kwargs):
        if not self.expires_at:
            # OTP expires in 10 minutes
            self.expires_at = timezone.now() + timedelta(minutes=10)
        if not self.otp_code:
            self.otp_code = self.generate_otp()
        super().save(*args, **kwargs)


class KioskSession(models.Model):
    """Track kiosk usage sessions"""
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='kiosk_sessions', null=True, blank=True)
    session_id = models.CharField(max_length=100, unique=True)
    loyalty_card = models.CharField(max_length=50, blank=True)
    email = models.EmailField(blank=True)
    started_at = models.DateTimeField(auto_now_add=True)
    ended_at = models.DateTimeField(null=True, blank=True)
    duration_seconds = models.IntegerField(null=True, blank=True)
    
    class Meta:
        verbose_name = 'Kiosk Session'
        verbose_name_plural = 'Kiosk Sessions'
        ordering = ['-started_at']
    
    def __str__(self):
        customer_info = self.customer.username if self.customer else self.email or self.loyalty_card
        return f"Kiosk Session - {customer_info} - {self.started_at}"


class KioskInteraction(models.Model):
    """Track specific interactions within kiosk sessions"""
    INTERACTION_TYPES = [
        ('product_view', 'Product View'),
        ('product_search', 'Product Search'),
        ('recommendation_view', 'Recommendation View'),
        ('location_lookup', 'Location Lookup'),
        ('promotion_view', 'Promotion View'),
    ]
    
    session = models.ForeignKey(KioskSession, on_delete=models.CASCADE, related_name='interactions')
    interaction_type = models.CharField(max_length=50, choices=INTERACTION_TYPES)
    product_id = models.IntegerField(null=True, blank=True)
    search_query = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Kiosk Interaction'
        verbose_name_plural = 'Kiosk Interactions'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.interaction_type} - {self.created_at}"
