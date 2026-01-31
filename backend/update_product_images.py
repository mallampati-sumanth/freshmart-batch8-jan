"""
Add proper product images to all products
"""

import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'freshmart_project.settings')
django.setup()

from products.models import Product

# High-quality product image URLs from Unsplash/Pexels (royalty-free)
PRODUCT_IMAGES = {
    # Fruits & Vegetables
    'Apple': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500',
    'Banana': 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=500',
    'Orange': 'https://images.unsplash.com/photo-1547514701-42782101795e?w=500',
    'Tomato': 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500',
    'Potato': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500',
    'Onion': 'https://images.unsplash.com/photo-1587049332846-4a222e784963?w=500',
    'Carrot': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500',
    'Lettuce': 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=500',
    'Cucumber': 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=500',
    'Bell Pepper': 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=500',
    
    # Dairy & Eggs
    'Milk': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500',
    'Eggs': 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500',
    'Cheese': 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=500',
    'Butter': 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500',
    'Yogurt': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500',
    
    # Bakery
    'Bread': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500',
    'Wheat Bread': 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=500',
    'Baguette': 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=500',
    
    # Grains & Staples
    'Rice': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500',
    'Pasta': 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500',
    'Flour': 'https://images.unsplash.com/photo-1628964058881-93d61f30f9e4?w=500',
    'Sugar': 'https://images.unsplash.com/photo-1587934203787-48b1963e95e0?w=500',
    'Salt': 'https://images.unsplash.com/photo-1617870267350-1ba8edd1c080?w=500',
    
    # Beverages
    'Coffee': 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500',
    'Tea': 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=500',
    'Juice': 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500',
    'Water': 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=500',
    
    # Snacks
    'Chips': 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500',
    'Cookies': 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500',
    'Crackers': 'https://images.unsplash.com/photo-1601307842272-41c76af2c0ae?w=500',
}

# Fallback images for categories
CATEGORY_FALLBACK_IMAGES = {
    'Fruits': 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=500',
    'Vegetables': 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=500',
    'Dairy': 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=500',
    'Bakery': 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500',
    'Beverages': 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500',
    'Snacks': 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=500',
    'Meat': 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=500',
    'Seafood': 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=500',
}

# Default grocery image
DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500'

def update_product_images():
    """Update all products with proper images"""
    
    print("Updating product images...")
    print("=" * 60)
    
    products = Product.objects.all()
    updated_count = 0
    
    for product in products:
        # Try to match by product name
        image_url = None
        
        # Direct match
        if product.name in PRODUCT_IMAGES:
            image_url = PRODUCT_IMAGES[product.name]
        else:
            # Partial match
            for key, url in PRODUCT_IMAGES.items():
                if key.lower() in product.name.lower():
                    image_url = url
                    break
        
        # If no match, use category fallback
        if not image_url and product.category:
            category_name = product.category.name
            if category_name in CATEGORY_FALLBACK_IMAGES:
                image_url = CATEGORY_FALLBACK_IMAGES[category_name]
        
        # If still no match, use default
        if not image_url:
            image_url = DEFAULT_IMAGE
        
        # Update product
        if product.image_url != image_url:
            product.image_url = image_url
            product.save()
            print(f"✓ Updated: {product.name} → {image_url[:50]}...")
            updated_count += 1
        else:
            print(f"  Skipped: {product.name} (already has image)")
    
    print("=" * 60)
    print(f"✅ Updated {updated_count} products with new images!")
    print(f"📦 Total products: {products.count()}")

if __name__ == '__main__':
    update_product_images()
