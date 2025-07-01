import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  CreditCard,
  Mail,
  Server
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Link } from 'wouter';

interface APIKey {
  name: string;
  key: string;
  description: string;
  status: 'connected' | 'disconnected' | 'testing';
  category: 'deployment' | 'payment' | 'communication' | 'hosting';
  icon: React.ReactNode;
  setupUrl?: string;
  required: boolean;
}

export default function Settings() {
  const [keys, setKeys] = useState<APIKey[]>([
    {
      name: 'GitHub Token',
      key: '',
      description: 'Personal access token for Git repository access and deployment',
      status: 'disconnected',
      category: 'deployment',
      icon: <GitBranch className="h-5 w-5" />,
      setupUrl: 'https://github.com/settings/tokens',
      required: true
    },
    {
      name: 'Stripe Secret Key',
      key: '',
      description: 'Secret key for payment processing and subscription management',
      status: 'disconnected',
      category: 'payment',
      icon: <CreditCard className="h-5 w-5" />,
      setupUrl: 'https://dashboard.stripe.com/apikeys',
      required: false
    },
    {
      name: 'Stripe Public Key',
      key: '',
      description: 'Publishable key for client-side payment forms',
      status: 'disconnected',
      category: 'payment',
      icon: <CreditCard className="h-5 w-5" />,
      setupUrl: 'https://dashboard.stripe.com/apikeys',
      required: false
    },
    {
      name: 'SMTP Settings',
      key: '',
      description: 'Email service configuration for notifications and alerts',
      status: 'disconnected',
      category: 'communication',
      icon: <Mail className="h-5 w-5" />,
      required: false
    },
    {
      name: 'DigitalOcean Token',
      key: '',
      description: 'API token for server provisioning and management',
      status: 'disconnected',
      category: 'hosting',
      icon: <Server className="h-5 w-5" />,
      setupUrl: 'https://cloud.digitalocean.com/account/api/tokens',
      required: false
    },
    {
      name: 'AWS Access Key',
      key: '',
      description: 'AWS credentials for cloud infrastructure management',
      status: 'disconnected',
      category: 'hosting',
      icon: <Server className="h-5 w-5" />,
      setupUrl: 'https://console.aws.amazon.com/iam/home#/security_credentials',
      required: false
    }
  ]);

  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [testingKeys, setTestingKeys] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    loadExistingKeys();
  }, []);

  const loadExistingKeys = async () => {
    try {
      const response = await apiRequest('GET', '/api/settings/api-keys');
      const existingKeys = response;
      
      setKeys(prevKeys => prevKeys.map(key => ({
        ...key,
        key: existingKeys[key.name.toLowerCase().replace(/\s+/g, '_')] || '',
        status: existingKeys[key.name.toLowerCase().replace(/\s+/g, '_')] ? 'connected' : 'disconnected'
      })));
    } catch (error) {
      // Keys not loaded, keep defaults
    }
  };

  const toggleKeyVisibility = (keyName: string) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(keyName)) {
      newVisible.delete(keyName);
    } else {
      newVisible.add(keyName);
    }
    setVisibleKeys(newVisible);
  };

  const updateKey = (keyName: string, value: string) => {
    setKeys(keys.map(key => 
      key.name === keyName 
        ? { ...key, key: value, status: value ? 'disconnected' : 'disconnected' as const }
        : key
    ));
  };

  const testConnection = async (keyName: string) => {
    setTestingKeys(prev => new Set(prev).add(keyName));
    
    try {
      const key = keys.find(k => k.name === keyName);
      if (!key?.key) {
        throw new Error('API key is empty');
      }

      let endpoint = '';
      let payload = {};

      switch (keyName) {
        case 'GitHub Token':
          endpoint = '/api/deployment/validate-repo';
          payload = { repoUrl: 'https://github.com/octocat/Hello-World', token: key.key };
          break;
        case 'Stripe Secret Key':
          endpoint = '/api/test/stripe';
          payload = { secretKey: key.key };
          break;
        case 'SMTP Settings':
          endpoint = '/api/test/smtp';
          payload = { config: key.key };
          break;
        default:
          endpoint = '/api/test/generic';
          payload = { service: keyName.toLowerCase().replace(' ', '_'), key: key.key };
      }

      await apiRequest('POST', endpoint, payload);
      
      setKeys(keys.map(k => 
        k.name === keyName 
          ? { ...k, status: 'connected' as const }
          : k
      ));

      toast({
        title: "Connection successful",
        description: `${keyName} is working correctly`,
      });
    } catch (error: any) {
      setKeys(keys.map(k => 
        k.name === keyName 
          ? { ...k, status: 'disconnected' as const }
          : k
      ));

      toast({
        title: "Connection failed",
        description: error.message || `Failed to connect ${keyName}`,
        variant: "destructive"
      });
    } finally {
      setTestingKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(keyName);
        return newSet;
      });
    }
  };

  const saveAllKeys = async () => {
    try {
      const keyData = keys.reduce((acc, key) => {
        if (key.key) {
          acc[key.name.toLowerCase().replace(/\s+/g, '_')] = key.key;
        }
        return acc;
      }, {} as Record<string, string>);

      await apiRequest('POST', '/api/settings/api-keys', keyData);
      
      toast({
        title: "API keys saved",
        description: "All API keys have been securely stored",
      });
    } catch (error: any) {
      toast({
        title: "Failed to save keys",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-600"><CheckCircle className="h-3 w-3 mr-1" />Connected</Badge>;
      case 'testing':
        return <Badge variant="secondary">Testing...</Badge>;
      default:
        return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Not Connected</Badge>;
    }
  };

  const getCategoryKeys = (category: string) => {
    return keys.filter(key => key.category === category);
  };

  const categories = [
    { id: 'deployment', name: 'Deployment & Git', description: 'Repository access and deployment services' },
    { id: 'payment', name: 'Payment Processing', description: 'Subscription and payment handling' },
    { id: 'communication', name: 'Communication', description: 'Email and notification services' },
    { id: 'hosting', name: 'Cloud Hosting', description: 'Server provisioning and management' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Key className="h-8 w-8" />
            API Keys & Credentials
          </h1>
          <p className="text-slate-400">Securely manage all external service credentials for full functionality</p>
        </div>

        <Alert className="mb-6 border-blue-500/20 bg-blue-50/5">
          <Shield className="h-4 w-4" />
          <AlertDescription className="text-white">
            All API keys are encrypted and stored securely. They never leave your server environment.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="deployment" className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700">
            {categories.map(category => (
              <TabsTrigger 
                key={category.id} 
                value={category.id} 
                className="data-[state=active]:bg-slate-700"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map(category => (
            <TabsContent key={category.id} value={category.id}>
              <Card className="border-slate-800 bg-slate-900">
                <CardHeader>
                  <CardTitle className="text-white">{category.name}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {category.id === 'deployment' && (
                    <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-white font-semibold mb-1">Quick Setup</h3>
                          <p className="text-sm text-slate-400">Add your GitHub token to enable repository deployments</p>
                        </div>
                        <Link href="/token-setup">
                          <Button className="bg-blue-600 hover:bg-blue-700">
                            <GitBranch className="h-4 w-4 mr-2" />
                            Add GitHub Token
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}
                  {getCategoryKeys(category.id).map(key => (
                    <div key={key.name} className="border border-slate-700 rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {key.icon}
                          <div>
                            <h3 className="text-white font-semibold flex items-center gap-2">
                              {key.name}
                              {key.required && <Badge variant="outline" className="text-xs">Required</Badge>}
                            </h3>
                            <p className="text-sm text-slate-400">{key.description}</p>
                          </div>
                        </div>
                        {getStatusBadge(testingKeys.has(key.name) ? 'testing' : key.status)}
                      </div>

                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <div className="flex-1 relative">
                            <Input
                              type={visibleKeys.has(key.name) ? 'text' : 'password'}
                              value={key.key}
                              onChange={(e) => updateKey(key.name, e.target.value)}
                              placeholder={`Enter ${key.name.toLowerCase()}`}
                              className="bg-slate-800 border-slate-700 text-white pr-10"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-1 top-1 h-8 w-8 p-0"
                              onClick={() => toggleKeyVisibility(key.name)}
                            >
                              {visibleKeys.has(key.name) ? 
                                <EyeOff className="h-4 w-4" /> : 
                                <Eye className="h-4 w-4" />
                              }
                            </Button>
                          </div>
                          <Button
                            onClick={() => testConnection(key.name)}
                            disabled={!key.key || testingKeys.has(key.name)}
                            variant="outline"
                          >
                            <TestTube className="h-4 w-4 mr-2" />
                            Test
                          </Button>
                        </div>

                        {key.setupUrl && (
                          <div className="flex items-center gap-2">
                            <a
                              href={key.setupUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                            >
                              Get API Key <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        <div className="flex justify-end mt-8">
          <Button onClick={saveAllKeys} size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Save className="h-4 w-4 mr-2" />
            Save All Keys
          </Button>
        </div>
      </div>
    </div>
  );
}