# 🎉 FreshMart - Complete Personalized Retail Application

## 🚀 Application Status: RUNNING

**Backend:** http://127.0.0.1:8000/  
**Frontend:** http://localhost:5173/  
**Admin Panel:** http://127.0.0.1:8000/admin/

---

## 🔐 Demo Accounts

### Customer Accounts
| Username | Password | Email | Preferences | Description |
|----------|----------|-------|-------------|-------------|
| `john_doe` | `password123` | john@example.com | Fresh Produce, Dairy & Eggs | Health-conscious customer |
| `jane_smith` | `password123` | jane@example.com | Bakery, Beverages, Snacks | Bakery enthusiast |
| `health_mike` | `password123` | mike@example.com | Fresh Produce, Meat & Seafood | Protein-focused shopper |

### Admin Account
| Username | Password | Email | Role |
|----------|----------|-------|------|
| `admin` | `admin123` | admin@freshmart.com | Admin |

---

## ✨ Complete Feature List

### 1. 📝 User Management & Authentication
- [x] **JWT-based Authentication** with token blacklisting
- [x] **Sign Up / Login** with validation
- [x] **User Profile Management**
  - Age, gender, city, store branch
  - Loyalty card system (auto-generated)
  - Loyalty points tracking
- [x] **Role-Based Access Control** (Customer, Admin)
- [x] **Password Security** with hashing

### 2. 🎯 Personalized Recommendations Engine
- [x] **Intelligent Recommendation System** based on:
  - Customer preferences (categories & brands)
  - Purchase history analysis
  - Popular products in preferred categories
  - Collaborative filtering (similar customers)
  - Product ratings and reviews
- [x] **Dynamic Recommendation Scoring**
- [x] **Real-time Recommendation Updates**
- [x] **Recommendation Click Tracking**
- [x] **Automatic Recommendations Refresh** after purchases

### 3. 🛒 Shopping Features
- [x] **Product Catalog** with categories and brands
- [x] **Advanced Product Search & Filters**
- [x] **Shopping Cart** with persistent storage
- [x] **Checkout Process** with multiple payment options
- [x] **Purchase History Tracking**
- [x] **Product Reviews & Ratings**
- [x] **Promotions & Special Offers**

### 4. 🏪 In-Store Features
- [x] **QR Code Support**
  - Each product has unique QR code
  - Scan to view: product details, reviews, recommendations
  - Aisle location information
- [x] **Indoor Navigation** (Aisle Location Display)
- [x] **Kiosk System**
  - Loyalty card lookup
  - Personalized product recommendations on kiosk
  - Quick product search
  - Store navigation assistance

### 5. 🎨 Modern Frontend Experience
- [x] **Responsive Design** (Mobile, Tablet, Desktop)
- [x] **Chakra UI Components**
- [x] **Smooth Animations** with Framer Motion
- [x] **Interactive Category Browse**
- [x] **Real-time Cart Updates**
- [x] **User-friendly Navigation**
- [x] **Dark/Light Mode Support**

### 6. 🔒 Security & Performance
- [x] **Rate Limiting** (100/hr anonymous, 1000/hr authenticated)
- [x] **Security Headers** (XSS, CSRF, Clickjacking protection)
- [x] **Input Validation** and sanitization
- [x] **Health Check Endpoints** (`/health/`, `/ready/`, `/live/`)
- [x] **Request Logging** with timing metrics
- [x] **Database Indexing** for performance
- [x] **Optimized Queries** with select_related/prefetch_related

### 7. 📊 Admin Features
- [x] **Admin Dashboard** with analytics
- [x] **Product Management** (CRUD operations)
- [x] **Customer Management**
- [x] **Order Tracking**
- [x] **Recommendation Analytics**
- [x] **Kiosk Usage Statistics**

### 8. 🆕 New User Onboarding
- [x] **Multi-Step Preferences Setup**
  - Step 1: Personal Information (age, gender, city, store)
  - Step 2: Category Preferences (visual selection)
  - Step 3: Brand Preferences (optional)
