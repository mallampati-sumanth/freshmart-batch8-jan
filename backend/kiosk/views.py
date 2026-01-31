from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.throttling import AnonRateThrottle
from django.utils import timezone
from datetime import timedelta
import uuid
import secrets
from .models import KioskSession, KioskInteraction, OTPVerification
from .serializers import KioskSessionSerializer, KioskInteractionSerializer
from .email_service import send_otp_email
from accounts.models import Customer
from products.models import Product
from products.serializers import ProductListSerializer
from recommendations.models import Recommendation
from recommendations.serializers import RecommendationSerializer


class KioskRateThrottle(AnonRateThrottle):
    """Rate limiting for kiosk access"""
    rate = '60/minute'


class RequestOTPView(APIView):
    """Request OTP for loyalty card kiosk login"""
    permission_classes = [permissions.AllowAny]
    throttle_classes = [KioskRateThrottle]
    
    def post(self, request):
        loyalty_card = request.data.get('loyalty_card', '').strip()
        
        if not loyalty_card:
            return Response({
                'success': False,
                'error': 'Loyalty card number is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Find customer by loyalty card
            customer = Customer.objects.get(loyalty_card=loyalty_card)
            
            # Invalidate old OTPs for this customer
            OTPVerification.objects.filter(
                customer=customer,
                is_used=False
            ).update(is_used=True)
            
            # Create new OTP
            otp = OTPVerification.objects.create(
                customer=customer,
                email=customer.email,
                phone=customer.phone
            )
            
            # Send OTP via email
            email_sent = send_otp_email(customer, otp.otp_code)
            
            if not email_sent:
                return Response({
                    'success': False,
                    'error': 'Failed to send OTP email. Please try again.'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            return Response({
                'success': True,
                'message': f'OTP sent to {customer.email[:3]}***@{customer.email.split("@")[1]}',
                'expires_in_minutes': 10,
                'customer_name': customer.first_name or customer.username
            })
            
        except Customer.DoesNotExist:
            return Response({
                'success': False,
                'error': 'Invalid loyalty card number'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'success': False,
                'error': f'An error occurred: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class VerifyOTPView(APIView):
    """Verify OTP and create kiosk session"""
    permission_classes = [permissions.AllowAny]
    throttle_classes = [KioskRateThrottle]
    
    def post(self, request):
        loyalty_card = request.data.get('loyalty_card', '').strip()
        otp_code = request.data.get('otp_code', '').strip()
        
        if not loyalty_card or not otp_code:
            return Response({
                'success': False,
                'error': 'Loyalty card and OTP code are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Find customer
            customer = Customer.objects.get(loyalty_card=loyalty_card)
            
            # Find most recent unused OTP
            otp = OTPVerification.objects.filter(
                customer=customer,
                otp_code=otp_code,
                is_used=False
            ).order_by('-created_at').first()
            
            if not otp:
                return Response({
                    'success': False,
                    'error': 'Invalid or expired OTP'
                }, status=status.HTTP_401_UNAUTHORIZED)
            
            # Check if OTP is valid
            if not otp.is_valid():
                otp.is_used = True
                otp.save()
                return Response({
                    'success': False,
                    'error': 'OTP has expired. Please request a new one.'
                }, status=status.HTTP_401_UNAUTHORIZED)
            
            # Mark OTP as used and verified
            otp.is_used = True
            otp.is_verified = True
            otp.save()
            
            # Create kiosk session
            session = KioskSession.objects.create(
                customer=customer,
                session_id=str(uuid.uuid4()),
                loyalty_card=loyalty_card,
                email=customer.email
            )
            
            return Response({
                'success': True,
                'message': 'Login successful',
                'session_id': session.session_id,
                'customer': {
                    'id': customer.id,
                    'username': customer.username,
                    'email': customer.email,
                    'loyalty_card': customer.loyalty_card,
                    'loyalty_points': customer.loyalty_points,
                    'cashback_balance': float(customer.cashback_balance)
                }
            })
            
        except Customer.DoesNotExist:
            return Response({
                'success': False,
                'error': 'Invalid loyalty card number'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'success': False,
                'error': f'An error occurred: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class HasValidKioskSession(permissions.BasePermission):
    """Check if request has a valid kiosk session"""
    def has_permission(self, request, view):
        session_id = view.kwargs.get('session_id')
        if not session_id:
            return False
        
        try:
            session = KioskSession.objects.get(
                session_id=session_id,
                ended_at__isnull=True  # Session still active
            )
            # Check session hasn't expired (max 30 minutes)
            if (timezone.now() - session.started_at) > timedelta(minutes=30):
                return False
            return True
        except KioskSession.DoesNotExist:
            return False


class KioskLoginView(APIView):
    """Kiosk login using loyalty card or email - Public with rate limiting"""
    permission_classes = [permissions.AllowAny]
    throttle_classes = [KioskRateThrottle]
    
    def post(self, request):
        loyalty_card = request.data.get('loyalty_card')
        email = request.data.get('email')
        
        if not loyalty_card and not email:
            return Response(
                {'success': False, 'error': 'Please provide loyalty card or email'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            if loyalty_card:
                customer = Customer.objects.get(loyalty_card=loyalty_card)
            else:
                customer = Customer.objects.get(email=email)
            
            # Create kiosk session with secure session ID
            session = KioskSession.objects.create(
                customer=customer,
                session_id=secrets.token_urlsafe(32),
                loyalty_card=loyalty_card or '',
                email=email or ''
            )
            
            return Response({
                'success': True,
                'message': 'Kiosk session started',
                'session': {
                    'session_id': session.session_id,
                    'expires_in': 1800  # 30 minutes
                },
                'customer': {
                    'id': customer.id,
                    'name': f"{customer.first_name} {customer.last_name}".strip() or customer.username,
                    'loyalty_points': customer.loyalty_points
                }
            })
        
        except Customer.DoesNotExist:
            return Response(
                {'success': False, 'error': 'Customer not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class KioskRecommendationsView(APIView):
    """Get recommendations for kiosk user - Valid session required"""
    permission_classes = [HasValidKioskSession]
    throttle_classes = [KioskRateThrottle]
    
    def get(self, request, session_id):
        try:
            session = KioskSession.objects.get(session_id=session_id)
            
            if not session.customer:
                return Response(
                    {'success': False, 'error': 'No customer associated with this session'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get recommendations
            recommendations = Recommendation.objects.filter(
                customer=session.customer,
                is_active=True,
                product__is_active=True,
                product__stock_quantity__gt=0
            ).select_related('product', 'product__category', 'product__brand')[:10]
            
            # Track interaction
            KioskInteraction.objects.create(
                session=session,
                interaction_type='recommendation_view'
            )
            
            return Response({
                'success': True,
                'recommendations': RecommendationSerializer(recommendations, many=True).data
            })
        
        except KioskSession.DoesNotExist:
            return Response(
                {'success': False, 'error': 'Session not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class KioskProductSearchView(APIView):
    """Search products from kiosk - Valid session required"""
    permission_classes = [HasValidKioskSession]
    throttle_classes = [KioskRateThrottle]
    
    def get(self, request, session_id):
        try:
            session = KioskSession.objects.get(session_id=session_id)
            search_query = request.query_params.get('q', '').strip()
            
            if not search_query or len(search_query) < 2:
                return Response(
                    {'success': False, 'error': 'Search query must be at least 2 characters'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Search products
            products = Product.objects.filter(
                name__icontains=search_query,
                is_active=True
            ) | Product.objects.filter(
                category__name__icontains=search_query,
                is_active=True
            ) | Product.objects.filter(
                brand__name__icontains=search_query,
                is_active=True
            )
            
            products = products.distinct()[:20]
            
            # Track interaction
            KioskInteraction.objects.create(
                session=session,
                interaction_type='product_search',
                search_query=search_query
            )
            
            return Response({
                'success': True,
                'products': ProductListSerializer(products, many=True).data
            })
        
        except KioskSession.DoesNotExist:
            return Response(
                {'success': False, 'error': 'Session not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class KioskProductDetailView(APIView):
    """Get product details from kiosk - Valid session required"""
    permission_classes = [HasValidKioskSession]
    throttle_classes = [KioskRateThrottle]
    
    def get(self, request, session_id, product_id):
        try:
            session = KioskSession.objects.get(session_id=session_id)
            product = Product.objects.get(id=product_id, is_active=True)
            
            # Track interaction
            KioskInteraction.objects.create(
                session=session,
                interaction_type='product_view',
                product_id=product_id
            )
            
            from products.serializers import ProductSerializer
            return Response({
                'success': True,
                'product': ProductSerializer(product).data
            })
        
        except KioskSession.DoesNotExist:
            return Response(
                {'success': False, 'error': 'Session not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Product.DoesNotExist:
            return Response(
                {'success': False, 'error': 'Product not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class KioskProductLocationView(APIView):
    """Get product location in store - Valid session required"""
    permission_classes = [HasValidKioskSession]
    throttle_classes = [KioskRateThrottle]
    
    def get(self, request, session_id, product_id):
        try:
            session = KioskSession.objects.get(session_id=session_id)
            product = Product.objects.get(id=product_id, is_active=True)
            
            # Track interaction
            KioskInteraction.objects.create(
                session=session,
                interaction_type='location_lookup',
                product_id=product_id
            )
            
            return Response({
                'success': True,
                'location': {
                    'product_name': product.name,
                    'aisle_location': product.aisle_location or 'Location not available',
                    'in_stock': product.in_stock,
                    'stock_quantity': product.stock_quantity
                }
            })
        
        except KioskSession.DoesNotExist:
            return Response(
                {'success': False, 'error': 'Session not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Product.DoesNotExist:
            return Response(
                {'success': False, 'error': 'Product not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class KioskLogoutView(APIView):
    """End kiosk session - Valid session required"""
    permission_classes = [permissions.AllowAny]
    throttle_classes = [KioskRateThrottle]
    
    def post(self, request, session_id):
        try:
            session = KioskSession.objects.get(session_id=session_id)
            
            if session.ended_at:
                return Response(
                    {'success': False, 'error': 'Session already ended'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            session.ended_at = timezone.now()
            
            # Calculate duration
            duration = session.ended_at - session.started_at
            session.duration_seconds = int(duration.total_seconds())
            session.save()
            
            return Response({
                'success': True,
                'message': 'Session ended successfully',
                'duration_seconds': session.duration_seconds
            })
        
        except KioskSession.DoesNotExist:
            return Response(
                {'success': False, 'error': 'Session not found'},
                status=status.HTTP_404_NOT_FOUND
            )


# Admin views
class AdminKioskSessionListView(generics.ListAPIView):
    """List all kiosk sessions - Admin only"""
    queryset = KioskSession.objects.all().order_by('-started_at')
    serializer_class = KioskSessionSerializer
    permission_classes = [permissions.IsAdminUser]


class AdminKioskStatsView(APIView):
    """Get kiosk usage statistics - Admin only"""
    permission_classes = [permissions.IsAdminUser]
    
    def get(self, request):
        from django.db.models import Count, Avg
        from datetime import timedelta
        
        today = timezone.now()
        last_30_days = today - timedelta(days=30)
        
        # Total sessions
        total_sessions = KioskSession.objects.count()
        completed_sessions = KioskSession.objects.filter(ended_at__isnull=False).count()
        
        # Recent sessions
        recent_sessions = KioskSession.objects.filter(
            started_at__gte=last_30_days
        ).count()
        
        # Average session duration
        avg_duration = KioskSession.objects.filter(
            duration_seconds__isnull=False
        ).aggregate(
            avg=Avg('duration_seconds')
        )
        
        # Interaction breakdown
        interactions = KioskInteraction.objects.values(
            'interaction_type'
        ).annotate(
            count=Count('id')
        )
        
        return Response({
            'success': True,
            'stats': {
                'total_sessions': total_sessions,
                'completed_sessions': completed_sessions,
                'sessions_last_30_days': recent_sessions,
                'avg_duration_seconds': float(avg_duration['avg'] or 0),
                'interaction_breakdown': list(interactions)
            }
        })
