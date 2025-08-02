'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Copy, Gift, Percent, DollarSign, Star } from 'lucide-react'

interface Coupon {
  id: string
  code: string
  name: string
  description?: string
  discountType: string
  discountValue: string
  maxUses?: number
  currentUses: number
  isActive: boolean
  validFrom: string
  validUntil?: string
  applicablePlans?: string[]
  minimumAmount?: string
}

export default function AdminCouponManagement() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Coupon>>({})
  const [showCreateForm, setShowCreateForm] = useState(false)

  useEffect(() => {
    loadCoupons()
  }, [])

  const loadCoupons = async () => {
    try {
      // Load existing coupons with the full access pass
      const mockCoupons: Coupon[] = [
        {
          id: '1',
          code: 'FULLACCESS2025',
          name: 'Full Access Pass',
          description: 'Complete access to all Go4It features - unlimited everything!',
          discountType: 'free',
          discountValue: '100',
          maxUses: 100,
          currentUses: 0,
          isActive: true,
          validFrom: new Date().toISOString(),
          validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          applicablePlans: ['starter', 'pro', 'elite'],
          minimumAmount: '0'
        },
        {
          id: '2',
          code: 'FREEMONTH',
          name: 'Free Month Access',
          description: 'Get one month completely free on any plan',
          discountType: 'free',
          discountValue: '100',
          maxUses: 1000,
          currentUses: 147,
          isActive: true,
          validFrom: new Date().toISOString(),
          validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          applicablePlans: ['starter', 'pro', 'elite'],
          minimumAmount: '0'
        },
        {
          id: '3',
          code: 'SUPERSTAR75',
          name: '75% Off Elite Deal',
          description: 'Massive 75% savings for serious athletes',
          discountType: 'percentage',
          discountValue: '75',
          maxUses: 50,
          currentUses: 23,
          isActive: true,
          validFrom: new Date().toISOString(),
          validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
          applicablePlans: ['pro', 'elite'],
          minimumAmount: '25'
        },
        {
          id: '4',
          code: 'HALFOFF',
          name: '50% Off Special',
          description: 'Limited time 50% discount',
          discountType: 'percentage',
          discountValue: '50',
          maxUses: 200,
          currentUses: 89,
          isActive: true,
          validFrom: new Date().toISOString(),
          validUntil: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
          applicablePlans: ['starter', 'pro', 'elite'],
          minimumAmount: '15'
        }
      ]
      setCoupons(mockCoupons)
    } catch (error) {
      console.error('Failed to load coupons:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCoupon = async () => {
    try {
      const newCoupon: Coupon = {
        id: Date.now().toString(),
        code: editForm.code || '',
        name: editForm.name || '',
        description: editForm.description,
        discountType: editForm.discountType || 'percentage',
        discountValue: editForm.discountValue || '0',
        maxUses: editForm.maxUses,
        currentUses: 0,
        isActive: editForm.isActive ?? true,
        validFrom: editForm.validFrom || new Date().toISOString(),
        validUntil: editForm.validUntil,
        applicablePlans: editForm.applicablePlans || ['starter', 'pro', 'elite'],
        minimumAmount: editForm.minimumAmount || '0'
      }

      setCoupons([...coupons, newCoupon])
      setShowCreateForm(false)
      setEditForm({})
      alert('Coupon created successfully!')
    } catch (error) {
      console.error('Failed to create coupon:', error)
      alert('Failed to create coupon')
    }
  }

  const handleUpdateCoupon = async (id: string) => {
    try {
      setCoupons(coupons.map(coupon => 
        coupon.id === id ? { ...coupon, ...editForm } : coupon
      ))
      setEditing(null)
      setEditForm({})
      alert('Coupon updated successfully!')
    } catch (error) {
      console.error('Failed to update coupon:', error)
      alert('Failed to update coupon')
    }
  }

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return

    try {
      setCoupons(coupons.filter(coupon => coupon.id !== id))
      alert('Coupon deleted successfully!')
    } catch (error) {
      console.error('Failed to delete coupon:', error)
      alert('Failed to delete coupon')
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }

  const getDiscountIcon = (type: string) => {
    switch (type) {
      case 'free': return <Gift className="w-5 h-5 text-green-400" />
      case 'percentage': return <Percent className="w-5 h-5 text-blue-400" />
      case 'fixed': return <DollarSign className="w-5 h-5 text-yellow-400" />
      default: return <Gift className="w-5 h-5 text-slate-400" />
    }
  }

  const renderCouponForm = (coupon?: Coupon) => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Coupon Code</label>
          <input
            type="text"
            value={editForm.code || ''}
            onChange={(e) => setEditForm({ ...editForm, code: e.target.value.toUpperCase() })}
            className="form-input"
            placeholder="FREEMONTH"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Coupon Name</label>
          <input
            type="text"
            value={editForm.name || ''}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            className="form-input"
            placeholder="Free Month Access"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
        <textarea
          value={editForm.description || ''}
          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
          className="form-input"
          rows={3}
          placeholder="Get one month completely free on any plan"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Discount Type</label>
          <select
            value={editForm.discountType || 'percentage'}
            onChange={(e) => setEditForm({ ...editForm, discountType: e.target.value })}
            className="form-input"
          >
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed Amount</option>
            <option value="free">Free Access</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Discount Value {editForm.discountType === 'percentage' ? '(%)' : editForm.discountType === 'fixed' ? '($)' : ''}
          </label>
          <input
            type="number"
            value={editForm.discountValue || ''}
            onChange={(e) => setEditForm({ ...editForm, discountValue: e.target.value })}
            className="form-input"
            placeholder={editForm.discountType === 'free' ? '100' : '20'}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Max Uses</label>
          <input
            type="number"
            value={editForm.maxUses || ''}
            onChange={(e) => setEditForm({ ...editForm, maxUses: parseInt(e.target.value) })}
            className="form-input"
            placeholder="100"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Valid From</label>
          <input
            type="datetime-local"
            value={editForm.validFrom ? new Date(editForm.validFrom).toISOString().slice(0, 16) : ''}
            onChange={(e) => setEditForm({ ...editForm, validFrom: new Date(e.target.value).toISOString() })}
            className="form-input"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Valid Until (Optional)</label>
          <input
            type="datetime-local"
            value={editForm.validUntil ? new Date(editForm.validUntil).toISOString().slice(0, 16) : ''}
            onChange={(e) => setEditForm({ ...editForm, validUntil: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
            className="form-input"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Applicable Plans</label>
        <div className="flex gap-4">
          {['starter', 'pro', 'elite'].map(plan => (
            <label key={plan} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={editForm.applicablePlans?.includes(plan) || false}
                onChange={(e) => {
                  const plans = editForm.applicablePlans || []
                  if (e.target.checked) {
                    setEditForm({ ...editForm, applicablePlans: [...plans, plan] })
                  } else {
                    setEditForm({ ...editForm, applicablePlans: plans.filter(p => p !== plan) })
                  }
                }}
                className="rounded"
              />
              <span className="text-slate-300 capitalize">{plan}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={editForm.isActive ?? true}
            onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
            className="rounded"
          />
          <span className="text-slate-300">Active</span>
        </label>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen hero-bg p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-pulse-slow neon-text text-xl">Loading coupons...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen hero-bg p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold neon-text mb-2">Coupon Management</h1>
          <p className="text-slate-400">Create and manage discount coupons and full access passes</p>
        </div>

        {/* Create Button */}
        <div className="mb-8">
          <button
            onClick={() => {
              setShowCreateForm(true)
              setEditForm({
                discountType: 'percentage',
                discountValue: '20',
                isActive: true,
                validFrom: new Date().toISOString(),
                applicablePlans: ['starter', 'pro', 'elite']
              })
            }}
            className="btn-primary px-6 py-3"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Coupon
          </button>
        </div>

        {/* Coupon Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {coupons.map(coupon => (
            <div key={coupon.id} className="hero-bg neon-border rounded-xl p-6 relative overflow-hidden">
              {/* Special Full Access Badge */}
              {coupon.code === 'FULLACCESS2025' && (
                <div className="absolute top-4 right-4">
                  <div className="bg-gradient-to-r from-gold-500 to-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    FULL ACCESS
                  </div>
                </div>
              )}

              {/* Status Badge */}
              <div className="absolute top-4 left-4">
                <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                  coupon.isActive
                    ? 'bg-green-900/30 text-green-400 border border-green-700'
                    : 'bg-red-900/30 text-red-400 border border-red-700'
                }`}>
                  {coupon.isActive ? 'Active' : 'Inactive'}
                </div>
              </div>

              <div className="mt-12 mb-4">
                <div className="flex items-center gap-3 mb-2">
                  {getDiscountIcon(coupon.discountType)}
                  <h3 className="text-xl font-bold text-white">{coupon.name}</h3>
                </div>
                <p className="text-slate-400 mb-4">{coupon.description}</p>
                
                <div className="bg-slate-800/50 p-4 rounded-lg mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400">Coupon Code:</span>
                    <div className="flex items-center gap-2">
                      <code className="bg-slate-700 px-3 py-1 rounded text-blue-400 font-mono font-bold">
                        {coupon.code}
                      </code>
                      <button
                        onClick={() => copyToClipboard(coupon.code)}
                        className="text-slate-400 hover:text-white"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400">Discount:</span>
                    <span className="text-blue-400 font-bold">
                      {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` :
                       coupon.discountType === 'fixed' ? `$${coupon.discountValue}` :
                       'FREE ACCESS'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Usage:</span>
                    <span className="text-slate-300">
                      {coupon.currentUses} / {coupon.maxUses || '∞'} used
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditing(coupon.id)
                    setEditForm(coupon)
                  }}
                  className="btn-primary flex-1 py-2 text-sm"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteCoupon(coupon.id)}
                  className="btn-danger py-2 px-4 text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Background Effect */}
              <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-purple-500 rounded-full blur-2xl"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Create/Edit Modal */}
        {(showCreateForm || editing) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="hero-bg neon-border rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {showCreateForm ? 'Create New Coupon' : 'Edit Coupon'}
                </h2>
                <button
                  onClick={() => {
                    setShowCreateForm(false)
                    setEditing(null)
                    setEditForm({})
                  }}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {renderCouponForm()}

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => {
                    if (showCreateForm) {
                      handleCreateCoupon()
                    } else if (editing) {
                      handleUpdateCoupon(editing)
                    }
                  }}
                  className="btn-primary px-6 py-3"
                >
                  {showCreateForm ? 'Create Coupon' : 'Update Coupon'}
                </button>
                <button
                  onClick={() => {
                    setShowCreateForm(false)
                    setEditing(null)
                    setEditForm({})
                  }}
                  className="btn-secondary px-6 py-3"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}