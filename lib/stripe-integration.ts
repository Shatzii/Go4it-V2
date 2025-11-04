// Stripe Payment Processing Integration
import Stripe from 'stripe';
import { databaseStorage } from '@/server/database-storage';
import { db } from '@/lib/db';
import { creditAudits } from '@/lib/db/schema/go4it_os';
import { leads } from '@/lib/db/schema/funnel';
import { eq } from 'drizzle-orm';
import { sendOnboardingTransactional } from '@/lib/utils/listmonk-client';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Stripe Price IDs for different subscription tiers
const STRIPE_PRICE_IDS = {
  starter: process.env.STRIPE_STARTER_PRICE_ID || 'price_starter_monthly',
  pro: process.env.STRIPE_PRO_PRICE_ID || 'price_pro_monthly',
  elite: process.env.STRIPE_ELITE_PRICE_ID || 'price_elite_monthly',
};

export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  stripePriceId: string;
  popular?: boolean;
}

export const SUBSCRIPTION_TIERS: Record<string, SubscriptionTier> = {
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 29.99,
    interval: 'month',
    stripePriceId: STRIPE_PRICE_IDS.starter,
    features: [
      'Basic GAR Analysis',
      'Social Media Integration (3 accounts)',
      'Basic Performance Tracking',
      'Community Access',
      'Mobile App Access',
    ],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 79.99,
    interval: 'month',
    stripePriceId: STRIPE_PRICE_IDS.pro,
    popular: true,
    features: [
      'Advanced GAR Analysis',
      'Unlimited Social Media Accounts',
      'AI Coaching & Recommendations',
      'StarPath Progression System',
      'Prospect Discovery Tools',
      'Advanced Analytics',
      'Priority Support',
    ],
  },
  elite: {
    id: 'elite',
    name: 'Elite',
    price: 149.99,
    interval: 'month',
    stripePriceId: STRIPE_PRICE_IDS.elite,
    features: [
      'Everything in Pro',
      'Personal AI Coach',
      'Advanced Recruitment Automation',
      'Custom Training Plans',
      'Team Management Tools',
      'White-label Options',
      'Dedicated Account Manager',
      '1-on-1 Strategy Sessions',
    ],
  },
};

export class StripeIntegration {
  // Create Stripe customer
  async createCustomer(userId: string, email: string, name?: string): Promise<Stripe.Customer> {
    try {
      const customer = await stripe.customers.create({
        email,
        name: name || undefined,
        metadata: {
          userId,
          platform: 'go4it-sports',
        },
      });

      console.log(`Created Stripe customer: ${customer.id} for user: ${userId}`);
      return customer;
    } catch (error) {
      console.error('Error creating Stripe customer:', error);
      throw new Error('Failed to create customer');
    }
  }

  // Get or create customer
  async getOrCreateCustomer(userId: string, email: string, name?: string): Promise<string> {
    try {
      const user = await databaseStorage.getUser(userId);

      // Return existing customer ID if available
      if (user?.stripeCustomerId) {
        return user.stripeCustomerId;
      }

      // Create new customer
      const customer = await this.createCustomer(userId, email, name);

      // Update user with customer ID
      await databaseStorage.upsertUser({
        id: userId,
        email,
        firstName: name?.split(' ')[0],
        lastName: name?.split(' ').slice(1).join(' '),
        stripeCustomerId: customer.id,
        updatedAt: new Date(),
      });

      return customer.id;
    } catch (error) {
      console.error('Error getting or creating customer:', error);
      throw error;
    }
  }

