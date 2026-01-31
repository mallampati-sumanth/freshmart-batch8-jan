"""
URL configuration for freshmart_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenRefreshView
from freshmart_project.health import HealthCheckView, ReadinessCheckView, LivenessCheckView, SystemInfoView

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Health check endpoints (for load balancers and monitoring)
    path('health/', HealthCheckView.as_view(), name='health-check'),
    path('ready/', ReadinessCheckView.as_view(), name='readiness-check'),
    path('live/', LivenessCheckView.as_view(), name='liveness-check'),
    path('api/system/info/', SystemInfoView.as_view(), name='system-info'),
    
    # API endpoints
    path('api/accounts/', include('accounts.urls')),
    path('api/products/', include('products.urls')),
    path('api/purchases/', include('purchases.urls')),
    path('api/recommendations/', include('recommendations.urls')),
    path('api/kiosk/', include('kiosk.urls')),
    path('api/packages/', include('packages.urls')),
    
    # JWT token refresh
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

