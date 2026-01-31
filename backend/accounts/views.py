from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.throttling import AnonRateThrottle
from django.contrib.auth import authenticate
from .models import Customer, CustomerPreference
from .serializers import (
    CustomerSerializer, CustomerRegistrationSerializer,
    CustomerUpdateSerializer, CustomerPreferenceSerializer
)


class LoginRateThrottle(AnonRateThrottle):
    """Rate limiting for login attempts"""
    rate = '5/minute'


class RegisterView(generics.CreateAPIView):
    """Customer registration endpoint - Public access"""
    queryset = Customer.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = CustomerRegistrationSerializer
    throttle_classes = [AnonRateThrottle]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
        if not serializer.is_valid():
            # Return validation errors in a clear format
            return Response({
                'success': False,
                'error': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        user = serializer.save()
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'success': True,
            'message': 'Registration successful',
            'user': CustomerSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    """Customer login endpoint - Public access with rate limiting"""
    permission_classes = [permissions.AllowAny]
    throttle_classes = [LoginRateThrottle]
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response(
                {'success': False, 'error': 'Please provide both username and password'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = authenticate(username=username, password=password)
        
        if not user:
            return Response(
                {'success': False, 'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        if not user.is_active:
            return Response(
                {'success': False, 'error': 'Account is disabled'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'success': True,
            'message': 'Login successful',
            'user': CustomerSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        })


class LogoutView(APIView):
    """Logout and blacklist the refresh token"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response({
                'success': True,
                'message': 'Logout successful'
            })
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(generics.RetrieveUpdateDestroyAPIView):
    """Get, update or delete customer profile - Authenticated users only"""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CustomerSerializer
    
    def get_object(self):
        return self.request.user
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        # Handle password change if 'password' is in data
        if 'password' in request.data:
            password = request.data.get('password')
            if password:
                instance.set_password(password)
                instance.save()
                # Remove password from data to prevent it being handled by serializer again if it's there
                if hasattr(request.data, '_mutable'):
                   mutable = request.data._mutable
                   request.data._mutable = True
                   request.data.pop('password', None)
                   request.data._mutable = mutable
                elif isinstance(request.data, dict):
                   request.data.pop('password', None)

        serializer = CustomerUpdateSerializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        # If password changed, update session auth hash? 
        # Actually with JWT we don't need to update session hash immediately for the current token to work,
        # but old tokens might remain valid until expiry.
        
        return Response({
            'success': True,
            'message': 'Profile updated successfully',
            'user': CustomerSerializer(instance).data
        })

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({
             'success': True,
             'message': 'Account deleted successfully'
        }, status=status.HTTP_200_OK)


class CustomerPreferenceListCreateView(generics.ListCreateAPIView):
    """List and create customer preferences - Authenticated users only"""
    serializer_class = CustomerPreferenceSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return CustomerPreference.objects.filter(customer=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)
    
    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        return Response({
            'success': True,
            'message': 'Preference added successfully',
            'preference': response.data
        }, status=status.HTTP_201_CREATED)


class CustomerPreferenceDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete a customer preference - Owner only"""
    serializer_class = CustomerPreferenceSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Users can only access their own preferences
        return CustomerPreference.objects.filter(customer=self.request.user)
    
    def destroy(self, request, *args, **kwargs):
        super().destroy(request, *args, **kwargs)
        return Response({
            'success': True,
            'message': 'Preference deleted successfully'
        })


class LoyaltyCardLookupView(APIView):
    """Look up customer by loyalty card (for kiosk) - Public for kiosk access"""
    permission_classes = [permissions.AllowAny]
    throttle_classes = [AnonRateThrottle]
    
    def post(self, request):
        loyalty_card = request.data.get('loyalty_card')
        email = request.data.get('email')
        
        try:
            if loyalty_card:
                customer = Customer.objects.get(loyalty_card=loyalty_card)
            elif email:
                customer = Customer.objects.get(email=email)
            else:
                return Response(
                    {'success': False, 'error': 'Please provide loyalty card or email'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Return limited info for kiosk lookup
            return Response({
                'success': True,
                'customer': {
                    'id': customer.id,
                    'first_name': customer.first_name,
                    'last_name': customer.last_name,
                    'loyalty_points': customer.loyalty_points,
                }
            })
        except Customer.DoesNotExist:
            return Response(
                {'success': False, 'error': 'Customer not found'},
                status=status.HTTP_404_NOT_FOUND
            )


# Admin Views
class AdminCustomerListView(generics.ListAPIView):
    """List all customers - Admin only"""
    queryset = Customer.objects.all().order_by('-created_at')
    serializer_class = CustomerSerializer
    permission_classes = [permissions.IsAdminUser]


class AdminCustomerDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Manage individual customer - Admin only"""
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [permissions.IsAdminUser]
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.is_superuser:
            return Response(
                {'success': False, 'error': 'Cannot delete superuser'},
                status=status.HTTP_403_FORBIDDEN
            )
        super().destroy(request, *args, **kwargs)
        return Response({
            'success': True,
            'message': 'Customer deleted successfully'
        })
