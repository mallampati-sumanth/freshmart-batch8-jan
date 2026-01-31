"""
Email service for sending OTPs and notifications
"""
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags


def send_otp_email(customer, otp_code, expires_in_minutes=10):
    """Send OTP verification email to customer"""
    subject = f'FreshMart Kiosk Login - Your OTP: {otp_code}'
    
    html_message = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: linear-gradient(135deg, #2ea074 0%, #1e7e5a 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
            .content {{ background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }}
            .otp-box {{ background: white; border: 3px solid #2ea074; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }}
            .otp-code {{ font-size: 36px; font-weight: bold; color: #2ea074; letter-spacing: 8px; }}
            .info {{ background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0; }}
            .footer {{ text-align: center; color: #666; font-size: 12px; margin-top: 20px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🛒 FreshMart Kiosk Login</h1>
                <p>Your One-Time Password</p>
            </div>
            <div class="content">
                <p>Hello <strong>{customer.first_name or customer.username}</strong>,</p>
                <p>You requested to login to FreshMart Kiosk using your loyalty card:</p>
                <p style="text-align: center; font-size: 18px; color: #2ea074;">
                    <strong>Card: {customer.loyalty_card}</strong>
                </p>
                
                <div class="otp-box">
                    <p style="margin: 0; color: #666;">Your OTP Code</p>
                    <div class="otp-code">{otp_code}</div>
                    <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">Valid for {expires_in_minutes} minutes</p>
                </div>
                
                <div class="info">
                    <strong>⏱️ Important:</strong>
                    <ul>
                        <li>This OTP expires in <strong>{expires_in_minutes} minutes</strong></li>
                        <li>Do not share this code with anyone</li>
                        <li>Use this code only at FreshMart Kiosk</li>
                    </ul>
                </div>
                
                <p>If you didn't request this OTP, please ignore this email.</p>
                
                <div style="text-align: center; margin-top: 30px;">
                    <p style="color: #2ea074; font-size: 16px;">
                        <strong>Happy Shopping! 🛍️</strong>
                    </p>
                </div>
            </div>
            <div class="footer">
                <p>© 2026 FreshMart. All rights reserved.</p>
                <p>This is an automated email. Please do not reply.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    plain_message = f"""
    FreshMart Kiosk Login - OTP Verification
    
    Hello {customer.first_name or customer.username},
    
    Your OTP Code: {otp_code}
    Loyalty Card: {customer.loyalty_card}
    
    This code is valid for {expires_in_minutes} minutes.
    
    Do not share this code with anyone.
    
    If you didn't request this, please ignore this email.
    
    - FreshMart Team
    """
    
    try:
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[customer.email],
            html_message=html_message,
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"Failed to send OTP email: {e}")
        return False


def send_loyalty_card_welcome_email(customer):
    """Send welcome email with loyalty card details"""
    subject = '🎉 Welcome to FreshMart Loyalty Program!'
    
    html_message = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: linear-gradient(135deg, #2ea074 0%, #1e7e5a 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
            .content {{ background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }}
            .card-box {{ background: white; border: 3px solid #ffbc00; border-radius: 15px; padding: 25px; text-align: center; margin: 20px 0; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }}
            .card-number {{ font-size: 32px; font-weight: bold; color: #2ea074; letter-spacing: 4px; margin: 15px 0; }}
            .benefits {{ background: #e8f5e9; border-radius: 10px; padding: 20px; margin: 20px 0; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎁 Welcome to FreshMart!</h1>
                <p>Your Loyalty Card is Ready</p>
            </div>
            <div class="content">
                <p>Hello <strong>{customer.first_name or customer.username}</strong>,</p>
                <p>Congratulations! Your FreshMart Loyalty Card has been activated.</p>
                
                <div class="card-box">
                    <p style="margin: 0; color: #666; font-size: 16px;">Your Loyalty Card Number</p>
                    <div class="card-number">{customer.loyalty_card}</div>
                    <p style="margin: 10px 0 0 0; color: #666;">Keep this number safe!</p>
                </div>
                
                <div class="benefits">
                    <h3 style="color: #2ea074; margin-top: 0;">🌟 Your Benefits</h3>
                    <ul style="text-align: left;">
                        <li><strong>Free Delivery</strong> on orders $60+</li>
                        <li><strong>5% Cashback</strong> on every $60+ purchase</li>
                        <li><strong>2x Loyalty Points</strong> per dollar spent</li>
                        <li><strong>Exclusive Flash Deals</strong> & promotions</li>
                        <li><strong>Kiosk Access</strong> with OTP verification</li>
                    </ul>
                </div>
                
                <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
                    <strong>📱 How to Use at Kiosk:</strong>
                    <ol style="margin: 10px 0 0 0;">
                        <li>Enter your loyalty card number</li>
                        <li>Receive OTP via email</li>
                        <li>Enter OTP to login</li>
                        <li>Start shopping!</li>
                    </ol>
                </div>
                
                <div style="text-align: center; margin-top: 30px;">
                    <p><strong>Current Rewards:</strong></p>
                    <p style="font-size: 24px; color: #2ea074;">
                        💰 ${customer.cashback_balance} Cashback<br>
                        🏆 {customer.loyalty_points} Points
                    </p>
                </div>
                
                <p style="text-align: center; margin-top: 30px;">
                    <a href="http://localhost:5173/profile" style="background: #2ea074; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                        View Your Profile
                    </a>
                </p>
            </div>
            <div style="text-align: center; color: #666; font-size: 12px; margin-top: 20px;">
                <p>© 2026 FreshMart. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    plain_message = f"""
    Welcome to FreshMart Loyalty Program!
    
    Hello {customer.first_name or customer.username},
    
    Your Loyalty Card Number: {customer.loyalty_card}
    
    Benefits:
    - Free Delivery on orders $60+
    - 5% Cashback on every $60+ purchase
    - 2x Loyalty Points per dollar
    - Exclusive Flash Deals
    - Kiosk Access with OTP
    
    Current Rewards:
    - Cashback: ${customer.cashback_balance}
    - Points: {customer.loyalty_points}
    
    Happy Shopping!
    - FreshMart Team
    """
    
    try:
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[customer.email],
            html_message=html_message,
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"Failed to send welcome email: {e}")
        return False
