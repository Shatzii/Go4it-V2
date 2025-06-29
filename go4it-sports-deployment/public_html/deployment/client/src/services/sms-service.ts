/**
 * Client-side service for SMS functionality
 */

export interface SmsResponse {
  success: boolean;
  message?: string;
  sid?: string;
  deliveredCount?: number;
}

/**
 * Check the status of the SMS service
 * @returns Status information about the SMS service
 */
export async function checkSmsStatus(): Promise<{ ready: boolean; message: string }> {
  try {
    const response = await fetch('/api/sms/status');
    
    if (!response.ok) {
      return {
        ready: false,
        message: `Error checking SMS service: ${response.statusText}`
      };
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to check SMS service status:', error);
    return {
      ready: false,
      message: 'Failed to connect to SMS service. Please try again later.'
    };
  }
}

/**
 * Send a direct SMS to a phone number
 * @param phoneNumber The recipient's phone number
 * @param message The message to send
 * @returns Response from the SMS service
 */
export async function sendSms(phoneNumber: string, message: string): Promise<SmsResponse> {
  try {
    const response = await fetch('/api/sms/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        phoneNumber, 
        message 
      }),
    });
    
    if (!response.ok) {
      return {
        success: false,
        message: `Error sending SMS: ${response.statusText}`
      };
    }
    
    const data = await response.json();
    return {
      success: data.success,
      message: data.message,
      sid: data.sid
    };
  } catch (error) {
    console.error('Failed to send SMS:', error);
    return {
      success: false,
      message: 'Failed to send SMS due to a network error. Please try again.'
    };
  }
}

/**
 * Send a verification code to a phone number
 * @param phoneNumber The phone number to verify
 * @returns Response from the SMS service
 */
export async function sendVerificationCode(phoneNumber: string): Promise<SmsResponse> {
  try {
    const response = await fetch('/api/sms/send-verification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber }),
    });
    
    if (!response.ok) {
      return {
        success: false,
        message: `Error sending verification code: ${response.statusText}`
      };
    }
    
    const data = await response.json();
    return {
      success: data.success,
      message: data.message
    };
  } catch (error) {
    console.error('Failed to send verification code:', error);
    return {
      success: false,
      message: 'Failed to send verification code due to a network error. Please try again.'
    };
  }
}

/**
 * Verify a code sent to a phone number
 * @param phoneNumber The phone number that received the code
 * @param code The verification code
 * @returns Response from the SMS service
 */
export async function verifyCode(phoneNumber: string, code: string): Promise<SmsResponse> {
  try {
    const response = await fetch('/api/sms/verify-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        phoneNumber, 
        code 
      }),
    });
    
    if (!response.ok) {
      return {
        success: false,
        message: `Error verifying code: ${response.statusText}`
      };
    }
    
    const data = await response.json();
    return {
      success: data.success,
      message: data.message
    };
  } catch (error) {
    console.error('Failed to verify code:', error);
    return {
      success: false,
      message: 'Failed to verify code due to a network error. Please try again.'
    };
  }
}

/**
 * Send a notification to multiple users
 * @param userIds Array of user IDs to send the notification to
 * @param message The message to send
 * @returns Response from the SMS service
 */
export async function sendNotification(userIds: number[], message: string): Promise<SmsResponse> {
  try {
    const response = await fetch('/api/sms/send-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        userIds, 
        message 
      }),
    });
    
    if (!response.ok) {
      return {
        success: false,
        message: `Error sending notification: ${response.statusText}`
      };
    }
    
    const data = await response.json();
    return {
      success: data.success,
      message: data.message,
      deliveredCount: data.deliveredCount
    };
  } catch (error) {
    console.error('Failed to send notification:', error);
    return {
      success: false,
      message: 'Failed to send notification due to a network error. Please try again.'
    };
  }
}