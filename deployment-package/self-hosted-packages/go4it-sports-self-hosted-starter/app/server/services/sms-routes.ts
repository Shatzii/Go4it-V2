import { Request, Response } from 'express';
import smsService from './sms-service';
import { z } from 'zod';

// Validation schema for sending SMS messages
const sendSmsSchema = z.object({
  to: z.string().min(10).max(15),
  body: z.string().min(1).max(1600),
  from: z.string().optional()
});

/**
 * Send an SMS message
 */
export const sendSms = async (req: Request, res: Response) => {
  try {
    const validation = sendSmsSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request data',
        errors: validation.error.errors
      });
    }

    // Check if SMS service is ready
    if (!smsService.isReady()) {
      return res.status(503).json({
        success: false,
        message: 'SMS service not configured. Missing Twilio credentials.'
      });
    }

    const { to, body, from } = validation.data;
    const result = await smsService.sendMessage({ to, body, from });

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: 'SMS sent successfully',
        data: result.data
      });
    } else {
      return res.status(400).json({
        success: false,
        message: result.error || 'Failed to send SMS'
      });
    }
  } catch (error: any) {
    console.error('Error sending SMS:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'An error occurred while sending SMS'
    });
  }
};

/**
 * Check service status
 */
export const checkSmsStatus = async (req: Request, res: Response) => {
  const isServiceReady = smsService.isReady();
  
  return res.status(200).json({
    success: true,
    ready: isServiceReady,
    message: isServiceReady 
      ? 'SMS service is configured and ready' 
      : 'SMS service is not configured. Missing Twilio credentials.'
  });
};

/**
 * Send a verification code via SMS
 */
export const sendVerificationCode = async (req: Request, res: Response) => {
  try {
    const { phoneNumber } = req.body;
    
    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }

    // Check if SMS service is ready
    if (!smsService.isReady()) {
      return res.status(503).json({
        success: false,
        message: 'SMS service not configured. Missing Twilio credentials.'
      });
    }

    // Generate a random 6-digit code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store the code temporarily (in a real app, you would save this in the database)
    // In a production app, associate this with the user and add an expiration
    // For now, we'll store it in the session
    if (!req.session.verificationCodes) {
      req.session.verificationCodes = {};
    }
    
    req.session.verificationCodes[phoneNumber] = {
      code: verificationCode,
      createdAt: new Date().toISOString()
    };

    // Send the SMS
    const result = await smsService.sendMessage({
      to: phoneNumber,
      body: `Your MyPlayer verification code is: ${verificationCode}. This code will expire in 10 minutes.`
    });

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: 'Verification code sent successfully'
      });
    } else {
      return res.status(400).json({
        success: false,
        message: result.error || 'Failed to send verification code'
      });
    }
  } catch (error: any) {
    console.error('Error sending verification code:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'An error occurred while sending verification code'
    });
  }
};

/**
 * Verify a code sent via SMS
 */
export const verifyCode = async (req: Request, res: Response) => {
  try {
    const { phoneNumber, code } = req.body;
    
    if (!phoneNumber || !code) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and verification code are required'
      });
    }

    // Check if there's a verification code for this phone number
    if (!req.session.verificationCodes || !req.session.verificationCodes[phoneNumber]) {
      return res.status(400).json({
        success: false,
        message: 'No verification code found for this phone number'
      });
    }

    const storedVerification = req.session.verificationCodes[phoneNumber];
    
    // Check if the code matches
    if (storedVerification.code !== code) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code'
      });
    }

    // Check if the code is expired (10 minutes)
    const createdAt = new Date(storedVerification.createdAt);
    const expirationTime = new Date(createdAt.getTime() + 10 * 60 * 1000); // 10 minutes
    
    if (new Date() > expirationTime) {
      // Remove the expired code
      delete req.session.verificationCodes[phoneNumber];
      
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired'
      });
    }

    // Code is valid, remove it from storage to prevent reuse
    delete req.session.verificationCodes[phoneNumber];

    // If user is logged in, update their phone number
    if (req.user) {
      // Update the user's phone number in the database
      const userId = (req.user as any).id;
      // const updatedUser = await storage.updateUser(userId, { phoneNumber });
      
      // TODO: Add this when integrating with database
      // For now, just return success
    }

    return res.status(200).json({
      success: true,
      message: 'Phone number verified successfully'
    });
  } catch (error: any) {
    console.error('Error verifying code:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'An error occurred while verifying code'
    });
  }
};

/**
 * Send notification to a user via SMS
 */
export const sendNotification = async (req: Request, res: Response) => {
  try {
    const { userId, message } = req.body;
    
    if (!userId || !message) {
      return res.status(400).json({
        success: false,
        message: 'User ID and notification message are required'
      });
    }

    // Check if SMS service is ready
    if (!smsService.isReady()) {
      return res.status(503).json({
        success: false,
        message: 'SMS service not configured. Missing Twilio credentials.'
      });
    }

    // Retrieve the user's phone number from the database
    const { storage } = require('../storage');
    const user = await storage.getUser(userId);
    
    if (!user || !user.phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'User does not have a registered phone number'
      });
    }

    // Send the SMS
    const result = await smsService.sendMessage({
      to: user.phoneNumber,
      body: message
    });

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: 'Notification sent successfully'
      });
    } else {
      return res.status(400).json({
        success: false,
        message: result.error || 'Failed to send notification'
      });
    }
  } catch (error: any) {
    console.error('Error sending notification:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'An error occurred while sending notification'
    });
  }
};