from rest_framework import generics, filters, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q, Avg, Count
from .models import Category, Brand, Product, ProductReview, Promotion
from .serializers import (
    CategorySerializer, BrandSerializer, ProductSerializer,
    ProductListSerializer, ProductReviewSerializer, PromotionSerializer
)


class IsAdminOrReadOnly(permissions.BasePermission):
    """Allow read access to all, write access to admins only"""
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff


class CategoryListView(generics.ListCreateAPIView):
    """List all categories (public) or create a new one (admin only)"""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]


class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve (public), update, or delete (admin only) a category"""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]


class BrandListView(generics.ListCreateAPIView):
    """List all brands (public) or create a new one (admin only)"""
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    permission_classes = [IsAdminOrReadOnly]


class BrandDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve (public), update, or delete (admin only) a brand"""
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    permission_classes = [IsAdminOrReadOnly]


class ProductListView(generics.ListCreateAPIView):
    """List all products (public) with filtering and search, create (admin only)"""
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductListSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description', 'category__name', 'brand__name']
    ordering_fields = ['price', 'created_at', 'name']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ProductSerializer
        return ProductListSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by category (comma separated IDs)
        category = self.request.query_params.get('category')
        if category:
            categories = [c.strip() for c in category.split(',') if c.strip()]
            if categories:
                queryset = queryset.filter(category__id__in=categories)
        
        # Filter by brand (comma separated IDs)
        brand = self.request.query_params.get('brand')
        if brand:
            brands = [b.strip() for b in brand.split(',') if b.strip()]
            if brands:
                queryset = queryset.filter(brand__id__in=brands)
        
        # Filter by price range
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        
        # Filter by stock
        in_stock = self.request.query_params.get('in_stock')
        if in_stock == 'true':
            queryset = queryset.filter(stock_quantity__gt=0)
        
        # Filter featured
        featured = self.request.query_params.get('featured')
        if featured == 'true':
            queryset = queryset.filter(featured=True)
        
        return queryset
    
    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        return Response({
            'success': True,
            'message': 'Product created successfully',
            'product': response.data
        }, status=status.HTTP_201_CREATED)


class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve (public), update, or delete (admin only) a product"""
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminOrReadOnly]
    
    def destroy(self, request, *args, **kwargs):
        super().destroy(request, *args, **kwargs)
        return Response({
            'success': True,
            'message': 'Product deleted successfully'
        })


class ProductByQRCodeView(APIView):
    """Get product details by QR code scan - Public access"""
    permission_classes = [permissions.AllowAny]
    
    def get(self, request, qr_code):
        try:
            # Extract product info from QR code
            # Format: product_{id}_{name}
            parts = qr_code.split('_')
            if len(parts) >= 2 and parts[0] == 'product':
                product_id = parts[1]
                product = Product.objects.get(id=product_id, is_active=True)
                return Response({
                    'success': True,
                    'product': ProductSerializer(product).data
                })
            else:
                return Response(
                    {'success': False, 'error': 'Invalid QR code format'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except Product.DoesNotExist:
            return Response(
                {'success': False, 'error': 'Product not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'success': False, 'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class ProductReviewListCreateView(generics.ListCreateAPIView):
    """List reviews (public) or create a new review (authenticated users only)"""
    serializer_class = ProductReviewSerializer
    
    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]
    
    def get_queryset(self):
        product_id = self.kwargs.get('product_id')
        return ProductReview.objects.filter(product_id=product_id)
    
    def perform_create(self, serializer):
        product_id = self.kwargs.get('product_id')
        serializer.save(customer=self.request.user, product_id=product_id)
    
    def create(self, request, *args, **kwargs):
        product_id = self.kwargs.get('product_id')
        
        # Check if user already reviewed this product
        if ProductReview.objects.filter(customer=request.user, product_id=product_id).exists():
            return Response(
                {'success': False, 'error': 'You have already reviewed this product'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if user has purchased this product
        from purchases.models import PurchaseItem
        has_purchased = PurchaseItem.objects.filter(
            purchase__customer=request.user,
            purchase__status='completed',
            product_id=product_id
        ).exists()
        
        if not has_purchased:
            return Response(
                {'success': False, 'error': 'You can only review products you have purchased'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        response = super().create(request, *args, **kwargs)
        return Response({
            'success': True,
            'message': 'Review added successfully',
            'review': response.data
        }, status=status.HTTP_201_CREATED)


class ProductReviewDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete a product review - Owner or admin only"""
    serializer_class = ProductReviewSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return ProductReview.objects.all()
        return ProductReview.objects.filter(customer=self.request.user)


class PromotionListView(generics.ListCreateAPIView):
    """List active promotions (public) or create (admin only)"""
    serializer_class = PromotionSerializer
    permission_classes = [IsAdminOrReadOnly]
    
    def get_queryset(self):
        from django.utils import timezone
        if self.request.user.is_staff:
            return Promotion.objects.all()
        return Promotion.objects.filter(
            is_active=True,
            start_date__lte=timezone.now(),
            end_date__gte=timezone.now()
        )


class PromotionDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve (public), update, or delete (admin only) a promotion"""
    queryset = Promotion.objects.all()
    serializer_class = PromotionSerializer
    permission_classes = [IsAdminOrReadOnly]


class FeaturedProductsView(generics.ListAPIView):
    """Get featured products - Public access"""
    queryset = Product.objects.filter(is_active=True, featured=True)
    serializer_class = ProductListSerializer
    permission_classes = [permissions.AllowAny]


# Admin-only views for product management
class AdminProductListView(generics.ListAPIView):
    """List all products including inactive ones - Admin only"""
    queryset = Product.objects.all().order_by('-created_at')
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAdminUser]


class AdminProductBulkUpdateView(APIView):
    """Bulk update products (stock, price, status) - Admin only"""
    permission_classes = [permissions.IsAdminUser]
    
    def patch(self, request):
        updates = request.data.get('updates', [])
        updated_count = 0
        
        for update in updates:
            product_id = update.get('id')
            try:
                product = Product.objects.get(id=product_id)
                if 'stock_quantity' in update:
                    product.stock_quantity = update['stock_quantity']
                if 'price' in update:
                    product.price = update['price']
                if 'is_active' in update:
                    product.is_active = update['is_active']
                if 'featured' in update:
                    product.featured = update['featured']
                product.save()
                updated_count += 1
            except Product.DoesNotExist:
                continue
        
        return Response({
            'success': True,
            'message': f'{updated_count} products updated successfully'
        })


class CheckPurchaseView(APIView):
    """Check if user has purchased a product - Authenticated users only"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, product_id):
        from purchases.models import PurchaseItem
        has_purchased = PurchaseItem.objects.filter(
            purchase__customer=request.user,
            purchase__status='completed',
            product_id=product_id
        ).exists()
        
        return Response({
            'success': True,
            'has_purchased': has_purchased
        })


class FrequentlyBoughtTogetherView(APIView):
    """Get products frequently bought together with a given product"""
    permission_classes = [permissions.AllowAny]
    
    def get(self, request, product_id):
        from purchases.models import Purchase, PurchaseItem
        from django.db.models import Count
        import random
        
        try:
            current_product = Product.objects.get(id=product_id)
            
            # Find all purchases that include this product
            purchases_with_product = Purchase.objects.filter(
                items__product_id=product_id,
                status='completed'
            ).values_list('id', flat=True)
            
            # Find other products bought in those same purchases
            related_products = PurchaseItem.objects.filter(
                purchase_id__in=purchases_with_product
            ).exclude(
                product_id=product_id
            ).values('product_id').annotate(
                count=Count('product_id')
            ).order_by('-count')[:6]
            
            # Get the actual product objects
            product_ids = [item['product_id'] for item in related_products]
            products = Product.objects.filter(
                id__in=product_ids,
                is_active=True,
                stock_quantity__gt=0
            )
            
            # FALLBACK: If no purchase history, show smart recommendations
            if not products.exists():
                # Strategy 1: Same category products
                same_category = Product.objects.filter(
                    category=current_product.category,
                    is_active=True,
                    stock_quantity__gt=0
                ).exclude(id=product_id)[:4]
                
                # Strategy 2: Similar price range (±30%)
                min_price = current_product.price * 0.7
                max_price = current_product.price * 1.3
                similar_price = Product.objects.filter(
                    price__gte=min_price,
                    price__lte=max_price,
                    is_active=True,
                    stock_quantity__gt=0
                ).exclude(id=product_id)[:3]
                
                # Strategy 3: High-rated products from same brand
                same_brand = Product.objects.filter(
                    brand=current_product.brand,
                    is_active=True,
                    stock_quantity__gt=0
                ).exclude(id=product_id).order_by('-average_rating')[:3]
                
                # Combine and deduplicate
                all_recommendations = list(same_category) + list(similar_price) + list(same_brand)
                seen_ids = set()
                products = []
                for p in all_recommendations:
                    if p.id not in seen_ids:
                        products.append(p)
                        seen_ids.add(p.id)
                        if len(products) >= 6:
                            break
                
                # If still no recommendations, just get random popular products
                if len(products) < 6:
                    additional = Product.objects.filter(
                        is_active=True,
                        stock_quantity__gt=0
                    ).exclude(id=product_id).exclude(id__in=seen_ids).order_by('-average_rating')[:6-len(products)]
                    products.extend(list(additional))
            
            return Response({
                'success': True,
                'products': ProductListSerializer(products, many=True).data,
                'count': len(products)
            })
        except Product.DoesNotExist:
            return Response({
                'success': False,
                'error': 'Product not found',
                'products': []
            })
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e),
                'products': []
            })
