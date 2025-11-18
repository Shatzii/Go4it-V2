'use client';

import React, { useState, useEffect } from 'react';
import dynamicImport from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CouponShowcase } from '@/components/ui/coupon-input';
import {
  Gift,
  Percent,
  Star,
  Clock,
  Users,
  CheckCircle,
  Copy,
  Calendar,
  DollarSign,
} from 'lucide-react';

// Disable static generation for this page
export const dynamic = 'force-dynamic';

// Lazy load CouponInput to avoid SSR issues with Clerk
const CouponInput = dynamicImport(
  () => import('@/components/ui/coupon-input').then(mod => ({ default: mod.CouponInput })),
  { ssr: false }
);

export default function CouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState('');

  useEffect(() => {
    loadCoupons();
    initializeCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      const response = await fetch('/api/coupons/list?active=true');
      const data = await response.json();
      if (data.success) {
        setCoupons(data.coupons);
      }
    } catch (error) {
      console.error('Failed to load coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeCoupons = async () => {
    try {
      await fetch('/api/coupons/admin?action=init', { method: 'POST' });
    } catch (error) {
      console.error('Failed to initialize coupons:', error);
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const getDiscountIcon = (discountType: string) => {
    switch (discountType) {
      case 'percentage':
        return Percent;
      case 'free':
        return Gift;
      case 'fixed':
        return DollarSign;
      default:
        return Star;
    }
  };

  const formatDiscount = (discountType: string, discountValue: string) => {
    switch (discountType) {
      case 'percentage':
        return `${discountValue}% OFF`;
      case 'free':
        return 'FREE MONTH';
      case 'fixed':
        return `$${discountValue} OFF`;
      default:
        return `${discountValue}% OFF`;
    }
  };

  const getDiscountColor = (discountValue: string) => {
    const value = parseFloat(discountValue);
    if (value >= 75) return 'from-green-500 to-emerald-500';
    if (value >= 50) return 'from-orange-500 to-red-500';
    if (value >= 20) return 'from-blue-500 to-cyan-500';
    return 'from-purple-500 to-pink-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full border border-primary/30 mb-6">
            <Gift className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Exclusive Discount Codes</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Save Big on Go4It Sports
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Unlock exclusive savings with our promotional codes. From free months to massive
            discounts, find the perfect deal for your athletic journey.
          </p>
        </div>

        {/* Coupon Testing Section */}
        <Card className="bg-slate-800/50 border-slate-700 mb-12">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              Test Your Coupon Code
            </CardTitle>
            <CardDescription>
              Enter a coupon code below to see how much you can save
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CouponInput
              planId="starter"
              amount={19}
              onCouponApplied={(coupon) => {
                if (coupon) {
                  console.log('Coupon applied:', coupon);
                }
              }}
            />
          </CardContent>
        </Card>

        {/* Available Coupons */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Available Discount Codes
          </h2>

          {loading ? (
            <div className="text-center text-slate-400">Loading coupons...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {coupons.map((coupon: any) => {
                const Icon = getDiscountIcon(coupon.discountType);
                const colorClass = getDiscountColor(coupon.discountValue);
                const usagePercent = coupon.maxUses
                  ? (coupon.currentUses / coupon.maxUses) * 100
                  : 0;

                return (
                  <Card
                    key={coupon.id}
                    className="relative overflow-hidden bg-slate-800 border-slate-700 hover:border-primary/50 transition-colors"
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${colorClass} opacity-10`}
                    />
                    <CardHeader className="relative pb-2">
                      <div className="flex items-center justify-between">
                        <Icon className="w-6 h-6 text-primary" />
                        <Badge
                          variant="outline"
                          className="cursor-pointer hover:bg-primary/20"
                          onClick={() => copyToClipboard(coupon.code)}
                        >
                          {copiedCode === coupon.code ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          ) : (
                            <Copy className="w-3 h-3 mr-1" />
                          )}
                          {coupon.code}
                        </Badge>
                      </div>
                      <CardTitle className="text-white text-xl">
                        {formatDiscount(coupon.discountType, coupon.discountValue)}
                      </CardTitle>
                      <CardDescription className="text-slate-300">{coupon.name}</CardDescription>
                    </CardHeader>
                    <CardContent className="relative">
                      <p className="text-sm text-slate-400 mb-4">{coupon.description}</p>

                      {/* Usage Progress */}
                      {coupon.maxUses && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                            <span>
                              Used {coupon.currentUses} of {coupon.maxUses}
                            </span>
                            <span>{Math.round(usagePercent)}%</span>
                          </div>
                          <Progress value={usagePercent} className="h-1" />
                        </div>
                      )}

                      {/* Validity */}
                      <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                        <Calendar className="w-3 h-3" />
                        Valid until{' '}
                        {coupon.validUntil
                          ? new Date(coupon.validUntil).toLocaleDateString()
                          : 'No expiration'}
                      </div>

                      {/* Applicable Plans */}
                      {coupon.applicablePlans && coupon.applicablePlans.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {coupon.applicablePlans.map((plan: string) => (
                            <Badge key={plan} variant="secondary" className="text-xs">
                              {plan.toUpperCase()}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => copyToClipboard(coupon.code)}
                      >
                        {copiedCode === coupon.code ? 'Copied!' : 'Copy Code'}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* How to Use */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">How to Use Coupon Codes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Copy className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-white mb-2">1. Copy Code</h3>
                <p className="text-sm text-slate-400">
                  Click on any coupon code above to copy it to your clipboard
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Star className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-white mb-2">2. Choose Plan</h3>
                <p className="text-sm text-slate-400">
                  Go to our pricing page and select your preferred subscription plan
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-white mb-2">3. Apply & Save</h3>
                <p className="text-sm text-slate-400">
                  Paste the code at checkout to instantly apply your discount
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
