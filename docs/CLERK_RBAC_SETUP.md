# Clerk Role-Based Access Control Setup Guide

## Overview
This guide walks through setting up user roles in Clerk for the Go4It platform's RBAC system.

## Supported Roles
- **student**: Regular student users (access to dashboard, study hall, NCAA tracker)
- **coach**: Coaching staff (access to student data, analytics)
- **admin**: Full system access (all features + user management)

---

## Step 1: Configure Public Metadata Schema

1. **Login to Clerk Dashboard**: https://dashboard.clerk.com
2. Navigate to **Configure** → **User & Authentication** → **Metadata**
3. Under **Public Metadata**, click **Edit Schema**
4. Add the following JSON schema:

```json
{
  "properties": {
    "role": {
      "type": "string",
      "enum": ["student", "coach", "admin"],
      "description": "User role for RBAC system"
    }
  },
  "required": ["role"]
}
```

5. Click **Save**

> **Why Public Metadata?**  
> Public metadata is readable on the client side (required for UI elements like role badges) but only writable by admins. Private metadata would require server-side checks for every UI element.

---

## Step 2: Assign Roles to Existing Users

### Method A: Manual Assignment (Clerk Dashboard)

1. Go to **Users** in Clerk Dashboard
2. Click on a user to edit
3. Scroll to **Public Metadata** section
4. Click **Edit**
5. Add the role field:

```json
{
  "role": "student"
}
```

6. Click **Save**

### Method B: Bulk Assignment (API)

Use Clerk's Management API to bulk update users:

```bash
#!/bin/bash
# bulk-assign-roles.sh

CLERK_SECRET_KEY="sk_test_..." # Your Clerk Secret Key

# Assign student role to multiple users
USER_IDS=("user_123" "user_456" "user_789")

for USER_ID in "${USER_IDS[@]}"; do
  curl -X PATCH "https://api.clerk.com/v1/users/$USER_ID" \
    -H "Authorization: Bearer $CLERK_SECRET_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "public_metadata": {
        "role": "student"
      }
    }'
  echo "Assigned student role to $USER_ID"
done
```

Make executable and run:
```bash
chmod +x bulk-assign-roles.sh
./bulk-assign-roles.sh
```

---

## Step 3: Auto-Assign Roles on Sign-Up

### Option A: Using Clerk Webhooks (Recommended)

1. **Create webhook endpoint** in your app at `/api/webhooks/clerk`:

```typescript
// app/api/webhooks/clerk/route.ts
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    throw new Error('CLERK_WEBHOOK_SECRET not set');
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Missing svix headers', { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Webhook verification failed:', err);
    return new Response('Invalid signature', { status: 400 });
  }

  // Handle user.created event
  if (evt.type === 'user.created') {
    const { id } = evt.data;
    
    // Auto-assign student role to new users
    const response = await fetch(`https://api.clerk.com/v1/users/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        public_metadata: {
          role: 'student', // Default role for new signups
        },
      }),
    });

    if (!response.ok) {
      console.error('Failed to assign role:', await response.text());
      return new Response('Failed to assign role', { status: 500 });
    }

    console.log(`Assigned student role to user ${id}`);
  }

  return new Response('Webhook processed', { status: 200 });
}
```

2. **Configure webhook in Clerk Dashboard**:
   - Go to **Webhooks** in Clerk Dashboard
   - Click **Add Endpoint**
   - Enter your endpoint URL: `https://yourdomain.com/api/webhooks/clerk`
   - Subscribe to `user.created` event
   - Copy the **Signing Secret** and add to `.env.local`:
     ```env
     CLERK_WEBHOOK_SECRET=whsec_...
     CLERK_SECRET_KEY=sk_live_...
     ```

### Option B: Custom Sign-Up Flow

Add role selection to your sign-up form:

```typescript
// components/auth/SignUpForm.tsx
'use client';

import { useSignUp } from '@clerk/nextjs';
import { useState } from 'react';

export function SignUpForm() {
  const { signUp, setActive } = useSignUp();
  const [role, setRole] = useState<'student' | 'coach'>('student');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Create user with role in public metadata
    await signUp?.create({
      emailAddress: email,
      password: password,
      unsafeMetadata: {
        role: role, // Will be moved to public_metadata after admin approval
      },
    });
    
    // ... rest of sign-up flow
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Email, password fields */}
      
      <div>
        <label>I am a:</label>
        <select value={role} onChange={(e) => setRole(e.target.value as any)}>
          <option value="student">Student Athlete</option>
          <option value="coach">Coach</option>
        </select>
      </div>
      
      <button type="submit">Sign Up</button>
    </form>
  );
}
```

---

## Step 4: Using RBAC Guards in Your App

### Server Components (Recommended)

```typescript
// app/dashboard/page.tsx
import { requireStudent } from '@/lib/auth/requireRole';

export default async function StudentDashboard() {
  const { authorized, userId, role } = await requireStudent();
  
  if (!authorized) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
        <p className="text-slate-400">You need student or admin role to access this page.</p>
        <p className="text-sm text-slate-500 mt-2">Your current role: {role || 'none'}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome, Student {userId}</h1>
      {/* Dashboard content */}
    </div>
  );
}
```

