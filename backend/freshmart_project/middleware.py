"""
Enterprise-grade middleware for FreshMart API
"""
import time
import logging
import uuid
from django.utils.deprecation import MiddlewareMixin

api_logger = logging.getLogger('freshmart.api')
security_logger = logging.getLogger('freshmart.security')


class RequestLoggingMiddleware(MiddlewareMixin):
    """
    Middleware to log all API requests with timing information
    """
    
    def process_request(self, request):
        request.start_time = time.time()
        request.request_id = str(uuid.uuid4())[:8]
        
        # Log incoming request
        api_logger.info(
            f"[{request.request_id}] {request.method} {request.path} - "
            f"User: {request.user if hasattr(request, 'user') and request.user.is_authenticated else 'Anonymous'}"
        )
    
    def process_response(self, request, response):
        if hasattr(request, 'start_time'):
            duration = time.time() - request.start_time
            request_id = getattr(request, 'request_id', 'unknown')
            
            # Log response with timing
            api_logger.info(
                f"[{request_id}] {request.method} {request.path} - "
                f"Status: {response.status_code} - Duration: {duration:.3f}s"
            )
            
            # Add request ID to response headers
            response['X-Request-ID'] = request_id
            response['X-Response-Time'] = f"{duration:.3f}s"
        
        return response


class SecurityHeadersMiddleware(MiddlewareMixin):
    """
    Middleware to add security headers to all responses
    """
    
    def process_response(self, request, response):
        # Security headers
        response['X-Content-Type-Options'] = 'nosniff'
        response['X-Frame-Options'] = 'DENY'
        response['X-XSS-Protection'] = '1; mode=block'
        response['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        response['Permissions-Policy'] = 'geolocation=(), microphone=(), camera=()'
        
        # Cache control for API responses
        if request.path.startswith('/api/'):
            response['Cache-Control'] = 'no-store, no-cache, must-revalidate, private'
            response['Pragma'] = 'no-cache'
        
        return response


class AuthenticationLoggingMiddleware(MiddlewareMixin):
    """
    Middleware to log authentication events
    """
    
    def process_response(self, request, response):
        # Log failed authentication attempts
        if request.path == '/api/accounts/login/' and request.method == 'POST':
            if response.status_code == 401:
                security_logger.warning(
                    f"Failed login attempt - IP: {self.get_client_ip(request)}"
                )
            elif response.status_code == 200:
                security_logger.info(
                    f"Successful login - IP: {self.get_client_ip(request)}"
                )
        
        # Log rate limit hits
        if response.status_code == 429:
            security_logger.warning(
                f"Rate limit exceeded - IP: {self.get_client_ip(request)} - Path: {request.path}"
            )
        
        return response
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class APIVersionMiddleware(MiddlewareMixin):
    """
    Middleware to handle API versioning
    """
    
    def process_request(self, request):
        # Get API version from header or default to v1
        request.api_version = request.META.get('HTTP_X_API_VERSION', 'v1')
    
    def process_response(self, request, response):
        # Add API version to response headers
        if hasattr(request, 'api_version'):
            response['X-API-Version'] = request.api_version
        return response