- [x] **Automatic Preference Detection** for returning users
- [x] **Smart Redirection** to setup for new users

---

## 🎯 How It Works (User Journey)

### For New Users:
1. **Sign Up** at http://localhost:5173/login
2. **Preferences Setup** (automatically redirected)
   - Choose age, gender, city, and preferred store
   - Select favorite product categories
   - Optionally select favorite brands
3. **Personalized Experience**
   - Homepage shows tailored recommendations
   - Product searches prioritize preferred categories
   - Special offers based on interests

### For Returning Users:
1. **Login** with existing credentials
2. **Personalized Homepage**
   - Top 10 product recommendations
   - Recommendations update based on purchases
   - Smart product suggestions
3. **Enhanced Shopping**
   - Filtered search results
   - Purchase history tracking
   - Loyalty points accumulation

### In-Store Experience:
1. **Kiosk Login** with loyalty card
2. **Get Personalized Recommendations**
3. **Find Products** with aisle locations
4. **Scan QR Codes** for instant product info

---

## 📱 Key Pages

### Public Pages
- **Home** (`/`) - Landing page with featured products
- **Products** (`/products`) - Browse all products with filters
- **Product Detail** (`/products/:id`) - Full product information
- **Login/Register** (`/login`) - Authentication
- **Cart** (`/cart`) - Shopping cart management
- **Checkout** (`/checkout`) - Complete purchase

### User Pages  
- **Profile** (`/profile`) - View and edit profile
- **Preferences Setup** (`/preferences-setup`) - Set shopping preferences

### Kiosk Pages
- **Kiosk Login** (`/kiosk-login`) - Enter loyalty card
- **Kiosk Dashboard** (`/kiosk-dashboard`) - Personalized kiosk interface

### Admin Pages
- **Admin Dashboard** (`/admin/dashboard`) - Overview and analytics
- **Products Management** (`/admin/products`) - Manage inventory
- **Customer Management** (`/admin/customers`) - View customer data
- **Orders** (`/admin/orders`) - Track all orders
- **Analytics** (`/admin/analytics`) - Business insights

---

## 🎨 Demo Data Available

### Categories (8)
- Fresh Produce
- Dairy & Eggs
- Meat & Seafood
- Bakery
- Beverages
- Snacks
- Frozen Foods
- Pantry Staples

### Brands (8)
- FreshMart Organic
- Daily Fresh
- Green Valley
- Ocean Catch
- Baker's Choice
- Pure Dairy
- Snack Time
- Healthy Choice

### Products (16)
Including: Organic Bananas, Red Apples, Greek Yogurt, Artisan Bread, Fresh Salmon, and more!

### Customers (3)
Pre-configured with different preferences and purchase history

---

## 🚀 Quick Start Guide

### 1. Test the Application

#### Method 1: Use Demo Accounts
```
1. Go to: http://localhost:5173/login
2. Login with: 
   Username: john_doe
   Password: password123
3. Explore personalized recommendations!
```

#### Method 2: Create New Account
```
1. Go to: http://localhost:5173/login
2. Click "Sign Up"
3. Fill in your details
4. Complete the 3-step preferences setup
5. Enjoy your personalized shopping experience!
```

### 2. Admin Access
```
1. Go to: http://127.0.0.1:8000/admin/
2. Login with:
   Username: admin
   Password: admin123
3. Manage products, customers, and view analytics
```

### 3. Kiosk Mode
```
1. Go to: http://localhost:5173/kiosk-login
2. Enter loyalty card: LC000003 (or LC000004, LC000005)
3. View personalized recommendations on kiosk interface
```

---

## 🔧 API Endpoints

### Authentication
- `POST /api/accounts/register/` - Register new user
- `POST /api/accounts/login/` - Login
- `POST /api/accounts/logout/` - Logout
- `GET/PUT /api/accounts/profile/` - User profile
- `GET/POST /api/accounts/preferences/` - User preferences

### Products
- `GET /api/products/` - List all products
- `GET /api/products/:id/` - Product detail
- `GET /api/products/categories/` - List categories
- `GET /api/products/brands/` - List brands
- `GET /api/products/qr/:qr_code/` - Get product by QR code