  // Create subscription
  async createSubscription(
    userId: string,
    email: string,
    tier: string,
    name?: string,
  ): Promise<{
    subscriptionId: string;
    clientSecret: string;
    customerId: string;
  }> {
    try {
      const tierConfig = SUBSCRIPTION_TIERS[tier];
      if (!tierConfig) {
        throw new Error(`Invalid subscription tier: ${tier}`);
      }

      // Get or create customer
      const customerId = await this.getOrCreateCustomer(userId, email, name);

      // Check for existing active subscription
      const existingSubscription = await databaseStorage.getSubscription(userId);
      if (existingSubscription && existingSubscription.status === 'active') {
        throw new Error('User already has an active subscription');
      }

      // Create subscription
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [
          {
            price: tierConfig.stripePriceId,
          },
        ],
        payment_behavior: 'default_incomplete',
        payment_settings: {
          save_default_payment_method: 'on_subscription',
        },
        expand: ['latest_invoice.payment_intent'],
        metadata: {
          userId,
          tier,
          platform: 'go4it-sports',
        },
      });

      const invoice = subscription.latest_invoice as Stripe.Invoice;
      const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

      // Save subscription to database
      await databaseStorage.createSubscription({
        id: `sub_${Date.now()}`,
        userId,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: customerId,
        stripePriceId: tierConfig.stripePriceId,
        status: subscription.status,
        tier: tierConfig.id,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        trialStart: subscription.trial_start ? new Date(subscription.trial_start * 1000) : null,
        trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
        metadata: {
          stripePriceId: tierConfig.stripePriceId,
          tierName: tierConfig.name,
          price: tierConfig.price,
        },
      });

      console.log(`Created subscription ${subscription.id} for user ${userId} (${tier} tier)`);

      return {
        subscriptionId: subscription.id,
        clientSecret: paymentIntent.client_secret!,
        customerId,
      };
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  // Update subscription tier
  async updateSubscriptionTier(userId: string, newTier: string): Promise<void> {
    try {
      const newTierConfig = SUBSCRIPTION_TIERS[newTier];
      if (!newTierConfig) {
        throw new Error(`Invalid subscription tier: ${newTier}`);
      }

      const subscription = await databaseStorage.getSubscription(userId);
      if (!subscription) {
        throw new Error('No subscription found for user');
      }

      // Update Stripe subscription
      const stripeSubscription = await stripe.subscriptions.retrieve(
        subscription.stripeSubscriptionId,
      );

      await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
        items: [
          {
            id: stripeSubscription.items.data[0].id,
            price: newTierConfig.stripePriceId,
          },
        ],
        metadata: {
          ...stripeSubscription.metadata,
          tier: newTier,
        },
      });

      // Update database
      await databaseStorage.updateSubscription(subscription.stripeSubscriptionId, {
        stripePriceId: newTierConfig.stripePriceId,
        tier: newTier,
        metadata: {
          ...subscription.metadata,
          tierName: newTierConfig.name,
          price: newTierConfig.price,
        },
      });

