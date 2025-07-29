'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Check, X, Percent, Gift, Star } from 'lucide-react'

interface CouponInputProps {
  onCouponApplied?: (coupon: any) => void
  planId?: string
  amount?: number
  className?: string
}

export function CouponInput({ onCouponApplied, planId, amount = 0, className }: CouponInputProps) {
  const [couponCode, setCouponCode] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const [validationResult, setValidationResult] = useState<any>(null)
  const [error, setError] = useState('')

  const validateCoupon = async () => {
    if (!couponCode.trim()) return

    setIsValidating(true)
    setError('')
    setValidationResult(null)

    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: couponCode.trim(),
          planId,
          amount,
          userId: 'demo-user', // In real app, get from auth
        }),
      })

      const result = await response.json()

      if (result.valid) {
        setValidationResult(result.coupon)
        onCouponApplied?.(result.coupon)
      } else {
        setError(result.error || 'Invalid coupon code')
      }
    } catch (err) {
      setError('Failed to validate coupon')
    } finally {
      setIsValidating(false)
    }
  }

  const removeCoupon = () => {
    setCouponCode('')
    setValidationResult(null)
    setError('')
    onCouponApplied?.(null)
  }

  const getDiscountIcon = (discountType: string) => {
    switch (discountType) {
      case 'percentage':
        return <Percent className="w-4 h-4" />
      case 'free':
        return <Gift className="w-4 h-4" />
      case 'fixed':
        return <Star className="w-4 h-4" />
      default:
        return <Percent className="w-4 h-4" />
    }
  }

  const formatDiscount = (discountType: string, discountValue: string) => {
    switch (discountType) {
      case 'percentage':
        return `${discountValue}% OFF`
      case 'free':
        return 'FREE MONTH'
      case 'fixed':
        return `$${discountValue} OFF`
      default:
        return `${discountValue}% OFF`
    }
  }

  return (
    <div className={className}>
      {!validationResult ? (
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === 'Enter' && validateCoupon()}
              className="flex-1"
              disabled={isValidating}
            />
            <Button
              onClick={validateCoupon}
              disabled={!couponCode.trim() || isValidating}
              variant="outline"
            >
              {isValidating ? 'Checking...' : 'Apply'}
            </Button>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-500 text-sm">
              <X className="w-4 h-4" />
              {error}
            </div>
          )}

          {/* Show popular coupon codes */}
          <div className="text-sm text-slate-400">
            <p className="mb-2">Try these codes:</p>
            <div className="flex flex-wrap gap-2">
              {['SAVE20', 'HALFOFF', 'FREEMONTH'].map((code) => (
                <Badge
                  key={code}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary/20"
                  onClick={() => setCouponCode(code)}
                >
                  {code}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <Check className="w-5 h-5" />
                  {getDiscountIcon(validationResult.discountType)}
                </div>
                <div>
                  <div className="font-medium text-green-800 dark:text-green-200">
                    {validationResult.name}
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400">
                    {formatDiscount(validationResult.discountType, validationResult.discountValue)} Applied
                  </div>
                  {validationResult.discountAmount && (
                    <div className="text-sm text-green-600 dark:text-green-400">
                      You save ${validationResult.discountAmount}
                    </div>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={removeCoupon}
                className="text-green-600 hover:text-green-800"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Predefined coupon showcase component
export function CouponShowcase() {
  const coupons = [
    {
      code: 'FREEMONTH',
      name: 'Free Month Access',
      description: 'Get your first month completely free',
      discount: 'FREE MONTH',
      color: 'from-purple-500 to-pink-500',
      icon: Gift,
    },
    {
      code: 'SAVE20',
      name: '20% Off Discount',
      description: 'Save 20% on any subscription plan',
      discount: '20% OFF',
      color: 'from-blue-500 to-cyan-500',
      icon: Percent,
    },
    {
      code: 'HALFOFF',
      name: '50% Off Special',
      description: 'Limited time 50% discount',
      discount: '50% OFF',
      color: 'from-orange-500 to-red-500',
      icon: Star,
    },
    {
      code: 'SUPERSTAR75',
      name: '75% Off Elite Deal',
      description: 'Massive savings for serious athletes',
      discount: '75% OFF',
      color: 'from-green-500 to-emerald-500',
      icon: Gift,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {coupons.map((coupon) => {
        const Icon = coupon.icon
        return (
          <Card key={coupon.code} className="relative overflow-hidden bg-slate-800 border-slate-700">
            <div className={`absolute inset-0 bg-gradient-to-br ${coupon.color} opacity-10`} />
            <CardContent className="p-4 relative">
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-5 h-5 text-primary" />
                <Badge variant="outline" className="text-xs">
                  {coupon.code}
                </Badge>
              </div>
              <div className="font-bold text-lg text-white mb-1">
                {coupon.discount}
              </div>
              <div className="text-sm text-slate-300 mb-2">
                {coupon.name}
              </div>
              <div className="text-xs text-slate-400">
                {coupon.description}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}