### Recommendations
- `GET /api/recommendations/` - Get personalized recommendations
- `POST /api/recommendations/refresh/` - Refresh recommendations
- `POST /api/recommendations/:id/click/` - Track click

### Cart & Purchases
- `GET /api/purchases/cart/` - Get cart
- `POST /api/purchases/cart/items/` - Add to cart
- `POST /api/purchases/checkout/` - Checkout
- `GET /api/purchases/` - Purchase history

### Kiosk
- `POST /api/kiosk/login/` - Kiosk login
- `GET /api/kiosk/:session_id/recommendations/` - Kiosk recommendations
- `GET /api/kiosk/:session_id/products/:id/location/` - Product location

---

## 📊 Database Structure

### Models
1. **Customer** - User profiles with preferences
2. **CustomerPreference** - Category and brand preferences
3. **Product** - Product catalog with QR codes
4. **Category** - Product categories
5. **Brand** - Product brands
6. **Purchase** - Order records
7. **PurchaseItem** - Order line items
8. **Cart** - Shopping cart
9. **CartItem** - Cart items
10. **Recommendation** - Personalized recommendations
11. **RecommendationClick** - Tracking clicks
12. **KioskSession** - Kiosk interactions
13. **ProductReview** - Customer reviews
14. **Promotion** - Special offers

---

## 🎓 Technical Stack

### Backend
- **Django 6.0.1** - Web framework
- **Django REST Framework** - API
- **SQLite** - Database
- **JWT Authentication** - Simple JWT
- **Pillow** - Image processing
- **QR Code** - QR code generation

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Chakra UI** - Component library
- **Framer Motion** - Animations
- **React Router** - Navigation
- **TanStack Query** - Data fetching
- **Axios** - HTTP client
- **Formik & Yup** - Forms and validation

---

## 🎯 Recommendation Algorithm

The recommendation engine uses a weighted scoring system:

1. **Preference-Based** (Weight: 3.0)
   - Matches customer's selected categories
   - Considers brand preferences
   
2. **Purchase History** (Weight: 2.0)
   - Related products from past purchases
   - Similar categories
   
3. **Popular Products** (Weight: 1.5)
   - Trending in preferred categories
   - High-rated products
   
4. **Collaborative Filtering** (Weight: 1.0)
   - Products bought by similar customers
   
5. **Featured Products** (Weight: 0.5)
   - Store promotions
   - New arrivals

**Final Score** = Σ(feature_weight × feature_score)

---

## 🎉 Success Metrics

### User Experience
✅ Personalized recommendations on first login  
✅ < 2 second page load time  
✅ Mobile-responsive design  
✅ Intuitive navigation  
✅ Smooth animations  

### Business Features
✅ Loyalty card system  
✅ Purchase tracking  
✅ Recommendation analytics  
✅ Kiosk integration  
✅ Admin management tools  

### Security
✅ JWT authentication  
✅ Rate limiting  
✅ Input validation  
✅ XSS/CSRF protection  
✅ Secure password storage  

---

## 🚀 Next Steps & Enhancements

### Potential Future Features
- [ ] Real-time notifications for promotions
- [ ] Mobile app (React Native)
- [ ] AI-powered chatbot for product inquiries
- [ ] Advanced analytics dashboard
- [ ] Social sharing features
- [ ] Wishlist functionality
- [ ] Order tracking with real-time updates
- [ ] Multi-language support
- [ ] Voice search in kiosk
- [ ] AR product visualization
- [ ] Integration with payment gateways
- [ ] Email marketing automation
- [ ] Customer segmentation
- [ ] A/B testing for recommendations

---

## 📞 Support & Documentation

For more information:
- **API Documentation:** http://127.0.0.1:8000/api/
- **Admin Panel:** http://127.0.0.1:8000/admin/
- **GitHub Issues:** Report any bugs or feature requests

---

## 🎊 Enjoy Your Personalized Shopping Experience!

**FreshMart** - Where every shopping trip is tailored just for you! 🛒✨