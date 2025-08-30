// Legacy Twilio import removed - using unified messaging service

// Twilio replaced with unified messaging service (AWS SNS + Discord + WhatsApp)
// This maintains backward compatibility for existing code

export const twilioClient = null; // Always null now - using unified messaging

export const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || '';

// SMS Templates for Go4It Sports Platform
export const SMS_TEMPLATES = {
  // Payment & Billing
  PAYMENT_CONFIRMATION: (amount: number, description: string) => 
    `✅ Payment confirmed: $${amount} for ${description}. Thank you for choosing Go4It Sports! View details: go4it.app/payments`,
  
  PAYMENT_FAILED: (amount: number, description: string) => 
    `❌ Payment failed: $${amount} for ${description}. Please update your payment method at go4it.app/billing`,
  
  SUBSCRIPTION_RENEWAL: (plan: string, amount: number, date: string) => 
    `🔄 ${plan} subscription renews on ${date} for $${amount}. Manage subscription: go4it.app/billing`,

  // GAR & Performance
  GAR_SCORE_COMPLETE: (score: number, improvement: string) => 
    `🏆 GAR Analysis Complete! Your score: ${score}/100. ${improvement} View full report: go4it.app/gar-analysis`,
  
  PERFORMANCE_MILESTONE: (milestone: string, level: number) => 
    `🎯 Milestone Achieved! ${milestone} - Level ${level} unlocked. Keep pushing! View progress: go4it.app/starpath`,

  // Coaching & Sessions
  COACH_SESSION_REMINDER: (coachName: string, time: string, type: string) => 
    `⏰ Reminder: ${type} with ${coachName} in 30 minutes (${time}). Join at: go4it.app/sessions`,
  
  COACH_SESSION_CONFIRMED: (coachName: string, date: string, time: string) => 
    `✅ Session confirmed with ${coachName} on ${date} at ${time}. Prepare to dominate! Details: go4it.app/sessions`,
  
  LIVE_CLASS_STARTING: (className: string, time: string) => 
    `🔴 LIVE: "${className}" starts in 15 minutes (${time}). Join now: go4it.app/live-classes`,

  // Recruitment & College
  SCOUT_INTEREST: (schoolName: string, coachName: string) => 
    `🎓 SCOUT ALERT: ${coachName} from ${schoolName} viewed your profile! Update your highlights: go4it.app/recruiting`,
  
  SCHOLARSHIP_OPPORTUNITY: (schoolName: string, amount: string) => 
    `💰 SCHOLARSHIP OPPORTUNITY: ${schoolName} - Up to ${amount}. Application deadline approaching: go4it.app/scholarships`,
  
  NCAA_DEADLINE: (requirement: string, deadline: string) => 
    `📅 NCAA REMINDER: ${requirement} due by ${deadline}. Complete now: go4it.app/ncaa-eligibility`,

  // Parent Communications
  CAMP_REGISTRATION: (childName: string, campName: string, date: string) => 
    `✅ ${childName} registered for ${campName} on ${date}. We can't wait to see them dominate! Details: go4it.app/camps`,
  
  PROGRESS_REPORT: (childName: string, achievements: string) => 
    `📈 ${childName}'s Weekly Progress: ${achievements}. Amazing work! Full report: go4it.app/parent-dashboard`,
  
  EMERGENCY_ALERT: (type: string, message: string) => 
    `🚨 ALERT: ${type} - ${message}. Check go4it.app for updates and instructions.`,

  // Challenges & Gamification
  DAILY_CHALLENGE: (challenge: string, reward: string) => 
    `⚡ Today's Challenge: ${challenge}. Complete for ${reward} XP! Start now: go4it.app/challenges`,
  
  LEADERBOARD_UPDATE: (position: number, category: string) => 
    `🏅 You're now #${position} in ${category}! Keep climbing the ranks: go4it.app/leaderboard`,

  // Academy & School
  GRADE_UPDATE: (subject: string, grade: string, teacher: string) => 
    `📚 Grade Update: ${subject} - ${grade} (${teacher}). Keep up the great work! View details: go4it.app/grades`,
  
  ATTENDANCE_ALERT: (studentName: string, date: string, className: string) => 
    `⚠️ Attendance: ${studentName} was absent from ${className} on ${date}. Contact school if needed.`,
  
  SCHEDULE_CHANGE: (change: string, date: string) => 
    `📅 Schedule Change: ${change} on ${date}. Check updated schedule: go4it.app/schedule`,

  // General Platform
  WELCOME_NEW_USER: (name: string) => 
    `🔥 Welcome to Go4It Sports, ${name}! Your journey to D1 starts now. Complete your profile: go4it.app/profile`,
  
  FEATURE_ANNOUNCEMENT: (feature: string) => 
    `🚀 NEW FEATURE: ${feature} is now live! Check it out: go4it.app/features`
};

