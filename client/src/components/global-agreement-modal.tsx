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
    // Check if user has already agreed to NDA from localStorage
    const hasAgreedToNDA = localStorage.getItem('nda_agreed') === 'true';
    setHasAgreed(hasAgreedToNDA);
    
    if (!hasAgreedToNDA) {
      setOpen(true);
    }
  }, []);

  const handleAgree = async () => {
    if (!agreed) return;
    
    setLoading(true);
    try {
      // If user is logged in, save agreement to database with user ID
      if (user) {
        await apiRequest('/api/user-agreements', 'POST', {
          userId: user.id,
          agreementType: 'nda',
          version: '1.0',
          ipAddress: 'client',
          userAgent: navigator.userAgent
        });
      } else {
        // For non-authenticated users, use the public endpoint
        await apiRequest('/api/public/user-agreements', 'POST', {
          agreementType: 'nda',
          version: '1.0',
          ipAddress: 'client',
          userAgent: navigator.userAgent
        });
      }
      
      // Mark as agreed in localStorage
      localStorage.setItem('nda_agreed', 'true');
      setHasAgreed(true);
      setOpen(false);
    } catch (error) {
      console.error('Failed to save agreement:', error);
      // Still mark as agreed in localStorage even if the API call fails
      // This prevents the user from being locked out if the server is unavailable
      localStorage.setItem('nda_agreed', 'true');
      setHasAgreed(true);
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  if (hasAgreed) {
    return null;
  }

  // Cannot close this dialog by clicking outside or pressing escape
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
            You must read and agree to the following Non-Disclosure Agreement (NDA) before accessing the Go4it platform. This agreement is legally binding.
          </p>
        </div>
        
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-4 text-sm">
            <p className="font-semibold">THIS CONFIDENTIALITY AND NON-DISCLOSURE AGREEMENT (the "Agreement") is made and entered into as of the date of acceptance.</p>
            
            <p><strong>BETWEEN:</strong> Go4it Sports, including its affiliates, subsidiaries, and parent companies (collectively, the "Company")</p>
            
            <p><strong>AND:</strong> You, the individual accessing or using the Go4it platform (the "Recipient")</p>
            
            <p className="font-semibold">WHEREAS:</p>
            
            <ol className="list-decimal pl-5 space-y-2">
              <li>The Company is developing and operating a proprietary sports technology platform that includes athlete development tools, scoring systems, evaluation methodologies, user interfaces, data analytics, and coaching resources (the "Confidential Information").</li>
              
              <li>The Recipient wishes to access the Company's platform for the purposes of athletic development, coaching, recruitment, or evaluation (the "Permitted Purpose").</li>
              
              <li>In connection with the Permitted Purpose, the Recipient may be exposed to or given access to Confidential Information belonging to the Company.</li>
              
              <li>The Company requires the Recipient to maintain the confidentiality of all Confidential Information in accordance with this Agreement.</li>
            </ol>
            
            <p className="font-semibold">NOW THEREFORE, in consideration of being granted access to the Confidential Information, the Recipient agrees as follows:</p>
            
            <ol className="list-decimal pl-5 space-y-4">
              <li>
                <p className="font-medium">Confidential Information</p>
                <p>"Confidential Information" means all information disclosed by the Company to the Recipient, including but not limited to:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>The GAR Rating system and all associated algorithms, methodologies, and scoring mechanisms;</li>
                  <li>Proprietary athlete evaluation tools and processes;</li>
                  <li>The platform's functionality, features, code, user interface, and design;</li>
                  <li>Business plans, strategies, and operational methods;</li>
                  <li>Technical specifications, data models, and software architecture;</li>
                  <li>User data, analytics, and insights generated by the platform;</li>
                  <li>Any other information that would reasonably be considered confidential or proprietary.</li>
                </ul>
              </li>
              
              <li>
                <p className="font-medium">Obligations of Confidentiality</p>
                <p>The Recipient shall:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Hold all Confidential Information in strict confidence;</li>
                  <li>Not disclose, distribute, reproduce, copy, transmit, disseminate, or otherwise communicate any Confidential Information to any third party without prior written consent from the Company;</li>
                  <li>Not use the Confidential Information for any purpose other than the Permitted Purpose;</li>
                  <li>Not reverse engineer, decompile, or disassemble any software, algorithms, or systems that form part of the Confidential Information;</li>
                  <li>Not take screenshots, record, or otherwise capture the platform's functionality for distribution;</li>
                  <li>Take all reasonable precautions to prevent unauthorized access to or disclosure of the Confidential Information.</li>
                </ul>
              </li>
              
              <li>
                <p className="font-medium">Non-Circumvention</p>
                <p>The Recipient shall not attempt to:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Circumvent the Company in any business relationships established through access to the Confidential Information;</li>
                  <li>Independently create, develop, or commission any system, platform, or methodology that competes with or replicates the functionality or features of the Company's platform;</li>
                  <li>Solicit or interfere with any business relationship between the Company and any third party.</li>
                </ul>
              </li>
              
              <li>
                <p className="font-medium">Term and Termination</p>
                <p>This Agreement shall remain in effect indefinitely from the date of acceptance. The obligations of confidentiality shall survive any termination of the Recipient's relationship with the Company or access to the platform.</p>
              </li>
              
              <li>
                <p className="font-medium">Remedies</p>
                <p>The Recipient acknowledges that monetary damages would not be a sufficient remedy for any breach of this Agreement, and the Company shall be entitled to seek injunctive or other equitable relief to prevent or remedy any breach or threatened breach of this Agreement, in addition to all other remedies available at law or in equity.</p>
              </li>
              
              <li>
                <p className="font-medium">Return of Information</p>
                <p>Upon request by the Company, the Recipient shall promptly return or destroy all Confidential Information in their possession or control, including any copies, extracts, or derivatives thereof.</p>
              </li>
              
              <li>
                <p className="font-medium">Governing Law</p>
                <p>This Agreement shall be governed by and construed in accordance with the laws of the State of [State], without regard to its conflict of laws principles.</p>
              </li>
              
              <li>
                <p className="font-medium">Beta Version Acknowledgment</p>
                <p>The Recipient acknowledges that they may be granted access to beta versions of the platform which may contain additional proprietary features and information. All such beta access is subject to this Agreement and may be subject to additional terms.</p>
              </li>
            </ol>
            
            <p className="font-semibold mt-6">BY CHECKING THE BOX BELOW AND CLICKING "I AGREE", THE RECIPIENT ACKNOWLEDGES THAT THEY HAVE READ AND UNDERSTOOD THIS AGREEMENT AND AGREE TO BE BOUND BY ITS TERMS AND CONDITIONS.</p>
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