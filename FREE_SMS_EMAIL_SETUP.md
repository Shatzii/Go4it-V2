# FREE SMS & Email Setup Guide

## ✅ Email (Already Configured - FREE)

Your app already has **Nodemailer** set up! Just add Gmail credentials:

### Gmail Setup (500 emails/day FREE):
1. Go to: https://myaccount.google.com/apppasswords
2. Create an "App Password" for "Mail"
3. Add to Replit Secrets:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-16-digit-app-password
   SMTP_FROM=your-email@gmail.com
   ```

## 🆓 SMS - Free Options (No Twilio Needed!)

### Option 1: Email-to-SMS Gateway (100% FREE)
**Best for:** Known carriers, unlimited usage
**Cost:** FREE
**Setup:** Already done! Just use the carrier parameter

```typescript
import { sendSMSViaEmail } from '@/lib/sms-free';

// Send to AT&T user
await sendSMSViaEmail({
  to: '+12145551234',
  message: 'Parent Night tomorrow at 7 PM!',
  carrier: 'att' // or 'verizon', 'tmobile', 'sprint'
});
```

**Supported Carriers:**
- AT&T: `@txt.att.net`
- Verizon: `@vtext.com`
- T-Mobile: `@tmomail.net`
- Sprint: `@messaging.sprintpcs.com`
- US Cellular: `@email.uscc.net`
- Boost: `@sms.myboostmobile.com`
- Cricket: `@sms.cricketwireless.net`
- MetroPCS: `@mymetropcs.com`

**How to get carrier info:**
- Ask during signup: "What's your carrier?"
- Use carrier lookup API (free): https://www.hlrlookup.com/

---

### Option 2: Textbelt (Open Source)
**Best for:** Don't know carrier, need reliability
**Cost:** 1 SMS/day FREE, then $0.0075 per SMS (75% cheaper than Twilio)
**Setup:** Already done!

```typescript
import { sendSMSViaTextbelt } from '@/lib/sms-free';

await sendSMSViaTextbelt({
  to: '+12145551234',
  message: 'Parent Night reminder!'
});
```

**To buy credits ($10 = 1,333 SMS):**
1. Go to: https://textbelt.com
2. Click "Buy Credits"
3. Add to Replit Secrets:
   ```
   TEXTBELT_API_KEY=your-api-key-here
   ```

---

### Option 3: Plivo (20-40% cheaper than Twilio)
**Best for:** High volume, professional use
**Cost:** ~$0.006 per SMS (vs Twilio $0.0079)
**Setup:**

1. Sign up: https://www.plivo.com/
2. Verify your account (free $5 trial credit)
3. Buy a phone number (~$1/month)
4. Add to Replit Secrets:
   ```
   PLIVO_AUTH_ID=your-auth-id
   PLIVO_AUTH_TOKEN=your-auth-token
   PLIVO_PHONE_NUMBER=+12145551234
   ```

```typescript
import { sendSMSViaPlivo } from '@/lib/sms-free';

await sendSMSViaPlivo({
  to: '+12145551234',
  message: 'Parent Night reminder!'
});
```

---

### Option 4: Smart Router (Recommended!)
**Automatically tries FREE methods first:**

```typescript
import { sendSMS } from '@/lib/sms-free';

// Tries in order:
// 1. Email-to-SMS (FREE if carrier known)
// 2. Textbelt (1 free/day)
// 3. Plivo (if configured)
// 4. Falls back to email notification
await sendSMS({
  to: '+12145551234',
  message: 'Parent Night tomorrow!',
  carrier: 'att' // or 'auto' to try all
});
```

---

## Cost Comparison

| Service | Setup Cost | Per SMS | Free Tier | Best For |
|---------|-----------|---------|-----------|----------|
| **Email-to-SMS** | $0 | $0 | Unlimited | Known carriers |
| **Textbelt** | $0 | $0.0075 | 1/day | Low volume |
| **Plivo** | $1/mo | $0.006 | $5 trial | High volume |
| **Twilio** | $15/mo | $0.0079 | $15 credit | Enterprise |
| **Vonage** | $0.90/mo | $0.0068 | $2 trial | Mid volume |

---

## Recommended Setup (100% FREE to start)

1. **Email:** Use Gmail (500/day free)
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```

2. **SMS:** Use Email-to-SMS + Textbelt fallback
   - Add carrier field to signup form
   - Use email-to-SMS for known carriers (FREE)
   - Use Textbelt for unknown carriers (1 free/day)

3. **For 342 parents/week:**
   - ~68 parents/day
   - Email: FREE with Gmail
   - SMS: 
     * ~60% know carrier = 41 FREE via email-to-SMS
     * ~40% unknown = 27 via Textbelt = $0.20/day
     * **Total SMS cost: $1.40/week vs $27/week with Twilio**

---

## Quick Start Commands

### 1. Add Gmail credentials (in Replit Secrets tab):
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=youremail@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=youremail@gmail.com
```

### 2. Enable Textbelt fallback (optional):
```bash
ENABLE_TEXTBELT=true
# Or buy credits: TEXTBELT_API_KEY=your-key
```

### 3. Test the system:
```typescript
// Test email (FREE)
import { sendEmailNodemailer } from '@/lib/sendEmailNodemailer';
await sendEmailNodemailer({
  to: 'parent@example.com',
  subject: 'Parent Night Confirmation',
  html: '<h1>See you Tuesday at 7 PM!</h1>'
});

// Test SMS (FREE with known carrier)
import { sendSMSViaEmail } from '@/lib/sms-free';
await sendSMSViaEmail({
  to: '+12145551234',
  message: 'Parent Night tomorrow at 7 PM!',
  carrier: 'att'
});
```

---

## Adding Carrier Field to Signup

Update your signup form to ask for carrier:

```typescript
<select name="carrier">
  <option value="">Select carrier (for SMS reminders)</option>
  <option value="att">AT&T</option>
  <option value="verizon">Verizon</option>
  <option value="tmobile">T-Mobile</option>
  <option value="sprint">Sprint</option>
  <option value="uscellular">US Cellular</option>
  <option value="boost">Boost Mobile</option>
  <option value="cricket">Cricket</option>
  <option value="metropcs">MetroPCS</option>
  <option value="auto">Not sure / Other</option>
</select>
```

---

## Benefits vs Twilio

| Feature | Free Setup | Twilio |
|---------|-----------|--------|
| Email | ✅ Nodemailer (500/day) | ❌ Need SendGrid ($15/mo) |
| SMS | ✅ Email-to-SMS (unlimited) | ❌ $0.0079/SMS |
| Setup | ✅ Just Gmail password | ❌ Phone verification + card |
| Cost | ✅ $0-$1.40/week | ❌ $27+/week |
| Reliability | ⚠️ 95% (carrier dependent) | ✅ 99.95% |

---

## Next Steps

1. Add Gmail app password to Replit Secrets
2. Test email with your own address
3. Test SMS to your phone (use your carrier)
4. Add carrier field to signup form
5. Monitor usage in admin panel

Your app is already configured to use these FREE alternatives! Just add the credentials and you're live.
