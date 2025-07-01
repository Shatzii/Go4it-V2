import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Building2, Zap, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface PaymentOption {
  id: string;
  name: string;
  type: 'credit' | 'ach' | 'wire' | 'crypto';
  fees: string;
  processingTime: string;
  icon: React.ReactNode;
}

const paymentOptions: PaymentOption[] = [
  {
    id: 'stripe-credit',
    name: 'Credit/Debit Card',
    type: 'credit',
    fees: '2.9% + 30¢',
    processingTime: 'Instant',
    icon: <CreditCard className="w-5 h-5" />
  },
  {
    id: 'ach-transfer',
    name: 'Bank Transfer (ACH)',
    type: 'ach',
    fees: '0.8%',
    processingTime: '1-3 business days',
    icon: <Building2 className="w-5 h-5" />
  },
  {
    id: 'wire-transfer',
    name: 'Wire Transfer',
    type: 'wire',
    fees: '$25 flat fee',
    processingTime: 'Same day',
    icon: <Zap className="w-5 h-5" />
  }
];

export default function Checkout() {
  const vertical = 'TruckFlow AI';
  const plan = 'Enterprise';
  const amount = 2500;
  const [selectedPayment, setSelectedPayment] = useState('stripe-credit');
  const [customerInfo, setCustomerInfo] = useState({
    companyName: '',
    email: '',
    phone: '',
    billingAddress: ''
  });
  const [processing, setProcessing] = useState(false);
  const [paymentReady, setPaymentReady] = useState(false);
  const { toast } = useToast();

  const selectedOption = paymentOptions.find(option => option.id === selectedPayment);
  const totalFees = selectedPayment === 'stripe-credit' 
    ? Math.round(amount * 0.029 + 30) / 100
    : selectedPayment === 'ach-transfer'
    ? Math.round(amount * 0.008) / 100
    : 25;

  const totalAmount = amount + totalFees;

  const handlePayment = async () => {
    if (!customerInfo.companyName || !customerInfo.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in company name and email",
        variant: "destructive"
      });
      return;
    }

    setProcessing(true);
    
    try {
      const response = await fetch('/api/payments/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount * 100, // Convert to cents
          vertical,
          plan,
          paymentMethod: selectedPayment,
          customer: customerInfo
        })
      });
      
      const result = await response.json();

      if (result.success) {
        setPaymentReady(true);
        toast({
          title: "Payment Processed!",
          description: `${vertical} ${plan} plan activated successfully`,
        });
      } else {
        throw new Error(result.error || 'Payment failed');
      }
    } catch (error: any) {
      toast({
        title: "Payment Error",
        description: error.message || 'Payment processing failed',
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  if (paymentReady) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-blue-500" />
            </div>
            <CardTitle className="text-2xl text-blue-500">Payment Successful!</CardTitle>
            <CardDescription>
              Your {vertical} {plan} plan is now active
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Amount: ${amount.toLocaleString()}
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Payment Method: {selectedOption?.name}
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Processing Time: {selectedOption?.processingTime}
                </p>
              </div>
              <Button 
                onClick={() => window.location.href = '/dashboard'}
                className="w-full"
              >
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Complete Your Purchase</h1>
        <p className="text-muted-foreground">
          {vertical} - {plan} Plan
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
            <CardDescription>Choose how you'd like to pay</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {paymentOptions.map((option) => (
              <div
                key={option.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedPayment === option.id
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-border hover:bg-muted/50'
                }`}
                onClick={() => setSelectedPayment(option.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {option.icon}
                    <div>
                      <p className="font-medium">{option.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Fees: {option.fees} • {option.processingTime}
                      </p>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    selectedPayment === option.id
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-muted-foreground'
                  }`} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle>Billing Information</CardTitle>
            <CardDescription>Your company details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="company">Company Name *</Label>
              <Input
                id="company"
                value={customerInfo.companyName}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, companyName: e.target.value }))}
                placeholder="Your Company LLC"
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                placeholder="you@company.com"
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="(555) 123-4567"
              />
            </div>
            
            <div>
              <Label htmlFor="address">Billing Address</Label>
              <Input
                id="address"
                value={customerInfo.billingAddress}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, billingAddress: e.target.value }))}
                placeholder="123 Business St, City, ST 12345"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Summary */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>{vertical} - {plan} Plan</span>
              <span>${amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Processing fees ({selectedOption?.fees})</span>
              <span>${totalFees.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
          </div>
          
          <Button 
            className="w-full mt-6" 
            size="lg"
            onClick={handlePayment}
            disabled={processing}
          >
            {processing ? 'Processing...' : `Pay $${totalAmount.toFixed(2)}`}
          </Button>
          
          <p className="text-xs text-muted-foreground mt-4 text-center">
            Secure payment processing. Funds transferred to BlueVine Business Account.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}