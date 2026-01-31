"""Quick test script for OTP functionality"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'freshmart_project.settings')
django.setup()

from accounts.models import Customer
from kiosk.models import OTPVerification

# Check customers with loyalty cards
print("=" * 60)
print("Customers with Loyalty Cards:")
print("=" * 60)
customers = Customer.objects.filter(loyalty_card__isnull=False)
for c in customers:
    print(f"Username: {c.username}")
    print(f"Loyalty Card: {c.loyalty_card}")
    print(f"Email: {c.email}")
    print(f"Phone: {c.phone}")
    print("-" * 60)

# Check recent OTPs
print("\n" + "=" * 60)
print("Recent OTP Verifications:")
print("=" * 60)
otps = OTPVerification.objects.all().order_by('-created_at')[:10]
for otp in otps:
    print(f"Customer: {otp.customer.username}")
    print(f"OTP Code: {otp.otp_code}")
    print(f"Created: {otp.created_at}")
    print(f"Expires: {otp.expires_at}")
    print(f"Used: {otp.is_used}")
    print(f"Verified: {otp.is_verified}")
    print(f"Valid: {otp.is_valid()}")
    print("-" * 60)
