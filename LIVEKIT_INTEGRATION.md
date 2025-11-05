# LiveKit Video Chat Integration

## 🎥 Overview

LiveKit is now integrated for live video chat functionality across the Go4it platform. This includes team communication, parent night sessions, and coaching calls.

---

## 🔧 Setup Requirements

### 1. LiveKit Server

You need a LiveKit server running. Two options:

#### Option A: Self-Hosted (Recommended for Production)
```bash
# Install LiveKit server with Docker
docker run --rm -p 7880:7880 \
  -p 7881:7881 \
  -p 7882:7882/udp \
  -e LIVEKIT_KEYS="devkey: secret" \
  livekit/livekit-server:latest
```

#### Option B: LiveKit Cloud (Free Tier for Development)
1. Sign up at https://livekit.io/
2. Create a project
3. Get API keys from dashboard

---

## 🔐 Environment Variables

Add these to your `.env.local`:

```bash
# LiveKit Server Configuration
LIVEKIT_API_KEY=devkey                    # Your LiveKit API key
LIVEKIT_API_SECRET=secret                 # Your LiveKit API secret
LIVEKIT_URL=ws://localhost:7880           # Server URL (backend)
NEXT_PUBLIC_LIVEKIT_URL=ws://localhost:7880  # Server URL (client)

# For Production (LiveKit Cloud):
# LIVEKIT_API_KEY=APIxxxxxxxxxx
# LIVEKIT_API_SECRET=xxxxxxxxxxxxxxx
# LIVEKIT_URL=wss://your-project.livekit.cloud
# NEXT_PUBLIC_LIVEKIT_URL=wss://your-project.livekit.cloud
```

---

## 📁 Files Created

### 1. **lib/livekit/server.ts**
Server-side utilities for:
- Token generation (participant & host)
- Room creation and management
- Participant management
- Access control

### 2. **app/api/video/token/route.ts**
API endpoint for generating LiveKit access tokens
- POST `/api/video/token`
- Body: `{ roomName, roomType, isHost }`
- Returns: `{ token, roomName, serverUrl, userName, isHost }`

### 3. **components/video/VideoRoom.tsx**
React components for video chat:
- `VideoRoom` - Full-featured video conference
- `SimpleVideoRoom` - Custom layout option

### 4. **components/team/TeamCommunicationSystem.tsx**
Updated with real video call functionality:
- Video button now starts LiveKit session
- Full-screen video interface
- "Leave Call" button to return to chat

---

## 🎯 Usage Examples

### Team Video Calls

Already integrated in `TeamCommunicationSystem`:
```tsx
// Click video button in team chat → Launches LiveKit room
// Room name: team-{teamId}-{channelId}
```

### Parent Night Live Streaming

```tsx
import { VideoRoom } from '@/components/video/VideoRoom';

export default function ParentNightPage() {
  return (
    <VideoRoom 
      roomName="parent-night-nov-2025"
      roomType="parent-night"
      isHost={false}
    />
  );
}
```

### Coaching Sessions

```tsx
import { VideoRoom } from '@/components/video/VideoRoom';

export default function CoachingSessionPage({ params }) {
  return (
    <VideoRoom 
      roomName={`coaching-${params.sessionId}`}
      roomType="coaching"
      isHost={isCoach}
    />
  );
}
```

---

## 🎨 Features

### Built-in Features
✅ **Video & Audio** - Multi-party video conferencing  
✅ **Screen Sharing** - Share screens during calls  
✅ **Chat** - Text chat alongside video  
✅ **Recording** - Host can record sessions  
✅ **Grid Layout** - Automatic participant layout  
✅ **Responsive** - Works on mobile & desktop  

### Access Control
- **Team Calls**: Requires team membership
- **Parent Nights**: Open to registered users
- **Coaching**: Athlete + assigned coach only
- **Admin**: Full access to all rooms

### Host Permissions
When `isHost=true`:
- Start/stop recording
- Remove participants
- Room admin controls

---

## 🚀 Deployment

### Development
```bash
# Start LiveKit server locally
docker run --rm -p 7880:7880 \
  -e LIVEKIT_KEYS="devkey: secret" \
  livekit/livekit-server:latest

# Set env vars
LIVEKIT_API_KEY=devkey
LIVEKIT_API_SECRET=secret
LIVEKIT_URL=ws://localhost:7880
NEXT_PUBLIC_LIVEKIT_URL=ws://localhost:7880

# Start Next.js
npm run dev
```

