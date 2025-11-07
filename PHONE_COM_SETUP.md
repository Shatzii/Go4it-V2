# Phone.com SMS Integration - Proper Architecture

## ✅ Integration Complete (Non-Breaking)

Phone.com has been integrated as an **optional premium SMS provider** that works **on top of** your existing free email-to-SMS system - not replacing it!

### Architecture Overview

```
┌─────────────────────────────────────────┐
│   All SMS Requests in Your App         │
│   (Parent Night, Automations, etc.)    │
└──────────────────┬──────────────────────┘
                   │
                   ▼
          ┌────────────────┐
          │  SMS Router    │ (lib/sms-router.ts)
          │  Single Entry  │
          └────────┬───────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
   ┌─────────┐         ┌─────────────┐
   │Phone.com│         │Email-to-SMS │
   │(Primary)│  ──X──> │  (Fallback) │
   └─────────┘         └─────────────┘
    If enabled           Always works
    & configured         (FREE)
```

### What Changed

**✅ Added (No Breaking Changes)**:
- `lib/phonecom-client.ts` - Phone.com API client
- `lib/sms-router.ts` - Unified SMS router
- `app/api/webhooks/phonecom/route.ts` - Inbound SMS handler
- `app/api/sms/status/route.ts` - Check provider status

**✅ Updated (No Breaking Changes)**:
- `app/api/parent-night/rsvp/route.ts` - Now uses SMS router

**✅ Preserved (Still Works)**:
- `lib/sms-free.ts` - Email-to-SMS (unchanged)
- All automation APIs work exactly as before
- Admin test page still tests email-to-SMS

### Account Details
- **Account Holder**: Alonzo Barrett
- **Email**: a.barrett@go4itsports.org
- **Phone Number**: (303) 970-4655
- **VoIP ID**: 3454731
- **Account ID**: 3845638
- **Express Service Code**: 70476520

## 🔧 Setup Instructions

### Step 1: Get Your Phone.com API Token

1. Go to https://app.phone.com and log in
2. Navigate to **Settings** > **API Settings**
3. Click **"Create New API Token"**
4. Copy the generated token

### Step 2: Configure Environment Variables

Add these to your Replit Secrets or `.env` file:

```bash
# Phone.com API credentials
PHONECOM_API_KEY=your_api_token_from_step_1
PHONECOM_ACCOUNT_ID=3845638
PHONECOM_FROM_NUMBER=+13039704655

# Feature flag - set to 'true' to enable Phone.com
USE_PHONECOM_SMS=true
```

**Important**: If you don't set `USE_PHONECOM_SMS=true`, your app will continue using the free email-to-SMS system only (which is totally fine!).

### Step 3: Configure Webhook in Phone.com Dashboard

1. Log in to https://app.phone.com
2. Go to **Settings** > **Webhooks**
3. Add new webhook URL:
   ```
   https://your-app.replit.app/api/webhooks/phonecom
   ```
4. Select events:
   - ✅ SMS Received
   - ✅ Call Completed
   - ✅ Voicemail Received

### Step 4: Test the Integration

Check SMS provider status:
```bash
curl https://your-app.replit.app/api/sms/status
```

Should return:
```json
{
  "success": true,
  "router": {
    "primary": "phonecom",
    "fallback": "email-to-sms"
  },
  "phoneCom": {
    "configured": true,
    "accountId": "3845638",
    "fromNumber": "+13039704655"
  }
}
```

## 📱 How SMS Routing Works

### Outbound SMS (Your App → User)

When any part of your app sends an SMS:

```typescript
import { sendSMS } from '@/lib/sms-router';

await sendSMS({
  to: '+13035551234',
  message: 'Your message here',
  carrierHint: 'att' // optional, for fallback
});
```

**What Happens**:
1. If `USE_PHONECOM_SMS=true` AND Phone.com configured → Try Phone.com
2. If Phone.com fails or not configured → Use email-to-SMS (FREE)
3. Never breaks - always attempts fallback

