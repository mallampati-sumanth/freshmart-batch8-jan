from django.urls import path
from .views import (
    RequestOTPView, VerifyOTPView,
    KioskLoginView, KioskRecommendationsView,
    KioskProductSearchView, KioskProductDetailView,
    KioskProductLocationView, KioskLogoutView,
    AdminKioskSessionListView, AdminKioskStatsView
)

app_name = 'kiosk'

urlpatterns = [
    # OTP Authentication routes
    path('request-otp/', RequestOTPView.as_view(), name='request-otp'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
    
    # Kiosk public routes (rate limited)
    path('login/', KioskLoginView.as_view(), name='kiosk-login'),
    
    # Kiosk session routes (valid session required)
    path('<str:session_id>/recommendations/', KioskRecommendationsView.as_view(), name='recommendations'),
    path('<str:session_id>/search/', KioskProductSearchView.as_view(), name='product-search'),
    path('<str:session_id>/products/<int:product_id>/', KioskProductDetailView.as_view(), name='product-detail'),
    path('<str:session_id>/products/<int:product_id>/location/', KioskProductLocationView.as_view(), name='product-location'),
    path('<str:session_id>/logout/', KioskLogoutView.as_view(), name='kiosk-logout'),
    
    # Admin routes
    path('admin/sessions/', AdminKioskSessionListView.as_view(), name='admin-session-list'),
    path('admin/stats/', AdminKioskStatsView.as_view(), name='admin-stats'),
]
