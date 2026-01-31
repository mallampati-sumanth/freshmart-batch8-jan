from django.urls import path
from .views import (
    RecommendationListView, RefreshRecommendationsView,
    TrackRecommendationClickView, AdminRecommendationStatsView
)

app_name = 'recommendations'

urlpatterns = [
    # User routes (authenticated)
    path('', RecommendationListView.as_view(), name='recommendation-list'),
    path('refresh/', RefreshRecommendationsView.as_view(), name='refresh-recommendations'),
    path('<int:recommendation_id>/click/', TrackRecommendationClickView.as_view(), name='track-click'),
    
    # Admin routes
    path('admin/stats/', AdminRecommendationStatsView.as_view(), name='admin-stats'),
]
