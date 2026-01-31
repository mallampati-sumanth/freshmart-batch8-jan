from django.db import models
from django.core.validators import MinValueValidator
import qrcode
from io import BytesIO
from django.core.files import File
from PIL import Image

class Category(models.Model):
    """Product categories"""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='categories/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Brand(models.Model):
    """Product brands"""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    logo = models.ImageField(upload_to='brands/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Brand'
        verbose_name_plural = 'Brands'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Product(models.Model):
    """Product model with QR code support"""
    name = models.CharField(max_length=200)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    brand = models.ForeignKey(Brand, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    stock_quantity = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    image = models.ImageField(upload_to='products/', null=True, blank=True)
    image_url = models.URLField(max_length=500, null=True, blank=True, help_text="External URL for product image")
    qr_code = models.ImageField(upload_to='qr_codes/', blank=True)
    aisle_location = models.CharField(max_length=50, blank=True, help_text="Store aisle location (e.g., A-12)")
    is_active = models.BooleanField(default=True)
    featured = models.BooleanField(default=False)
    
    # Nutrition information
    calories = models.IntegerField(null=True, blank=True, help_text="Calories per 100g")
    protein = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, help_text="Protein (g) per 100g")
    carbs = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, help_text="Carbohydrates (g) per 100g")
    fat = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, help_text="Fat (g) per 100g")
    fiber = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, help_text="Fiber (g) per 100g")
    
    # Eco & Market data
    eco_score = models.IntegerField(null=True, blank=True, help_text="Eco-friendliness score 1-100")
    carbon_footprint = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True, help_text="CO2 kg per unit")
    market_avg_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="Average market price")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Product'
        verbose_name_plural = 'Products'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        # Save first to get an ID
        is_new = self.pk is None
        super().save(*args, **kwargs)
        
        # Generate QR code after we have an ID
        if is_new and not self.qr_code:
            qr = qrcode.QRCode(version=1, box_size=10, border=5)
            qr.add_data(f"product_{self.id}_{self.name}")
            qr.make(fit=True)
            qr_image = qr.make_image(fill_color="black", back_color="white")
            
            file_name = f'qr_{self.id}.png'
            stream = BytesIO()
            qr_image.save(stream, 'PNG')
            stream.seek(0)
            self.qr_code.save(file_name, File(stream), save=False)
            super().save(update_fields=['qr_code'])

    
    @property
    def in_stock(self):
        return self.stock_quantity > 0
    
    @property
    def average_rating(self):
        reviews = self.reviews.all()
        if reviews:
            return sum([r.rating for r in reviews]) / len(reviews)
        return 0


class ProductReview(models.Model):
    """Customer reviews for products"""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    customer = models.ForeignKey('accounts.Customer', on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField(validators=[MinValueValidator(1)], help_text="Rating from 1-5")
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['product', 'customer']
        verbose_name = 'Product Review'
        verbose_name_plural = 'Product Reviews'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.customer.username} - {self.product.name} ({self.rating}★)"


class Promotion(models.Model):
    """Promotional offers"""
    title = models.CharField(max_length=200)
    description = models.TextField()
    discount_percentage = models.DecimalField(max_digits=5, decimal_places=2, validators=[MinValueValidator(0)])
    products = models.ManyToManyField(Product, related_name='promotions', blank=True)
    categories = models.ManyToManyField(Category, related_name='promotions', blank=True)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Promotion'
        verbose_name_plural = 'Promotions'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title
