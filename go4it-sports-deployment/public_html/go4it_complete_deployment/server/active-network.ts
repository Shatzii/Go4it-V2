import axios from 'axios';
import { db } from './db';
import { registrations, payments, combineTourEvents } from '../shared/schema';
import { eq } from 'drizzle-orm';

// Active Network API integration
// This is a simplified implementation that would need to be expanded with real API endpoints

interface ActiveNetworkConfig {
  apiKey: string;
  orgId: string;
  baseUrl: string;
}

class ActiveNetworkService {
  private config: ActiveNetworkConfig;
  private axios: any;

  constructor(config: ActiveNetworkConfig) {
    this.config = config;
    this.axios = axios.create({
      baseURL: config.baseUrl,
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
        'X-Organization-Id': config.orgId
      }
    });
  }

  /**
   * Create an event in Active Network
   * @param eventData Event details
   * @returns Created event data from Active Network
   */
  async createEvent(eventData: any) {
    try {
      // In a real implementation, this would make an API call to Active Network
      // const response = await this.axios.post('/api/events', eventData);
      // return response.data;
      
      // For our demo, we'll simulate a successful response
      return {
        id: `active-event-${Date.now()}`,
        name: eventData.name,
        status: 'active',
        registrationUrl: `https://www.active.com/register/${eventData.name.toLowerCase().replace(/\s+/g, '-')}`
      };
    } catch (error) {
      console.error('Error creating event in Active Network:', error);
      throw error;
    }
  }

  /**
   * Get registration URL for a specific event
   * @param eventId The ID of the event in our system
   * @returns Registration URL from Active Network
   */
  async getRegistrationUrl(eventId: number) {
    try {
      // Fetch the event from our database
      const [event] = await db.select().from(combineTourEvents).where(eq(combineTourEvents.id, eventId));
      
      if (!event) {
        throw new Error(`Event with ID ${eventId} not found`);
      }
      
      // If the event already has an Active Network ID, return the registration URL
      if (event.activeNetworkId) {
        return {
          registrationUrl: event.registrationUrl || `https://www.active.com/register/${event.slug}`,
          activeNetworkId: event.activeNetworkId
        };
      }
      
      // If not, we'd need to create the event in Active Network first
      // For demo purposes, we'll just return a simulated URL
      return {
        registrationUrl: `https://www.active.com/register/${event.slug}`,
        activeNetworkId: `active-event-${Date.now()}`
      };
    } catch (error) {
      console.error('Error getting registration URL from Active Network:', error);
      throw error;
    }
  }

  /**
   * Check registration status for a user
   * @param userId The user ID
   * @param eventId The event ID
   * @returns Registration status
   */
  async checkRegistrationStatus(userId: number, eventId: number) {
    try {
      // In a real implementation, query Active Network API
      // For demo, check our local database
      const [registration] = await db
        .select()
        .from(registrations)
        .where(eq(registrations.userId, userId) && eq(registrations.eventId, eventId));
      
      return {
        registered: !!registration,
        registrationId: registration?.id,
        status: registration?.status || 'not_registered',
        paymentStatus: registration?.paymentStatus || 'unpaid'
      };
    } catch (error) {
      console.error('Error checking registration status:', error);
      throw error;
    }
  }

  /**
   * Process a webhook from Active Network (for payment confirmations, etc.)
   * @param webhookData Data received from Active Network webhook
   * @returns Processing result
   */
  async processWebhook(webhookData: any) {
    try {
      // Validate the webhook signature
      // this.validateWebhookSignature(webhookData, signature);
      
      const { event, data } = webhookData;
      
      switch (event) {
        case 'registration.completed':
          // Update our database with the registration status
          await this.updateRegistrationStatus(data);
          break;
        case 'payment.completed':
          // Update our database with the payment status
          await this.updatePaymentStatus(data);
          break;
        default:
          console.log(`Unhandled webhook event: ${event}`);
      }
      
      return { success: true, event };
    } catch (error) {
      console.error('Error processing Active Network webhook:', error);
      throw error;
    }
  }

  /**
   * Update registration status in our database
   * @param data Registration data from Active Network
   */
  private async updateRegistrationStatus(data: any) {
    // Update our registration status based on the data from Active Network
    const { registrationId, status, userId, eventId } = data;
    
    const [existingRegistration] = await db
      .select()
      .from(registrations)
      .where(eq(registrations.externalId, registrationId));
    
    if (existingRegistration) {
      // Update existing registration
      await db
        .update(registrations)
        .set({ status })
        .where(eq(registrations.id, existingRegistration.id));
    } else {
      // Create new registration record
      await db
        .insert(registrations)
        .values({
          userId,
          eventId,
          status,
          externalId: registrationId,
          registeredAt: new Date(),
          paymentStatus: 'pending'
        });
    }
  }

  /**
   * Update payment status in our database
   * @param data Payment data from Active Network
   */
  private async updatePaymentStatus(data: any) {
    const { registrationId, paymentId, amount, status } = data;
    
    // Find the registration
    const [registration] = await db
      .select()
      .from(registrations)
      .where(eq(registrations.externalId, registrationId));
    
    if (!registration) {
      throw new Error(`Registration with external ID ${registrationId} not found`);
    }
    
    // Update the registration payment status
    await db
      .update(registrations)
      .set({ paymentStatus: status })
      .where(eq(registrations.id, registration.id));
    
    // Record the payment
    await db
      .insert(payments)
      .values({
        registrationId: registration.id,
        amount,
        externalId: paymentId,
        status,
        processedAt: new Date()
      });
  }

  /**
   * Get details about an Active Network event
   * @param activeNetworkId The ID of the event in Active Network
   * @returns Event details
   */
  async getEventDetails(activeNetworkId: string) {
    try {
      // In a real implementation, this would query the Active Network API
      // const response = await this.axios.get(`/api/events/${activeNetworkId}`);
      // return response.data;
      
      // For our demo, return simulated data
      return {
        id: activeNetworkId,
        name: 'Combine Tour Event',
        description: 'Basketball combine event for high school athletes',
        location: 'Main Sports Complex, Los Angeles',
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        endDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // 8 days from now
        status: 'active',
        capacity: 100,
        registeredCount: 45,
        fee: 99.99,
        registrationDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days from now
      };
    } catch (error) {
      console.error('Error fetching event details from Active Network:', error);
      throw error;
    }
  }
  
  /**
   * Register a user for an event
   * @param userId The ID of the user registering
   * @param eventId The ID of the event in our system
   * @returns Registration details
   */
  async registerForEvent(userId: number, eventId: number) {
    try {
      // First, get the event details from our database
      const [event] = await db
        .select()
        .from(combineTourEvents)
        .where(eq(combineTourEvents.id, eventId));
      
      if (!event) {
        throw new Error(`Event with ID ${eventId} not found`);
      }
      
      // Check if the user is already registered
      const [existingRegistration] = await db
        .select()
        .from(registrations)
        .where(eq(registrations.userId, userId) && eq(registrations.eventId, eventId));
      
      if (existingRegistration) {
        return {
          success: true,
          alreadyRegistered: true,
          registrationId: existingRegistration.id,
          status: existingRegistration.status,
          paymentStatus: existingRegistration.paymentStatus,
          message: "You are already registered for this event"
        };
      }
      
      // In a real implementation, this would call Active Network API to register the user
      // const response = await this.axios.post(`/api/events/${event.activeNetworkId}/registrations`, {
      //   userId,
      //   eventId,
      //   // Additional registration details would go here
      // });
      
      // For our demo, simulate a successful registration
      const activeNetworkRegistrationId = `active-registration-${Date.now()}`;
      
      // Create a registration record in our database
      const [registration] = await db
        .insert(registrations)
        .values({
          userId,
          eventId,
          status: 'registered',
          externalId: activeNetworkRegistrationId,
          registeredAt: new Date(),
          paymentStatus: 'pending'
        })
        .returning();
      
      return {
        success: true,
        registrationId: registration.id,
        eventId,
        activeNetworkRegistrationId,
        status: 'registered',
        paymentStatus: 'pending',
        paymentUrl: `https://www.active.com/payment/${activeNetworkRegistrationId}`,
        message: "Registration successful! Please complete payment to secure your spot."
      };
    } catch (error) {
      console.error('Error registering for event:', error);
      throw error;
    }
  }
}

// Create the Active Network service instance
// In a real application, these values would come from environment variables
const activeNetworkService = new ActiveNetworkService({
  apiKey: process.env.ACTIVE_NETWORK_API_KEY || 'demo-api-key',
  orgId: process.env.ACTIVE_NETWORK_ORG_ID || 'demo-org-id',
  baseUrl: process.env.ACTIVE_NETWORK_BASE_URL || 'https://api.active.com/v1'
});

export default activeNetworkService;