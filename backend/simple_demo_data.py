#!/usr/bin/env python
"""
Simple demo data population script for FreshMart
"""

import os
import sys
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'freshmart_project.settings')
django.setup()

from accounts.models import Customer, CustomerPreference
from products.models import Category, Brand, Product
from purchases.models import Purchase, PurchaseItem
from recommendations.engine import update_recommendations_for_customer
from django.utils import timezone
from datetime import timedelta
import random

def create_demo_data():
    print("Creating demo data...")
    
    # 1. Create categories
    categories_data = [
        'Fresh Produce', 'Dairy & Eggs', 'Meat & Seafood', 'Bakery',
        'Beverages', 'Snacks', 'Frozen Foods', 'Pantry Staples'
    ]
    
    categories = []
    for cat_name in categories_data:
        category, created = Category.objects.get_or_create(
            name=cat_name,
            defaults={'description': f'{cat_name} products'}
        )
        categories.append(category)
        if created:
            print(f"Created category: {cat_name}")
    
    # 2. Create brands
    brands_data = [
        'FreshMart Organic', 'Daily Fresh', 'Green Valley', 'Ocean Catch',
        'Baker\'s Choice', 'Pure Dairy', 'Snack Time', 'Healthy Choice'
    ]
    
    brands = []
    for brand_name in brands_data:
        brand, created = Brand.objects.get_or_create(
            name=brand_name,
            defaults={'description': f'{brand_name} products'}
        )
        brands.append(brand)
        if created:
            print(f"Created brand: {brand_name}")
    
    # 3. Create sample products
    products_data = [
        # Fresh Produce
        ('Organic Bananas', 'Fresh Produce', 'FreshMart Organic', 2.99, 'A1'),
        ('Red Apples', 'Fresh Produce', 'Daily Fresh', 3.49, 'A1'),
        ('Baby Spinach', 'Fresh Produce', 'Green Valley', 2.79, 'A2'),
        ('Organic Carrots', 'Fresh Produce', 'FreshMart Organic', 1.99, 'A2'),
        
        # Dairy & Eggs
        ('Whole Milk', 'Dairy & Eggs', 'Pure Dairy', 3.99, 'B1'),
        ('Greek Yogurt', 'Dairy & Eggs', 'Healthy Choice', 4.49, 'B1'),
        ('Free Range Eggs', 'Dairy & Eggs', 'Daily Fresh', 4.99, 'B2'),
        ('Cheddar Cheese', 'Dairy & Eggs', 'Pure Dairy', 5.99, 'B2'),
        
        # Bakery
        ('Artisan Bread', 'Bakery', 'Baker\'s Choice', 3.99, 'C1'),
        ('Croissants', 'Bakery', 'Baker\'s Choice', 4.99, 'C1'),
        
        # Beverages
        ('Orange Juice', 'Beverages', 'Daily Fresh', 3.99, 'D1'),
        ('Sparkling Water', 'Beverages', 'Healthy Choice', 1.99, 'D1'),
        
        # Snacks
        ('Organic Chips', 'Snacks', 'Snack Time', 3.49, 'E1'),
        ('Trail Mix', 'Snacks', 'Healthy Choice', 4.99, 'E1'),
        
        # Meat & Seafood
        ('Fresh Salmon', 'Meat & Seafood', 'Ocean Catch', 12.99, 'F1'),
        ('Chicken Breast', 'Meat & Seafood', 'Daily Fresh', 8.99, 'F1'),
    ]
    
    products = []
    for name, cat_name, brand_name, price, aisle in products_data:
        category = Category.objects.get(name=cat_name)
        brand = Brand.objects.get(name=brand_name)
        
        product, created = Product.objects.get_or_create(
            name=name,
            defaults={
                'category': category,
                'brand': brand,
                'price': price,
                'stock_quantity': random.randint(10, 100),
                'aisle_location': aisle,
                'description': f'High quality {name.lower()}',
                'is_active': True
            }
        )
        products.append(product)
        if created:
            print(f"Created product: {name}")
    
    # 4. Create demo customers
    customers_data = [
        {
            'username': 'john_doe',
            'email': 'john@example.com',
            'first_name': 'John',
            'last_name': 'Doe',
            'age': 35,
            'gender': 'M',
            'city': 'New York',
            'preferences': ['Fresh Produce', 'Dairy & Eggs']
        },
        {
            'username': 'jane_smith',
            'email': 'jane@example.com',
            'first_name': 'Jane',
            'last_name': 'Smith',
            'age': 28,
            'gender': 'F',
            'city': 'Los Angeles',
            'preferences': ['Bakery', 'Beverages', 'Snacks']
        },
        {
            'username': 'health_mike',
            'email': 'mike@example.com',
            'first_name': 'Mike',
            'last_name': 'Johnson',
            'age': 42,
            'gender': 'M',
            'city': 'Chicago',
            'preferences': ['Fresh Produce', 'Meat & Seafood']
        }
    ]
    
    customers = []
    for customer_data in customers_data:
        prefs = customer_data.pop('preferences')
        username = customer_data['username']
        
        # Create or get customer
        customer, created = Customer.objects.get_or_create(
            username=username,
            defaults=customer_data
        )
        
        if created:
            customer.set_password('password123')
            customer.loyalty_card = f"LC{customer.id:06d}"
            customer.loyalty_points = random.randint(100, 1000)
            customer.save()
            print(f"Created customer: {username}")
            
            # Create preferences
            for pref_name in prefs:
                category = Category.objects.get(name=pref_name)
                CustomerPreference.objects.get_or_create(
                    customer=customer,
                    category=pref_name,
                    defaults={'preference_score': random.uniform(0.7, 1.0)}
                )
                print(f"  Added preference: {pref_name}")
        
        customers.append(customer)
    
    # 5. Create some purchase history
    for customer in customers[:2]:  # Only for first 2 customers
        purchase = Purchase.objects.create(
            customer=customer,
            total_amount=0,
            status='completed',
            payment_method='credit_card'
        )
        
        # Add 3-5 random items to each purchase
        total = 0
        for _ in range(random.randint(3, 5)):
            product = random.choice(products)
            quantity = random.randint(1, 3)
            PurchaseItem.objects.create(
                purchase=purchase,
                product=product,
                quantity=quantity,
                price_at_purchase=product.price
            )
            total += product.price * quantity
        
        purchase.total_amount = total
        purchase.save()
        print(f"Created purchase for {customer.username}: ${total:.2f}")
    
    # 6. Generate recommendations
    for customer in customers:
        try:
            recommendations = update_recommendations_for_customer(customer)
            print(f"Generated {len(recommendations)} recommendations for {customer.username}")
        except Exception as e:
            print(f"Error generating recommendations for {customer.username}: {e}")
    
    print("\\n=== Demo Data Created Successfully! ===")
    print(f"Categories: {len(categories)}")
    print(f"Brands: {len(brands)}")
    print(f"Products: {len(products)}")
    print(f"Customers: {len(customers)}")
    print("\\n=== Demo Accounts ===")
    for customer in customers:
        print(f"Username: {customer.username} | Password: password123 | Loyalty Card: {customer.loyalty_card}")

if __name__ == '__main__':
    create_demo_data()