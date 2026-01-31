#!/usr/bin/env python
"""
Add aisle locations and reviews to all products
"""

import os
import sys
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'freshmart_project.settings')
django.setup()

from products.models import Product, ProductReview
from accounts.models import Customer
import random

def add_aisle_locations():
    """Add aisle locations to all products"""
    aisles = ['A-1', 'A-2', 'A-3', 'B-1', 'B-2', 'B-3', 'C-1', 'C-2', 'D-1', 'D-2', 'E-1', 'E-2']
    
    products = Product.objects.all()
    for product in products:
        if not product.aisle_location:
            product.aisle_location = random.choice(aisles)
            product.save()
            print(f"✓ {product.name} → {product.aisle_location}")

def add_reviews():
    """Add sample reviews to products"""
    customers = list(Customer.objects.all()[:3])
    if not customers:
        print("⚠ No customers found. Please run demo data script first.")
        return
    
    products = Product.objects.all()
    
    review_comments = [
        "Excellent quality! Very fresh.",
        "Great value for money.",
        "Always my go-to choice.",
        "Fresh and delicious!",
        "Highly recommend this product.",
        "Good quality, will buy again.",
        "Perfect for my family.",
        "Best in the market!",
        "Very satisfied with the purchase.",
        "Fresh and tasty!"
    ]
    
    for product in products:
        # Add 1-3 reviews per product
        num_reviews = random.randint(1, 3)
        for _ in range(num_reviews):
            customer = random.choice(customers)
            # Check if this customer already reviewed this product
            if not ProductReview.objects.filter(customer=customer, product=product).exists():
                rating = random.randint(4, 5)  # 4 or 5 stars
                comment = random.choice(review_comments)
                
                ProductReview.objects.create(
                    product=product,
                    customer=customer,
                    rating=rating,
                    comment=comment
                )
                print(f"✓ Added {rating}★ review for {product.name}")

if __name__ == '__main__':
    print("=" * 60)
    print("Adding Aisle Locations and Reviews")
    print("=" * 60)
    
    print("\n📍 Adding aisle locations...")
    add_aisle_locations()
    
    print("\n⭐ Adding product reviews...")
    add_reviews()
    
    print("\n✅ Done! All products now have locations and reviews.")
