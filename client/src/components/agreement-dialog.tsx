import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AgreementDialogProps {
  open: boolean;
  onClose: () => void;
  onAccept: () => void;
  agreementType: "nda" | "terms" | "privacy";
}

export function AgreementDialog({ open, onClose, onAccept, agreementType }: AgreementDialogProps) {
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);

  // Handle scroll events to enable the accept button only when user has scrolled to the bottom
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const isAtBottom = Math.abs(
      target.scrollHeight - target.clientHeight - target.scrollTop
    ) < 10; // Allow small margin of error
    
    if (isAtBottom && !isScrolledToBottom) {
      setIsScrolledToBottom(true);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {agreementType === "nda" 
              ? "Non-Disclosure Agreement" 
              : agreementType === "privacy" 
                ? "Privacy Policy" 
                : "Terms of Service"}
          </DialogTitle>
          <DialogDescription>
            Please read this agreement carefully before continuing
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-4" onScroll={handleScroll}>
          <div className="space-y-4 py-2 text-sm">
            {agreementType === "nda" && (
              <>
                <h3 className="text-lg font-semibold">BETA TEST NON-DISCLOSURE AGREEMENT</h3>
                <p className="text-muted-foreground">Last Updated: April 5, 2025</p>
                
                <h4 className="font-medium mt-4">1. INTRODUCTION</h4>
                <p>
                  This Non-Disclosure Agreement ("Agreement") is entered into between Go4It Sports,
                  Inc. ("Company") and you, as a beta tester ("Beta Tester" or "you") of the Go4It Sports
                  Performance Platform ("Platform"). This Agreement governs your access to and use of
                  the Platform during its beta testing phase.
                </p>

                <h4 className="font-medium mt-4">2. CONFIDENTIAL INFORMATION</h4>
                <p>
                  "Confidential Information" means any non-public information related to the Platform, 
                  including but not limited to its features, functionality, design, user interface, 
                  algorithms, technology, code, performance metrics, bugs, user feedback mechanisms, 
                  business plans, and marketing strategies. Confidential Information also includes:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>The proprietary GAR (Growth and Ability Rating) scoring system and its algorithms</li>
                  <li>The innovative Star Path, Skill Tree, and XP system mechanics</li>
                  <li>The My Player game interface and its integration with real-world athletic training</li>
                  <li>The ADHD-focused design methodologies and user experience features</li>
                  <li>The neurodivergent athlete development strategies</li>
                  <li>Any source code, design documents, or implementation details</li>
                  <li>Any access credentials provided to you to access the Platform</li>
                  <li>The business concept and strategy for connecting student athletes with coaching opportunities</li>
                </ul>

                <h4 className="font-medium mt-4">3. OBLIGATIONS</h4>
                <p>As a Beta Tester, you agree to:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Keep all Confidential Information strictly confidential and secure;</li>
                  <li>Not disclose, publish, distribute, or otherwise share any Confidential Information with any third party without the Company's prior written consent;</li>
                  <li>Not use any concepts, ideas, or systems similar to those in the Platform in any other application or service;</li>
                  <li>Not attempt to create a competing product based on the concepts or systems used in the Platform;</li>
                  <li>Use the Platform only for the purpose of testing and providing feedback to the Company;</li>
                  <li>Not reverse engineer, decompile, or attempt to discover the source code of the Platform;</li>
                  <li>Not capture or share screenshots, videos, or recordings of the Platform without explicit written permission;</li>
                  <li>Not share your access credentials with any other person or entity;</li>
                  <li>Not use the Platform for any commercial purpose or gain;</li>
                  <li>Report any potential security vulnerabilities directly to the Company instead of disclosing them publicly;</li>
                  <li>Immediately notify the Company of any unauthorized access to or use of Confidential Information;</li>
                  <li>Provide honest and constructive feedback to the Company about the Platform when requested.</li>
                </ul>

                <h4 className="font-medium mt-4">4. INTELLECTUAL PROPERTY</h4>
                <p>
                  All intellectual property rights in the Platform, including but not limited to 
                  copyrights, patents, trademarks, and trade secrets, remain the sole property of 
                  the Company. This includes but is not limited to:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>The GAR scoring system and all its components</li>
                  <li>The Star Path, Skill Tree, XP system, and achievement mechanics</li>
                  <li>The My Player game interface design and functionality</li>
                  <li>All algorithms related to player assessment, matching, and development</li>
                  <li>The ADHD-focused user experience design methodology</li>
                  <li>All branding, logos, and marketing materials</li>
                </ul>
                <p className="mt-2">
                  Nothing in this Agreement grants you any rights to any intellectual property in the Platform.
                  You acknowledge that any unauthorized use or disclosure of the Company's intellectual property
                  may cause the Company irreparable harm for which monetary damages may be inadequate.
                </p>

                <h4 className="font-medium mt-4">5. TERM AND TERMINATION</h4>
                <p>
                  This Agreement commences upon your acceptance and continues until the earlier of: 
                  (i) the official public release of the Platform; (ii) termination of your participation 
                  in the beta test by the Company; or (iii) your withdrawal from the beta test with 
                  notice to the Company. The confidentiality obligations in this Agreement survive 
                  any termination of this Agreement for a period of three (3) years.
                </p>

                <h4 className="font-medium mt-4">6. FEEDBACK</h4>
                <p>
                  Any feedback, suggestions, ideas, or recommendations you provide to the Company 
                  regarding the Platform ("Feedback") shall become the property of the Company. You 
                  hereby assign all rights, title, and interest in and to such Feedback to the Company, 
                  and the Company is free to use, disclose, reproduce, license, or otherwise distribute 
                  and exploit the Feedback as it sees fit, without obligation or restriction of any kind.
                </p>

                <h4 className="font-medium mt-4">7. DISCLAIMER OF WARRANTIES</h4>
                <p>
                  THE PLATFORM IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND. THE COMPANY DISCLAIMS 
                  ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES 
                  OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                </p>

                <h4 className="font-medium mt-4">8. LIMITATION OF LIABILITY</h4>
                <p>
                  IN NO EVENT SHALL THE COMPANY BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, 
                  CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, 
                  DATA, USE, OR OTHER ECONOMIC ADVANTAGE, ARISING OUT OF OR IN CONNECTION WITH THIS 
                  AGREEMENT OR THE PLATFORM, EVEN IF THE COMPANY HAS BEEN ADVISED OF THE POSSIBILITY 
                  OF SUCH DAMAGES.
                </p>

                <h4 className="font-medium mt-4">9. GOVERNING LAW</h4>
                <p>
                  This Agreement shall be governed by and construed in accordance with the laws of 
                  the state of California, without regard to its conflict of law principles.
                </p>

                <h4 className="font-medium mt-4">10. ENTIRE AGREEMENT</h4>
                <p>
                  This Agreement constitutes the entire agreement between you and the Company regarding 
                  the subject matter hereof and supersedes all prior or contemporaneous oral or written 
                  agreements concerning such subject matter.
                </p>

                <h4 className="font-medium mt-4">11. SEVERABILITY</h4>
                <p>
                  If any provision of this Agreement is found to be unenforceable or invalid, that 
                  provision shall be limited or eliminated to the minimum extent necessary so that 
                  this Agreement shall otherwise remain in full force and effect and enforceable.
                </p>

                <h4 className="font-medium mt-4">12. REMEDIES</h4>
                <p>
                  You acknowledge that any breach of this Agreement may cause irreparable harm to the 
                  Company for which monetary damages may be inadequate. Accordingly, the Company may 
                  seek injunctive or other equitable relief to prevent or remedy any breach or 
                  threatened breach of this Agreement.
                </p>

                <p className="mt-6 text-muted-foreground">
                  BY CLICKING "I AGREE" BELOW, YOU ACKNOWLEDGE THAT YOU HAVE READ THIS AGREEMENT, 
                  UNDERSTAND IT, AND AGREE TO BE BOUND BY ITS TERMS AND CONDITIONS.
                </p>
              </>
            )}

            {agreementType === "terms" && (
              <p>Terms of service content would go here.</p>
            )}

            {agreementType === "privacy" && (
              <p>Privacy policy content would go here.</p>
            )}
          </div>
        </ScrollArea>
        <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
          <Button variant="outline" onClick={onClose} className="sm:w-auto w-full">
            Decline
          </Button>
          <Button 
            onClick={onAccept} 
            disabled={!isScrolledToBottom}
            className="sm:w-auto w-full"
          >
            {isScrolledToBottom ? "I Agree" : "Please read the entire agreement"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}