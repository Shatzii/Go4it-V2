'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { 
  CreditCard, 
  Calendar, 
  BookOpen, 
  Users, 
  Award, 
  CheckCircle,
  ArrowLeft,
  Shield
} from 'lucide-react'
import Link from 'next/link'

// Initialize Stripe with runtime check to prevent build-time errors
const getStripePublicKey = () => {
  if (typeof window === 'undefined') return ''; // Server-side rendering
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
};

const stripePromise = typeof window !== 'undefined' 
  ? loadStripe(getStripePublicKey()) 
  : Promise.resolve(null);

interface PaymentFormProps {
  amount: number
  description: string
  studentId: string
  paymentType: string
  schoolId: string
  onSuccess: () => void
}

function PaymentForm({ amount, description, studentId, paymentType, schoolId, onSuccess }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    
    if (!stripe || !elements) return

    setLoading(true)
    setError(null)

    try {
      // Create payment intent
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          description,
          studentId,
          paymentType,
          schoolId
        }),
      })

      const { clientSecret } = await response.json()

      const cardElement = elements.getElement(CardElement)
      
      if (!cardElement) {
        throw new Error('Card element not found')
      }

      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        }
      })

      if (error) {
        setError(error.message || 'Payment failed')
      } else if (paymentIntent.status === 'succeeded') {
        onSuccess()
      }
    } catch (err) {
      setError('Payment processing error')
      console.error('Payment error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-2">Payment Details</h3>
        <p className="text-sm text-gray-600 mb-1">{description}</p>
        <p className="text-lg font-bold text-green-600">${amount.toFixed(2)}</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Information
          </label>
          <div className="p-3 border border-gray-300 rounded-lg">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <Shield className="w-4 h-4 mr-1" />
            Secured by Stripe
          </div>
          <button
            type="submit"
            disabled={!stripe || loading}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              loading || !stripe
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {loading ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
          </button>
        </div>
      </div>
    </form>
  )
}

export default function PaymentsPage() {
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const paymentOptions = [
    {
      id: 'tuition-monthly',
      title: 'Monthly Tuition',
      amount: 450,
      description: 'Monthly tuition payment for Universal One School',
      type: 'tuition',
      icon: BookOpen,
      color: 'bg-blue-500'
    },
    {
      id: 'enrollment-fee',
      title: 'Enrollment Fee',
      amount: 125,
      description: 'One-time enrollment fee for new students',
      type: 'enrollment',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      id: 'activity-fee',
      title: 'Activity Fee',
      amount: 75,
      description: 'Sports and extracurricular activities fee',
      type: 'activity',
      icon: Award,
      color: 'bg-purple-500'
    },
    {
      id: 'materials-fee',
      title: 'Materials Fee',
      amount: 35,
      description: 'Educational materials and supplies fee',
      type: 'materials',
      icon: Calendar,
      color: 'bg-orange-500'
    }
  ]

  const selectedOption = paymentOptions.find(option => option.id === selectedPayment)

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
            <p className="text-lg text-gray-600 mb-6">
              Thank you for your payment. A receipt has been sent to your email address.
            </p>
            <div className="space-y-4">
              <Link href="/parent-dashboard">
                <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Go to Parent Dashboard
                </button>
              </Link>
              <Link href="/payments/manage">
                <button className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  Manage Payments
                </button>
              </Link>
              <button
                onClick={() => {
                  setPaymentSuccess(false)
                  setSelectedPayment(null)
                }}
                className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Make Another Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/" className="flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Payment Center</h1>
              <p className="text-lg text-gray-600 mt-2">
                Secure payment processing for Universal One School
              </p>
            </div>
            <Link href="/payments/manage">
              <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Manage Payments
              </button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Options */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Select Payment Type</h2>
            <div className="space-y-4">
              {paymentOptions.map((option) => {
                const Icon = option.icon
                return (
                  <button
                    key={option.id}
                    onClick={() => setSelectedPayment(option.id)}
                    className={`w-full p-4 rounded-lg border-2 transition-all ${
                      selectedPayment === option.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-12 h-12 rounded-lg ${option.color} flex items-center justify-center mr-4`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold text-gray-900">{option.title}</h3>
                          <p className="text-sm text-gray-600">{option.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900">${option.amount}</p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Information</h2>
            
            {selectedOption ? (
              <Elements stripe={stripePromise}>
                <PaymentForm
                  amount={selectedOption.amount}
                  description={selectedOption.description}
                  studentId="student-123" // Replace with actual student ID
                  paymentType={selectedOption.type}
                  schoolId="primary-school" // Replace with actual school ID
                  onSuccess={() => setPaymentSuccess(true)}
                />
              </Elements>
            ) : (
              <div className="text-center py-12">
                <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select Payment Type</h3>
                <p className="text-gray-600">
                  Choose a payment option from the left to proceed with secure payment processing.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Security Information */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Security & Privacy</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Shield className="w-12 h-12 text-green-500 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Secure Processing</h3>
              <p className="text-sm text-gray-600">All payments are processed securely through Stripe</p>
            </div>
            <div className="text-center">
              <CreditCard className="w-12 h-12 text-blue-500 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Multiple Payment Methods</h3>
              <p className="text-sm text-gray-600">Accept all major credit and debit cards</p>
            </div>
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-purple-500 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Instant Confirmation</h3>
              <p className="text-sm text-gray-600">Immediate payment confirmation and receipts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}