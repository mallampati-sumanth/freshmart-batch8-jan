# FreshMart Backend - Enterprise-Grade Django REST API

A comprehensive, production-ready Django backend for a personalized retail shopping application with recommendation engine, purchase tracking, and kiosk support.

## 🏢 Enterprise Features

### Security
- ✅ **JWT Authentication** with token blacklisting
- ✅ **Rate Limiting** (100/hour anonymous, 1000/hour authenticated)
- ✅ **Role-Based Access Control** (Public, User, Admin)
- ✅ **Security Headers** (XSS, CSRF, Clickjacking protection)
- ✅ **Input Validation** and sanitization
- ✅ **Password Strength Requirements**
- ✅ **Secure Session Management**

### Monitoring & Observability
- ✅ **Health Check Endpoints** (`/health/`, `/ready/`, `/live/`)
- ✅ **Request Logging** with timing metrics
- ✅ **Security Event Logging**
- ✅ **API Version Headers**
- ✅ **Request ID Tracking**

### Performance
- ✅ **Database Indexes** on frequently queried fields
- ✅ **Efficient Query Optimization**
- ✅ **Pagination** on all list endpoints
- ✅ **Rotating Log Files** (10MB max, 5 backups)

### API Quality
- ✅ **Consistent Error Responses**
- ✅ **API Versioning Support**
- ✅ **Comprehensive Documentation**
- ✅ **RESTful Design Patterns**

---

## 📋 Features

### 1. User Management
- Custom user model with profile information
- JWT authentication with refresh tokens
- Loyalty card system with points tracking
- Customer preferences for recommendations

### 2. Product Management
- Products with categories and brands
- Automatic QR code generation
- Product reviews and ratings
- Stock management and aisle locations

### 3. Personalized Recommendations
- Multi-algorithm recommendation engine
- Purchase history analysis
- Collaborative filtering
- Automatic updates after purchases

### 4. Purchase & Cart System
- Shopping cart management
- Order processing with stock validation
- Purchase history tracking
- Loyalty points on purchases

### 5. Kiosk Support
- Secure session-based access
- Product search and location lookup
- Personalized recommendations
- Interaction analytics

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- pip

### Installation

```bash
# 1. Navigate to backend directory
cd c:\freshmart\backend

# 2. Install dependencies
pip install -r requirements.txt

# 3. Run migrations
python manage.py migrate

# 4. Create superuser
python create_superuser.py

# 5. Load demo data
python manage.py populate_demo_data

# 6. Start server
python manage.py runserver
```

The API will be available at `http://localhost:8000/`

---

## 🔗 API Endpoints

### Health & Monitoring
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health/` | GET | Health check (database status) |
| `/ready/` | GET | Readiness check (migrations) |
| `/live/` | GET | Liveness check |
| `/api/system/info/` | GET | System statistics |

### Authentication
| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/accounts/register/` | POST | Public | Register |
| `/api/accounts/login/` | POST | Public | Login |
| `/api/accounts/logout/` | POST | JWT | Logout |
| `/api/accounts/profile/` | GET/PUT | JWT | Profile |
| `/api/token/refresh/` | POST | Public | Refresh token |

### Products (Public Read, Admin Write)
| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/products/` | GET | Public | List products |
| `/api/products/<id>/` | GET | Public | Product details |
| `/api/products/featured/` | GET | Public | Featured products |
| `/api/products/qr/<code>/` | GET | Public | Product by QR |
| `/api/products/categories/` | GET | Public | Categories |
| `/api/products/brands/` | GET | Public | Brands |
| `/api/products/` | POST | Admin | Create product |
| `/api/products/<id>/` | PUT/DELETE | Admin | Modify product |

### Cart & Purchases (Authenticated)
| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/purchases/cart/` | GET | JWT | View cart |
| `/api/purchases/cart/items/` | POST | JWT | Add to cart |
| `/api/purchases/checkout/` | POST | JWT | Checkout |
| `/api/purchases/` | GET | JWT | Purchase history |

### Recommendations (Authenticated)
| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/recommendations/` | GET | JWT | Get recommendations |
| `/api/recommendations/refresh/` | POST | JWT | Refresh recommendations |

### Kiosk (Session-based)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/kiosk/login/` | POST | Start session |
| `/api/kiosk/<session>/recommendations/` | GET | Get recommendations |
| `/api/kiosk/<session>/search/` | GET | Search products |
| `/api/kiosk/<session>/products/<id>/location/` | GET | Product location |

### Admin Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/accounts/admin/customers/` | GET | All customers |
| `/api/purchases/admin/stats/` | GET | Purchase analytics |
| `/api/recommendations/admin/stats/` | GET | Recommendation analytics |
| `/api/kiosk/admin/stats/` | GET | Kiosk analytics |

---

## 🔐 Security

### JWT Token Lifecycle
- **Access Token**: 30 minutes
- **Refresh Token**: 7 days (rotated on use)
- **Logout**: Tokens blacklisted

### Rate Limits
| Type | Limit |
|------|-------|
| Anonymous | 100 requests/hour |
| Authenticated | 1000 requests/hour |
| Login attempts | 5/minute |
| Kiosk | 60 requests/minute |

### Response Headers
```
X-Request-ID: abc123
X-Response-Time: 0.045s
X-API-Version: v1
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
```

---

## 📁 Project Structure

```
backend/
├── freshmart_project/      # Main project settings
│   ├── settings.py         # Configuration
│   ├── urls.py             # URL routing
│   ├── middleware.py       # Custom middleware
│   ├── permissions.py      # Custom permissions
│   ├── exceptions.py       # Error handling
│   ├── health.py           # Health endpoints
│   ├── validators.py       # Input validation
│   └── logging_config.py   # Logging setup
├── accounts/               # User management
├── products/               # Product catalog
├── purchases/              # Cart & orders
├── recommendations/        # Recommendation engine
├── kiosk/                  # Kiosk functionality
├── logs/                   # Log files
└── media/                  # Uploaded files
```

---

## 📊 Demo Data

| Data | Count |
|------|-------|
| Customers | 5 |
| Products | 20+ |
| Categories | 10 |
| Brands | 8 |
| Purchase History | ✅ |
| Recommendations | ✅ |

### Demo Credentials

**Regular Users** (password: `password123`):
- john_doe, jane_smith, bob_wilson, alice_brown, charlie_davis

**Admin**:
- Username: `admin`
- Password: `admin123`

---

## 🧪 Testing

```bash
# Run system check
python manage.py check

# Test health endpoint
curl http://localhost:8000/health/

# Test login
curl -X POST http://localhost:8000/api/accounts/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "john_doe", "password": "password123"}'
```

---

## 📈 Logging

Logs are stored in `logs/` directory:
- `freshmart.log` - General application logs
- `errors.log` - Error logs only
- `security.log` - Authentication & security events
- `api.log` - API request/response logs

---

## 🚀 Production Deployment

For production deployment:

1. Set `DEBUG = False`
2. Configure proper `SECRET_KEY`
3. Set up PostgreSQL database
4. Configure HTTPS
5. Set up reverse proxy (nginx)
6. Configure proper CORS origins
7. Set up monitoring (Prometheus/Grafana)

---

## 📄 License

MIT License

## 💬 Support

For issues and questions, contact the development team.
