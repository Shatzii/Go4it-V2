'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, CreditCard, User, Star, CheckCircle } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Initialize Stripe with runtime check to prevent build-time errors
const getStripePublicKey = () => {
  if (typeof window === 'undefined') return ''; // Server-side rendering
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
};

const stripePromise = typeof window !== 'undefined' 
  ? loadStripe(getStripePublicKey()) 
  : Promise.resolve(null);

const BookingForm = ({ sessionData }: { sessionData: any }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) return;
    
    setIsProcessing(true);
    setPaymentError(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/booking-success?session=${sessionData.coachId}`,
      },
    });

    if (error) {
      setPaymentError(error.message || 'Payment failed');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      {paymentError && (
        <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
          <p className="text-red-400 text-sm">{paymentError}</p>
        </div>
      )}
      
      <Button 
        type="submit" 
        disabled={!stripe || isProcessing}
        className="w-full bg-green-600 hover:bg-green-700"
      >
        {isProcessing ? 'Processing...' : `Pay $${sessionData.rate}`}
      </Button>
    </form>
  );
};

export default function BookSessionPage() {
  const [sessionData, setSessionData] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');

  useEffect(() => {
    // Get session data from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const data = {
      coachId: urlParams.get('coachId'),
      coachName: urlParams.get('coachName'),
      sessionType: urlParams.get('sessionType'),
      rate: parseInt(urlParams.get('rate') || '0'),
      specialty: urlParams.get('specialty')
    };
    
    setSessionData(data);
    
    // Create payment intent
    if (data.rate > 0) {
      createPaymentIntent(data);
    }
  }, []);

  const createPaymentIntent = async (data: any) => {
    // Check if Stripe is properly configured
    if (!getStripePublicKey()) {
      console.error('Stripe public key not configured');
      return;
    }
    
    try {
      const response = await fetch('/api/payments/class', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classId: `session_${Date.now()}`,
          className: `${data.sessionType} with ${data.coachName}`,
          coach: data.coachName,
          price: data.rate,
          userId: 'current_user_id', // In production, get from auth
          userEmail: 'user@example.com' // In production, get from auth
        })
      });
      
      const result = await response.json();
      if (result.success) {
        setClientSecret(result.clientSecret);
      }
    } catch (error) {
      console.error('Failed to create payment intent:', error);
    }
  };

  if (!sessionData) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const sessionTypes = {
    consultation: 'Consultation Session',
    training: '1-on-1 Training',
    live_class: 'Live Class Access'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Book Your Session</h1>
          <p className="text-slate-300">Complete your booking with {sessionData.coachName}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Session Details */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="w-5 h-5 text-blue-400" />
                Session Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-white mb-2">{sessionData.coachName}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-slate-300">4.9 rating • 127 reviews</span>
                </div>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  {sessionData.specialty}
                </Badge>
              </div>

              <div className="border-t border-slate-600 pt-4">
                <h4 className="font-medium text-white mb-2">Session Type</h4>
                <p className="text-slate-300">{sessionTypes[sessionData.sessionType as keyof typeof sessionTypes]}</p>
              </div>

              <div className="border-t border-slate-600 pt-4">
                <h4 className="font-medium text-white mb-2">Duration & Rate</h4>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">60 minutes</span>
                  <span className="text-2xl font-bold text-green-400">${sessionData.rate}</span>
                </div>
              </div>

              {/* Schedule Selection */}
              <div className="border-t border-slate-600 pt-4">
                <h4 className="font-medium text-white mb-3">Select Date & Time</h4>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Date</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Time</label>
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white"
                    >
                      <option value="">Select time</option>
                      <option value="09:00">9:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="14:00">2:00 PM</option>
                      <option value="15:00">3:00 PM</option>
                      <option value="16:00">4:00 PM</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* What's Included */}
              <div className="border-t border-slate-600 pt-4">
                <h4 className="font-medium text-white mb-2">What's Included</h4>
                <ul className="space-y-1 text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Personalized coaching session
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Custom training plan
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Follow-up recommendations
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Session recording (if requested)
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-green-400" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              {clientSecret && getStripePublicKey() ? (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <BookingForm sessionData={sessionData} />
                </Elements>
              ) : !getStripePublicKey() ? (
                <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 text-sm">Payment system not configured. Please contact support.</p>
                </div>
              ) : (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                  <span className="ml-3 text-slate-300">Loading payment form...</span>
                </div>
              )}

              <div className="mt-6 p-4 bg-slate-700/50 rounded-lg">
                <h5 className="font-medium text-white mb-2">Cancellation Policy</h5>
                <p className="text-sm text-slate-400">
                  Full refund available up to 24 hours before your scheduled session. 
                  Cancellations within 24 hours are subject to a 50% cancellation fee.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}