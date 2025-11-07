# Phone.com VoIP Integration Setup Guide

## ✅ Integration Complete

Your Phone.com account has been integrated into the Go4It platform!

### Account Details
- **Account Holder**: Alonzo Barrett
- **Email**: a.barrett@go4itsports.org
- **Phone Number**: (303) 970-4655
- **VoIP ID**: 3454731
- **Account ID**: 3845638
- **Express Service Code**: 70476520

## 🔧 Setup Instructions

### Step 1: Get Your API Token

1. Go to https://app.phone.com and log in
2. Navigate to **Settings** > **API Settings**
3. Click **"Create New API Token"**
4. Copy the generated token

### Step 2: Configure Environment Variable

Add this to your Replit Secrets or `.env` file:

```bash
PHONE_COM_API_TOKEN=your_api_token_from_step_1
```

### Step 3: Test the Integration

Once deployed, test the integration:

```bash
# Check status
curl https://your-app.replit.app/api/voip/status

# Should return account information and features
```

## 📱 Available Features

### 1. Make Calls
**Endpoint**: `POST /api/voip/call`

```typescript
// Example usage
const response = await fetch('/api/voip/call', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: '+1234567890',
    from: '(303) 970-4655' // Optional, defaults to your number
  })
});
```

### 2. Send SMS
**Endpoint**: `POST /api/voip/sms`

```typescript
const response = await fetch('/api/voip/sms', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: '+1234567890',
    message: 'Hello from Go4It!'
  })
});
```

### 3. Get Call History
**Endpoint**: `GET /api/voip/call?startDate=2025-01-01&limit=50`

```typescript
const response = await fetch('/api/voip/call?limit=50');
const data = await response.json();
console.log(data.calls);
```

### 4. Get Voicemails
**Endpoint**: `GET /api/voip/voicemail`

```typescript
const response = await fetch('/api/voip/voicemail');
const data = await response.json();
console.log(data.voicemails);
```

### 5. Check Status
**Endpoint**: `GET /api/voip/status`

```typescript
const response = await fetch('/api/voip/status');
const data = await response.json();
console.log(data.configured); // true if token is set
```

## 🎯 Integration Points

### Where to Use VoIP Features:

1. **Recruiting Dashboard**
   - Click-to-call recruits directly
   - Send SMS to athletes
   - View call history with prospects

2. **Coach Communications**
   - Call parents/guardians
   - SMS notifications for tryouts
   - Voicemail management

3. **Admin Panel**
   - Call center functionality
   - SMS campaigns
   - Communication logs

## 🔐 Security

- All VoIP endpoints require Clerk authentication
- API token stored securely in environment variables
- Only authenticated admin/coach users can access VoIP features

## 📊 Usage Analytics

The integration supports:
- ✅ Call duration tracking
- ✅ SMS delivery status
- ✅ Voicemail transcription (if enabled in Phone.com)
- ✅ Call recording retrieval

## 🆘 Troubleshooting

### Issue: "API token not configured"
**Solution**: Make sure `PHONE_COM_API_TOKEN` is set in your environment variables

### Issue: "Failed to make call"
**Solution**: 
1. Verify your Phone.com account is active
2. Check that you have sufficient credits
3. Ensure the phone number format is correct (+1234567890)

### Issue: "Unauthorized" error
**Solution**: User must be logged in via Clerk authentication

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
