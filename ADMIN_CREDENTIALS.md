# Go4It Sports Platform - Admin Access

## Admin Credentials
- **Email:** admin@goforit.com  
- **Password:** AdminGo4It2025!

## Admin Dashboard Features

### 1. Content Management System (/admin/content)
- **Edit Camp Information:** Change titles, descriptions, pricing, dates, locations
- **Upload Images:** Camp photos and promotional images 
- **Manage Features:** Add/remove camp features and benefits
- **Control Pricing:** Update camp prices and categories
- **Toggle Active Status:** Enable/disable camps and events

### 2. Coupon Management System (/admin/coupons)
- **Full Access Pass:** FULLACCESS2025 - Complete free access to everything
- **Free Month Pass:** FREEMONTH - One month free on any plan
- **Elite Discount:** SUPERSTAR75 - 75% off elite plans
- **Create New Coupons:** Custom discount codes and percentages
- **Track Usage:** Monitor coupon redemptions and limits

### 3. User Management (/admin/users)
- **Profile Cards:** Beautiful user displays with GAR scores and verification badges
- **Verification System:** Grant/remove verified status
- **Performance Metrics:** View GAR scores and athlete ratings
- **User Search:** Filter by verification status, role, sport

## File Locations

### Content Management
- **Frontend:** `app/admin/content/page.tsx`
- **API Routes:** `app/api/admin/content/route.ts`
- **Upload Handler:** `app/api/upload/route.ts`

### Coupon System  
- **Frontend:** `app/admin/coupons/page.tsx`
- **API Routes:** `app/api/coupons/route.ts`
- **Schema:** `shared/coupon-schema.ts`
- **Initialization:** `scripts/init-coupons.js`

### Navigation
- **Admin Layout:** `app/admin/layout.tsx` (includes sidebar navigation)
- **Main Dashboard:** `app/admin/page.tsx`

## Quick Copy Coupon Codes

### Full Access Pass (Unlimited Everything)
```
FULLACCESS2025
```

### Free Month Pass
```
FREEMONTH
```

### Elite 75% Discount
```
SUPERSTAR75
```

## Admin Access URLs
- Main Dashboard: `/admin`
- Content Management: `/admin/content`
- Coupon System: `/admin/coupons`
- User Management: `/admin/users`
- Data Scraper: `/admin/scraper-dashboard`

## Features Summary
✅ **Content Management** - Edit pricing, descriptions, camp details, upload images
✅ **Coupon System** - Full access passes, discounts, usage tracking
✅ **User Management** - Profile cards with verification and GAR scores
✅ **Admin Credentials** - Secure access with provided login details
✅ **File Upload System** - Image management for camps and content
✅ **Navigation Sidebar** - Easy access to all admin functions