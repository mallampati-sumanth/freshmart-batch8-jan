from django.urls import path
from .views import (
    RegisterView, LoginView, LogoutView, ProfileView,
    CustomerPreferenceListCreateView, CustomerPreferenceDetailView,
    LoyaltyCardLookupView, AdminCustomerListView, AdminCustomerDetailView
)

app_name = 'accounts'

urlpatterns = [
    # Public routes
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    
    # Authenticated user routes
    path('logout/', LogoutView.as_view(), name='logout'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('preferences/', CustomerPreferenceListCreateView.as_view(), name='preference-list'),
    path('preferences/<int:pk>/', CustomerPreferenceDetailView.as_view(), name='preference-detail'),
    
    # Kiosk route (public with rate limiting)
    path('loyalty-lookup/', LoyaltyCardLookupView.as_view(), name='loyalty-lookup'),
    
    # Admin routes
    path('admin/customers/', AdminCustomerListView.as_view(), name='admin-customer-list'),
    path('admin/customers/<int:pk>/', AdminCustomerDetailView.as_view(), name='admin-customer-detail'),
]
