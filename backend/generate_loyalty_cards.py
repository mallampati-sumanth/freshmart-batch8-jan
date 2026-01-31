"""
Generate loyalty card numbers for all existing customers
"""
import os
import django
import random
import string

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'freshmart_project.settings')
django.setup()

from accounts.models import Customer

def generate_loyalty_card():
    """Generate unique loyalty card number in format: FM-XXXX-XXXX"""
    while True:
        # Generate random 8-digit number split into two 4-digit groups
        part1 = ''.join(random.choices(string.digits, k=4))
        part2 = ''.join(random.choices(string.digits, k=4))
        card_number = f"FM-{part1}-{part2}"
        
        # Check if unique
        if not Customer.objects.filter(loyalty_card=card_number).exists():
            return card_number

def populate_loyalty_cards():
    """Generate loyalty cards for customers who don't have one"""
    print("=" * 60)
    print("Generating Loyalty Card Numbers")
    print("=" * 60)
    
    customers_without_card = Customer.objects.filter(loyalty_card__isnull=True) | Customer.objects.filter(loyalty_card='')
    total_count = customers_without_card.count()
    
    if total_count == 0:
        print("All customers already have loyalty cards!")
        return
    
    generated = 0
    
    for customer in customers_without_card:
        card_number = generate_loyalty_card()
        customer.loyalty_card = card_number
        customer.save()
        
        print(f"✓ {customer.username:20} → {card_number}")
        generated += 1
    
    print("=" * 60)
    print(f"✅ Generated {generated} loyalty card numbers!")
    print(f"📊 Total customers with cards: {Customer.objects.exclude(loyalty_card='').count()}")
    print("=" * 60)

if __name__ == "__main__":
    populate_loyalty_cards()