### API Routes

```typescript
// app/api/admin/route.ts
import { requireAdmin } from '@/lib/auth/requireRole';
import { NextResponse } from 'next/server';

export async function GET() {
  const { authorized } = await requireAdmin();
  
  if (!authorized) {
    return NextResponse.json(
      { error: 'Admin access required' },
      { status: 403 }
    );
  }

  // Admin-only logic
  return NextResponse.json({ data: 'sensitive data' });
}
```

### Client Components (UI Only)

```typescript
// components/AdminPanel.tsx
'use client';

import { useUser } from '@clerk/nextjs';

export function AdminPanel() {
  const { user } = useUser();
  const role = user?.publicMetadata?.role as string;

  if (role !== 'admin') {
    return null; // Don't render for non-admins
  }

  return (
    <div>
      {/* Admin controls */}
    </div>
  );
}
```

---

## Step 5: Testing RBAC

### Test Script

```bash
#!/bin/bash
# test-rbac.sh

echo "Testing RBAC system..."

# Test 1: Access student dashboard as student (should succeed)
echo "1. Student accessing student dashboard..."
curl -H "Authorization: Bearer <student_token>" \
  http://localhost:3000/dashboard

# Test 2: Access admin panel as student (should fail)
echo "2. Student accessing admin panel..."
curl -H "Authorization: Bearer <student_token>" \
  http://localhost:3000/admin

# Test 3: Access admin panel as admin (should succeed)
echo "3. Admin accessing admin panel..."
curl -H "Authorization: Bearer <admin_token>" \
  http://localhost:3000/admin
```

### Manual Testing Checklist

- [ ] Student role can access `/dashboard`
- [ ] Student role cannot access `/admin`
- [ ] Coach role can access `/coach-dashboard`
- [ ] Coach role cannot access student's private data
- [ ] Admin role can access all routes
- [ ] Users without role are redirected to sign-in
- [ ] Role changes in Clerk Dashboard reflect immediately in app

---

## Step 6: Role Migration for Existing Users

If you have existing users without roles, run this migration:

```typescript
// scripts/migrate-user-roles.ts
import { clerkClient } from '@clerk/nextjs/server';

async function migrateUserRoles() {
  const users = await clerkClient.users.getUserList();
  
  for (const user of users) {
    // Skip if already has role
    if (user.publicMetadata.role) continue;
    
    // Assign default role based on email domain or other logic
    const role = user.emailAddresses[0]?.emailAddress.includes('@coach.')
      ? 'coach'
      : 'student';
    
    await clerkClient.users.updateUser(user.id, {
      publicMetadata: {
        ...user.publicMetadata,
        role: role,
      },
    });
    
    console.log(`Assigned ${role} to user ${user.id}`);
  }
  
  console.log('Migration complete!');
}

migrateUserRoles().catch(console.error);
```

Run migration:
```bash
npx tsx scripts/migrate-user-roles.ts
```

---

## Troubleshooting

### Issue: "Property 'role' does not exist on type '{}'"

**Fix**: Update your `types/clerk.d.ts`:

```typescript
// types/clerk.d.ts
export interface CustomJwtSessionClaims {
  metadata: {
    role?: 'student' | 'coach' | 'admin';
  };
}
```

Or cast the type:
```typescript
const role = sessionClaims?.metadata?.role as string | undefined;
```

### Issue: Role changes don't reflect immediately

**Cause**: Clerk caches session claims  
**Fix**: Force session refresh:

```typescript
import { useAuth } from '@clerk/nextjs';

function RefreshRole() {
  const { getToken } = useAuth();
  
  async function refresh() {
    await getToken({ skipCache: true }); // Force token refresh
    window.location.reload();
  }
  
  return <button onClick={refresh}>Refresh Role</button>;
}
```

### Issue: Webhook not receiving events

**Debugging**:
1. Check webhook logs in Clerk Dashboard
2. Verify endpoint URL is publicly accessible (use ngrok for local testing)
3. Check signing secret matches `CLERK_WEBHOOK_SECRET`
4. Test with Clerk's webhook testing tool

---

## Security Best Practices

1. **Never trust client-side role checks alone** - Always validate on the server
2. **Use `requireRole()` guards for all protected routes** - Don't rely on manual checks
3. **Audit role changes** - Log when admins modify user roles
4. **Principle of least privilege** - Default to student role, upgrade as needed
5. **Regular role reviews** - Periodically audit who has coach/admin access

---

## Next Steps

- [ ] Add role badges to user profiles
- [ ] Create admin dashboard for role management
- [ ] Implement role-based feature flags (e.g., beta features for admins)
- [ ] Add audit logging for sensitive actions
- [ ] Create coach-specific dashboards with aggregated student data

---

## Support

**Documentation**: https://clerk.com/docs/users/metadata  
**API Reference**: https://clerk.com/docs/reference/backend-api/tag/Users#operation/UpdateUser  
**Community**: https://clerk.com/discord

For Go4It-specific RBAC questions, check `/lib/auth/requireRole.ts` implementation.
