# FreshMart - January Use Case (Calibo Training)

## Overview
FreshMart is a full-stack e-commerce application developed as part of the **Calibo Training January Use Case**. It demonstrates a modern retail system with dual interfaces: a standard customer web application and a specialized Kiosk mode for physical store terminals.

## Key Features

### 🛒 Customer Portal
- User Authentication (Login/Register).
- Product Browsing with Categories.
- Shopping Cart & Secure Checkout.
- Order History & Profile Management.

### 🏪 Kiosk Mode
- **No-Login Experience**: Walk-in customers can shop immediately.
- **Local Session Cart**: Cart usage persists locally without account creation.
- **Streamlined Checkout**: Simplified checkout process for quick in-store transactions.
- **Smart Recommendations**: upsell suggestions based on cart items.

### 📊 Admin Dashboard
- Sales Analytics & Revenue Charts.
- Customer & Order Management.
- Product Inventory Control.
- Kiosk Performance Monitoring.

## 🌟 Unique Features & Innovations

### 📦 Smart Product Packages & Bundles
FreshMart includes a dynamic **Promotion Engine** that creates value packages for customers:
- **Category Bundles**: Automated discounts when buying from specific categories (e.g., "Dairy Week Special").
- **Family Packages**: "Mega Family Value Pack" bundles essentials (Milk, Bread, Fresh Produce) for a simplified one-click weekly shop.
- **Seasonal Packages**: Time-limited offers grouping relevant products.
- **Smart upsell**: The recommendation engine suggests complementary items to create a "complete package" for the shopper.

### 🧠 AI-Powered Recommendation Engine
Our custom built engine (`backend/recommendations/engine.py`) drives sales by:
- **Collaborative Filtering**: "Users who bought X also bought Y".
- **History Analysis**: Personalized suggestions based on past behavior.
- **Preference Matching**: Direct mapping of user tastes (Vegan, Gluten-free) to products.

### 🚀 Hybrid Architecture
- **Dual-Mode API**: Served by a single Django backend but optimized for two distinct frontend flows (Auth-based Web vs Session-based Kiosk).
- **Resilient Connectivity**: Kiosk mode is designed to handle high-traffic in-store usage with optimized local state management.

## Tech Stack

- **Frontend**: React 18, Vite, Chakra UI, Axios.
- **Backend**: Python, Django 4.2, Django REST Framework.
- **Database**: SQLite (Development).
- **Infrastructure**: ngrok (Tunneling), CORS headers configured for external access.

## Project Structure

```
freshmart-main/
├── backend/                # Django REST API
│   ├── freshmart_project/  # Core settings
│   ├── products/           # Product catalog
│   ├── purchases/          # Orders & Transactions
│   ├── kiosk/              # Kiosk specific logic
│   └── recommendations/    # Recommendation Engine
└── frontend/               # React Application
    ├── src/
    │   ├── api/            # Axios setup & Endpoints
    │   ├── features/       # Business logic (Auth, Cart)
    │   ├── pages/          # Application Routes
    │   └── theme/          # UI Styling
```

## Setup Instructions

### Backend (Django)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # Windows
   .\venv\Scripts\activate
   # Mac/Linux
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env and add your credentials:
   # - SECRET_KEY: Generate a new Django secret key
   # - EMAIL_HOST_USER: Your Gmail address
   # - EMAIL_HOST_PASSWORD: Your Gmail app-specific password
   ```
   
   **Important Security Note**: 
   - Never commit `.env` files to version control
   - Use environment-specific values for production
   - Generate a strong SECRET_KEY for production environments
   - Use Gmail App Passwords (not regular password) for EMAIL_HOST_PASSWORD

5. Run Migrations:
   ```bash
   python manage.py migrate
   ```

6. Start the Server:
   ```bash
   python manage.py runserver
   ```

### Frontend (React)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Development Server:
   ```bash
   npm run dev
   ```

## Configuration

### Environment Variables & Network
- The Application is configured to work with `ngrok` for external access.
- **Frontend API Config**: Located in `frontend/src/api/axios.js`.
- **Backend CORS**: Configured in `backend/freshmart_project/settings.py` to accept requests from the frontend and ngrok-tunneled domains.

## Developers
- **Mallampati Sumanth** - *Calibo Training (January Use Case)*

## Demo Accounts

The database comes populated with several demo users (password is `password123` for all):

| Username | Email | Persona |
|----------|-------|---------|
| `john_doe` | john@example.com | General Shopper |
| `jane_smith` | jane@example.com | Health & Beauty |
| `bob_wilson` | bob@example.com | Meat & Seafood |
| `alice_brown` | alice@example.com | Bakery fan |
| `charlie_davis` | charlie@example.com | Snack lover |

To create an admin account:
```bash
cd backend
python manage.py createsuperuser
```
