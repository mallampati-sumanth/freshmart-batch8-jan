from django.urls import path
from .views import (
    PurchaseListView, PurchaseDetailView,
    CartView, CartItemView, CheckoutView,
    AdminPurchaseListView, AdminPurchaseDetailView, AdminPurchaseStatsView
)

app_name = 'purchases'

urlpatterns = [
    # User routes (authenticated)
    path('', PurchaseListView.as_view(), name='purchase-list'),
    path('<int:pk>/', PurchaseDetailView.as_view(), name='purchase-detail'),
    
    # Cart routes (authenticated)
    path('cart/', CartView.as_view(), name='cart'),
    path('cart/items/', CartItemView.as_view(), name='cart-item-add'),
    path('cart/items/<int:item_id>/', CartItemView.as_view(), name='cart-item-detail'),
    
    # Checkout (authenticated)
    path('checkout/', CheckoutView.as_view(), name='checkout'),
    
    # Admin routes
    path('admin/all/', AdminPurchaseListView.as_view(), name='admin-purchase-list'),
    path('admin/<int:pk>/', AdminPurchaseDetailView.as_view(), name='admin-purchase-detail'),
    path('admin/stats/', AdminPurchaseStatsView.as_view(), name='admin-purchase-stats'),
]
