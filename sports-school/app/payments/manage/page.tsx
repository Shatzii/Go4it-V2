'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  DollarSign,
  Calendar,
  Users,
  Settings,
  CheckCircle,
  AlertCircle,
  Clock,
} from 'lucide-react';
import Link from 'next/link';

interface Payment {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  description: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  dueDate: string;
  paymentType: string;
  schoolId: string;
  createdAt: string;
}

interface PaymentType {
  id: string;
  name: string;
  description: string;
  defaultAmount: number;
  category: string;
  recurring: boolean;
  required: boolean;
  custom?: boolean;
}

export default function PaymentManagement() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentTypes, setPaymentTypes] = useState<PaymentType[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [showNewPaymentForm, setShowNewPaymentForm] = useState(false);
  const [showNewTypeForm, setShowNewTypeForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sample payment data
  const samplePayments: Payment[] = [
    {
      id: 'pay-001',
      studentId: 'student-emma',
      studentName: 'Emma Rodriguez',
      amount: 450,
      description: 'January 2025 Tuition - SuperHero Elementary',
      status: 'pending',
      dueDate: '2025-01-20',
      paymentType: 'tuition',
      schoolId: 'primary-school',
      createdAt: '2025-01-15',
    },
    {
      id: 'pay-002',
      studentId: 'student-marcus',
      studentName: 'Marcus Johnson',
      amount: 75,
      description: 'Art Club Activity Fee',
      status: 'completed',
      dueDate: '2025-01-25',
      paymentType: 'activity',
      schoolId: 'primary-school',
      createdAt: '2025-01-10',
    },
    {
      id: 'pay-003',
      studentId: 'student-emma',
      studentName: 'Emma Rodriguez',
      amount: 125,
      description: 'Enrollment Fee - SuperHero Elementary',
      status: 'completed',
      dueDate: '2024-08-20',
      paymentType: 'enrollment',
      schoolId: 'primary-school',
      createdAt: '2024-08-15',
    },
  ];

  useEffect(() => {
    // Load payment types and payments
    loadPaymentTypes();
    setPayments(samplePayments);
  }, []);

  const loadPaymentTypes = async () => {
    try {
      const response = await fetch('/api/payments/types');
      const data = await response.json();
      if (data.success) {
        setPaymentTypes(data.paymentTypes);
      }
    } catch (error) {
      console.error('Error loading payment types:', error);
    }
  };

  const handleEditPayment = (payment: Payment) => {
    setEditingPayment({ ...payment });
    setSelectedPayment(payment);
  };

  const handleSavePayment = async () => {
    if (!editingPayment) return;

    setLoading(true);
    try {
      const response = await fetch('/api/payments/adjust', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId: editingPayment.id,
          amount: editingPayment.amount,
          description: editingPayment.description,
          dueDate: editingPayment.dueDate,
          status: editingPayment.status,
        }),
      });

      if (response.ok) {
        // Update local state
        setPayments(payments.map((p) => (p.id === editingPayment.id ? editingPayment : p)));
        setEditingPayment(null);
        setSelectedPayment(null);
      }
    } catch (error) {
      console.error('Error saving payment:', error);
    }
    setLoading(false);
  };

  const handleCancelPayment = async (paymentId: string) => {
    if (!confirm('Are you sure you want to cancel this payment?')) return;

    setLoading(true);
    try {
      const response = await fetch('/api/payments/adjust', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId }),
      });

      if (response.ok) {
        setPayments(
          payments.map((p) => (p.id === paymentId ? { ...p, status: 'refunded' as const } : p)),
        );
      }
    } catch (error) {
      console.error('Error cancelling payment:', error);
    }
    setLoading(false);
  };

  const handleCreatePayment = async (formData: any) => {
    setLoading(true);
    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newPayment: Payment = {
          id: `pay-${Date.now()}`,
          studentId: formData.studentId,
          studentName: formData.studentName,
          amount: formData.amount,
          description: formData.description,
          status: 'pending',
          dueDate: formData.dueDate,
          paymentType: formData.paymentType,
          schoolId: formData.schoolId,
          createdAt: new Date().toISOString(),
        };
        setPayments([...payments, newPayment]);
        setShowNewPaymentForm(false);
      }
    } catch (error) {
      console.error('Error creating payment:', error);
    }
    setLoading(false);
  };

  const handleCreatePaymentType = async (formData: any) => {
    setLoading(true);
    try {
      const response = await fetch('/api/payments/types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setPaymentTypes([...paymentTypes, data.paymentType]);
        setShowNewTypeForm(false);
      }
    } catch (error) {
      console.error('Error creating payment type:', error);
    }
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      case 'refunded':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4" />;
      case 'refunded':
        return <X className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="flex items-center text-sm text-gray-600 mb-4">
            <Link href="/payments" className="hover:text-blue-600">
              Payments
            </Link>
            <span className="mx-2">/</span>
            <span className="text-blue-600">Manage Payments</span>
          </nav>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
              <p className="text-lg text-gray-600 mt-1">
                Adjust existing payments and create new payment types
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowNewPaymentForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                New Payment
              </button>
              <button
                onClick={() => setShowNewTypeForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Settings className="w-5 h-5" />
                New Payment Type
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">All Payments</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {payments.map((payment) => (
                  <div key={payment.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{payment.studentName}</h3>
                          <div
                            className={`flex items-center gap-1 text-sm px-2 py-1 rounded-full ${getStatusColor(payment.status)}`}
                          >
                            {getStatusIcon(payment.status)}
                            <span className="capitalize">{payment.status}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{payment.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Due: {new Date(payment.dueDate).toLocaleDateString()}</span>
                          <span>Type: {payment.paymentType}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-xl font-bold text-gray-900">${payment.amount}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditPayment(payment)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {payment.status === 'pending' && (
                            <button
                              onClick={() => handleCancelPayment(payment.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Edit Panel */}
          <div className="space-y-6">
            {editingPayment && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Payment</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                    <input
                      type="number"
                      value={editingPayment.amount}
                      onChange={(e) =>
                        setEditingPayment({
                          ...editingPayment,
                          amount: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={editingPayment.description}
                      onChange={(e) =>
                        setEditingPayment({
                          ...editingPayment,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                    <input
                      type="date"
                      value={editingPayment.dueDate}
                      onChange={(e) =>
                        setEditingPayment({
                          ...editingPayment,
                          dueDate: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={editingPayment.status}
                      onChange={(e) =>
                        setEditingPayment({
                          ...editingPayment,
                          status: e.target.value as any,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="failed">Failed</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSavePayment}
                      disabled={loading}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                    <button
                      onClick={() => {
                        setEditingPayment(null);
                        setSelectedPayment(null);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Types */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Types</h3>
              <div className="space-y-3">
                {paymentTypes.map((type) => (
                  <div
                    key={type.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium text-gray-900">{type.name}</h4>
                      <p className="text-sm text-gray-600">${type.defaultAmount}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {type.required && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                          Required
                        </span>
                      )}
                      {type.recurring && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          Recurring
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Payment Form Modal */}
      {showNewPaymentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Payment</h3>
            <NewPaymentForm
              paymentTypes={paymentTypes}
              onSubmit={handleCreatePayment}
              onCancel={() => setShowNewPaymentForm(false)}
              loading={loading}
            />
          </div>
        </div>
      )}

      {/* New Payment Type Form Modal */}
      {showNewTypeForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Payment Type</h3>
            <NewPaymentTypeForm
              onSubmit={handleCreatePaymentType}
              onCancel={() => setShowNewTypeForm(false)}
              loading={loading}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function NewPaymentForm({
  paymentTypes,
  onSubmit,
  onCancel,
  loading,
}: {
  paymentTypes: PaymentType[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    amount: '',
    description: '',
    dueDate: '',
    paymentType: '',
    schoolId: 'primary-school',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      amount: Number(formData.amount),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
        <input
          type="text"
          value={formData.studentName}
          onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Type</label>
        <select
          value={formData.paymentType}
          onChange={(e) => setFormData({ ...formData, paymentType: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        >
          <option value="">Select type</option>
          {paymentTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name} - ${type.defaultAmount}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
        <input
          type="number"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          rows={3}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
        <input
          type="date"
          value={formData.dueDate}
          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          Create Payment
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function NewPaymentTypeForm({
  onSubmit,
  onCancel,
  loading,
}: {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    defaultAmount: '',
    category: '',
    recurring: false,
    required: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      defaultAmount: Number(formData.defaultAmount),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          rows={3}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Default Amount</label>
        <input
          type="number"
          value={formData.defaultAmount}
          onChange={(e) => setFormData({ ...formData, defaultAmount: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        >
          <option value="">Select category</option>
          <option value="tuition">Tuition</option>
          <option value="enrollment">Enrollment</option>
          <option value="activity">Activity</option>
          <option value="materials">Materials</option>
          <option value="technology">Technology</option>
          <option value="ceremony">Ceremony</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div className="flex gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.recurring}
            onChange={(e) => setFormData({ ...formData, recurring: e.target.checked })}
            className="rounded border-gray-300"
          />
          <span className="text-sm text-gray-700">Recurring</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.required}
            onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
            className="rounded border-gray-300"
          />
          <span className="text-sm text-gray-700">Required</span>
        </label>
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          Create Type
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