### Production (Hetzner)

#### Option 1: Self-Hosted LiveKit
```bash
# On your Hetzner server
docker run -d --restart=unless-stopped \
  --name livekit \
  -p 7880:7880 \
  -p 7881:7881 \
  -p 7882:7882/udp \
  -e LIVEKIT_KEYS="${LIVEKIT_API_KEY}: ${LIVEKIT_API_SECRET}" \
  -v /var/livekit:/data \
  livekit/livekit-server:latest

# Update environment variables
LIVEKIT_API_KEY=your_secure_key_here
LIVEKIT_API_SECRET=your_secure_secret_here
LIVEKIT_URL=ws://your-server-ip:7880
NEXT_PUBLIC_LIVEKIT_URL=wss://video.go4itsports.com
```

**Note:** Configure reverse proxy (Caddy/Nginx) for WSS:
```nginx
# Nginx config for LiveKit
location /livekit/ {
    proxy_pass http://localhost:7880/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}
```

#### Option 2: LiveKit Cloud (Easier)
1. Sign up at https://livekit.io/
2. Create production project
3. Get API credentials
4. Set environment variables:
```bash
LIVEKIT_API_KEY=APIxxxxxxxxxx
LIVEKIT_API_SECRET=xxxxxxxxxxxxxxx
LIVEKIT_URL=wss://your-project.livekit.cloud
NEXT_PUBLIC_LIVEKIT_URL=wss://your-project.livekit.cloud
```

---

## 💰 Cost Comparison

### Self-Hosted (Option 1)
- **LiveKit Server:** FREE (open source)
- **Server Resources:** ~250MB RAM per room
- **Bandwidth:** ~1GB per user per hour
- **Total:** $5-20/month (your existing Hetzner server)

### LiveKit Cloud (Option 2)
- **Free Tier:** 10,000 participant minutes/month
- **Paid:** $0.001/minute = $1 per 1000 minutes
- **Example:** 100 hours/month = $6/month
- **Best for:** Getting started quickly

---

## 🧪 Testing

### Test Locally
1. Start LiveKit server (Docker)
2. Set environment variables
3. Navigate to team communication
4. Click video icon
5. Should connect to video room

### Test with Multiple Users
1. Open in 2+ browser windows
2. Different Clerk accounts
3. Join same team channel
4. Start video call
5. All users should see each other

---

## 🔍 Troubleshooting

### "Failed to generate token"
- Check `LIVEKIT_API_KEY` and `LIVEKIT_API_SECRET` are set
- Verify they match your LiveKit server config

### "Connection Error"
- Check `NEXT_PUBLIC_LIVEKIT_URL` is accessible
- For local dev: Use `ws://localhost:7880`
- For production: Use `wss://` with valid SSL

### "WebSocket connection failed"
- Check firewall allows ports 7880, 7881, 7882
- Verify LiveKit server is running
- Check browser console for detailed errors

### Video not showing
- Check browser permissions (camera/mic)
- Try different browser (Chrome/Edge best)
- Check LiveKit server logs

---

## 📚 Additional Resources

- **LiveKit Docs:** https://docs.livekit.io/
- **React Components:** https://docs.livekit.io/guides/react/
- **Self-Hosting:** https://docs.livekit.io/deploy/
- **API Reference:** https://docs.livekit.io/server/

---

## ✅ Integration Complete

**Status:** ✅ Video chat fully integrated  
**Files Modified:** 4 files  
**Dependencies Added:** 3 packages  
**Environment Variables:** 4 required  

**Next Steps:**
1. Set up LiveKit server (Docker or Cloud)
2. Add environment variables
3. Test video calls in team communication
4. Deploy to production

---

## 🎯 Future Enhancements

Potential additions:
- [ ] Recording playback interface
- [ ] Waiting room for parent nights
- [ ] Breakout rooms for group coaching
- [ ] Virtual backgrounds
- [ ] Noise cancellation
- [ ] Live transcription/captions
- [ ] Analytics dashboard

All available in LiveKit - just need to enable!
