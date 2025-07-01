import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { BellRing, Send, Settings, BellOff, RefreshCw, MessageSquare } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  severity: z.enum(["low", "medium", "high", "critical"]),
  type: z.string().min(3, { message: "Type must be at least 3 characters" }),
});

export default function Notifications() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTestingSlack, setIsTestingSlack] = useState(false);
  
  // Form for sending a test alert
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "Test Security Alert",
      description: "This is a test security alert sent from the Sentinel AI platform.",
      severity: "medium",
      type: "test_alert",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/alerts/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Alert Created",
          description: "The test alert was created and notifications were sent.",
        });
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to create test alert",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      console.error("Error creating alert:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const testSlackIntegration = async () => {
    setIsTestingSlack(true);
    
    try {
      const response = await fetch("/api/notifications/test/slack", {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "Slack test notification sent successfully",
        });
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to send Slack test notification",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      console.error("Error testing Slack integration:", error);
    } finally {
      setIsTestingSlack(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Notification Settings</h1>
      </div>

      <Tabs defaultValue="settings">
        <TabsList className="grid w-[400px] grid-cols-2">
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="test">
            <Send className="h-4 w-4 mr-2" />
            Test Alerts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alert Destinations</CardTitle>
              <CardDescription>
                Configure where and how security alerts will be delivered
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Slack Integration */}
              <div className="flex items-center justify-between space-x-2">
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2 text-blue-500" />
                    <span className="font-medium">Slack Notifications</span>
                  </div>
                  <span className="text-sm text-gray-400">
                    Send security alerts to your Slack workspace
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <Switch defaultChecked id="slack-enabled" />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={testSlackIntegration}
                    disabled={isTestingSlack}
                  >
                    {isTestingSlack ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      "Test"
                    )}
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              {/* Email Notifications */}
              <div className="flex items-center justify-between space-x-2">
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <BellRing className="h-5 w-5 mr-2 text-orange-500" />
                    <span className="font-medium">Email Notifications</span>
                  </div>
                  <span className="text-sm text-gray-400">
                    Receive security alerts via email
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <Switch defaultChecked id="email-enabled" />
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
              </div>
              
              <Separator />
              
              {/* SMS Alerts */}
              <div className="flex items-center justify-between space-x-2">
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <BellOff className="h-5 w-5 mr-2 text-red-500" />
                    <span className="font-medium">SMS Alerts</span>
                  </div>
                  <span className="text-sm text-gray-400">
                    Get critical alerts via SMS (high and critical severity only)
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <Switch id="sms-enabled" />
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notification Thresholds</CardTitle>
              <CardDescription>
                Configure when and how frequently you receive security alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <FormLabel>Minimum Severity for Alerts</FormLabel>
                <Select defaultValue="medium">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select minimum severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (All Alerts)</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical Only</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Only alert on events equal to or higher than this severity
                </FormDescription>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="test" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Send Test Alert</CardTitle>
              <CardDescription>
                Create a test security alert to verify your notification settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alert Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter alert title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alert Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter alert details"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="severity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Severity</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select severity" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="critical">Critical</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Alert Type</FormLabel>
                          <FormControl>
                            <Input placeholder="Alert type" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Test Alert
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}