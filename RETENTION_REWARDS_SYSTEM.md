# 🎁 FreshMart Customer Retention & Rewards System

## Overview
A comprehensive rewards system designed to increase customer retention, encourage minimum basket values of $45, and drive repeat purchases through tangible benefits.

---

## 🎯 Business Goals

### Primary Objectives
1. **Increase Average Order Value**: Encourage customers to reach $45 minimum basket
2. **Improve Retention Rate**: Provide incentives for customers to return
3. **Boost Customer Lifetime Value**: Reward loyal customers with points and cashback
4. **Reduce Cart Abandonment**: Show clear progress toward benefits

---

## 💰 Reward Structure

### $45 Minimum Basket Benefits

When customers spend **$45 or more** per order, they unlock:

| Benefit | Value | Description |
|---------|-------|-------------|
| **Free Delivery** | $5.99 saved | Normally charged for orders under $45 |
| **Cashback** | 5% of order total | Credited for next purchase |
| **Loyalty Points** | 2x points per $1 | Double points earning rate |

### Example Order Benefits

**Order: $50**
- Free Delivery: ✅ (Save $5.99)
- Cashback Earned: $2.50
- Loyalty Points: 100 points
- **Total Value**: $8.49 in rewards!

**Order: $30**
- Delivery Cost: $5.99 ❌
- Cashback: $0.00
- Loyalty Points: 60 points
- **Recommendation**: Add $15 more to unlock $8.49 in rewards!

---

## 📊 Loyalty Points System

### Earning Points
- **Standard Orders**: 2 points per $1 spent
- **$45+ Orders**: 2 points per $1 (same rate, but free delivery bonus)
- **Special Promotions**: Bonus points events (TBD)

### Redeeming Points
| Points Required | Reward |
|----------------|--------|
| 1,000 points | $20 Gift Card |
| 2,500 points | $50 Gift Card |
| 5,000 points | $100 Gift Card + VIP Status |

### Points Calculation
```python
points_earned = order_total * 2
```

Example:
- $45 order = 90 points
- $100 order = 200 points

---

## 💳 Cashback System

### How It Works
1. **Earning**: Orders $45+ earn 5% cashback
2. **Storage**: Cashback accumulates in customer account
3. **Usage**: Applied automatically to next order or manually at checkout

### Database Fields (Customer Model)
```python
cashback_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
total_cashback_earned = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
orders_over_minimum = models.IntegerField(default=0)
```

### Cashback Calculation
```python
MINIMUM_BASKET = 45
if order_total >= MINIMUM_BASKET:
    cashback_earned = round(order_total * 0.05, 2)
    customer.cashback_balance += cashback_earned
    customer.total_cashback_earned += cashback_earned
    customer.orders_over_minimum += 1
```

---

## 🛒 Smart Cart Features

### 1. Progress Tracker
Visual progress bar showing distance to $45 minimum:
- **Under $35**: Orange/Red indicator with "Add more to unlock!"
- **$35-$44**: Yellow indicator with "Almost there! Just $X away"
- **$45+**: Green indicator with "🎉 Benefits Unlocked!"

### 2. Quick Add Suggestions
When cart is $35-$44, system suggests products that:
- Cost less than remaining amount to $45
- Are popular/frequently purchased
- Help customer reach minimum efficiently

### 3. Real-Time Benefit Display
Cart summary shows:
```
Subtotal: $42.00
Shipping: $5.99 → FREE (if you add $3 more!)
Cashback: $0 → $2.10+ (at $45)
Total: $47.99 → $42.00 (with $45 cart)

💡 Add $3 more to save $8.49!
```

---

## 📱 Profile Rewards Dashboard

### Display Components

#### 1. Available Cashback Card
```
💰 Available Cashback
$12.50
Use on your next order!
```

#### 2. Loyalty Points Card
```
🏆 Loyalty Points
850 points
2 points per $1 spent
Progress: 85% to $20 gift card
```

#### 3. Achievement Stats
```
📦 $45+ Orders: 15
✅ Free Deliveries: 15
💵 Total Saved: $89.85
```

