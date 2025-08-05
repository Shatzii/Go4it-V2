'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { 
  CreditCard, 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  Clock, 
  CheckCircle,
  AlertCircle
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

interface PaymentRecord {
  id: string
  amount: number
  description: string
  status: 'pending' | 'completed' | 'failed'
  date: string
  dueDate?: string
  paymentType: 'tuition' | 'enrollment' | 'activity' | 'materials'
}

export default function ParentDashboardPayments() {
  const [selectedStudent, setSelectedStudent] = useState('emma')
  const [showPaymentForm, setShowPaymentForm] = useState(false)

  const students = [
    { id: 'emma', name: 'Emma Rodriguez', grade: 'Kindergarten', school: 'SuperHero Elementary' },
    { id: 'marcus', name: 'Marcus Johnson', grade: '3rd Grade', school: 'SuperHero Elementary' }
  ]

  const pendingPayments: PaymentRecord[] = [
    {
      id: 'tuition-01',
      amount: 450,
      description: 'January 2025 Tuition - SuperHero Elementary',
      status: 'pending',
      date: '2025-01-15',
      dueDate: '2025-01-20',
      paymentType: 'tuition'
    },
    {
      id: 'activity-01',
      amount: 75,
      description: 'Art Club Activity Fee',
      status: 'pending',
      date: '2025-01-10',
      dueDate: '2025-01-25',
      paymentType: 'activity'
    }
  ]

  const paymentHistory: PaymentRecord[] = [
    {
      id: 'tuition-12',
      amount: 450,
      description: 'December 2024 Tuition - SuperHero Elementary',
      status: 'completed',
      date: '2024-12-15',
      paymentType: 'tuition'
    },
    {
      id: 'enrollment-01',
      amount: 125,
      description: 'Enrollment Fee - SuperHero Elementary',
      status: 'completed',
      date: '2024-08-20',
      paymentType: 'enrollment'
    },
    {
      id: 'materials-01',
      amount: 35,
      description: 'School Materials Fee',
      status: 'completed',
      date: '2024-08-25',
      paymentType: 'materials'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50'
      case 'pending': return 'text-yellow-600 bg-yellow-50'
      case 'failed': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />
      case 'pending': return <Clock className="w-4 h-4" />
      case 'failed': return <AlertCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const selectedStudentData = students.find(s => s.id === selectedStudent)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="flex items-center text-sm text-gray-600 mb-4">
            <Link href="/parent-dashboard" className="hover:text-blue-600">
              Parent Dashboard
            </Link>
            <span className="mx-2">/</span>
            <span className="text-blue-600">Payments</span>
          </nav>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Payment Center</h1>
              <p className="text-lg text-gray-600 mt-1">
                Manage tuition, fees, and payment history
              </p>
            </div>
            <Link href="/payments">
              <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <CreditCard className="w-5 h-5" />
                Make Payment
              </button>
            </Link>
          </div>
        </div>

        {/* Student Selector */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Student</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {students.map((student) => (
              <button
                key={student.id}
                onClick={() => setSelectedStudent(student.id)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedStudent === student.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h3 className="font-semibold text-gray-900">{student.name}</h3>
                <p className="text-sm text-gray-600">{student.grade} • {student.school}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Payments */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Pending Payments</h2>
              <span className="text-sm text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                {pendingPayments.length} pending
              </span>
            </div>
            
            <div className="space-y-4">
              {pendingPayments.map((payment) => (
                <div key={payment.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{payment.description}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Due: {new Date(payment.dueDate!).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900">${payment.amount}</p>
                      <div className={`flex items-center gap-1 text-sm px-2 py-1 rounded-full ${getStatusColor(payment.status)}`}>
                        {getStatusIcon(payment.status)}
                        <span className="capitalize">{payment.status}</span>
                      </div>
                    </div>
                  </div>
                  <Link href="/payments">
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Pay Now
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Payment History */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Payment History</h2>
              <span className="text-sm text-gray-600">
                {paymentHistory.length} payments
              </span>
            </div>
            
            <div className="space-y-4">
              {paymentHistory.map((payment) => (
                <div key={payment.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{payment.description}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Paid: {new Date(payment.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900">${payment.amount}</p>
                      <div className={`flex items-center gap-1 text-sm px-2 py-1 rounded-full ${getStatusColor(payment.status)}`}>
                        {getStatusIcon(payment.status)}
                        <span className="capitalize">{payment.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Summary</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                ${pendingPayments.reduce((sum, p) => sum + p.amount, 0)}
              </p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                ${paymentHistory.reduce((sum, p) => sum + p.amount, 0)}
              </p>
              <p className="text-sm text-gray-600">Paid This Year</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">Jan 20</p>
              <p className="text-sm text-gray-600">Next Due Date</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">$450</p>
              <p className="text-sm text-gray-600">Monthly Tuition</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}