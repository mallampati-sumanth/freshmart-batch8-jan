"""
Populate products with nutrition, eco-rating, and market comparison data
"""
import os
import django
from decimal import Decimal

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'freshmart_project.settings')
django.setup()

from products.models import Product

# Nutrition & Eco data for different product categories
PRODUCT_DATA = {
    # Fruits & Vegetables
    "Organic Bananas": {
        "calories": 89, "protein": Decimal("1.1"), "carbs": Decimal("22.8"), 
        "fat": Decimal("0.3"), "fiber": Decimal("2.6"),
        "eco_score": 85, "carbon_footprint": Decimal("0.7"), "market_avg_price": Decimal("3.49")
    },
    "Red Apples": {
        "calories": 52, "protein": Decimal("0.3"), "carbs": Decimal("14.0"),
        "fat": Decimal("0.2"), "fiber": Decimal("2.4"),
        "eco_score": 80, "carbon_footprint": Decimal("0.4"), "market_avg_price": Decimal("4.29")
    },
    "Baby Spinach": {
        "calories": 23, "protein": Decimal("2.9"), "carbs": Decimal("3.6"),
        "fat": Decimal("0.4"), "fiber": Decimal("2.2"),
        "eco_score": 90, "carbon_footprint": Decimal("0.5"), "market_avg_price": Decimal("3.79")
    },
    "Organic Carrots": {
        "calories": 41, "protein": Decimal("0.9"), "carbs": Decimal("9.6"),
        "fat": Decimal("0.2"), "fiber": Decimal("2.8"),
        "eco_score": 88, "carbon_footprint": Decimal("0.3"), "market_avg_price": Decimal("2.79")
    },
    
    # Dairy Products
    "Whole Milk": {
        "calories": 61, "protein": Decimal("3.2"), "carbs": Decimal("4.8"),
        "fat": Decimal("3.3"), "fiber": Decimal("0.0"),
        "eco_score": 45, "carbon_footprint": Decimal("1.9"), "market_avg_price": Decimal("4.79")
    },
    "Greek Yogurt": {
        "calories": 59, "protein": Decimal("10.0"), "carbs": Decimal("3.6"),
        "fat": Decimal("0.4"), "fiber": Decimal("0.0"),
        "eco_score": 50, "carbon_footprint": Decimal("1.5"), "market_avg_price": Decimal("5.79")
    },
    "Cheddar Cheese": {
        "calories": 403, "protein": Decimal("25.0"), "carbs": Decimal("1.3"),
        "fat": Decimal("33.0"), "fiber": Decimal("0.0"),
        "eco_score": 35, "carbon_footprint": Decimal("13.5"), "market_avg_price": Decimal("6.99")
    },
    "Free Range Eggs": {
        "calories": 155, "protein": Decimal("13.0"), "carbs": Decimal("1.1"),
        "fat": Decimal("11.0"), "fiber": Decimal("0.0"),
        "eco_score": 65, "carbon_footprint": Decimal("4.8"), "market_avg_price": Decimal("5.49")
    },
    
    # Meat & Seafood
    "Chicken Breast": {
        "calories": 165, "protein": Decimal("31.0"), "carbs": Decimal("0.0"),
        "fat": Decimal("3.6"), "fiber": Decimal("0.0"),
        "eco_score": 55, "carbon_footprint": Decimal("6.9"), "market_avg_price": Decimal("8.49")
    },
    "Fresh Salmon": {
        "calories": 208, "protein": Decimal("20.0"), "carbs": Decimal("0.0"),
        "fat": Decimal("13.0"), "fiber": Decimal("0.0"),
        "eco_score": 60, "carbon_footprint": Decimal("11.9"), "market_avg_price": Decimal("13.99")
    },
    
    # Bakery
    "Artisan Bread": {
        "calories": 265, "protein": Decimal("9.0"), "carbs": Decimal("49.0"),
        "fat": Decimal("3.2"), "fiber": Decimal("2.7"),
        "eco_score": 70, "carbon_footprint": Decimal("0.9"), "market_avg_price": Decimal("4.79")
    },
    "Croissants": {
        "calories": 406, "protein": Decimal("8.2"), "carbs": Decimal("46.0"),
        "fat": Decimal("21.0"), "fiber": Decimal("2.6"),
        "eco_score": 50, "carbon_footprint": Decimal("1.2"), "market_avg_price": Decimal("5.29")
    },
    
    # Beverages
    "Orange Juice": {
        "calories": 45, "protein": Decimal("0.7"), "carbs": Decimal("10.4"),
        "fat": Decimal("0.2"), "fiber": Decimal("0.2"),
        "eco_score": 65, "carbon_footprint": Decimal("0.9"), "market_avg_price": Decimal("4.79")
    },
    "Sparkling Water": {
        "calories": 0, "protein": Decimal("0.0"), "carbs": Decimal("0.0"),
        "fat": Decimal("0.0"), "fiber": Decimal("0.0"),
        "eco_score": 75, "carbon_footprint": Decimal("0.3"), "market_avg_price": Decimal("3.79")
    },
    
    # Snacks
    "Organic Chips": {
        "calories": 536, "protein": Decimal("6.6"), "carbs": Decimal("52.0"),
        "fat": Decimal("34.0"), "fiber": Decimal("4.8"),
        "eco_score": 60, "carbon_footprint": Decimal("1.5"), "market_avg_price": Decimal("4.79")
    },
    "Trail Mix": {
        "calories": 462, "protein": Decimal("13.0"), "carbs": Decimal("45.0"),
        "fat": Decimal("29.0"), "fiber": Decimal("6.0"),
        "eco_score": 70, "carbon_footprint": Decimal("2.1"), "market_avg_price": Decimal("6.99")
    },
}

def populate_product_data():
    """Populate products with nutrition and eco data"""
    print("=" * 60)
    print("Populating Product Nutrition & Eco Data")
    print("=" * 60)
    
    updated_count = 0
    total_products = Product.objects.count()
    
    for product in Product.objects.all():
        if product.name in PRODUCT_DATA:
            data = PRODUCT_DATA[product.name]
            
            # Update nutrition
            product.calories = data["calories"]
            product.protein = data["protein"]
            product.carbs = data["carbs"]
            product.fat = data["fat"]
            product.fiber = data["fiber"]
            
            # Update eco & market data
            product.eco_score = data["eco_score"]
            product.carbon_footprint = data["carbon_footprint"]
            product.market_avg_price = data["market_avg_price"]
            
            product.save()
            
            savings = float(data["market_avg_price"]) - float(product.price)
            savings_pct = (savings / float(data["market_avg_price"])) * 100
            
            print(f"✓ Updated: {product.name}")
            print(f"  Nutrition: {data['calories']} cal, {data['protein']}g protein")
            print(f"  Eco Score: {data['eco_score']}/100, CO2: {data['carbon_footprint']}kg")
            print(f"  Savings: ${savings:.2f} ({savings_pct:.1f}% off market price)")
            print()
            
            updated_count += 1
    
    print("=" * 60)
    print(f"✅ Updated {updated_count}/{total_products} products!")
    print("=" * 60)

if __name__ == "__main__":
    populate_product_data()