#### 4. Next Reward Progress
Visual progress bar:
```
850 / 1,000 points
[=================>    ] 85%
Earn 150 more points to unlock $20 gift card! 🎊
```

---

## 🎨 UI/UX Elements

### Cart Page Components

#### Progress Bar States
1. **Below $35**:
   - Color: Red/Orange gradient
   - Message: "🎯 Reach $45 for Rewards"
   - Icon: Target icon
   - Animation: Pulsing stripe

2. **$35-$44 (Close to Minimum)**:
   - Color: Yellow/Orange
   - Message: "💡 Just $X away from rewards!"
   - Icon: Light bulb
   - Animation: Animated stripes
   - **Shows**: Quick add product suggestions

3. **$45+ (Goal Reached)**:
   - Color: Green gradient
   - Message: "🎉 Benefits Unlocked!"
   - Icon: Gift/Trophy
   - Animation: Celebration confetti
   - **Shows**: 
     - ✓ Free Delivery
     - ✓ $X Cashback for Next Order
     - ✓ X Loyalty Points Earned

#### Checkout Button Labels
- Under $45: "Proceed to Checkout"
- $45+: "🎉 Checkout with Benefits"

---

## 🔧 Technical Implementation

### Frontend (React)

#### Cart.jsx - Key Logic
```javascript
// Constants
const MINIMUM_BASKET = 45;
const CASHBACK_RATE = 0.05; // 5%
const POINTS_PER_DOLLAR = 2;

// Calculate progress
const currentTotal = parseFloat(cart?.total_amount || 0);
const remainingToMinimum = Math.max(0, MINIMUM_BASKET - currentTotal);
const progressPercentage = Math.min(100, (currentTotal / MINIMUM_BASKET) * 100);
const hasReachedMinimum = currentTotal >= MINIMUM_BASKET;
const isCloseToMinimum = remainingToMinimum > 0 && remainingToMinimum <= 10;

// Calculate rewards
const cashbackAmount = hasReachedMinimum ? (currentTotal * CASHBACK_RATE).toFixed(2) : 0;
const loyaltyPoints = hasReachedMinimum ? Math.floor(currentTotal * POINTS_PER_DOLLAR) : 0;
const shippingCost = hasReachedMinimum ? 0 : 5.99;
```

#### Profile.jsx - Rewards Dashboard
```javascript
// Calculate lifetime rewards
const totalSpent = orders.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);
const ordersOver45 = orders.filter(order => parseFloat(order.total_amount || 0) >= 45).length;
const totalCashback = (totalSpent * 0.05).toFixed(2);
const loyaltyPoints = Math.floor(totalSpent * 2);
const nextRewardAt = 1000;
const rewardProgress = (loyaltyPoints / nextRewardAt) * 100;
```

### Backend (Django)

#### Models (accounts/models.py)
```python
class Customer(AbstractUser):
    loyalty_points = models.IntegerField(default=0, db_index=True)
    cashback_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_cashback_earned = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    orders_over_minimum = models.IntegerField(default=0)
```

#### Checkout Logic (purchases/views.py)
```python
MINIMUM_BASKET = 45

# Award rewards for $45+ orders
customer = request.user
points_earned = int(total_amount * 2)
customer.loyalty_points += points_earned

if total_amount >= MINIMUM_BASKET:
    cashback_earned = round(total_amount * 0.05, 2)
    customer.cashback_balance += cashback_earned
    customer.total_cashback_earned += cashback_earned
    customer.orders_over_minimum += 1

customer.save()
```

---

## 📈 Expected Business Impact

### Metrics to Track

1. **Average Order Value (AOV)**
   - Target: Increase from ~$35 to $50+
   - Method: $45 minimum incentive

2. **Customer Retention Rate**
   - Target: Increase repeat purchases by 30%
   - Method: Cashback rewards encourage returns

3. **Orders Per Customer**
   - Target: Increase from 2-3 to 5+ per year
   - Method: Loyalty points system

4. **Cart Abandonment Rate**
   - Target: Decrease by 20%
   - Method: Clear progress indicators, quick-add suggestions

