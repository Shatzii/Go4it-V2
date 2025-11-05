# 🔑 Secrets & API Keys Configuration Guide

## 🚀 Quick Start - Add These First (2 Minutes)

### **Priority 1: Email & SMS (FREE - No Twilio!)**
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=xxxx-xxxx-xxxx-xxxx
SMTP_FROM=your-email@gmail.com
```

**Get Gmail App Password:**
1. Go to: https://myaccount.google.com/apppasswords
2. Select "Mail" as the app
3. Click "Generate"
4. Copy the 16-digit password
5. Paste into `SMTP_PASS`

**What This Enables:**
- ✅ Parent Night email confirmations
- ✅ FREE SMS via email-to-SMS (unlimited!)
- ✅ Tuesday/Thursday/Monday automation sequences
- ✅ All email features

**Cost:** $0/month (saves $108/month vs Twilio)

---

## 📋 All Available Secrets (By Priority)

### **1. Authentication - Clerk (Required for Login)**
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

**Setup:**
1. Sign up: https://clerk.com (free tier: 10,000 users)
2. Create new application
3. Copy "Publishable key" and "Secret key"
4. Add to Replit Secrets

**What This Enables:**
- ✅ User authentication
- ✅ Admin access
- ✅ User management
- ✅ Protected routes

**Cost:** Free up to 10,000 users

---

### **2. Database - PostgreSQL (Optional)**
```bash
DATABASE_URL=postgresql://user:password@host:5432/database
```

**Setup:**
1. Use Replit Database (included free)
2. Or use Supabase: https://supabase.com (free tier)
3. Or use Neon: https://neon.tech (free tier)

**What This Enables:**
- ✅ Production-grade database
- ✅ Better performance than SQLite
- ✅ Scalability

**Cost:** Free tier available

**Note:** SQLite works great for now - upgrade later if needed!

---

### **3. Payment Processing - Stripe (Optional)**
```bash
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Setup:**
1. Sign up: https://stripe.com
2. Go to Developers → API Keys
3. Copy Test keys first
4. Set up webhook endpoint: `https://your-site.com/api/webhooks/stripe`

**What This Enables:**
- ✅ Accept payments
- ✅ Subscription billing
- ✅ Parent Night package purchases
- ✅ Automatic license management

**Cost:** 2.9% + $0.30 per transaction

---

### **4. AI Features - OpenAI (Optional)**
```bash
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Setup:**
1. Sign up: https://platform.openai.com
2. Add payment method (pay-as-you-go)
3. Create API key
4. Copy to Replit Secrets

**What This Enables:**
- ✅ AI video analysis
- ✅ GAR score calculations
- ✅ Recruiting recommendations
- ✅ Content generation

**Cost:** ~$0.002 per request (very cheap)

---

### **5. Alternative Email - Resend (Optional Backup)**
```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx
```

**Setup:**
1. Sign up: https://resend.com
2. Create API key
3. Verify domain (optional)

**What This Enables:**
- ✅ Backup email service
- ✅ Better deliverability (for high volume)

**Cost:** 3,000 emails/month free, then $20/month

**Note:** You already have FREE Gmail SMTP - only add if needed!

---

### **6. SMS Alternative - Twilio (NOT NEEDED!)**
```bash
# DON'T ADD - You have FREE email-to-SMS!
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+1234567890
```

**Why NOT to use:**
- ❌ Costs $0.0079 per SMS
- ❌ $15/month minimum
- ❌ Requires credit card
- ✅ You have FREE email-to-SMS instead!

---

### **7. Social Media APIs (Optional)**
```bash
# Instagram
INSTAGRAM_ACCESS_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxx

# Facebook
FACEBOOK_ACCESS_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxx
FACEBOOK_PAGE_ID=xxxxxxxxxxxxxxxxxxxxxxxx

# Twitter/X
TWITTER_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxx
TWITTER_API_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
TWITTER_ACCESS_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxx
TWITTER_ACCESS_TOKEN_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx

# TikTok
TIKTOK_CLIENT_KEY=xxxxxxxxxxxxxxxxxxxxxxxx
TIKTOK_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
```

**Setup:**
- Instagram: https://developers.facebook.com
- Facebook: https://developers.facebook.com
- Twitter: https://developer.twitter.com
- TikTok: https://developers.tiktok.com

**What This Enables:**
- ✅ Auto-post to social media
- ✅ Content calendar automation
- ✅ Social media retargeting

**Cost:** Free API access

---

### **8. Analytics - PostHog (Optional)**
```bash
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

**Setup:**
1. Sign up: https://posthog.com
2. Create project
3. Copy project API key

**What This Enables:**
- ✅ User behavior analytics
- ✅ Event tracking
- ✅ Funnel analysis
- ✅ Session recordings

**Cost:** 1M events/month free

---

### **9. SMS Alternatives (Optional - If Email-to-SMS Not Enough)**

#### **Textbelt (1 free SMS/day, then cheap)**
```bash
TEXTBELT_API_KEY=textbelt  # Free tier = 1/day
ENABLE_TEXTBELT=true
```
**Cost:** 1 free/day, then $0.0075 per SMS (75% cheaper than Twilio)

