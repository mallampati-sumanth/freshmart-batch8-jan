"""
Custom exception handlers for FreshMart API
"""
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context):
    """
    Custom exception handler that provides consistent error responses
    """
    response = exception_handler(exc, context)
    
    if response is not None:
        # Log the error
        logger.error(f"API Error: {exc} - View: {context.get('view')}")
        
        # Customize the response
        custom_response_data = {
            'success': False,
            'error': {
                'status_code': response.status_code,
                'message': get_error_message(response),
            }
        }
        response.data = custom_response_data
    
    return response


def get_error_message(response):
    """Extract error message from response data"""
    if isinstance(response.data, dict):
        if 'detail' in response.data:
            return str(response.data['detail'])
        # Handle validation errors
        errors = []
        for field, messages in response.data.items():
            if isinstance(messages, list):
                errors.append(f"{field}: {', '.join(str(m) for m in messages)}")
            else:
                errors.append(f"{field}: {messages}")
        return '; '.join(errors) if errors else 'An error occurred'
    elif isinstance(response.data, list):
        return '; '.join(str(item) for item in response.data)
    return str(response.data)