      console.log(`Updated subscription ${subscription.stripeSubscriptionId} to ${newTier} tier`);
    } catch (error) {
      console.error('Error updating subscription tier:', error);
      throw error;
    }
  }

  // Cancel subscription
  async cancelSubscription(userId: string, cancelImmediately: boolean = false): Promise<void> {
    try {
      const subscription = await databaseStorage.getSubscription(userId);
      if (!subscription) {
        throw new Error('No subscription found for user');
      }

      if (cancelImmediately) {
        // Cancel immediately
        await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);

        await databaseStorage.updateSubscription(subscription.stripeSubscriptionId, {
          status: 'canceled',
          cancelAtPeriodEnd: false,
        });
      } else {
        // Cancel at period end
        await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
          cancel_at_period_end: true,
        });

        await databaseStorage.updateSubscription(subscription.stripeSubscriptionId, {
          cancelAtPeriodEnd: true,
        });
      }

      console.log(
        `${cancelImmediately ? 'Canceled' : 'Scheduled cancellation for'} subscription ${subscription.stripeSubscriptionId}`,
      );
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  }

  // Handle webhook events
  async handleWebhook(payload: string, signature: string): Promise<void> {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('Missing Stripe webhook secret');
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      throw new Error('Invalid signature');
    }

    console.log(`Processing webhook: ${event.type}`);

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        await this.handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await this.handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case 'payment_intent.succeeded':
        await this.handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await this.handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      default:
        console.log(`Unhandled webhook type: ${event.type}`);
    }
  }

  // Handle one-time Credit Audit success (PaymentIntent)
  private async handlePaymentIntentSucceeded(pi: Stripe.PaymentIntent): Promise<void> {
    const stripePi = pi.id;
    try {
      // Update credit audit status
      await db.update(creditAudits).set({ status: 'succeeded' }).where(eq(creditAudits.stripePi, stripePi));
    } catch (e) {
      console.error('Failed to update creditAudits on success:', e);
    }

    try {
      // Fetch lead and send onboarding transactional via Listmonk
      const [audit] = await db
        .select({ leadId: creditAudits.leadId })
        .from(creditAudits)
        .where(eq(creditAudits.stripePi, stripePi));

      if (audit?.leadId) {
        const [lead] = await db
          .select({ id: leads.id, email: leads.email, firstName: leads.firstName })
          .from(leads)
          .where(eq(leads.id, audit.leadId));

        if (lead?.email) {
          await sendOnboardingTransactional({
            email: lead.email,
            firstName: lead.firstName || 'there',
          });
        }
      }
    } catch (e) {
      console.error('Failed to trigger onboarding transactional:', e);
    }
  }

  // Handle one-time Credit Audit failure (PaymentIntent)
  private async handlePaymentIntentFailed(pi: Stripe.PaymentIntent): Promise<void> {
    const stripePi = pi.id;
    try {
      await db.update(creditAudits).set({ status: 'failed' }).where(eq(creditAudits.stripePi, stripePi));
    } catch (e) {
      console.error('Failed to update creditAudits on failure:', e);
    }
  }

  // Handle subscription updated
  private async handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<void> {
    const userId = subscription.metadata.userId;
    if (!userId) return;

    await databaseStorage.updateSubscription(subscription.id, {
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    });

    console.log(`Updated subscription ${subscription.id} for user ${userId}`);
  }

  // Handle subscription deleted
  private async handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
    await databaseStorage.updateSubscription(subscription.id, {
      status: 'canceled',
    });

    console.log(`Canceled subscription ${subscription.id}`);
  }

  // Handle successful payment
  private async handlePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
    console.log(`Payment succeeded for invoice ${invoice.id}`);

    if (invoice.subscription) {
      const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
      await this.handleSubscriptionUpdated(subscription);
    }
  }

  // Handle failed payment
  private async handlePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
    console.log(`Payment failed for invoice ${invoice.id}`);

    if (invoice.subscription) {
      await databaseStorage.updateSubscription(invoice.subscription as string, {
        status: 'past_due',
      });
    }
  }

  // Get subscription tiers
  static getSubscriptionTiers(): SubscriptionTier[] {
    return Object.values(SUBSCRIPTION_TIERS);
  }

  // Get user's subscription status
  async getUserSubscription(userId: string): Promise<{
    subscription: any;
    tier: SubscriptionTier | null;
    isActive: boolean;
    daysUntilRenewal: number;
  }> {
    try {
      const subscription = await databaseStorage.getSubscription(userId);

      if (!subscription) {
        return {
          subscription: null,
          tier: null,
          isActive: false,
          daysUntilRenewal: 0,
        };
      }

      const tier = SUBSCRIPTION_TIERS[subscription.tier] || null;
      const isActive = ['active', 'trialing'].includes(subscription.status);
      const daysUntilRenewal = Math.ceil(
        (subscription.currentPeriodEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
      );

      return {
        subscription,
        tier,
        isActive,
        daysUntilRenewal,
      };
    } catch (error) {
      console.error('Error getting user subscription:', error);
      return {
        subscription: null,
        tier: null,
        isActive: false,
        daysUntilRenewal: 0,
      };
    }
  }
}

// Export singleton instance
export const stripeIntegration = new StripeIntegration();
