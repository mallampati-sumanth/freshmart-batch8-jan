"""
Health check and monitoring endpoints for FreshMart
"""
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.db import connection
from django.core.cache import cache
from django.conf import settings
import time
import os


class HealthCheckView(APIView):
    """
    Health check endpoint for load balancers and monitoring
    """
    permission_classes = [AllowAny]
    
    def get(self, request):
        health_status = {
            'status': 'healthy',
            'timestamp': time.time(),
            'version': getattr(settings, 'API_VERSION', '1.0.0'),
        }
        
        # Check database connection
        try:
            with connection.cursor() as cursor:
                cursor.execute('SELECT 1')
            health_status['database'] = 'connected'
        except Exception as e:
            health_status['database'] = 'error'
            health_status['database_error'] = str(e)
            health_status['status'] = 'unhealthy'
        
        status_code = status.HTTP_200_OK if health_status['status'] == 'healthy' else status.HTTP_503_SERVICE_UNAVAILABLE
        
        return Response(health_status, status=status_code)


class ReadinessCheckView(APIView):
    """
    Readiness check for Kubernetes-style deployments
    """
    permission_classes = [AllowAny]
    
    def get(self, request):
        checks = {
            'database': False,
            'migrations': False,
        }
        
        # Check database
        try:
            with connection.cursor() as cursor:
                cursor.execute('SELECT 1')
            checks['database'] = True
        except:
            pass
        
        # Check migrations are applied
        try:
            from django.db.migrations.executor import MigrationExecutor
            executor = MigrationExecutor(connection)
            targets = executor.loader.graph.leaf_nodes()
            checks['migrations'] = not executor.migration_plan(targets)
        except:
            pass
        
        all_ready = all(checks.values())
        
        return Response({
            'ready': all_ready,
            'checks': checks
        }, status=status.HTTP_200_OK if all_ready else status.HTTP_503_SERVICE_UNAVAILABLE)


class LivenessCheckView(APIView):
    """
    Liveness check - simple ping to verify app is running
    """
    permission_classes = [AllowAny]
    
    def get(self, request):
        return Response({'alive': True, 'timestamp': time.time()})


class SystemInfoView(APIView):
    """
    System information endpoint - Admin only
    """
    permission_classes = [AllowAny]  # Change to IsAdminUser in production
    
    def get(self, request):
        from django.db.models import Count, Sum
        from accounts.models import Customer
        from products.models import Product, Category
        from purchases.models import Purchase
        from recommendations.models import Recommendation
        from kiosk.models import KioskSession
        
        return Response({
            'version': getattr(settings, 'API_VERSION', '1.0.0'),
            'debug': settings.DEBUG,
            'database': {
                'engine': settings.DATABASES['default']['ENGINE'],
            },
            'statistics': {
                'total_customers': Customer.objects.count(),
                'total_products': Product.objects.filter(is_active=True).count(),
                'total_categories': Category.objects.count(),
                'total_purchases': Purchase.objects.filter(status='completed').count(),
                'total_recommendations': Recommendation.objects.filter(is_active=True).count(),
                'total_kiosk_sessions': KioskSession.objects.count(),
            }
        })
