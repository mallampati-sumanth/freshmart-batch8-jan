"""
Generate comprehensive packages for all combinations:
- People: 1 to 5
- Days: 1, 3, 5, 7, 10
- Budget ranges: $50-$250
"""

import os
import django
import random
from decimal import Decimal

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'freshmart_project.settings')
django.setup()

from packages.models import Package, PackageItem
from products.models import Product

def generate_comprehensive_packages():
    """Generate packages for all combinations"""
    
    # Clear existing packages
    print("Clearing existing packages...")
    Package.objects.all().delete()
    
    # Get all available products
    all_products = list(Product.objects.filter(is_active=True))
    if not all_products:
        print("ERROR: No products found!")
        return
    
    print(f"Found {len(all_products)} products")
    
    # Define combinations
    people_counts = [1, 2, 3, 4, 5]
    days_options = [1, 3, 5, 7, 10]
    
    # Package types with different strategies
    package_types = [
        {'name': 'Budget Smart', 'icon': '💰', 'focus': 'budget', 'multiplier': 0.8},
        {'name': 'Balanced', 'icon': '⚖️', 'focus': 'balanced', 'multiplier': 1.0},
        {'name': 'Premium', 'icon': '⭐', 'focus': 'premium', 'multiplier': 1.3},
        {'name': 'Healthy', 'icon': '🥗', 'focus': 'healthy', 'multiplier': 1.1},
        {'name': 'Family Feast', 'icon': '👨‍👩‍👧‍👦', 'focus': 'family', 'multiplier': 1.2},
    ]
    
    total_packages = 0
    
    # Generate packages for each combination
    for people in people_counts:
        for days in days_options:
            # Calculate base budget for this combination
            # Formula: base = (people * days * 10) - increased to support $60 minimum basket
            base_budget = people * days * 10
            
            # Generate 3-5 packages per combination with different price points
            for pkg_type in package_types[:3]:  # Use first 3 types per combination
                
                # Calculate target budget based on type
                target_budget = base_budget * pkg_type['multiplier']
                
                # Skip if target budget is too low or too high
                if target_budget < 30 or target_budget > 400:
                    continue
                
                # Select products to fit budget
                selected_items = []
                current_total = Decimal('0.00')
                
                # Shuffle products for variety
                shuffled = random.sample(all_products, min(len(all_products), 15))
                
                for product in shuffled:
                    # Calculate quantity based on people and days
                    if pkg_type['focus'] == 'budget':
                        # Budget: fewer items, essentials
                        qty = max(1, (people * days) // 8)
                    elif pkg_type['focus'] == 'premium':
                        # Premium: more items, variety
                        qty = max(1, (people * days) // 4)
                    else:
                        # Balanced/Healthy/Family: moderate quantities
                        qty = max(1, (people * days) // 6)
                    
                    item_cost = product.price * qty
                    
                    # Add if within budget (with 5% tolerance)
                    if current_total + item_cost <= Decimal(str(target_budget * 1.05)):
                        selected_items.append({
                            'product': product,
                            'quantity': qty,
                            'price': product.price
                        })
                        current_total += item_cost
                    
                    # Stop if we've reached 85% of target budget
                    if current_total >= Decimal(str(target_budget * 0.85)):
                        break
                
                # Only create package if we have at least 3 items
                if len(selected_items) >= 3:
                    # Calculate final pricing
                    final_price = float(current_total)
                    discount_pct = 12.0  # 12% discount
                    total_price = final_price / (1 - discount_pct/100)  # Original price before discount
                    
                    # Create package name
                    pkg_name = f"{pkg_type['name']} - {people}P {days}D"
                    
                    # Generate attractive marketing description
                    marketing_msgs = []
                    
                    # Budget-based messages (updated for $60 minimum)
                    if final_price < 60:
                        marketing_msgs.append("💰 Great value under $60!")
                    elif final_price < 100:
                        marketing_msgs.append("🌟 $60-100 perfect for healthy family meals!")
                    elif final_price < 150:
                        marketing_msgs.append("✨ $100-150 premium nutrition investment!")
                    else:
                        marketing_msgs.append("👑 Premium nutrition for your loved ones!")
                    
                    # Type-based messages
                    if pkg_type['focus'] == 'budget':
                        marketing_msgs.append("Save money without compromising quality!")
                    elif pkg_type['focus'] == 'balanced':
                        marketing_msgs.append("Perfect balance of nutrition & taste!")
                    elif pkg_type['focus'] == 'premium':
                        marketing_msgs.append("Premium ingredients for best results!")
                    elif pkg_type['focus'] == 'healthy':
                        marketing_msgs.append("Boost your immunity & energy naturally!")
                    elif pkg_type['focus'] == 'family':
                        marketing_msgs.append("Everything your family loves in one package!")
                    
                    # Duration-based messages
                    if days <= 3:
                        marketing_msgs.append("Quick starter pack!")
                    elif days <= 7:
                        marketing_msgs.append("Full week of delicious meals covered!")
                    else:
                        marketing_msgs.append("Complete grocery solution for the whole period!")
                    
                    # Create compelling description
                    description = f"Perfect for {people} {'person' if people == 1 else 'people'} for {days} {'day' if days == 1 else 'days'}. "
                    description += " ".join(marketing_msgs)
                    description += f" Includes {len(selected_items)} carefully selected items. Save ${round(total_price - final_price, 2)} with this package!"
                    
                    # Create package
                    package = Package.objects.create(
                        name=pkg_name,
                        description=description,
                        icon=pkg_type['icon'],
                        package_type=pkg_type['focus'],
                        people_count=people,
                        days=days,
                        total_price=Decimal(str(round(total_price, 2))),
                        discount_percentage=Decimal(str(discount_pct)),
                        final_price=Decimal(str(round(final_price, 2))),
                        is_active=True
                    )
                    
                    # Add items to package
                    for item in selected_items:
                        PackageItem.objects.create(
                            package=package,
                            product=item['product'],
                            quantity=item['quantity']
                        )
                    
                    total_packages += 1
                    print(f"✓ Created: {pkg_name} - ${final_price:.2f} ({len(selected_items)} items)")
    
    print(f"\n{'='*60}")
    print(f"✅ Successfully created {total_packages} packages!")
    print(f"{'='*60}")
    
    # Show distribution
    print("\nPackage Distribution:")
    for people in people_counts:
        for days in days_options:
            count = Package.objects.filter(people_count=people, days=days).count()
            if count > 0:
                print(f"  {people} people, {days} days: {count} packages")

if __name__ == '__main__':
    print("="*60)
    print("Generating Comprehensive Package Library")
    print("="*60)
    generate_comprehensive_packages()
    print("\n✨ All packages generated successfully!")
