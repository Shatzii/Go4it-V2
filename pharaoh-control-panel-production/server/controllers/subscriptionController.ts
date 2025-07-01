import { Request, Response } from 'express';
import Stripe from 'stripe';
import { storage } from '../storage';

// Initialize Stripe
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' })
  : null;

// Plan prices (in cents)
const PLAN_PRICES = {
  premium: {
    monthly: 3900, // $39/month
    annually: 39000, // $390/year ($32.50/month)
  },
  enterprise: {
    monthly: 9900, // $99/month
    annually: 99000, // $990/year ($82.50/month)
  },
};

// Product IDs from Stripe Dashboard
const PRODUCT_IDS = {
  premium: process.env.STRIPE_PREMIUM_PRODUCT_ID || 'prod_premium',
  enterprise: process.env.STRIPE_ENTERPRISE_PRODUCT_ID || 'prod_enterprise',
};

export const subscriptionController = {
  /**
   * Create or get subscription for a user
   */
  getOrCreateSubscription: async (req: Request, res: Response) => {
    try {
      if (!stripe) {
        return res.status(500).json({ error: 'Stripe is not configured' });
      }

      // Get user from request (set by auth middleware)
      const userId = (req as any).userId;
      
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      // Get user details
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Parse request data
      const { plan, billingCycle } = req.body;
      
      if (!plan || !['premium', 'enterprise'].includes(plan)) {
        return res.status(400).json({ error: 'Invalid plan' });
      }
      
      if (!billingCycle || !['monthly', 'annually'].includes(billingCycle)) {
        return res.status(400).json({ error: 'Invalid billing cycle' });
      }

      // Get price based on plan and billing cycle
      const amount = PLAN_PRICES[plan][billingCycle];
      const productId = PRODUCT_IDS[plan];

      // Check if user already has a Stripe customer ID
      let customerId = user.stripeCustomerId;
      
      if (!customerId) {
        // Create a new customer in Stripe
        const customer = await stripe.customers.create({
          email: user.email || undefined,
          name: user.username,
          metadata: {
            userId: userId.toString(),
          },
        });
        
        customerId = customer.id;
        
        // Update user with Stripe customer ID
        await storage.updateStripeCustomerId(userId, customerId);
      }

      // Check if user already has an active subscription
      if (user.stripeSubscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
        
        if (subscription.status === 'active') {
          // Return the active subscription
          return res.json({
            customerId,
            subscriptionId: user.stripeSubscriptionId,
            status: subscription.status,
          });
        }
      }

      // Create a checkout session
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product: productId,
              unit_amount: amount,
              recurring: {
                interval: billingCycle === 'monthly' ? 'month' : 'year',
              },
            },
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${req.protocol}://${req.get('host')}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.protocol}://${req.get('host')}/subscription`,
        metadata: {
          userId: userId.toString(),
          plan,
          billingCycle,
        },
      });

      res.json({
        url: session.url,
        sessionId: session.id,
      });
    } catch (error) {
      console.error('Subscription error:', error);
      res.status(500).json({
        error: 'Failed to create subscription',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  /**
   * Handle successful subscription
   */
  handleSubscriptionSuccess: async (req: Request, res: Response) => {
    try {
      if (!stripe) {
        return res.status(500).json({ error: 'Stripe is not configured' });
      }

      const { session_id } = req.query;
      
      if (!session_id || typeof session_id !== 'string') {
        return res.status(400).json({ error: 'Missing session ID' });
      }

      // Retrieve checkout session
      const session = await stripe.checkout.sessions.retrieve(session_id);
      
      if (!session || !session.subscription) {
        return res.status(400).json({ error: 'Invalid session' });
      }

      // Get user ID from session metadata
      const userId = session.metadata?.userId;
      
      if (!userId) {
        return res.status(400).json({ error: 'User ID not found in session metadata' });
      }

      // Get user details
      const user = await storage.getUser(parseInt(userId));
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Update user subscription details
      await storage.updateUserStripeInfo(parseInt(userId), {
        customerId: session.customer as string,
        subscriptionId: session.subscription as string,
      });

      // Update user plan based on the subscription
      const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
      const plan = session.metadata?.plan || 'premium'; // Default to premium if not set
      
      await storage.updateUserPlan(parseInt(userId), plan);

      res.json({
        success: true,
        message: 'Subscription created successfully',
        plan,
        status: subscription.status,
      });
    } catch (error) {
      console.error('Subscription success error:', error);
      res.status(500).json({
        error: 'Failed to process subscription',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  /**
   * Cancel subscription
   */
  cancelSubscription: async (req: Request, res: Response) => {
    try {
      if (!stripe) {
        return res.status(500).json({ error: 'Stripe is not configured' });
      }

      // Get user from request (set by auth middleware)
      const userId = (req as any).userId;
      
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      // Get user details
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Check if user has an active subscription
      if (!user.stripeSubscriptionId) {
        return res.status(400).json({ error: 'User does not have an active subscription' });
      }

      // Cancel subscription in Stripe
      const subscription = await stripe.subscriptions.del(user.stripeSubscriptionId);
      
      // Update user plan to free
      await storage.updateUserPlan(userId, 'free');

      res.json({
        success: true,
        message: 'Subscription cancelled successfully',
        status: subscription.status,
      });
    } catch (error) {
      console.error('Cancel subscription error:', error);
      res.status(500).json({
        error: 'Failed to cancel subscription',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  /**
   * Get current subscription details
   */
  getSubscription: async (req: Request, res: Response) => {
    try {
      if (!stripe) {
        return res.status(500).json({ error: 'Stripe is not configured' });
      }

      // Get user from request (set by auth middleware)
      const userId = (req as any).userId;
      
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      // Get user details
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // User has no subscription
      if (!user.stripeSubscriptionId) {
        return res.json({
          plan: user.plan,
          status: 'no_subscription',
        });
      }

      // Get subscription details from Stripe
      const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
      
      res.json({
        plan: user.plan,
        status: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      });
    } catch (error) {
      console.error('Get subscription error:', error);
      res.status(500).json({
        error: 'Failed to get subscription details',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },
};