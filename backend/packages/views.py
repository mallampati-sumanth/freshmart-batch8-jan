from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Package, PackageItem, CustomerPackageOrder
from .serializers import PackageSerializer, CustomerPackageOrderSerializer
from purchases.models import Cart, CartItem
from products.models import Product
from decimal import Decimal
import random


class PackageViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for FreshieBot packages
    """
    queryset = Package.objects.filter(is_active=True).prefetch_related('items__product')
    serializer_class = PackageSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by package type
        package_type = self.request.query_params.get('type', None)
        if package_type:
            queryset = queryset.filter(package_type=package_type)
        
        # Filter by people count
        people = self.request.query_params.get('people', None)
        if people:
            queryset = queryset.filter(people_count=people)
        
        # Filter by days
        days = self.request.query_params.get('days', None)
        if days:
            queryset = queryset.filter(days=days)
        
        return queryset
    
    @action(detail=True, methods=['post'])
    def add_to_cart(self, request, pk=None):
        """Add all items from a package to the user's cart"""
        package = self.get_object()
        customer = request.user
        
        # Get or create cart
        cart, created = Cart.objects.get_or_create(customer=customer)
        
        # Add all package items to cart
        added_items = []
        for package_item in package.items.all():
            cart_item, created = CartItem.objects.get_or_create(
                cart=cart,
                product=package_item.product,
                defaults={'quantity': package_item.quantity}
            )
            if not created:
                # If item already exists, increase quantity
                cart_item.quantity += package_item.quantity
                cart_item.save()
            
            added_items.append({
                'product': package_item.product.name,
                'quantity': package_item.quantity
            })
        
        # Track that this customer ordered this package
        CustomerPackageOrder.objects.create(
            customer=customer,
            package=package
        )
        
        return Response({
            'message': f'{package.name} added to cart successfully!',
            'items_added': len(added_items),
            'items': added_items
        }, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'])
    def recommendations(self, request):
        """Get package recommendations - uses existing packages OR generates dynamic ones"""
        people = request.query_params.get('people', None)
        days = request.query_params.get('days', None)
        budget = request.query_params.get('budget', None)
        
        try:
            # Parse inputs
            people_count = int(people) if people else 2
            days_count = int(days) if days else 7
            budget_amount = float(budget) if budget else None
            
            queryset = self.get_queryset()
            
            # Handle outliers - adjust search criteria
            search_people_min = max(1, people_count - 1)
            search_people_max = min(5, people_count + 1)
            search_days_min = max(1, days_count - 2)
            search_days_max = min(10, days_count + 2)
            
            # Try to find existing packages with flexible matching
            flexible_match = queryset.filter(
                people_count__gte=search_people_min,
                people_count__lte=search_people_max,
                days__gte=search_days_min,
                days__lte=search_days_max
            )
            
            # Apply budget filter if specified
            if budget_amount:
                # Very flexible budget matching
                budget_min = budget_amount * 0.6  # 40% below
                budget_max = budget_amount * 1.5  # 50% above
                budget_filtered = flexible_match.filter(
                    final_price__gte=budget_min,
                    final_price__lte=budget_max
                )
                
                if budget_filtered.exists():
                    filtered_results = list(budget_filtered[:6])
                    match_type = 'flexible'
                else:
                    # If no budget match, show closest prices
                    all_matches = list(flexible_match[:6])
                    if all_matches:
                        # Sort by closest to budget
                        filtered_results = sorted(all_matches, key=lambda x: abs(x.final_price - budget_amount))[:6]
                        match_type = 'adjusted'
                    else:
                        # Generate dynamic packages for outliers
                        filtered_results = self._generate_dynamic_packages(people_count, days_count, budget_amount)
                        match_type = 'dynamic'
            else:
                # No budget specified
                if flexible_match.exists():
                    filtered_results = list(flexible_match[:6])
                    match_type = 'flexible'
                else:
                    # Generate dynamic for outliers
                    filtered_results = self._generate_dynamic_packages(people_count, days_count, budget_amount)
                    match_type = 'dynamic'
            
            # Serialize results
            if filtered_results and isinstance(filtered_results[0], dict):
                serialized_data = filtered_results
            else:
                serializer = self.get_serializer(filtered_results, many=True)
                serialized_data = serializer.data
            
            return Response({
                'recommendations': serialized_data,
                'query': {
                    'people': people_count,
                    'days': days_count,
                    'budget': budget_amount
                },
                'match_type': match_type,
                'count': len(serialized_data)
            })
        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response({
                'recommendations': [],
                'query': {
                    'people': people,
                    'days': days,
                    'budget': budget
                },
                'match_type': 'error',
                'error': str(e),
                'count': 0
            })
    
    def _generate_dynamic_packages(self, people_count, days_count, budget_amount):
        """Generate dynamic packages based on user criteria"""
        
        try:
            # If no budget specified, use default ranges
            if not budget_amount:
                budget_ranges = [100, 150, 200, 250, 300]
            else:
                # Generate budgets around the specified amount
                budget_ranges = [
                    budget_amount * 0.7,
                    budget_amount * 0.85,
                    budget_amount,
                ]
            
            dynamic_packages = []
            
            # Get available products
            all_products = list(Product.objects.filter(is_active=True))
            
            if not all_products:
                return []
            
            # Define package types
            package_types = [
                {'name': 'Budget Smart', 'icon': '💰', 'focus': 'essentials'},
                {'name': 'Balanced Mix', 'icon': '⚖️', 'focus': 'balanced'},
                {'name': 'Premium Choice', 'icon': '⭐', 'focus': 'premium'},
            ]
            
            for idx, target_budget in enumerate(budget_ranges):
                pkg_type = package_types[idx] if idx < len(package_types) else package_types[0]
                
                # Calculate daily budget per person
                daily_per_person = target_budget / (people_count * days_count) if (people_count * days_count) > 0 else target_budget / 14
                
                # Select products to fit budget
                selected_products = []
                total_price = 0.0
                
                # Shuffle for variety
                shuffled_products = random.sample(all_products, min(len(all_products), 20))
                
                for product in shuffled_products:
                    # Calculate quantity based on people and days
                    if pkg_type['focus'] == 'essentials':
                        quantity = max(1, (people_count * days_count) // 7)
                    elif pkg_type['focus'] == 'premium':
                        quantity = max(2, (people_count * days_count) // 5)
                    else:
                        quantity = max(1, (people_count * days_count) // 6)
                    
                    item_cost = float(product.price) * quantity
                    
                    # Add if within budget
                    if total_price + item_cost <= target_budget * 1.05:
                        selected_products.append({
                            'id': product.id,
                            'name': product.name,
                            'price': float(product.price),
                            'quantity': quantity,
                            'image_url': product.image_url or ''
                        })
                        total_price += item_cost
                    
                    # Stop if we've filled the budget
                    if total_price >= target_budget * 0.85:
                        break
                
                if selected_products:
                    # Calculate savings (mock 10-15% discount)
                    original_price = total_price * 1.12
                    savings = original_price - total_price
                    
                    dynamic_packages.append({
                        'id': f'dynamic_{idx}_{people_count}_{days_count}',
                        'name': f'{pkg_type["name"]} Package',
                        'description': f'Custom package for {people_count} {"person" if people_count == 1 else "people"} for {days_count} days',
                        'icon': pkg_type['icon'],
                        'package_type': pkg_type['focus'],
                        'people_count': people_count,
                        'days': days_count,
                        'original_price': round(original_price, 2),
                        'final_price': round(total_price, 2),
                        'savings': round(savings, 2),
                        'items': selected_products,
                        'item_count': len(selected_products),
                        'is_active': True
                    })
            
            return dynamic_packages
        except Exception as e:
            # Log error and return empty list
            print(f"Error generating dynamic packages: {e}")
            import traceback
            traceback.print_exc()
            return []
    
    @action(detail=False, methods=['get'])
    def my_orders(self, request):
        """Get packages ordered by the current user"""
        customer = request.user
        orders = CustomerPackageOrder.objects.filter(customer=customer)
        serializer = CustomerPackageOrderSerializer(orders, many=True)
        return Response(serializer.data)
