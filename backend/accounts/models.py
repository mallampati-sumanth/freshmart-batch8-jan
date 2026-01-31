from django.contrib.auth.models import AbstractUser
from django.db import models

class Customer(AbstractUser):
    """Custom user model for customers"""
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
        ('N', 'Prefer not to say'),
    ]

    ROLE_CHOICES = [
        ('customer', 'Customer'),
        ('admin', 'Admin'),
    ]
    
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='customer')
    age = models.IntegerField(null=True, blank=True)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, null=True, blank=True)
    phone = models.CharField(max_length=15, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True, db_index=True)
    store_branch = models.CharField(max_length=100, null=True, blank=True, db_index=True)
    loyalty_card = models.CharField(max_length=50, unique=True, null=True, blank=True)
    loyalty_points = models.IntegerField(default=0, db_index=True)
    cashback_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)  # Available cashback
    total_cashback_earned = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)  # Lifetime cashback
    orders_over_minimum = models.IntegerField(default=0)  # Track $45+ orders for retention
    profile_picture = models.ImageField(upload_to='profiles/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Customer'
        verbose_name_plural = 'Customers'
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['city', 'store_branch']),
            models.Index(fields=['-created_at']),
        ]
    
    def __str__(self):
        return f"{self.username} - {self.email}"


class CustomerPreference(models.Model):
    """Customer preferences for personalized recommendations"""
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='preferences')
    category = models.CharField(max_length=100, db_index=True)
    brand = models.CharField(max_length=100, null=True, blank=True, db_index=True)
    preference_score = models.FloatField(default=1.0)  # Higher score = stronger preference
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['customer', 'category', 'brand']
        verbose_name = 'Customer Preference'
        verbose_name_plural = 'Customer Preferences'
        indexes = [
            models.Index(fields=['customer', 'category']),
            models.Index(fields=['-preference_score']),
        ]
    
    def __str__(self):
        return f"{self.customer.username} - {self.category}"

