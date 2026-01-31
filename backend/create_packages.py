"""
Create demo packages for FreshieBot
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'freshmart_project.settings')
django.setup()

from packages.models import Package, PackageItem
from products.models import Product, Category

def create_demo_packages():
    print("Creating FreshieBot Demo Packages...")
    
    # Get products
    products = {p.name: p for p in Product.objects.all()}
    
    if not products:
        print("ERROR: No products found! Please run populate_demo_data.py first.")
        return
    
    # Family Package (4 people, 7 days)
    family_pkg = Package.objects.create(
        name="Family Essentials Package",
        package_type="family",
        description="Complete grocery package for a family of 4 for one week. Includes fresh produce, dairy, proteins, and pantry essentials.",
        people_count=4,
        days=7,
        total_price=299.99,
        discount_percentage=15,
        icon="👨‍👩‍👧‍👦",
        is_active=True
    )
    
    # Add items to family package
    family_items = [
        ("Organic Bananas", 4),
        ("Red Apples", 3),
        ("Greek Yogurt", 4),
        ("Artisan Bread", 2),
        ("Fresh Salmon", 2),
        ("Whole Milk", 3),
        ("Cheddar Cheese", 2),
        ("Fresh Chicken Breast", 2),
    ]
    
    for item_name, qty in family_items:
        if item_name in products:
            PackageItem.objects.create(
                package=family_pkg,
                product=products[item_name],
                quantity=qty
            )
    
    print(f"✅ Created: {family_pkg.name}")
    
    # Solo Package (1 person, 7 days)
    solo_pkg = Package.objects.create(
        name="Solo Living Essentials",
        package_type="solo",
        description="Perfect for one person living alone. Balanced nutrition with fresh ingredients for a full week.",
        people_count=1,
        days=7,
        total_price=89.99,
        discount_percentage=10,
        icon="👤",
        is_active=True
    )
    
    solo_items = [
        ("Organic Bananas", 1),
        ("Red Apples", 1),
        ("Greek Yogurt", 2),
        ("Artisan Bread", 1),
        ("Fresh Salmon", 1),
        ("Whole Milk", 1),
    ]
    
    for item_name, qty in solo_items:
        if item_name in products:
            PackageItem.objects.create(
                package=solo_pkg,
                product=products[item_name],
                quantity=qty
            )
    
    print(f"✅ Created: {solo_pkg.name}")
    
    # Duo Package (2 people, 7 days)
    duo_pkg = Package.objects.create(
        name="Duo Delight Package",
        package_type="duo",
        description="Ideal for couples or roommates. Fresh ingredients and essentials for two people for one week.",
        people_count=2,
        days=7,
        total_price=149.99,
        discount_percentage=12,
        icon="👫",
        is_active=True
    )
    
    duo_items = [
        ("Organic Bananas", 2),
        ("Red Apples", 2),
        ("Greek Yogurt", 3),
        ("Artisan Bread", 1),
        ("Fresh Salmon", 1),
        ("Whole Milk", 2),
        ("Cheddar Cheese", 1),
        ("Fresh Chicken Breast", 1),
    ]
    
    for item_name, qty in duo_items:
        if item_name in products:
            PackageItem.objects.create(
                package=duo_pkg,
                product=products[item_name],
                quantity=qty
            )
    
    print(f"✅ Created: {duo_pkg.name}")
    
    # Healthy Living Package
    healthy_pkg = Package.objects.create(
        name="Healthy Living Package",
        package_type="healthy",
        description="Organic and nutritious selections for health-conscious individuals. High protein, low processed foods.",
        people_count=2,
        days=7,
        total_price=179.99,
        discount_percentage=10,
        icon="🥗",
        is_active=True
    )
    
    healthy_items = [
        ("Organic Bananas", 2),
        ("Red Apples", 2),
        ("Greek Yogurt", 4),
        ("Fresh Salmon", 2),
        ("Fresh Chicken Breast", 2),
    ]
    
    for item_name, qty in healthy_items:
        if item_name in products:
            PackageItem.objects.create(
                package=healthy_pkg,
                product=products[item_name],
                quantity=qty
            )
    
    print(f"✅ Created: {healthy_pkg.name}")
    
    # Budget Package
    budget_pkg = Package.objects.create(
        name="Budget Friendly Package",
        package_type="budget",
        description="Affordable essentials without compromising quality. Perfect for students and budget-conscious shoppers.",
        people_count=2,
        days=7,
        total_price=99.99,
        discount_percentage=20,
        icon="💰",
        is_active=True
    )
    
    budget_items = [
        ("Organic Bananas", 2),
        ("Red Apples", 2),
        ("Artisan Bread", 2),
        ("Whole Milk", 2),
        ("Cheddar Cheese", 1),
    ]
    
    for item_name, qty in budget_items:
        if item_name in products:
            PackageItem.objects.create(
                package=budget_pkg,
                product=products[item_name],
                quantity=qty
            )
    
    print(f"✅ Created: {budget_pkg.name}")
    
    # Premium Package
    premium_pkg = Package.objects.create(
        name="Premium Gourmet Package",
        package_type="premium",
        description="Finest selection of premium organic products. For those who appreciate quality and taste.",
        people_count=2,
        days=7,
        total_price=349.99,
        discount_percentage=5,
        icon="⭐",
        is_active=True
    )
    
    premium_items = [
        ("Fresh Salmon", 3),
        ("Fresh Chicken Breast", 2),
        ("Greek Yogurt", 4),
        ("Cheddar Cheese", 3),
        ("Red Apples", 3),
        ("Organic Bananas", 2),
    ]
    
    for item_name, qty in premium_items:
        if item_name in products:
            PackageItem.objects.create(
                package=premium_pkg,
                product=products[item_name],
                quantity=qty
            )
    
    print(f"✅ Created: {premium_pkg.name}")
    
    print(f"\n🎉 Successfully created {Package.objects.count()} packages!")
    print(f"📦 Total package items: {PackageItem.objects.count()}")

if __name__ == '__main__':
    create_demo_packages()
