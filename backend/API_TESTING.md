# FreshMart API Security Documentation

## Overview

The FreshMart API uses **JWT (JSON Web Tokens)** for authentication with the following security features:

1. **Token-based Authentication** - All protected endpoints require a valid JWT token
2. **Token Blacklisting** - Logout invalidates tokens
3. **Rate Limiting** - Protection against brute force attacks
4. **Role-based Access Control** - Admin vs User permissions
5. **Session-based Kiosk Access** - Secure kiosk sessions with expiration

---

## Authentication Flow

### 1. Register
```http
POST /api/accounts/register/
Content-Type: application/json

{
    "username": "newuser",
    "email": "newuser@example.com",
    "password": "SecurePass123!",
    "password2": "SecurePass123!",
    "first_name": "New",
    "last_name": "User",
    "age": 25,
    "gender": "M",
    "city": "New York",
    "store_branch": "Manhattan",
    "preferences": [
        {"category": "Fresh Produce", "brand": "FreshMart Organic"}
    ]
}
```

Response:
```json
{
    "success": true,
    "message": "Registration successful",
    "user": {...},
    "tokens": {
        "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
        "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
    }
}
```

### 2. Login
```http
POST /api/accounts/login/
Content-Type: application/json

{
    "username": "john_doe",
    "password": "password123"
}
```

**Rate Limited**: 5 attempts per minute

### 3. Using Access Token
Include the access token in the Authorization header for protected endpoints:

```http
GET /api/recommendations/
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

### 4. Refresh Token
When access token expires (30 minutes), use refresh token to get a new one:

```http
POST /api/token/refresh/
Content-Type: application/json

{
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### 5. Logout (Blacklist Token)
```http
POST /api/accounts/logout/
Authorization: Bearer <access_token>
Content-Type: application/json

{
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

---

## Permission Levels

### Public Endpoints (No Authentication)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/accounts/register/` | POST | User registration |
| `/api/accounts/login/` | POST | User login |
| `/api/products/` | GET | List products |
| `/api/products/<id>/` | GET | Product details |
| `/api/products/featured/` | GET | Featured products |
| `/api/products/qr/<code>/` | GET | Product by QR code |
| `/api/products/categories/` | GET | List categories |
| `/api/products/brands/` | GET | List brands |
| `/api/products/promotions/` | GET | Active promotions |
| `/api/products/<id>/reviews/` | GET | Product reviews |
| `/api/kiosk/login/` | POST | Kiosk login |

### Authenticated User Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/accounts/logout/` | POST | Logout |
| `/api/accounts/profile/` | GET/PUT | User profile |
| `/api/accounts/preferences/` | GET/POST | User preferences |
| `/api/purchases/cart/` | GET/DELETE | Shopping cart |
| `/api/purchases/cart/items/` | POST/PUT/DELETE | Cart items |
| `/api/purchases/checkout/` | POST | Checkout |
| `/api/purchases/` | GET | Purchase history |
| `/api/recommendations/` | GET | Personalized recommendations |
| `/api/recommendations/refresh/` | POST | Refresh recommendations |
| `/api/products/<id>/reviews/` | POST | Add review |

### Admin-Only Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/accounts/admin/customers/` | GET | List all customers |
| `/api/accounts/admin/customers/<id>/` | GET/PUT/DELETE | Manage customer |
| `/api/products/` | POST | Create product |
| `/api/products/<id>/` | PUT/DELETE | Update/delete product |
| `/api/products/admin/all/` | GET | All products (incl. inactive) |
| `/api/products/admin/bulk-update/` | PATCH | Bulk update products |
| `/api/products/categories/` | POST/PUT/DELETE | Manage categories |
| `/api/products/brands/` | POST/PUT/DELETE | Manage brands |
| `/api/purchases/admin/all/` | GET | All purchases |
| `/api/purchases/admin/stats/` | GET | Purchase analytics |
| `/api/recommendations/admin/stats/` | GET | Recommendation analytics |
| `/api/kiosk/admin/sessions/` | GET | All kiosk sessions |
| `/api/kiosk/admin/stats/` | GET | Kiosk analytics |

---

## Kiosk Security

Kiosk endpoints use session-based authentication:

### 1. Start Kiosk Session
```http
POST /api/kiosk/login/
Content-Type: application/json

{
    "loyalty_card": "LC000002"
}
```

Response includes a secure session ID:
```json
{
    "success": true,
    "session": {
        "session_id": "Gr7kP2mQ9xL4nB8vT1wZ...",
        "expires_in": 1800
    },
    "customer": {...}
}
```

### 2. Use Session ID for Kiosk Operations
```http
GET /api/kiosk/{session_id}/recommendations/
GET /api/kiosk/{session_id}/search/?q=apple
GET /api/kiosk/{session_id}/products/{id}/
GET /api/kiosk/{session_id}/products/{id}/location/
```

### 3. Session Rules
- **Expires**: 30 minutes from creation
- **Rate Limited**: 60 requests per minute
- **Secure Token**: Uses cryptographically secure random token

---

## Rate Limiting

| Endpoint Type | Rate Limit |
|---------------|------------|
| Anonymous (Public) | 100 requests/hour |
| Authenticated User | 1000 requests/hour |
| Login Attempts | 5 attempts/minute |
| Kiosk Operations | 60 requests/minute |

---

## Security Headers

All responses include:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

---

## Error Responses

All errors follow a consistent format:

```json
{
    "success": false,
    "error": {
        "status_code": 401,
        "message": "Authentication credentials were not provided."
    }
}
```

Common status codes:
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limited)

---

## Demo Credentials

### Regular Users (password: `password123`)
| Username | Email | Loyalty Card |
|----------|-------|--------------|
| john_doe | john@example.com | LC000002 |
| jane_smith | jane@example.com | LC000003 |
| bob_wilson | bob@example.com | LC000004 |
| alice_brown | alice@example.com | LC000005 |
| charlie_davis | charlie@example.com | LC000006 |

### Admin User
- **Username**: admin
- **Password**: admin123
- **Access**: Full admin panel and all API endpoints

---

## Testing with cURL

### Login and Get Token
```bash
curl -X POST http://localhost:8000/api/accounts/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "john_doe", "password": "password123"}'
```

### Access Protected Endpoint
```bash
curl -X GET http://localhost:8000/api/recommendations/ \
  -H "Authorization: Bearer <your_access_token>"
```

### Admin Endpoint
```bash
curl -X GET http://localhost:8000/api/accounts/admin/customers/ \
  -H "Authorization: Bearer <admin_access_token>"
```

---

## Best Practices

1. **Store tokens securely** - Never expose in URLs or logs
2. **Refresh tokens before expiry** - Access tokens expire in 30 minutes
3. **Logout on session end** - Blacklist refresh tokens
4. **Use HTTPS in production** - All traffic should be encrypted
5. **Rotate refresh tokens** - New refresh token issued on each refresh