### Revenue Projections

**Scenario: 1,000 Monthly Customers**

| Metric | Before | After | Impact |
|--------|--------|-------|--------|
| Avg Order Value | $35 | $48 | +$13 |
| Monthly Revenue | $35,000 | $48,000 | +$13,000 |
| Orders/Customer/Year | 2.5 | 4.0 | +60% |
| Annual Retention | 40% | 65% | +25% |

**Net Benefit**: 
- Revenue Increase: +$156,000/year
- Cost (5% cashback on $45+ orders): ~$12,000/year
- **Net Gain**: ~$144,000/year

---

## 🎓 Best Practices & Tips

### For Customers

1. **Plan Your Shopping**: Aim for $45+ orders to maximize benefits
2. **Use Cashback**: Don't let it sit - use it on next order
3. **Track Points**: Check profile to see progress toward rewards
4. **Quick Add**: Use cart suggestions to reach $45 efficiently

### For FreshMart Team

1. **Monitor Thresholds**: Track % of orders reaching $45
2. **Adjust Incentives**: If needed, consider $40 or $50 minimum
3. **Promote Clearly**: Email reminders about unused cashback
4. **Seasonal Bonuses**: Double points weekends, holiday specials

---

## 🔮 Future Enhancements

1. **Tiered Membership**
   - Bronze: 0-999 points
   - Silver: 1,000-4,999 points (5% bonus points)
   - Gold: 5,000+ points (10% bonus points, early access)

2. **Referral Program**
   - Refer a friend → Both get $10 credit
   - Friend makes $45+ order → You get 500 bonus points

3. **Birthday Rewards**
   - Free delivery for birthday month
   - Double points on birthday week

4. **Subscription Service**
   - $9.99/month for unlimited free delivery
   - 10% bonus points on all orders

5. **Gamification**
   - Streaks: 3 weeks in a row → 500 bonus points
   - Achievements: "Hit $45 ten times" badge
   - Leaderboards: Top shoppers get monthly prizes

---

## 📝 API Documentation

### Get Customer Rewards
```
GET /api/accounts/profile/
Response:
{
  "loyalty_points": 850,
  "cashback_balance": "12.50",
  "total_cashback_earned": "45.75",
  "orders_over_minimum": 15
}
```

### Checkout with Rewards
```
POST /api/purchases/checkout/
Response:
{
  "success": true,
  "purchase": {...},
  "rewards": {
    "points_earned": 100,
    "cashback_earned": 2.50,
    "free_delivery": true,
    "total_points": 950,
    "total_cashback": 15.00
  }
}
```

---

## ✅ Implementation Checklist

- [x] Create database fields for cashback and rewards tracking
- [x] Run migrations for new fields
- [x] Update Customer serializer to expose rewards data
- [x] Implement $45 progress tracker in Cart UI
- [x] Add smart product suggestions for reaching $45
- [x] Display real-time benefits (free delivery, cashback, points)
- [x] Create Rewards dashboard in Profile page
- [x] Update checkout logic to award cashback and points
- [x] Add visual celebrations for unlocking benefits
- [x] Show shipping cost vs free delivery comparison
- [ ] Email notifications for earned rewards
- [ ] Admin dashboard for rewards analytics
- [ ] A/B test $45 vs $40 vs $50 thresholds
- [ ] Mobile app push notifications for rewards milestones

---

## 🎉 Launch Announcement

**Subject**: Introducing FreshMart Rewards - Save Big on Every Order! 🎁

Dear Valued Customers,

We're excited to announce our NEW FreshMart Rewards Program!

**Spend $45+ and unlock:**
✅ FREE Delivery (save $5.99)
✅ 5% Cashback for your next order
✅ 2x Loyalty Points

**Plus:**
🏆 Earn points toward gift cards
💰 Watch your cashback grow
📊 Track rewards in your profile

Start shopping smarter today! Every $45+ order brings you closer to amazing rewards.

Happy Shopping!
The FreshMart Team

---

*Document Version: 1.0*
*Last Updated: January 25, 2026*
*Author: FreshMart Development Team*
