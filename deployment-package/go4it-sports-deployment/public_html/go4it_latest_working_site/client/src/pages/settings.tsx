import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, CheckCircle2, Key } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [apiKeys, setApiKeys] = useState({
    openai: "",
    stripe: "",
    sendgrid: "",
    twilio: ""
  });
  const [loading, setLoading] = useState(false);
  const [apiKeyStatus, setApiKeyStatus] = useState<Record<string, boolean>>({});

  // Fetch existing API keys (just their status, not the actual values)
  useEffect(() => {
    const fetchApiKeyStatus = async () => {
      try {
        const response = await apiRequest('/api/settings/api-keys/status');
        
        setApiKeyStatus(response.data || {});
      } catch (error) {
        console.error("Failed to fetch API key status:", error);
      }
    };

    if (user) {
      fetchApiKeyStatus();
    }
  }, [user]);

  const handleSaveApiKey = async (keyType: keyof typeof apiKeys) => {
    if (!apiKeys[keyType]) {
      toast({
        title: "API Key Required",
        description: "Please enter an API key value.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequest('/api/settings/api-keys', {
        method: 'POST',
        data: {
          keyType,
          keyValue: apiKeys[keyType]
        }
      });

      // Update the status for this key
      setApiKeyStatus(prev => ({
        ...prev,
        [keyType]: true
      }));

      // Clear the input
      setApiKeys(prev => ({
        ...prev,
        [keyType]: ""
      }));

      toast({
        title: "API Key Saved",
        description: `Your ${keyType.toUpperCase()} API key has been saved successfully.`,
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error Saving API Key",
        description: "There was a problem saving your API key. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container py-10">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>
            You need to be logged in to access settings.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground mt-2">
            Manage your account settings and API keys.
          </p>
        </div>

        <Separator />

        <Tabs defaultValue="api-keys" className="w-full">
          <TabsList>
            <TabsTrigger value="api-keys">API Keys</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="api-keys" className="space-y-4 mt-4">
            <h3 className="text-lg font-semibold">API Key Management</h3>
            <p className="text-muted-foreground mb-6">
              Add your API keys to enable full functionality of the platform.
            </p>

            <div className="grid gap-6">
              {/* OpenAI API Key */}
              <Card>
                <CardHeader className="flex flex-row items-center">
                  <div className="flex-1">
                    <CardTitle>OpenAI API Key</CardTitle>
                    <CardDescription>
                      Required for video analysis and AI coach features
                    </CardDescription>
                  </div>
                  {apiKeyStatus.openai && (
                    <div className="flex items-center text-green-500">
                      <CheckCircle2 className="h-5 w-5 mr-1" />
                      <span>Active</span>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="openai-key">API Key (starts with sk-)</Label>
                    <div className="flex gap-2">
                      <Input
                        id="openai-key"
                        type="password"
                        placeholder={apiKeyStatus.openai ? "••••••••••••••••••••••••" : "Enter your OpenAI API key"}
                        value={apiKeys.openai}
                        onChange={(e) => setApiKeys({ ...apiKeys, openai: e.target.value })}
                      />
                      <Button 
                        variant="secondary" 
                        onClick={() => handleSaveApiKey("openai")}
                        disabled={loading || !apiKeys.openai}
                      >
                        <Key className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Get your key from <a href="https://platform.openai.com/account/api-keys" target="_blank" rel="noopener noreferrer" className="underline">OpenAI dashboard</a>
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Stripe API Key */}
              <Card>
                <CardHeader className="flex flex-row items-center">
                  <div className="flex-1">
                    <CardTitle>Stripe API Key</CardTitle>
                    <CardDescription>
                      Required for payment processing
                    </CardDescription>
                  </div>
                  {apiKeyStatus.stripe && (
                    <div className="flex items-center text-green-500">
                      <CheckCircle2 className="h-5 w-5 mr-1" />
                      <span>Active</span>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="stripe-key">Secret Key</Label>
                    <div className="flex gap-2">
                      <Input
                        id="stripe-key"
                        type="password"
                        placeholder={apiKeyStatus.stripe ? "••••••••••••••••••••••••" : "Enter your Stripe secret key"}
                        value={apiKeys.stripe}
                        onChange={(e) => setApiKeys({ ...apiKeys, stripe: e.target.value })}
                      />
                      <Button 
                        variant="secondary" 
                        onClick={() => handleSaveApiKey("stripe")}
                        disabled={loading || !apiKeys.stripe}
                      >
                        <Key className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Get your key from <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noopener noreferrer" className="underline">Stripe dashboard</a>
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* SendGrid API Key */}
              <Card>
                <CardHeader className="flex flex-row items-center">
                  <div className="flex-1">
                    <CardTitle>SendGrid API Key</CardTitle>
                    <CardDescription>
                      Required for email notifications
                    </CardDescription>
                  </div>
                  {apiKeyStatus.sendgrid && (
                    <div className="flex items-center text-green-500">
                      <CheckCircle2 className="h-5 w-5 mr-1" />
                      <span>Active</span>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="sendgrid-key">API Key</Label>
                    <div className="flex gap-2">
                      <Input
                        id="sendgrid-key"
                        type="password"
                        placeholder={apiKeyStatus.sendgrid ? "••••••••••••••••••••••••" : "Enter your SendGrid API key"}
                        value={apiKeys.sendgrid}
                        onChange={(e) => setApiKeys({ ...apiKeys, sendgrid: e.target.value })}
                      />
                      <Button 
                        variant="secondary" 
                        onClick={() => handleSaveApiKey("sendgrid")}
                        disabled={loading || !apiKeys.sendgrid}
                      >
                        <Key className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Twilio API Key */}
              <Card>
                <CardHeader className="flex flex-row items-center">
                  <div className="flex-1">
                    <CardTitle>Twilio API Key</CardTitle>
                    <CardDescription>
                      Required for SMS notifications
                    </CardDescription>
                  </div>
                  {apiKeyStatus.twilio && (
                    <div className="flex items-center text-green-500">
                      <CheckCircle2 className="h-5 w-5 mr-1" />
                      <span>Active</span>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="twilio-key">API Key</Label>
                    <div className="flex gap-2">
                      <Input
                        id="twilio-key"
                        type="password"
                        placeholder={apiKeyStatus.twilio ? "••••••••••••••••••••••••" : "Enter your Twilio API key"}
                        value={apiKeys.twilio}
                        onChange={(e) => setApiKeys({ ...apiKeys, twilio: e.target.value })}
                      />
                      <Button 
                        variant="secondary" 
                        onClick={() => handleSaveApiKey("twilio")}
                        disabled={loading || !apiKeys.twilio}
                      >
                        <Key className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="account" className="space-y-4 mt-4">
            <h3 className="text-lg font-semibold">Account Settings</h3>
            <p className="text-muted-foreground mb-6">
              Update your account information.
            </p>
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">Account settings coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4 mt-4">
            <h3 className="text-lg font-semibold">Notification Preferences</h3>
            <p className="text-muted-foreground mb-6">
              Configure how you receive notifications.
            </p>
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">Notification settings coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}