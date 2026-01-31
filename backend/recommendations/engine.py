"""
Recommendation Engine for FreshMart
Generates personalized product recommendations based on:
- Customer preferences (categories/brands)
- Purchase history
- Product ratings
- Collaborative filtering (similar customers)
"""

from django.db.models import Count, Q, Avg
from collections import defaultdict
from .models import Recommendation
from products.models import Product
from purchases.models import Purchase, PurchaseItem
from accounts.models import CustomerPreference


class RecommendationEngine:
    """Main recommendation engine class"""
    
    def __init__(self, customer):
        self.customer = customer
        self.recommendations = []
    
    def generate_recommendations(self, limit=10):
        """Generate personalized recommendations for a customer"""
        scores = defaultdict(float)
        reasons = {}
        
        # 1. Preference-based recommendations
        preference_products = self._get_preference_based_products()
        for product, score in preference_products:
            scores[product.id] += score * 3.0  # High weight for preferences
            reasons[product.id] = f"Matches your interest in {product.category.name}"
        
        # 2. Purchase history-based recommendations
        history_products = self._get_purchase_history_based_products()
        for product, score in history_products:
            scores[product.id] += score * 2.0  # Medium weight
            if product.id not in reasons:
                reasons[product.id] = "Based on your purchase history"
        
        # 3. Popular products in preferred categories
        popular_products = self._get_popular_products()
        for product, score in popular_products:
            scores[product.id] += score * 1.5  # Lower weight
            if product.id not in reasons:
                reasons[product.id] = "Popular in your favorite categories"
        
        # 4. Collaborative filtering (similar customers)
        collaborative_products = self._get_collaborative_filtering_products()
        for product, score in collaborative_products:
            scores[product.id] += score * 1.0
            if product.id not in reasons:
                reasons[product.id] = "Customers like you also bought this"
        
        # 5. Featured products
        featured_products = self._get_featured_products()
        for product, score in featured_products:
            scores[product.id] += score * 0.5  # Lowest weight
            if product.id not in reasons:
                reasons[product.id] = "Featured product"
        
        # Sort by score and get top products
        sorted_products = sorted(scores.items(), key=lambda x: x[1], reverse=True)[:limit]
        
        # Create or update recommendations
        for product_id, score in sorted_products:
            try:
                product = Product.objects.get(id=product_id, is_active=True, stock_quantity__gt=0)
                recommendation, created = Recommendation.objects.update_or_create(
                    customer=self.customer,
                    product=product,
                    defaults={
                        'score': round(score, 2),
                        'reason': reasons.get(product_id, "Recommended for you"),
                        'is_active': True
                    }
                )
                self.recommendations.append(recommendation)
            except Product.DoesNotExist:
                continue
        
        return self.recommendations
    
    def _get_preference_based_products(self):
        """Get products matching customer preferences"""
        preferences = CustomerPreference.objects.filter(customer=self.customer)
        products = []
        
        for pref in preferences:
            query = Q(category__name=pref.category, is_active=True, stock_quantity__gt=0)
            if pref.brand:
                query &= Q(brand__name=pref.brand)
            
            prods = Product.objects.filter(query).exclude(
                purchase_items__purchase__customer=self.customer
            )[:5]
            
            for prod in prods:
                products.append((prod, pref.preference_score))
        
        return products
    
    def _get_purchase_history_based_products(self):
        """Get products related to purchase history"""
        # Get categories from past purchases
        purchased_items = PurchaseItem.objects.filter(
            purchase__customer=self.customer,
            purchase__status='completed'
        ).select_related('product__category', 'product__brand')
        
        categories = set()
        brands = set()
        
        for item in purchased_items:
            categories.add(item.product.category)
            if item.product.brand:
                brands.add(item.product.brand)
        
        # Find similar products not yet purchased
        products = []
        for category in categories:
            prods = Product.objects.filter(
                category=category,
                is_active=True,
                stock_quantity__gt=0
            ).exclude(
                purchase_items__purchase__customer=self.customer
            ).annotate(
                avg_rating=Avg('reviews__rating')
            ).order_by('-avg_rating')[:3]
            
            for prod in prods:
                score = 1.0
                if prod.brand in brands:
                    score += 0.5  # Bonus for matching brand
                products.append((prod, score))
        
        return products
    
    def _get_popular_products(self):
        """Get popular products in preferred categories"""
        preferences = CustomerPreference.objects.filter(customer=self.customer)
        preferred_categories = [pref.category for pref in preferences]
        
        products = Product.objects.filter(
            category__name__in=preferred_categories,
            is_active=True,
            stock_quantity__gt=0
        ).exclude(
            purchase_items__purchase__customer=self.customer
        ).annotate(
            purchase_count=Count('purchase_items'),
            avg_rating=Avg('reviews__rating')
        ).order_by('-purchase_count', '-avg_rating')[:5]
        
        return [(prod, 1.0) for prod in products]
    
    def _get_collaborative_filtering_products(self):
        """Find products bought by similar customers"""
        # Get customer's purchased products
        customer_products = set(
            PurchaseItem.objects.filter(
                purchase__customer=self.customer,
                purchase__status='completed'
            ).values_list('product_id', flat=True)
        )
        
        if not customer_products:
            return []
        
        # Find customers who bought similar products
        similar_customers = Purchase.objects.filter(
            items__product_id__in=customer_products,
            status='completed'
        ).exclude(
            customer=self.customer
        ).values('customer').annotate(
            common_products=Count('items__product')
        ).order_by('-common_products')[:5]
        
        similar_customer_ids = [c['customer'] for c in similar_customers]
        
        # Get products bought by similar customers
        products = Product.objects.filter(
            purchase_items__purchase__customer_id__in=similar_customer_ids,
            purchase_items__purchase__status='completed',
            is_active=True,
            stock_quantity__gt=0
        ).exclude(
            id__in=customer_products
        ).annotate(
            purchase_count=Count('purchase_items')
        ).order_by('-purchase_count')[:5]
        
        return [(prod, 1.0) for prod in products]
    
    def _get_featured_products(self):
        """Get featured products"""
        products = Product.objects.filter(
            featured=True,
            is_active=True,
            stock_quantity__gt=0
        ).exclude(
            purchase_items__purchase__customer=self.customer
        )[:3]
        
        return [(prod, 1.0) for prod in products]


def update_recommendations_for_customer(customer):
    """Utility function to update recommendations for a customer"""
    engine = RecommendationEngine(customer)
    return engine.generate_recommendations()


def update_all_recommendations():
    """Update recommendations for all customers (can be run as a cron job)"""
    from accounts.models import Customer
    
    customers = Customer.objects.filter(is_active=True)
    for customer in customers:
        try:
            update_recommendations_for_customer(customer)
        except Exception as e:
            print(f"Error updating recommendations for {customer.username}: {e}")
