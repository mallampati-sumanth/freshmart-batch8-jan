"""
Management command to populate the database with demo data
Usage: python manage.py populate_demo_data
"""

from django.core.management.base import BaseCommand
from django.db import transaction
from accounts.models import Customer, CustomerPreference
from products.models import Category, Brand, Product, ProductReview, Promotion
from purchases.models import Purchase, PurchaseItem
from recommendations.engine import update_recommendations_for_customer
from django.utils import timezone
from datetime import timedelta
import random


class Command(BaseCommand):
    help = 'Populate database with demo data for FreshMart'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS('Starting to populate demo data...'))
        
        with transaction.atomic():
            # Clear existing data (optional)
            self.stdout.write('Clearing existing data...')
            
            # Create categories
            self.stdout.write('Creating categories...')
            categories = self._create_categories()
            
            # Create brands
            self.stdout.write('Creating brands...')
            brands = self._create_brands()
            
            # Create products
            self.stdout.write('Creating products...')
            products = self._create_products(categories, brands)
            
            # Create customers
            self.stdout.write('Creating customers...')
            customers = self._create_customers()
            
            # Create customer preferences
            self.stdout.write('Creating customer preferences...')
            self._create_preferences(customers, categories, brands)
            
            # Create purchases
            self.stdout.write('Creating purchase history...')
            self._create_purchases(customers, products)
            
            # Create reviews
            self.stdout.write('Creating product reviews...')
            self._create_reviews(customers, products)
            
            # Create promotions
            self.stdout.write('Creating promotions...')
            self._create_promotions(products, categories)
            
            # Generate recommendations
            self.stdout.write('Generating recommendations...')
            for customer in customers:
                update_recommendations_for_customer(customer)
            
            self.stdout.write(self.style.SUCCESS('Successfully populated demo data!'))
            self.stdout.write(self.style.SUCCESS(f'Created {len(customers)} customers'))
            self.stdout.write(self.style.SUCCESS(f'Created {len(products)} products'))
            self.stdout.write(self.style.SUCCESS(f'Created {len(categories)} categories'))
            self.stdout.write(self.style.SUCCESS(f'Created {len(brands)} brands'))

    def _create_categories(self):
        categories_data = [
            {'name': 'Fresh Produce', 'description': 'Fresh fruits and vegetables'},
            {'name': 'Dairy & Eggs', 'description': 'Milk, cheese, yogurt, and eggs'},
            {'name': 'Meat & Seafood', 'description': 'Fresh meat and seafood'},
            {'name': 'Bakery', 'description': 'Fresh bread and baked goods'},
            {'name': 'Beverages', 'description': 'Drinks and beverages'},
            {'name': 'Snacks', 'description': 'Chips, cookies, and snacks'},
            {'name': 'Frozen Foods', 'description': 'Frozen meals and ice cream'},
            {'name': 'Pantry Staples', 'description': 'Rice, pasta, and canned goods'},
            {'name': 'Health & Beauty', 'description': 'Personal care products'},
            {'name': 'Household', 'description': 'Cleaning and household items'},
        ]
        
        categories = []
        for data in categories_data:
            category, created = Category.objects.get_or_create(**data)
            categories.append(category)
        
        return categories

    def _create_brands(self):
        brands_data = [
            {'name': 'FreshMart Organic', 'description': 'Our organic product line'},
            {'name': 'Daily Fresh', 'description': 'Fresh daily products'},
            {'name': 'Green Valley', 'description': 'Natural and healthy products'},
            {'name': 'Ocean Catch', 'description': 'Premium seafood'},
            {'name': 'Baker\'s Choice', 'description': 'Quality baked goods'},
            {'name': 'Pure Dairy', 'description': 'Farm fresh dairy'},
            {'name': 'Snack Time', 'description': 'Delicious snacks'},
            {'name': 'Healthy Choice', 'description': 'Health-conscious products'},
        ]
        
        brands = []
        for data in brands_data:
            brand, created = Brand.objects.get_or_create(**data)
            brands.append(brand)
        
        return brands

    def _create_products(self, categories, brands):
        products_data = [
            # Fresh Produce
            {'name': 'Organic Apples', 'category': 'Fresh Produce', 'brand': 'FreshMart Organic', 'price': 3.99, 'stock': 100, 'aisle': 'A-1', 'image': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80'},
            {'name': 'Fresh Bananas', 'category': 'Fresh Produce', 'brand': 'Daily Fresh', 'price': 2.49, 'stock': 150, 'aisle': 'A-1', 'image': 'https://images.unsplash.com/photo-1571771896612-618db7752e50?auto=format&fit=crop&w=600&q=80'},
            {'name': 'Organic Carrots', 'category': 'Fresh Produce', 'brand': 'FreshMart Organic', 'price': 2.99, 'stock': 80, 'aisle': 'A-2', 'image': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80'},
            {'name': 'Fresh Tomatoes', 'category': 'Fresh Produce', 'brand': 'Daily Fresh', 'price': 3.49, 'stock': 90, 'aisle': 'A-2', 'image': 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80'},
            
            # Dairy & Eggs
            {'name': 'Whole Milk', 'category': 'Dairy & Eggs', 'brand': 'Pure Dairy', 'price': 4.99, 'stock': 60, 'aisle': 'B-1', 'image': 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=600&q=80'},
            {'name': 'Greek Yogurt', 'category': 'Dairy & Eggs', 'brand': 'Pure Dairy', 'price': 5.99, 'stock': 50, 'aisle': 'B-1', 'image': 'https://images.unsplash.com/photo-1588710929895-6ae7b764bb72?auto=format&fit=crop&w=600&q=80'},
            {'name': 'Cheddar Cheese', 'category': 'Dairy & Eggs', 'brand': 'Pure Dairy', 'price': 6.99, 'stock': 40, 'aisle': 'B-2', 'image': 'https://images.unsplash.com/photo-1533722765360-153579893963?auto=format&fit=crop&w=600&q=80'},
            {'name': 'Free Range Eggs', 'category': 'Dairy & Eggs', 'brand': 'Daily Fresh', 'price': 4.49, 'stock': 70, 'aisle': 'B-2', 'image': 'https://images.unsplash.com/photo-1582722878654-02fd235dd7c2?auto=format&fit=crop&w=600&q=80'},
            
            # Meat & Seafood
            {'name': 'Chicken Breast', 'category': 'Meat & Seafood', 'brand': 'Daily Fresh', 'price': 8.99, 'stock': 45, 'aisle': 'C-1', 'image': 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=600&q=80'},
            {'name': 'Atlantic Salmon', 'category': 'Meat & Seafood', 'brand': 'Ocean Catch', 'price': 12.99, 'stock': 30, 'aisle': 'C-2', 'image': 'https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c?auto=format&fit=crop&w=600&q=80'},
            
            # Bakery
            {'name': 'Whole Wheat Bread', 'category': 'Bakery', 'brand': 'Baker\'s Choice', 'price': 3.99, 'stock': 80, 'aisle': 'D-1', 'image': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80'},
            {'name': 'Croissants', 'category': 'Bakery', 'brand': 'Baker\'s Choice', 'price': 5.49, 'stock': 40, 'aisle': 'D-1', 'image': 'https://images.unsplash.com/photo-1555507036-ab1f40388085?auto=format&fit=crop&w=600&q=80'},
            
            # Beverages
            {'name': 'Orange Juice', 'category': 'Beverages', 'brand': 'Daily Fresh', 'price': 4.99, 'stock': 60, 'aisle': 'E-1', 'image': 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=600&q=80'},
            {'name': 'Green Tea', 'category': 'Beverages', 'brand': 'Healthy Choice', 'price': 6.99, 'stock': 50, 'aisle': 'E-2', 'image': 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?auto=format&fit=crop&w=600&q=80'},
            {'name': 'Sparkling Water', 'category': 'Beverages', 'brand': 'Daily Fresh', 'price': 3.99, 'stock': 100, 'aisle': 'E-1', 'image': 'https://images.unsplash.com/photo-1560023907-5f339617ea30?auto=format&fit=crop&w=600&q=80'},
            
            # Snacks
            {'name': 'Potato Chips', 'category': 'Snacks', 'brand': 'Snack Time', 'price': 3.49, 'stock': 120, 'aisle': 'F-1', 'image': 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80'},
            {'name': 'Chocolate Cookies', 'category': 'Snacks', 'brand': 'Snack Time', 'price': 4.99, 'stock': 90, 'aisle': 'F-2', 'image': 'https://images.unsplash.com/photo-1499636138143-bd649043ea52?auto=format&fit=crop&w=600&q=80'},
            {'name': 'Trail Mix', 'category': 'Snacks', 'brand': 'Healthy Choice', 'price': 5.99, 'stock': 70, 'aisle': 'F-1', 'image': 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=600&q=80'},
            
            # Frozen Foods
            {'name': 'Frozen Pizza', 'category': 'Frozen Foods', 'brand': 'Daily Fresh', 'price': 7.99, 'stock': 50, 'aisle': 'G-1', 'image': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80'},
            {'name': 'Ice Cream', 'category': 'Frozen Foods', 'brand': 'Daily Fresh', 'price': 5.99, 'stock': 60, 'aisle': 'G-2', 'image': 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=600&q=80'},
        ]
        
        products = []
        category_dict = {cat.name: cat for cat in categories}
        brand_dict = {brand.name: brand for brand in brands}
        
        for data in products_data:
            product, created = Product.objects.update_or_create(
                name=data['name'],
                defaults={
                    'description': f"High quality {data['name'].lower()}",
                    'category': category_dict[data['category']],
                    'brand': brand_dict.get(data['brand']),
                    'price': data['price'],
                    'stock_quantity': data['stock'],
                    'aisle_location': data['aisle'],
                    'image_url': data.get('image'),
                    'is_active': True,
                    'featured': random.choice([True, False]),
                }
            )
            products.append(product)
        
        return products

    def _create_customers(self):
        customers_data = [
            {
                'username': 'john_doe',
                'email': 'john@example.com',
                'first_name': 'John',
                'last_name': 'Doe',
                'age': 30,
                'gender': 'M',
                'city': 'New York',
                'store_branch': 'Manhattan',
            },
            {
                'username': 'jane_smith',
                'email': 'jane@example.com',
                'first_name': 'Jane',
                'last_name': 'Smith',
                'age': 28,
                'gender': 'F',
                'city': 'New York',
                'store_branch': 'Brooklyn',
            },
            {
                'username': 'bob_wilson',
                'email': 'bob@example.com',
                'first_name': 'Bob',
                'last_name': 'Wilson',
                'age': 35,
                'gender': 'M',
                'city': 'Los Angeles',
                'store_branch': 'Downtown LA',
            },
            {
                'username': 'alice_brown',
                'email': 'alice@example.com',
                'first_name': 'Alice',
                'last_name': 'Brown',
                'age': 32,
                'gender': 'F',
                'city': 'Chicago',
                'store_branch': 'North Chicago',
            },
            {
                'username': 'charlie_davis',
                'email': 'charlie@example.com',
                'first_name': 'Charlie',
                'last_name': 'Davis',
                'age': 27,
                'gender': 'M',
                'city': 'San Francisco',
                'store_branch': 'Downtown SF',
            },
        ]
        
        customers = []
        for data in customers_data:
            customer, created = Customer.objects.get_or_create(
                username=data['username'],
                defaults={
                    'email': data['email'],
                    'first_name': data['first_name'],
                    'last_name': data['last_name'],
                    'age': data['age'],
                    'gender': data['gender'],
                    'city': data['city'],
                    'store_branch': data['store_branch'],
                }
            )
            if created:
                customer.set_password('password123')
                customer.loyalty_card = f"LC{customer.id:06d}"
                customer.save()
            customers.append(customer)
        
        return customers

    def _create_preferences(self, customers, categories, brands):
        preferences_map = {
            'john_doe': [
                {'category': 'Fresh Produce', 'brand': 'FreshMart Organic'},
                {'category': 'Dairy & Eggs', 'brand': 'Pure Dairy'},
            ],
            'jane_smith': [
                {'category': 'Health & Beauty', 'brand': 'Healthy Choice'},
                {'category': 'Snacks', 'brand': 'Snack Time'},
            ],
            'bob_wilson': [
                {'category': 'Meat & Seafood', 'brand': 'Ocean Catch'},
                {'category': 'Beverages', 'brand': 'Daily Fresh'},
            ],
            'alice_brown': [
                {'category': 'Bakery', 'brand': 'Baker\'s Choice'},
                {'category': 'Frozen Foods', 'brand': 'Daily Fresh'},
            ],
            'charlie_davis': [
                {'category': 'Snacks', 'brand': 'Healthy Choice'},
                {'category': 'Beverages', 'brand': 'Healthy Choice'},
            ],
        }
        
        category_dict = {cat.name: cat for cat in categories}
        brand_dict = {brand.name: brand for brand in brands}
        
        for customer in customers:
            prefs = preferences_map.get(customer.username, [])
            for pref_data in prefs:
                CustomerPreference.objects.get_or_create(
                    customer=customer,
                    category=pref_data['category'],
                    defaults={
                        'brand': pref_data.get('brand', ''),
                        'preference_score': random.uniform(0.7, 1.0),
                    }
                )

    def _create_purchases(self, customers, products):
        for customer in customers:
            # Create 2-4 purchases per customer
            num_purchases = random.randint(2, 4)
            for _ in range(num_purchases):
                # Select random products
                purchase_products = random.sample(products, random.randint(2, 5))
                total = sum([p.price * random.randint(1, 3) for p in purchase_products])
                
                purchase = Purchase.objects.create(
                    customer=customer,
                    total_amount=total,
                    status='completed',
                    payment_method=random.choice(['credit_card', 'debit_card', 'cash']),
                    created_at=timezone.now() - timedelta(days=random.randint(1, 30))
                )
                
                for product in purchase_products:
                    quantity = random.randint(1, 3)
                    PurchaseItem.objects.create(
                        purchase=purchase,
                        product=product,
                        quantity=quantity,
                        price_at_purchase=product.price
                    )
                
                # Add loyalty points
                customer.loyalty_points += int(total)
            
            customer.save()

    def _create_reviews(self, customers, products):
        # Create reviews for random products
        for customer in customers:
            reviewed_products = random.sample(products, random.randint(2, 5))
            for product in reviewed_products:
                ProductReview.objects.get_or_create(
                    customer=customer,
                    product=product,
                    defaults={
                        'rating': random.randint(3, 5),
                        'comment': f"Great {product.name.lower()}! Would buy again.",
                    }
                )

    def _create_promotions(self, products, categories):
        promotions_data = [
            {
                'title': 'Fresh Produce Sale',
                'description': '20% off all fresh fruits and vegetables',
                'discount': 20,
                'category': 'Fresh Produce',
            },
            {
                'title': 'Dairy Week Special',
                'description': '15% off all dairy products',
                'discount': 15,
                'category': 'Dairy & Eggs',
            },
        ]
        
        category_dict = {cat.name: cat for cat in categories}
        
        for data in promotions_data:
            promotion, created = Promotion.objects.get_or_create(
                title=data['title'],
                defaults={
                    'description': data['description'],
                    'discount_percentage': data['discount'],
                    'start_date': timezone.now(),
                    'end_date': timezone.now() + timedelta(days=7),
                    'is_active': True,
                }
            )
            if created:
                promotion.categories.add(category_dict[data['category']])

        # Create Family Value Package (Bundle)
        family_promo, created = Promotion.objects.get_or_create(
            title='Mega Family Value Pack',
            defaults={
                'description': 'The ultimate weekly supply: Includes Milk, Bread, Eggs, and Fresh Produce. Perfect for families!',
                'discount_percentage': 25.00,
                'start_date': timezone.now(),
                'end_date': timezone.now() + timedelta(days=30),
                'is_active': True,
            }
        )
        if created:
            # Add multiple categories to this single promotion to create a "bundle" effect
            for cat_name in ['Dairy & Eggs', 'Bakery', 'Fresh Produce']:
                if cat_name in category_dict:
                    family_promo.categories.add(category_dict[cat_name])