#### **Plivo (Cheaper than Twilio)**
```bash
PLIVO_AUTH_ID=xxxxxxxxxxxxxxxxxxxxxxxx
PLIVO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxx
PLIVO_PHONE_NUMBER=+1234567890
```
**Cost:** ~$0.006 per SMS (20-40% cheaper than Twilio)

---

## 📍 How to Add Secrets in Replit

### **Method 1: Replit Secrets Tab**
1. Click **🔒 Secrets** (lock icon on left sidebar)
2. Click **"New Secret"**
3. Enter key name (e.g., `SMTP_USER`)
4. Enter value
5. Click **"Add Secret"**
6. Repeat for all keys
7. Click **"Restart"** when done

### **Method 2: .env File (Local Testing Only)**
```bash
# Create .env.local for testing
cp .env.example .env.local
# Edit with your values
nano .env.local
```

**⚠️ Never commit .env.local to git!**

---

## ✅ Configuration Checklist

### **Minimum to Go Live:**
- [ ] SMTP credentials (email + SMS)
- [ ] Clerk authentication keys
- [ ] That's it! You're live! 🚀

### **Recommended Additions:**
- [ ] Stripe keys (enable payments)
- [ ] OpenAI key (enable AI features)
- [ ] Database URL (scale beyond SQLite)

### **Nice to Have:**
- [ ] Social media API tokens
- [ ] Analytics keys
- [ ] Alternative SMS provider

---

## 🧪 Testing Your Configuration

### **Test Email/SMS:**
Visit: `https://your-site.com/admin/email-sms-setup`

1. Enter your SMTP credentials
2. Click "Test Email"
3. Check your inbox
4. Copy values to Replit Secrets
5. Restart
6. ✅ Email & SMS active!

### **Test Authentication:**
1. Visit `/sign-up`
2. Create test account
3. Verify email received
4. Login works
5. ✅ Auth active!

### **Test Payments:**
1. Use Stripe test card: `4242 4242 4242 4242`
2. Any future expiry date
3. Any 3-digit CVC
4. ✅ Payments active!

---

## 💰 Cost Summary

| Service | Free Tier | Paid Tier | Your Cost |
|---------|-----------|-----------|-----------|
| **Email (Gmail SMTP)** | 500/day | N/A | **$0** |
| **SMS (Email-to-SMS)** | Unlimited | N/A | **$0** |
| **Clerk Auth** | 10K users | $25/mo | **$0** |
| **Stripe** | Free | 2.9% + $0.30 | **Pay per use** |
| **OpenAI** | $5 credit | Pay-as-you-go | **~$2/mo** |
| **Database** | Replit free | N/A | **$0** |
| **PostHog** | 1M events | $0.000225/event | **$0** |
| **Total** | - | - | **~$2/mo** |

**vs Twilio alone:** $108/month 😱

**Your savings:** $1,272/year! 🎉

---

## 🆘 Troubleshooting

### **Email Not Sending**
- ✅ Check SMTP_PASS is App Password (not Gmail password)
- ✅ Enable 2-Step Verification in Google Account
- ✅ Generate new App Password
- ✅ Check SMTP_HOST = `smtp.gmail.com`
- ✅ Check SMTP_PORT = `587`

### **SMS Not Delivering**
- ✅ Verify carrier is correct (AT&T, Verizon, etc.)
- ✅ Phone number format: `+1234567890` (no spaces)
- ✅ Email is working first
- ✅ Check carrier gateway in form

### **Authentication Errors**
- ✅ Verify Clerk keys are correct
- ✅ Check domain is added in Clerk dashboard
- ✅ Restart Replit after adding keys

### **Payment Errors**
- ✅ Use test mode keys first
- ✅ Verify webhook endpoint is set
- ✅ Check webhook secret matches

---

## 🎯 Priority Order

**Start Here (Day 1):**
1. ✅ SMTP credentials (5 minutes)
2. ✅ Clerk authentication (10 minutes)
3. ✅ Test everything works

**Add Later (Week 1):**
4. ✅ Stripe for payments
5. ✅ OpenAI for AI features

**Optional (Month 1):**
6. ✅ Social media APIs
7. ✅ Analytics
8. ✅ PostgreSQL database

---

## 📚 Quick Reference Links

- **Gmail App Passwords:** https://myaccount.google.com/apppasswords
- **Clerk Dashboard:** https://dashboard.clerk.com
- **Stripe Dashboard:** https://dashboard.stripe.com
- **OpenAI API:** https://platform.openai.com
- **Resend Dashboard:** https://resend.com/home
- **PostHog Dashboard:** https://app.posthog.com

---

## 🎉 You're All Set!

Your site is **deployed and working** right now without any keys!

Add SMTP credentials first (2 minutes) to enable:
- ✅ Email confirmations
- ✅ FREE SMS reminders  
- ✅ Parent Night automation
- ✅ $1,296/year savings

**Start with email/SMS - that's the game-changer!** 📧📱✨
