import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Key, 
  Eye, 
  EyeOff, 
  Save, 
  TestTube, 
  CheckCircle, 
  AlertCircle,
  ExternalLink,
  Shield,
  GitBranch,
  ArrowLeft
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Link } from 'wouter';

export default function TokenSetup() {
  const [githubToken, setGithubToken] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const testToken = async () => {
    if (!githubToken) {
      toast({
        title: "Token required",
        description: "Please enter your GitHub token first",
        variant: "destructive"
      });
      return;
    }

    setIsTesting(true);
    setIsValid(null);

    try {
      await apiRequest('POST', '/api/deployment/validate-repo', {
        repoUrl: 'https://github.com/octocat/Hello-World',
        token: githubToken
      });

      setIsValid(true);
      toast({
        title: "Token verified",
        description: "Your GitHub token is working correctly",
      });
    } catch (error: any) {
      setIsValid(false);
      toast({
        title: "Token invalid",
        description: error.message || "Failed to verify GitHub token",
        variant: "destructive"
      });
    } finally {
      setIsTesting(false);
    }
  };

  const saveToken = async () => {
    if (!githubToken) {
      toast({
        title: "Token required",
        description: "Please enter your GitHub token",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);

    try {
      await apiRequest('POST', '/api/settings/api-keys', {
        github_token: githubToken
      });

      toast({
        title: "Token saved",
        description: "GitHub token has been securely stored. Deployment features are now enabled!",
      });

      // Clear the token from memory for security
      setGithubToken('');
      setIsVisible(false);
      setIsValid(null);
    } catch (error: any) {
      toast({
        title: "Failed to save token",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusBadge = () => {
    if (isTesting) return <Badge variant="secondary">Testing...</Badge>;
    if (isValid === true) return <Badge className="bg-green-600"><CheckCircle className="h-3 w-3 mr-1" />Valid</Badge>;
    if (isValid === false) return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Invalid</Badge>;
    return <Badge variant="outline">Not tested</Badge>;
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/settings" className="text-blue-400 hover:text-blue-300 flex items-center gap-2 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Settings
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <GitBranch className="h-8 w-8" />
            GitHub Token Setup
          </h1>
          <p className="text-slate-400">Add your GitHub personal access token to enable repository deployments</p>
        </div>

        <Alert className="mb-6 border-blue-500/20 bg-blue-50/5">
          <Shield className="h-4 w-4" />
          <AlertDescription className="text-white">
            Your token is encrypted and stored securely. It's only used for Git operations and never leaves your server.
          </AlertDescription>
        </Alert>

        <Card className="border-slate-800 bg-slate-900 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3">
              <Key className="h-5 w-5" />
              GitHub Personal Access Token
              {getStatusBadge()}
            </CardTitle>
            <CardDescription>
              This token enables real repository deployment, framework detection, and build automation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="github-token" className="text-white">Personal Access Token</Label>
                <div className="flex gap-2 mt-2">
                  <div className="flex-1 relative">
                    <Input
                      id="github-token"
                      type={isVisible ? 'text' : 'password'}
                      value={githubToken}
                      onChange={(e) => setGithubToken(e.target.value)}
                      placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                      className="bg-slate-800 border-slate-700 text-white pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1 h-8 w-8 p-0"
                      onClick={() => setIsVisible(!isVisible)}
                    >
                      {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <Button
                    onClick={testToken}
                    disabled={!githubToken || isTesting}
                    variant="outline"
                  >
                    <TestTube className="h-4 w-4 mr-2" />
                    Test
                  </Button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <a
                  href="https://github.com/settings/tokens"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                >
                  Get GitHub Token <ExternalLink className="h-3 w-3" />
                </a>
                <Button
                  onClick={saveToken}
                  disabled={!githubToken || isSaving || isValid === false}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Token'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900">
          <CardHeader>
            <CardTitle className="text-white text-lg">How to Create a GitHub Token</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-300">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <p className="font-medium">Visit GitHub Settings</p>
                  <p className="text-sm text-slate-400">Go to https://github.com/settings/tokens</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <p className="font-medium">Generate New Token</p>
                  <p className="text-sm text-slate-400">Click "Generate new token (classic)"</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <p className="font-medium">Select Scopes</p>
                  <p className="text-sm text-slate-400">Choose "repo" for private repositories or "public_repo" for public only</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</div>
                <div>
                  <p className="font-medium">Copy the Token</p>
                  <p className="text-sm text-slate-400">Save the token somewhere safe - you won't see it again!</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}