### Inbound SMS (User → Your App)

When someone texts your Phone.com number `(303) 970-4655`:

**Keywords Supported**:
- `START` → Sends transcript audit link
- `PARENT` → Sends Parent Night info
- `STARPATH` → Sends pricing overview
- `ACADEMY` → Sends enrollment info
- `COMBINE` → Sends events schedule
- `AUDIT` → Sends audit link
- `HELP` → Sends menu of options
- `STOP` → Unsubscribes from messages

**Example Flow**:
```
User: "START"
App:  "🎓 Welcome to Go4It! Get your GAR here: 
       https://go4itsports.org/transcript-audit
       
       Reply STARPATH for pricing."
```

All replies are sent through the SMS router, so if Phone.com fails, they still get sent via email-to-SMS!

## 🎯 What This Enables

### Current System (FREE - Still Works!)
- ✅ Email-to-SMS via carrier gateways
- ✅ Unlimited free SMS  
- ✅ All existing automations
- ✅ Parent Night confirmations
- ✅ No monthly fees

### With Phone.com Enabled (Optional Premium)
- ✅ **Everything above PLUS**:
- ✅ Inbound SMS with keyword routing
- ✅ Professional SMS sender ID (303) 970-4655
- ✅ Two-way SMS conversations
- ✅ Voice calls + voicemail
- ✅ Call tracking & analytics
- ✅ Automatic fallback to free SMS if needed

**Key Point**: You can keep using the FREE system forever. Phone.com is an optional upgrade that adds inbound SMS and professional features, but never breaks your existing setup.

## 🔐 Security & Privacy

- All SMS endpoints require Clerk authentication
- API credentials stored securely in environment variables
- Webhook payloads validated before processing
- Unsubscribe handling built-in (STOP keyword)
- No PII exposed in logs

## 🆘 Troubleshooting

### "Phone.com not configured" error
**Solution**: Set `PHONECOM_API_KEY` and `USE_PHONECOM_SMS=true` in environment

### SMS not sending
**Check**:
1. Is `USE_PHONECOM_SMS` set to `true`?
2. Is `PHONECOM_API_KEY` valid?
3. Check logs for fallback to email-to-SMS
4. Verify phone number format (+1234567890)

### Inbound SMS not working
**Check**:
1. Webhook URL configured in Phone.com dashboard
2. Webhook URL is publicly accessible
3. Check `/api/webhooks/phonecom` logs

### Still using email-to-SMS even with Phone.com configured
**This is intentional!** If:
- `USE_PHONECOM_SMS` is not set to `'true'` (exact string), OR
- Phone.com API call fails
- System automatically uses email-to-SMS fallback

**To force Phone.com**: Set `USE_PHONECOM_SMS=true` and check API credentials

## 📊 Monitoring

Check SMS provider status anytime:
```bash
GET /api/sms/status
```

Returns:
```json
{
  "router": {
    "primary": "phonecom" | "email-to-sms",
    "fallback": "email-to-sms" | "none"
  },
  "phoneCom": {
    "configured": true | false
  }
}
```

## 📞 Phone.com Support

- **Support**: https://www.phone.com/support
- **API Docs**: https://www.phone.com/api/documentation/
- **Account Dashboard**: https://app.phone.com

## 🚀 Next Steps

1. Set `PHONE_COM_API_TOKEN` in your environment
2. Deploy your application
3. Test the `/api/voip/status` endpoint
4. Integrate call/SMS buttons into your UI
5. Add call history to the recruiting dashboard

---

**Files Created:**
- `lib/phone-com.ts` - API client
- `app/api/voip/call/route.ts` - Call management
- `app/api/voip/sms/route.ts` - SMS sending
- `app/api/voip/voicemail/route.ts` - Voicemail access
- `app/api/voip/status/route.ts` - Status checking
- `.env.phone-com.example` - Configuration template

**Commit**: `d2ef8423` - "feat: add Phone.com VoIP integration and fix duplicate build guards"
