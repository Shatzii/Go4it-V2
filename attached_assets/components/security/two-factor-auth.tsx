'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  ShieldCheck, 
  Smartphone, 
  Key, 
  QrCode, 
  AlertTriangle,
  CheckCircle,
  Copy,
  RefreshCw,
  Settings
} from 'lucide-react';

interface TwoFactorSetup {
  isEnabled: boolean;
  method: 'sms' | 'authenticator' | 'backup';
  phoneNumber?: string;
  backupCodes?: string[];
  qrCode?: string;
  secretKey?: string;
}

export function TwoFactorAuth() {
  const [setup, setSetup] = useState<TwoFactorSetup>({
    isEnabled: false,
    method: 'sms'
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [verificationCode, setVerificationCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadCurrentSetup();
  }, []);

  const loadCurrentSetup = async () => {
    try {
      const response = await fetch('/api/auth/2fa/status');
      if (response.ok) {
        const data = await response.json();
        setSetup(data);
      }
    } catch (error) {
      console.error('Failed to load 2FA status:', error);
    }
  };

  const setupSMS = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/2fa/setup-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber })
      });
      
      if (response.ok) {
        setCurrentStep(1);
        setSuccess('Verification code sent to your phone');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to setup SMS 2FA');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const setupAuthenticator = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/2fa/setup-authenticator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSetup(prev => ({
          ...prev,
          qrCode: data.qrCode,
          secretKey: data.secretKey
        }));
        setCurrentStep(1);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to setup authenticator 2FA');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const verifySetup = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/2fa/verify-setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          code: verificationCode,
          method: setup.method,
          phoneNumber: setup.method === 'sms' ? phoneNumber : undefined
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setSetup(prev => ({
          ...prev,
          isEnabled: true,
          backupCodes: data.backupCodes
        }));
        setCurrentStep(2);
        setSuccess('Two-factor authentication enabled successfully!');
      } else {
        const data = await response.json();
        setError(data.error || 'Invalid verification code');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const disable2FA = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/2fa/disable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        setSetup({
          isEnabled: false,
          method: 'sms'
        });
        setCurrentStep(0);
        setSuccess('Two-factor authentication disabled');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to disable 2FA');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateBackupCodes = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/2fa/backup-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSetup(prev => ({
          ...prev,
          backupCodes: data.backupCodes
        }));
        setSuccess('New backup codes generated');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to generate backup codes');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccess('Copied to clipboard');
  };

  const formatBackupCodes = () => {
    if (!setup.backupCodes) return '';
    return setup.backupCodes.join('\n');
  };

  if (setup.isEnabled) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-green-600" />
            Two-Factor Authentication
          </CardTitle>
          <CardDescription>
            Your account is protected with 2FA
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-800">2FA is Active</h3>
              <p className="text-sm text-green-700">
                Your account is secured with {setup.method === 'sms' ? 'SMS' : 'authenticator app'} verification
              </p>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {setup.method === 'sms' ? 'SMS' : 'Authenticator'}
            </Badge>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Method</h4>
                <p className="text-sm text-gray-600">
                  {setup.method === 'sms' ? `SMS to ${setup.phoneNumber}` : 'Authenticator app'}
                </p>
              </div>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Change Method
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Backup Codes</h4>
                <p className="text-sm text-gray-600">
                  {setup.backupCodes?.length || 0} codes available
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={generateBackupCodes} disabled={isLoading}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Generate New Codes
              </Button>
            </div>

            {setup.backupCodes && setup.backupCodes.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Backup Codes</h4>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                    {formatBackupCodes()}
                  </pre>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(formatBackupCodes())}
                    className="mt-2"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy All Codes
                  </Button>
                </div>
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Store these codes safely. Each code can only be used once.
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </div>

          <div className="border-t pt-4">
            <Button 
              variant="destructive" 
              onClick={disable2FA}
              disabled={isLoading}
            >
              Disable Two-Factor Authentication
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Two-Factor Authentication Setup
        </CardTitle>
        <CardDescription>
          Add an extra layer of security to your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <Tabs value={setup.method} onValueChange={(value) => setSetup(prev => ({ ...prev, method: value as 'sms' | 'authenticator' }))}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sms" className="flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              SMS
            </TabsTrigger>
            <TabsTrigger value="authenticator" className="flex items-center gap-2">
              <Key className="w-4 h-4" />
              Authenticator App
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sms" className="space-y-4">
            {currentStep === 0 && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">SMS Verification</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    We'll send a verification code to your phone number
                  </p>
                  <Input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                <Button onClick={setupSMS} disabled={isLoading || !phoneNumber}>
                  {isLoading ? 'Sending...' : 'Send Verification Code'}
                </Button>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Enter Verification Code</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Enter the 6-digit code sent to {phoneNumber}
                  </p>
                  <Input
                    type="text"
                    placeholder="123456"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    maxLength={6}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={verifySetup} disabled={isLoading || verificationCode.length !== 6}>
                    {isLoading ? 'Verifying...' : 'Verify Code'}
                  </Button>
                  <Button variant="outline" onClick={() => setCurrentStep(0)}>
                    Back
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="authenticator" className="space-y-4">
            {currentStep === 0 && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Authenticator App</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Use apps like Google Authenticator, Authy, or Microsoft Authenticator
                  </p>
                </div>
                <Button onClick={setupAuthenticator} disabled={isLoading}>
                  {isLoading ? 'Setting up...' : 'Setup Authenticator'}
                </Button>
              </div>
            )}

            {currentStep === 1 && setup.qrCode && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Scan QR Code</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Scan this QR code with your authenticator app
                  </p>
                  <div className="flex justify-center p-4 bg-white border rounded-lg">
                    <img src={setup.qrCode} alt="QR Code" className="w-48 h-48" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Manual Entry</h4>
                  <p className="text-sm text-gray-600">
                    If you can't scan the QR code, enter this secret key manually:
                  </p>
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded border">
                    <code className="text-sm flex-1">{setup.secretKey}</code>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => copyToClipboard(setup.secretKey!)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Enter Verification Code</h4>
                  <p className="text-sm text-gray-600">
                    Enter the 6-digit code from your authenticator app
                  </p>
                  <Input
                    type="text"
                    placeholder="123456"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    maxLength={6}
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={verifySetup} disabled={isLoading || verificationCode.length !== 6}>
                    {isLoading ? 'Verifying...' : 'Verify & Enable'}
                  </Button>
                  <Button variant="outline" onClick={() => setCurrentStep(0)}>
                    Back
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="text-center p-6 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-green-800 mb-2">2FA Enabled Successfully!</h3>
              <p className="text-sm text-green-700">
                Your account is now protected with two-factor authentication
              </p>
            </div>

            {setup.backupCodes && (
              <div className="space-y-2">
                <h4 className="font-medium">Backup Codes</h4>
                <p className="text-sm text-gray-600">
                  Save these backup codes in a secure location. Each code can only be used once.
                </p>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                    {formatBackupCodes()}
                  </pre>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(formatBackupCodes())}
                    className="mt-2"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy All Codes
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}