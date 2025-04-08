import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/auth-context';

export function GlobalAgreementModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [hasAgreed, setHasAgreed] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Check if user is logged in and show NDA agreement
    if (user) {
      // Force the NDA to show for every user session by checking session storage
      // instead of localStorage (which persists longer)
      const hasAgreedThisSession = sessionStorage.getItem('nda_agreed_session') === 'true';
      
      // Still respect the permanent agreement in localStorage for non-logged in users
      const hasAgreedPermanently = localStorage.getItem('nda_agreed') === 'true';
      
      // For logged in users, we require per-session agreement
      // For non-logged in users, we only need one-time agreement
      const shouldShowAgreement = !hasAgreedThisSession && (user ? true : !hasAgreedPermanently);
      
      setHasAgreed(!shouldShowAgreement);
      setOpen(shouldShowAgreement);
    } else {
      // For non-logged in users, check if they've ever agreed
      const hasAgreedToNDA = localStorage.getItem('nda_agreed') === 'true';
      setHasAgreed(hasAgreedToNDA);
      
      if (!hasAgreedToNDA) {
        setOpen(true);
      }
    }
  }, [user]);

  const handleAgree = async () => {
    if (!agreed) return;

    setLoading(true);
    try {
      if (user) {
        await apiRequest('/api/user-agreements', 'POST', {
          userId: user.id,
          agreementType: 'nda',
          version: '1.0',
          ipAddress: 'client',
          userAgent: navigator.userAgent
        });
      } else {
        await apiRequest('api/public/user-agreements', 'POST', {
          agreementType: 'nda',
          version: '1.0',
          ipAddress: 'client',
          userAgent: navigator.userAgent
        });
      }

      // Save to localStorage for permanent record
      localStorage.setItem('nda_agreed', 'true');
      
      // Also save to sessionStorage to track this session
      sessionStorage.setItem('nda_agreed_session', 'true');
      
      setHasAgreed(true);
      setOpen(false);
      
      // Check the current URL to determine where to redirect the user
      // If already on the auth page, no need to navigate away
      const currentPath = window.location.pathname;
      
      // If we're on the auth page, don't redirect, just close the modal
      if (currentPath === '/auth') {
        // Just stay on the auth page - don't redirect
        console.log('On auth page - keeping user here after NDA acceptance');
      } else {
        // For any other page, direct users to the auth page to encourage login
        window.location.href = '/auth';
      }
    } catch (error) {
      console.error('Failed to save agreement:', error);
      
      // Save to both storages even in case of API error
      localStorage.setItem('nda_agreed', 'true');
      sessionStorage.setItem('nda_agreed_session', 'true');
      
      setHasAgreed(true);
      setOpen(false);
      
      // Check the current URL to determine where to redirect the user
      // If already on the auth page, no need to navigate away
      const currentPath = window.location.pathname;
      
      // If we're on the auth page, don't redirect, just close the modal
      if (currentPath === '/auth') {
        // Just stay on the auth page - don't redirect
        console.log('On auth page - keeping user here after NDA acceptance (error case)');
      } else {
        // For any other page, direct users to the auth page to encourage login
        window.location.href = '/auth';
      }
    } finally {
      setLoading(false);
    }
  };

  if (hasAgreed) {
    return null;
  }

  return (
    <Dialog 
      open={open} 
      onOpenChange={() => {}}
      modal={true}
    >
      <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col p-0 gap-0 border-4 border-primary/50">
        <DialogHeader className="px-6 py-4 bg-primary/5 flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-2">
            CONFIDENTIALITY & NON-DISCLOSURE AGREEMENT
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-4 bg-destructive/5 border-y border-destructive/20">
          <p className="text-sm text-destructive font-medium">
            Please read and agree to the Non-Disclosure Agreement (NDA) before accessing Go4it. This agreement is legally binding.
          </p>
        </div>

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-4 text-sm">
            <p className="font-semibold">THIS CONFIDENTIALITY AND NON-DISCLOSURE AGREEMENT is effective upon acceptance.</p>

            <p><strong>BETWEEN:</strong> Go4it Sports ("Company")</p>
            <p><strong>AND:</strong> The User ("Recipient")</p>

            <h3 className="text-lg font-semibold mt-6">1. Confidential Information</h3>
            <p>
              "Confidential Information" includes all proprietary information related to:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>The GAR Rating system and evaluation methodologies</li>
              <li>Athlete development tools and analytics</li>
              <li>Platform features and functionality</li>
              <li>Business operations and strategies</li>
              <li>User data and insights</li>
            </ul>

            <h3 className="text-lg font-semibold mt-6">2. Obligations</h3>
            <p>The Recipient agrees to:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Maintain strict confidentiality of all Confidential Information</li>
              <li>Use the information solely for authorized platform purposes</li>
              <li>Not share access credentials or platform content</li>
              <li>Not reverse engineer or replicate platform features</li>
            </ul>

            <h3 className="text-lg font-semibold mt-6">3. Term</h3>
            <p>
              This Agreement remains in effect indefinitely from acceptance. Confidentiality obligations survive termination of platform access.
            </p>

            <h3 className="text-lg font-semibold mt-6">4. Enforcement</h3>
            <p>
              Violation may result in immediate account termination and legal action. The Company may seek injunctive relief in addition to other legal remedies.
            </p>

            <p className="font-semibold mt-6">
              BY CHECKING THE BOX BELOW, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTAND, AND AGREE TO BE BOUND BY THIS AGREEMENT.
            </p>
          </div>
        </ScrollArea>

        <Separator />

        <DialogFooter className="p-6 flex flex-col sm:flex-row gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="agree" 
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(!!checked)}
            />
            <label
              htmlFor="agree"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I have read and agree to the Non-Disclosure Agreement
            </label>
          </div>

          <Button 
            type="button" 
            onClick={handleAgree}
            disabled={!agreed || loading}
            size="lg"
            className="mt-0 sm:ml-auto"
          >
            {loading ? "Processing..." : "I Agree"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}