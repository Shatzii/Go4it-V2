Stripe local testing

Steps to test Stripe Checkout + webhook locally using the Stripe CLI.

1. Prereqs
- Install the Stripe CLI: https://stripe.com/docs/stripe-cli
- Ensure your `.env` has `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` (webhook secret will be provided by `stripe listen`).
- Run your Next.js dev server: `npm run dev` (or the project's dev command).

2. Start listening to webhooks and forward to local webhook endpoint
```bash
stripe listen --forward-to http://localhost:3000/api/payments/webhook
```
This command prints a webhook signing secret (e.g., `whsec_...`). Set that as `STRIPE_WEBHOOK_SECRET` in your local environment or in your terminal session.

3. Create a Checkout session (from frontend)
- Start from the app UI (Pricing -> Subscribe or StarPath enroll) and complete the Checkout using Stripe test cards (e.g., `4242 4242 4242 4242`, any future expiry, any CVC).

OR create a session via curl (example)
```bash
curl -X POST http://localhost:3000/api/payments \
  -H "Content-Type: application/json" \
  -d '{"productId":"starpath_one_time","successUrl":"http://localhost:3000/success","cancelUrl":"http://localhost:3000/cancel","userId":"user_local_123"}'
```

4. Complete payment in Stripe-hosted Checkout
- After creating the session you'll get a `url` in the response; open it and complete a test purchase.

5. Confirm webhook processing
- The `stripe listen` session will show the events forwarded and the responses. The webhook handler at `/api/payments/webhook` will log processing and record an assessment to `data/assessments.json` when the purchase contains starpath.

6. Inspect recorded data
- Open `data/assessments.json` to verify the entry and `userId` field (metadata.userId preferred; falls back to `customer_email`).

Notes
- For subscription flows that use `stripe.checkout.sessions.create`, ensure the creating route includes `metadata.userId` so the webhook can link the session to your app user.
- If you get webhook signature errors, verify `STRIPE_WEBHOOK_SECRET` matches the secret printed by `stripe listen`.

Troubleshooting
- If the webhook receives events but your handler logs signature errors, re-run `stripe listen` and update the `STRIPE_WEBHOOK_SECRET`.
- If `data/assessments.json` is not updated, check server logs for errors processing `checkout.session.completed` events.

If you'd like, I can run a local test session here (needs STRIPE keys). I can also add a small test script to create a Checkout session programmatically for quick verification.