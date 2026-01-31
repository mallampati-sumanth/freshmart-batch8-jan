from django.db import models
from accounts.models import Customer
from products.models import Product


class Package(models.Model):
    """Pre-designed grocery packages for different household types"""
    PACKAGE_TYPES = (
        ('family', 'Family Package'),
        ('solo', 'Solo Living Package'),
        ('duo', 'Duo Package'),
        ('healthy', 'Healthy Living Package'),
        ('budget', 'Budget Friendly Package'),
        ('premium', 'Premium Package'),
    )
    
    name = models.CharField(max_length=200)
    package_type = models.CharField(max_length=20, choices=PACKAGE_TYPES)
    description = models.TextField()
    people_count = models.IntegerField(help_text="Number of people this package serves")
    days = models.IntegerField(help_text="Number of days this package lasts")
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    final_price = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)
    icon = models.CharField(max_length=10, default='📦')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['package_type', 'people_count']
    
    def __str__(self):
        return f"{self.name} - {self.people_count} people for {self.days} days"
    
    def save(self, *args, **kwargs):
        # Calculate final price with discount
        if self.discount_percentage > 0:
            self.final_price = self.total_price * (1 - self.discount_percentage / 100)
        else:
            self.final_price = self.total_price
        super().save(*args, **kwargs)


class PackageItem(models.Model):
    """Items included in a package"""
    package = models.ForeignKey(Package, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    
    class Meta:
        unique_together = ('package', 'product')
    
    def __str__(self):
        return f"{self.product.name} x{self.quantity} in {self.package.name}"


class CustomerPackageOrder(models.Model):
    """Track when customers order packages"""
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    package = models.ForeignKey(Package, on_delete=models.CASCADE)
    ordered_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-ordered_at']
    
    def __str__(self):
        return f"{self.customer.username} ordered {self.package.name}"
