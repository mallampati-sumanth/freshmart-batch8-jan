from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Recommendation, RecommendationClick
from .serializers import RecommendationSerializer, RecommendationClickSerializer
from .engine import update_recommendations_for_customer


class RecommendationListView(generics.ListAPIView):
    """Get personalized recommendations - Authenticated users only"""
    serializer_class = RecommendationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Recommendation.objects.filter(
            customer=self.request.user,
            is_active=True,
            product__is_active=True,
            product__stock_quantity__gt=0
        ).select_related('product', 'product__category', 'product__brand')[:10]
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        
        # If no recommendations exist, generate them
        if not queryset.exists():
            update_recommendations_for_customer(request.user)
            queryset = self.get_queryset()
        
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'success': True,
            'recommendations': serializer.data
        })


class RefreshRecommendationsView(APIView):
    """Manually refresh recommendations - Authenticated users only"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            recommendations = update_recommendations_for_customer(request.user)
            serializer = RecommendationSerializer(recommendations, many=True)
            return Response({
                'success': True,
                'message': 'Recommendations updated successfully',
                'recommendations': serializer.data
            })
        except Exception as e:
            return Response(
                {'success': False, 'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class TrackRecommendationClickView(APIView):
    """Track when a user clicks on a recommendation - Authenticated users only"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, recommendation_id):
        try:
            recommendation = Recommendation.objects.get(
                id=recommendation_id,
                customer=request.user
            )
            
            click = RecommendationClick.objects.create(recommendation=recommendation)
            
            return Response({
                'success': True,
                'message': 'Click tracked',
                'click': RecommendationClickSerializer(click).data
            }, status=status.HTTP_201_CREATED)
        except Recommendation.DoesNotExist:
            return Response(
                {'success': False, 'error': 'Recommendation not found'},
                status=status.HTTP_404_NOT_FOUND
            )


# Admin views
class AdminRecommendationStatsView(APIView):
    """Get recommendation analytics - Admin only"""
    permission_classes = [permissions.IsAdminUser]
    
    def get(self, request):
        from django.db.models import Count, Avg
        from django.utils import timezone
        from datetime import timedelta
        
        today = timezone.now()
        last_30_days = today - timedelta(days=30)
        
        # Total recommendations
        total_recommendations = Recommendation.objects.filter(is_active=True).count()
        
        # Total clicks
        total_clicks = RecommendationClick.objects.count()
        recent_clicks = RecommendationClick.objects.filter(
            clicked_at__gte=last_30_days
        ).count()
        
        # Top clicked products
        top_products = RecommendationClick.objects.values(
            'recommendation__product__name'
        ).annotate(
            click_count=Count('id')
        ).order_by('-click_count')[:10]
        
        # Average recommendations per user
        from accounts.models import Customer
        avg_per_user = Recommendation.objects.filter(is_active=True).values(
            'customer'
        ).annotate(
            count=Count('id')
        ).aggregate(
            avg=Avg('count')
        )
        
        return Response({
            'success': True,
            'stats': {
                'total_recommendations': total_recommendations,
                'total_clicks': total_clicks,
                'clicks_last_30_days': recent_clicks,
                'avg_recommendations_per_user': float(avg_per_user['avg'] or 0),
                'top_clicked_products': list(top_products)
            }
        })