export interface SMSOptions {
  to: string;
  message: string;
  mediaUrl?: string[];
  scheduleTime?: Date;
}

export class SMSService {
  private client = twilioClient;
  private fromNumber = TWILIO_PHONE_NUMBER;

  async sendSMS({ to, message, mediaUrl, scheduleTime }: SMSOptions) {
    // Fallback to unified messaging service if Twilio not available
    if (!this.client || !this.fromNumber) {
      console.warn('Twilio not configured, using unified messaging service');
      try {
        const { messagingService } = await import('./messaging-service');
        const result = await messagingService.sendSMS(to, message);
        return { success: result, error: result ? null : 'Unified messaging failed' };
      } catch (error) {
        console.error('Both Twilio and unified messaging failed:', { to, message });
        return { success: false, error: 'All SMS services unavailable' };
      }
    }

    try {
      const messageOptions: any = {
        body: message,
        from: this.fromNumber,
        to: to
      };

      if (mediaUrl && mediaUrl.length > 0) {
        messageOptions.mediaUrl = mediaUrl;
      }

      if (scheduleTime) {
        messageOptions.scheduleType = 'fixed';
        messageOptions.sendAt = scheduleTime;
      }

      const result = await this.client.messages.create(messageOptions);

      console.log(`SMS sent successfully: ${result.sid}`);
      return {
        success: true,
        messageId: result.sid,
        status: result.status
      };

    } catch (error: any) {
      console.error('Failed to send SMS:', error);
      return {
        success: false,
        error: error.message || 'Failed to send SMS'
      };
    }
  }

  async sendBulkSMS(recipients: { phone: string; message: string }[]) {
    if (!this.client || !this.fromNumber) {
      console.error('Twilio not configured. Bulk SMS not sent');
      return { success: false, error: 'SMS service not configured' };
    }

    const results = [];
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    for (const recipient of recipients) {
      try {
        const result = await this.sendSMS({
          to: recipient.phone,
          message: recipient.message
        });
        results.push({ phone: recipient.phone, ...result });
        
        // Rate limiting: 1 message per second
        await delay(1000);
      } catch (error) {
        results.push({
          phone: recipient.phone,
          success: false,
          error: 'Failed to send'
        });
      }
    }

    return {
      success: true,
      results,
      totalSent: results.filter(r => r.success).length,
      totalFailed: results.filter(r => !r.success).length
    };
  }

  // Template helpers
  sendPaymentConfirmation(phone: string, amount: number, description: string) {
    return this.sendSMS({
      to: phone,
      message: SMS_TEMPLATES.PAYMENT_CONFIRMATION(amount, description)
    });
  }

  sendGARScoreUpdate(phone: string, score: number, improvement: string) {
    return this.sendSMS({
      to: phone,
      message: SMS_TEMPLATES.GAR_SCORE_COMPLETE(score, improvement)
    });
  }

  sendCoachReminder(phone: string, coachName: string, time: string, type: string) {
    return this.sendSMS({
      to: phone,
      message: SMS_TEMPLATES.COACH_SESSION_REMINDER(coachName, time, type)
    });
  }

  sendEmergencyAlert(phone: string, type: string, message: string) {
    return this.sendSMS({
      to: phone,
      message: SMS_TEMPLATES.EMERGENCY_ALERT(type, message)
    });
  }

  sendParentUpdate(phone: string, childName: string, achievements: string) {
    return this.sendSMS({
      to: phone,
      message: SMS_TEMPLATES.PROGRESS_REPORT(childName, achievements)
    });
  }
}

export const smsService = new SMSService();