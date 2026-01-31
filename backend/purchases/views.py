from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db import transaction
from .models import Purchase, PurchaseItem, Cart, CartItem
from .serializers import (
    PurchaseSerializer, CartSerializer, CartItemSerializer, CheckoutSerializer
)
from products.models import Product


class PurchaseListView(generics.ListAPIView):
    """List customer's purchase history - Authenticated users only"""
    serializer_class = PurchaseSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Purchase.objects.filter(customer=self.request.user).order_by('-created_at')


class PurchaseDetailView(generics.RetrieveAPIView):
    """Get details of a specific purchase - Owner only"""
    serializer_class = PurchaseSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Users can only view their own purchases
        return Purchase.objects.filter(customer=self.request.user)


class CartView(APIView):
    """Get or clear customer's cart - Authenticated users only"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        cart, created = Cart.objects.get_or_create(customer=request.user)
        serializer = CartSerializer(cart, context={'request': request})
        return Response({
            'success': True,
            'cart': serializer.data
        })
    
    def delete(self, request):
        """Clear cart"""
        try:
            cart = Cart.objects.get(customer=request.user)
            cart.items.all().delete()
            return Response({
                'success': True,
                'message': 'Cart cleared successfully'
            })
        except Cart.DoesNotExist:
            return Response(
                {'success': False, 'error': 'Cart not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class CartItemView(APIView):
    """Add, update, or remove items from cart - Authenticated users only"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        """Add item to cart"""
        cart, created = Cart.objects.get_or_create(customer=request.user)
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity', 1)
        
        if not product_id:
            return Response(
                {'success': False, 'error': 'Product ID is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            product = Product.objects.get(id=product_id, is_active=True)
            
            # Check stock
            if product.stock_quantity < quantity:
                return Response(
                    {'success': False, 'error': 'Insufficient stock'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Add or update cart item
            cart_item, created = CartItem.objects.get_or_create(
                cart=cart,
                product=product,
                defaults={'quantity': quantity}
            )
            
            if not created:
                cart_item.quantity += quantity
                if cart_item.quantity > product.stock_quantity:
                    return Response(
                        {'success': False, 'error': 'Insufficient stock'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                cart_item.save()
            
            return Response({
                'success': True,
                'message': 'Item added to cart',
                'item': CartItemSerializer(cart_item).data
            }, status=status.HTTP_201_CREATED)
        
        except Product.DoesNotExist:
            return Response(
                {'success': False, 'error': 'Product not found'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    def put(self, request, item_id):
        """Update cart item quantity"""
        try:
            cart = Cart.objects.get(customer=request.user)
            cart_item = CartItem.objects.get(id=item_id, cart=cart)
            quantity = request.data.get('quantity')
            
            if quantity is None:
                return Response(
                    {'success': False, 'error': 'Quantity is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if quantity <= 0:
                cart_item.delete()
                return Response({
                    'success': True,
                    'message': 'Item removed from cart'
                })
            
            if quantity > cart_item.product.stock_quantity:
                return Response(
                    {'success': False, 'error': 'Insufficient stock'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            cart_item.quantity = quantity
            cart_item.save()
            
            return Response({
                'success': True,
                'message': 'Cart item updated',
                'item': CartItemSerializer(cart_item).data
            })
        
        except (Cart.DoesNotExist, CartItem.DoesNotExist):
            return Response(
                {'success': False, 'error': 'Cart item not found'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    def delete(self, request, item_id):
        """Remove item from cart"""
        try:
            cart = Cart.objects.get(customer=request.user)
            cart_item = CartItem.objects.get(id=item_id, cart=cart)
            cart_item.delete()
            return Response({
                'success': True,
                'message': 'Item removed from cart'
            })
        except (Cart.DoesNotExist, CartItem.DoesNotExist):
            return Response(
                {'success': False, 'error': 'Cart item not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class CheckoutView(APIView):
    """Process checkout and create purchase - Authenticated users only"""
    permission_classes = [permissions.IsAuthenticated]
    
    @transaction.atomic
    def post(self, request):
        serializer = CheckoutSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        
        try:
            cart = Cart.objects.get(customer=request.user)
            cart_items = cart.items.all()
            
            if not cart_items:
                return Response(
                    {'success': False, 'error': 'Cart is empty'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Calculate total and check stock
            total_amount = 0
            for item in cart_items:
                if item.product.stock_quantity < item.quantity:
                    return Response(
                        {'success': False, 'error': f'Insufficient stock for {item.product.name}'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                total_amount += item.subtotal
            
            # Create purchase
            purchase = Purchase.objects.create(
                customer=request.user,
                total_amount=total_amount,
                payment_method=serializer.validated_data['payment_method'],
                status='completed'
            )
            
            # Create purchase items and update stock
            for item in cart_items:
                PurchaseItem.objects.create(
                    purchase=purchase,
                    product=item.product,
                    quantity=item.quantity,
                    price_at_purchase=item.product.price
                )
                
                # Update stock
                item.product.stock_quantity -= item.quantity
                item.product.save()
            
            # Award rewards for $60+ orders
            MINIMUM_BASKET = 60
            customer = request.user
            
            # Update loyalty points (2 points per dollar spent)
            points_earned = int(total_amount * 2)
            customer.loyalty_points += points_earned
            
            # Award cashback for orders $45+
            if total_amount >= MINIMUM_BASKET:
                cashback_earned = round(total_amount * 0.05, 2)  # 5% cashback
                customer.cashback_balance += cashback_earned
                customer.total_cashback_earned += cashback_earned
                customer.orders_over_minimum += 1
            
            customer.save()
            
            # Clear cart
            cart_items.delete()
            
            # Trigger recommendation update
            from recommendations.engine import update_recommendations_for_customer
            update_recommendations_for_customer(request.user)
            
            return Response({
                'success': True,
                'message': 'Purchase completed successfully',
                'purchase': PurchaseSerializer(purchase).data,
                'rewards': {
                    'points_earned': points_earned,
                    'cashback_earned': cashback_earned if total_amount >= MINIMUM_BASKET else 0,
                    'free_delivery': total_amount >= MINIMUM_BASKET,
                    'total_points': customer.loyalty_points,
                    'total_cashback': float(customer.cashback_balance)
                }
            }, status=status.HTTP_201_CREATED)
        
        except Cart.DoesNotExist:
            return Response(
                {'success': False, 'error': 'Cart not found'},
                status=status.HTTP_404_NOT_FOUND
            )


# Admin views for purchase management
class AdminPurchaseListView(generics.ListAPIView):
    """List all purchases - Admin only"""
    queryset = Purchase.objects.all().order_by('-created_at')
    serializer_class = PurchaseSerializer
    permission_classes = [permissions.IsAdminUser]


class AdminPurchaseDetailView(generics.RetrieveUpdateAPIView):
    """View and update purchase status - Admin only"""
    queryset = Purchase.objects.all()
    serializer_class = PurchaseSerializer
    permission_classes = [permissions.IsAdminUser]


class AdminPurchaseStatsView(APIView):
    """Get purchase statistics - Admin only"""
    permission_classes = [permissions.IsAdminUser]
    
    def get(self, request):
        from django.db.models import Sum, Count
        from django.db.models.functions import TruncDay, TruncMonth
        from django.utils import timezone
        from datetime import timedelta
        
        today = timezone.now().date()
        week_ago = today - timedelta(days=7)
        six_months_ago = today - timedelta(days=180)
        
        # 1. Total Stats
        stats = Purchase.objects.filter(status='completed').aggregate(
            total_revenue=Sum('total_amount'),
            total_orders=Count('id')
        )
        
        # 2. Revenue Trend & Daily Orders (Last 7 Days)
        daily_stats = Purchase.objects.filter(
            status='completed',
            created_at__date__gte=week_ago
        ).annotate(
            day=TruncDay('created_at')
        ).values('day').annotate(
            revenue=Sum('total_amount'),
            orders=Count('id')
        ).order_by('day')
        
        revenue_data = {
            'categories': [d['day'].strftime('%a') for d in daily_stats],
            'revenue': [float(d['revenue']) for d in daily_stats],
            'orders': [d['orders'] for d in daily_stats]
        }
        
        # 3. Sales by Category
        category_stats = PurchaseItem.objects.filter(
            purchase__status='completed',
            purchase__created_at__date__gte=six_months_ago
        ).values('product__category__name').annotate(
            count=Sum('quantity')
        ).order_by('-count')[:5]
        
        category_data = {
            'labels': [d['product__category__name'] for d in category_stats],
            'series': [d['count'] for d in category_stats]
        }
        
        # 4. Customer Growth (New Customers per Month - Last 6 Months)
        from accounts.models import Customer
        customer_growth = Customer.objects.filter(
            date_joined__date__gte=six_months_ago
        ).annotate(
            month=TruncMonth('date_joined')
        ).values('month').annotate(
            count=Count('id')
        ).order_by('month')
        
        growth_data = {
            'months': [d['month'].strftime('%b') for d in customer_growth],
            'counts': [d['count'] for d in customer_growth]
        }
        
        return Response({
            'success': True,
            'stats': {
                'total_revenue': float(stats['total_revenue'] or 0),
                'total_orders': stats['total_orders'] or 0,
                'revenue_trend': revenue_data,
                'category_distribution': category_data,
                'customer_growth': growth_data
            }
        })
