from django.db import models
from accounts.models import Customer
from products.models import Product

class Recommendation(models.Model):
    """Personalized product recommendations for customers"""
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='recommendations')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='recommendations')
    score = models.FloatField(default=0.0, help_text="Recommendation score (higher = more relevant)")
    reason = models.CharField(max_length=200, blank=True, help_text="Why this product is recommended")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['customer', 'product']
        verbose_name = 'Recommendation'
        verbose_name_plural = 'Recommendations'
        ordering = ['-score', '-created_at']
    
    def __str__(self):
        return f"{self.customer.username} - {self.product.name} (Score: {self.score})"


class RecommendationClick(models.Model):
    """Track when customers click on recommendations"""
    recommendation = models.ForeignKey(Recommendation, on_delete=models.CASCADE, related_name='clicks')
    clicked_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Recommendation Click'
        verbose_name_plural = 'Recommendation Clicks'
    
    def __str__(self):
        return f"{self.recommendation.customer.username} clicked {self.recommendation.product.name}"
