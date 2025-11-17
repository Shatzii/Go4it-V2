# Deployment Setup Instructions

## Clerk Environment Variables Configuration

Your Clerk keys have been added to `.env.local` for local development. For production deployment on Replit, you need to add these as **Replit Secrets**.

### Required Secrets

Add these in the Replit Secrets tab (🔒 icon in the left sidebar):

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_bmV4dC1tb25rZmlzaC00OS5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_dR2npmEXfaJOI1kwfiNtkw6qEcmFDQoCT2My3sqSPC
```

### Steps to Add Secrets on Replit:

1. Click the **🔒 Secrets** icon in the left sidebar (or Tools → Secrets)
2. Click **"New Secret"**
3. Add each key-value pair:
   - **Key**: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - **Value**: `pk_test_bmV4dC1tb25rZmlzaC00OS5jbGVyay5hY2NvdW50cy5kZXYk`
4. Click **"Add new secret"** again
5. Add the second key:
   - **Key**: `CLERK_SECRET_KEY`
   - **Value**: `sk_test_dR2npmEXfaJOI1kwfiNtkw6qEcmFDQoCT2My3sqSPC`

### Verification

After adding the secrets:
1. Stop the current deployment
2. Click **"Deploy"** again
3. The build should now succeed with proper Clerk authentication

### Alternative: Using Environment Variables in .replit

You can also add these to your `.replit` file under the `[env]` section, but **Secrets are recommended** for sensitive keys.

## Current Configuration Status

✅ **Local Development** (.env.local)
- Clerk keys configured
- Ready for local testing

⏳ **Production Deployment** (Replit Secrets)
- **Action Required**: Add the two secrets listed above

✅ **Code Configuration**
- ClerkProvider properly wrapped in `app/providers.tsx`
- Middleware configured with `clerkMiddleware()` in `middleware.ts`
- All components using `useUser()` hook properly

## Testing Authentication

Once deployed:
1. Visit your deployed URL
2. Click "Sign In" or "Sign Up"
3. You should see the Clerk authentication modal
4. After signing in, you'll have access to protected routes

## Troubleshooting

If you still see "CLERK_SECRET_KEY not set":
1. Verify secrets are added correctly in Replit
2. Restart the deployment completely (Stop → Deploy)
3. Check deployment logs for any other errors

## Support

- Clerk Dashboard: https://dashboard.clerk.com
- Clerk Docs: https://clerk.com/docs
- Your Clerk Account: https://next-monkfish-49.clerk.accounts.dev
