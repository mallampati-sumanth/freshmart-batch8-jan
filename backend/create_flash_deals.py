"""
Create flash deals for featured products
"""
import os
import django
from decimal import Decimal
from datetime import datetime, timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'freshmart_project.settings')
django.setup()

from products.models import Product, Promotion
from django.utils import timezone

def create_flash_deals():
    """Create limited-time flash deals"""
    print("=" * 60)
    print("Creating Flash Deals")
    print("=" * 60)
    
    # Clear existing promotions
    Promotion.objects.all().delete()
    
    # Select products for flash deals (highest eco score or best savings)
    flash_products = [
        ("Baby Spinach", 25, 6),  # 25% off for 6 hours
        ("Organic Bananas", 20, 12),  # 20% off for 12 hours
        ("Trail Mix", 30, 4),  # 30% off for 4 hours
        ("Greek Yogurt", 15, 24),  # 15% off for 24 hours
        ("Fresh Salmon", 20, 8),  # 20% off for 8 hours
    ]
    
    now = timezone.now()
    deals_created = 0
    
    for product_name, discount, hours in flash_products:
        try:
            product = Product.objects.get(name=product_name)
            
            # Calculate discounted price
            discount_decimal = Decimal(str(discount)) / Decimal('100')
            discounted_price = product.price * (Decimal('1') - discount_decimal)
            
            # Create promotion
            promotion = Promotion.objects.create(
                title=f"⚡ Flash Deal: {discount}% OFF {product_name}",
                description=f"Limited time! Save ${float(product.price - discounted_price):.2f}! Ends in {hours}h",
                discount_percentage=Decimal(str(discount)),
                start_date=now,
                end_date=now + timedelta(hours=hours),
                is_active=True
            )
            promotion.products.add(product)
            
            time_left = f"{hours}h" if hours < 24 else f"{hours//24}d"
            
            print(f"✓ Created: {product_name}")
            print(f"  Discount: {discount}% OFF")
            print(f"  Price: ${product.price} → ${discounted_price:.2f}")
            print(f"  Ends in: {time_left}")
            print(f"  {promotion.description}")
            print()
            
            deals_created += 1
            
        except Product.DoesNotExist:
            print(f"✗ Product not found: {product_name}")
    
    print("=" * 60)
    print(f"✅ Created {deals_created} flash deals!")
    print("=" * 60)

if __name__ == "__main__":
    create_flash_deals()
