from django.urls import path
from .views import (
    CategoryListView, CategoryDetailView,
    BrandListView, BrandDetailView,
    ProductListView, ProductDetailView,
    ProductByQRCodeView, ProductReviewListCreateView,
    ProductReviewDetailView, PromotionListView,
    PromotionDetailView, FeaturedProductsView,
    AdminProductListView, AdminProductBulkUpdateView,
    CheckPurchaseView, FrequentlyBoughtTogetherView
)

app_name = 'products'

urlpatterns = [
    # Public routes (read-only for non-admin)
    # Categories
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('categories/<int:pk>/', CategoryDetailView.as_view(), name='category-detail'),
    
    # Brands
    path('brands/', BrandListView.as_view(), name='brand-list'),
    path('brands/<int:pk>/', BrandDetailView.as_view(), name='brand-detail'),
    
    # Products
    path('', ProductListView.as_view(), name='product-list'),
    path('<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
    path('featured/', FeaturedProductsView.as_view(), name='featured-products'),
    path('qr/<str:qr_code>/', ProductByQRCodeView.as_view(), name='product-by-qr'),
    
    # Reviews (read: public, write: authenticated)
    path('<int:product_id>/reviews/', ProductReviewListCreateView.as_view(), name='review-list'),
    path('reviews/<int:pk>/', ProductReviewDetailView.as_view(), name='review-detail'),
    
    # Check if user purchased product
    path('<int:product_id>/check-purchase/', CheckPurchaseView.as_view(), name='check-purchase'),
    
    # Frequently bought together
    path('<int:product_id>/frequently_bought_together/', FrequentlyBoughtTogetherView.as_view(), name='frequently-bought-together'),
    
    # Promotions
    path('promotions/', PromotionListView.as_view(), name='promotion-list'),
    path('promotions/<int:pk>/', PromotionDetailView.as_view(), name='promotion-detail'),
    
    # Admin routes
    path('admin/all/', AdminProductListView.as_view(), name='admin-product-list'),
    path('admin/bulk-update/', AdminProductBulkUpdateView.as_view(), name='admin-bulk-update'),
]
