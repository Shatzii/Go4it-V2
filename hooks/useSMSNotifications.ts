'use client';

import { useState } from 'react';

interface SMSNotificationHook {
  sendPaymentConfirmation: (data: PaymentSMSData) => Promise<boolean>;
  sendGARUpdate: (data: GARSMSData) => Promise<boolean>;
  sendCoachReminder: (data: CoachSMSData) => Promise<boolean>;
  sendEmergencyAlert: (data: EmergencySMSData) => Promise<boolean>;
  sendCampNotification: (data: CampSMSData) => Promise<boolean>;
  sendRecruitingUpdate: (data: RecruitingSMSData) => Promise<boolean>;
  sendGameNotification: (data: GameSMSData) => Promise<boolean>;
  isSending: boolean;
  lastResult: any;
}

interface PaymentSMSData {
  customerPhone: string;
  amount: number;
  description: string;
  status: 'succeeded' | 'failed' | 'requires_action';
  paymentIntentId?: string;
}

interface GARSMSData {
  athletePhone?: string;
  parentPhone?: string;
  athleteName: string;
  garScore: number;
  improvements: string[];
  videoTitle: string;
}

interface CoachSMSData {
  athletePhone: string;
  coachName: string;
  sessionDate: string;
  sessionTime: string;
  sessionType: string;
  notificationType: 'confirmation' | 'reminder' | 'cancellation' | 'rescheduled';
  sessionId?: string;
}

interface EmergencySMSData {
  alertType: string;
  message: string;
  affectedUsers: Array<{ phone: string; name: string; role: string }>;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface CampSMSData {
  parentPhone: string;
  childName: string;
  campName: string;
  campDate: string;
  notificationType: 'registration' | 'reminder' | 'checkin' | 'pickup' | 'update';
  location?: string;
  time?: string;
}

interface RecruitingSMSData {
  athletePhone?: string;
  parentPhone?: string;
  athleteName: string;
  notificationType: 'scout_interest' | 'scholarship_opportunity' | 'ncaa_deadline' | 'profile_view';
  schoolName?: string;
  coachName?: string;
  amount?: string;
  deadline?: string;
  requirement?: string;
}

interface GameSMSData {
  athletePhone?: string;
  parentPhone?: string;
  athleteName: string;
  notificationType: 'achievement' | 'daily_challenge' | 'leaderboard' | 'streak' | 'level_up';
  achievementName?: string;
  challengeName?: string;
  rewardXP?: number;
  position?: number;
  category?: string;
  streakDays?: number;
  newLevel?: number;
}

export function useSMSNotifications(): SMSNotificationHook {
  const [isSending, setIsSending] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);

  const sendPaymentConfirmation = async (data: PaymentSMSData): Promise<boolean> => {
    setIsSending(true);
    try {
      const response = await fetch('/api/payments/sms-notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      setLastResult(result);
      return result.success;
    } catch (error) {
      console.error('Failed to send payment SMS:', error);
      setLastResult({ success: false, error: 'Failed to send SMS' });
      return false;
    } finally {
      setIsSending(false);
    }
  };

  const sendGARUpdate = async (data: GARSMSData): Promise<boolean> => {
    setIsSending(true);
    try {
      const response = await fetch('/api/gar/sms-notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      setLastResult(result);
      return result.success;
    } catch (error) {
      console.error('Failed to send GAR SMS:', error);
      setLastResult({ success: false, error: 'Failed to send SMS' });
      return false;
    } finally {
      setIsSending(false);
    }
  };

  const sendCoachReminder = async (data: CoachSMSData): Promise<boolean> => {
    setIsSending(true);
    try {
      const response = await fetch('/api/coaches/session-notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      setLastResult(result);
      return result.success;
    } catch (error) {
      console.error('Failed to send coach SMS:', error);
      setLastResult({ success: false, error: 'Failed to send SMS' });
      return false;
    } finally {
      setIsSending(false);
    }
  };

  const sendEmergencyAlert = async (data: EmergencySMSData): Promise<boolean> => {
    setIsSending(true);
    try {
      const response = await fetch('/api/emergency/sms-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      setLastResult(result);
      return result.success;
    } catch (error) {
      console.error('Failed to send emergency SMS:', error);
      setLastResult({ success: false, error: 'Failed to send SMS' });
      return false;
    } finally {
      setIsSending(false);
    }
  };

  const sendCampNotification = async (data: CampSMSData): Promise<boolean> => {
    setIsSending(true);
    try {
      const response = await fetch('/api/camps/sms-notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      setLastResult(result);
      return result.success;
    } catch (error) {
      console.error('Failed to send camp SMS:', error);
      setLastResult({ success: false, error: 'Failed to send SMS' });
      return false;
    } finally {
      setIsSending(false);
    }
  };

  const sendRecruitingUpdate = async (data: RecruitingSMSData): Promise<boolean> => {
    setIsSending(true);
    try {
      const response = await fetch('/api/recruiting/sms-notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      setLastResult(result);
      return result.success;
    } catch (error) {
      console.error('Failed to send recruiting SMS:', error);
      setLastResult({ success: false, error: 'Failed to send SMS' });
      return false;
    } finally {
      setIsSending(false);
    }
  };

  const sendGameNotification = async (data: GameSMSData): Promise<boolean> => {
    setIsSending(true);
    try {
      const response = await fetch('/api/gamification/sms-notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      setLastResult(result);
      return result.success;
    } catch (error) {
      console.error('Failed to send game SMS:', error);
      setLastResult({ success: false, error: 'Failed to send SMS' });
      return false;
    } finally {
      setIsSending(false);
    }
  };

  return {
    sendPaymentConfirmation,
    sendGARUpdate,
    sendCoachReminder,
    sendEmergencyAlert,
    sendCampNotification,
    sendRecruitingUpdate,
    sendGameNotification,
    isSending,
    lastResult
  };
}