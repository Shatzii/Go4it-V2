import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  CreditCard, DollarSign, Building, Zap, Shield, CheckCircle, 
  Clock, TrendingUp, AlertCircle, Receipt, Wallet, Globe
} from "lucide-react";

interface PaymentMethod {
  id: string;
  type: 'stripe' | 'bluevine' | 'crypto' | 'wire';
  name: string;
  status: 'active' | 'pending' | 'inactive';
  fees: number;
  processingTime: string;
  icon: React.ReactNode;
}

interface Transaction {
  id: string;
  amount: number;
  client: string;
  vertical: string;
  method: string;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  fees: number;
}

export default function PaymentCenter() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [totalRevenue, setTotalRevenue] = useState(5847000);
  const [monthlyRecurring, setMonthlyRecurring] = useState(4250000);
  const [processingFees, setProcessingFees] = useState(42850);

  const [paymentMethods] = useState<PaymentMethod[]>([
    {
      id: 'stripe',
      type: 'stripe',
      name: 'Stripe Payments',
      status: 'active',
      fees: 2.9,
      processingTime: 'Instant',
      icon: <CreditCard className="w-6 h-6" />
    },
    {
      id: 'bluevine',
      type: 'bluevine',
      name: 'BlueVine Business Account',
      status: 'active',
      fees: 0.0,
      processingTime: '1-2 business days',
      icon: <Building className="w-6 h-6" />
    },
    {
      id: 'crypto',
      type: 'crypto',
      name: 'Cryptocurrency',
      status: 'pending',
      fees: 1.5,
      processingTime: '10-30 minutes',
      icon: <Zap className="w-6 h-6" />
    },
    {
      id: 'wire',
      type: 'wire',
      name: 'Wire Transfer',
      status: 'active',
      fees: 0.5,
      processingTime: '3-5 business days',
      icon: <Globe className="w-6 h-6" />
    }
  ]);

  const [recentTransactions] = useState<Transaction[]>([
    {
      id: 'tx001',
      amount: 85000,
      client: 'FleetMax Logistics',
      vertical: 'TruckFlow AI',
      method: 'BlueVine',
      status: 'completed',
      date: '2025-06-30',
      fees: 0
    },
    {
      id: 'tx002',
      amount: 42500,
      client: 'Summit Roofing Co',
      vertical: 'RoofingFlow AI',
      method: 'Stripe',
      status: 'completed',
      date: '2025-06-30',
      fees: 1232.5
    },
    {
      id: 'tx003',
      amount: 125000,
      client: 'Metro Health System',
      vertical: 'HealthFlow AI',
      method: 'Wire Transfer',
      status: 'pending',
      date: '2025-06-29',
      fees: 625
    }
  ]);

  const handlePaymentSetup = async (method: string) => {
    toast({
      title: "Payment Method Setup",
      description: `Configuring ${method} integration...`,
    });

    // Simulate setup process
    setTimeout(() => {
      toast({
        title: "Setup Complete",
        description: `${method} is now ready to accept payments.`,
        variant: "default",
      });
    }, 2000);
  };

  const handleInvoiceGeneration = (vertical: string, amount: number) => {
    toast({
      title: "Invoice Generated",
      description: `Invoice for ${vertical} - $${amount.toLocaleString()} sent to client.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Wallet className="w-12 h-12 text-green-600 mr-4" />
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
              Shatzii Payment Center
            </h1>
          </div>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-6">
            Integrated BlueVine Banking & Multi-Payment Processing
          </p>
          <div className="flex justify-center space-x-4 mb-8">
            <Badge variant="secondary" className="px-4 py-2">
              <DollarSign className="w-4 h-4 mr-2" />
              ${totalRevenue.toLocaleString()}/month
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Building className="w-4 h-4 mr-2" />
              BlueVine Connected
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <CreditCard className="w-4 h-4 mr-2" />
              Stripe Active
            </Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bluevine">BlueVine Banking</TabsTrigger>
            <TabsTrigger value="stripe">Stripe Payments</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-green-600 flex items-center text-lg">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Total Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    ${totalRevenue.toLocaleString()}
                  </div>
                  <p className="text-sm text-slate-600">Monthly recurring</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-blue-600 flex items-center text-lg">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Processing Fees
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">
                    ${processingFees.toLocaleString()}
                  </div>
                  <p className="text-sm text-slate-600">0.73% effective rate</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-purple-600 flex items-center text-lg">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Success Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">
                    99.7%
                  </div>
                  <p className="text-sm text-slate-600">Transaction success</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-orange-600 flex items-center text-lg">
                    <Clock className="w-5 h-5 mr-2" />
                    Avg. Settlement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600">
                    1.2 days
                  </div>
                  <p className="text-sm text-slate-600">Weighted average</p>
                </CardContent>
              </Card>
            </div>

            {/* Payment Methods Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-6 h-6 mr-2" />
                  Payment Methods Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {paymentMethods.map((method) => (
                    <Card key={method.id} className="border-slate-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            {method.icon}
                            <span className="ml-2 font-semibold">{method.name}</span>
                          </div>
                          <Badge variant={method.status === 'active' ? 'default' : 'secondary'}>
                            {method.status}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm text-slate-600">
                          <div>Fees: {method.fees}%</div>
                          <div>Settlement: {method.processingTime}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* BlueVine Banking Tab */}
          <TabsContent value="bluevine" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-blue-600">
                  <Building className="w-6 h-6 mr-2" />
                  BlueVine Business Banking Integration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Account Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Account Name:</span>
                        <span className="font-semibold">Shotty Bank LLC</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Account Type:</span>
                        <span className="font-semibold">Business Checking</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Routing Number:</span>
                        <span className="font-semibold">084106768</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Status:</span>
                        <Badge variant="default" className="bg-green-600">Active</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Account Balance</h3>
                    <div className="text-3xl font-bold text-green-600">
                      $2,847,500.00
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Available Balance:</span>
                        <span>$2,847,500.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pending Deposits:</span>
                        <span>$125,000.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Updated:</span>
                        <span>2 minutes ago</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                  <div className="flex space-x-4">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Transfer Funds
                    </Button>
                    <Button variant="outline">
                      <Receipt className="w-4 h-4 mr-2" />
                      View Statements
                    </Button>
                    <Button variant="outline">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Generate Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Auto-Transfer Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Automated Transfer Rules</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">Daily Revenue Sweep</h4>
                      <p className="text-sm text-slate-600">Transfer daily earnings to savings account</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="default">Active</Badge>
                      <Button size="sm" variant="outline">Configure</Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">Emergency Reserve</h4>
                      <p className="text-sm text-slate-600">Maintain $500K minimum operating balance</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="default">Active</Badge>
                      <Button size="sm" variant="outline">Configure</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stripe Payments Tab */}
          <TabsContent value="stripe" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-purple-600">
                  <CreditCard className="w-6 h-6 mr-2" />
                  Stripe Payment Processing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="border-green-200">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">$1,247,500</div>
                      <p className="text-sm text-slate-600">Monthly Volume</p>
                    </CardContent>
                  </Card>
                  <Card className="border-blue-200">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">1,847</div>
                      <p className="text-sm text-slate-600">Transactions</p>
                    </CardContent>
                  </Card>
                  <Card className="border-purple-200">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">2.9%</div>
                      <p className="text-sm text-slate-600">Average Fee</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Payment Processing Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                        <span>Credit & Debit Cards</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                        <span>ACH Bank Transfers</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                        <span>International Payments</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                        <span>Recurring Billing</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                        <span>Invoice Generation</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                        <span>Fraud Protection</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Quick Payment Links</h3>
                  <div className="space-y-3">
                    {['TruckFlow AI', 'RoofingFlow AI', 'HealthFlow AI', 'FinanceFlow AI'].map((vertical) => (
                      <div key={vertical} className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="font-medium">{vertical}</span>
                        <div className="space-x-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleInvoiceGeneration(vertical, 50000)}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            Generate Invoice
                          </Button>
                          <Button size="sm" variant="outline">
                            Payment Link
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Receipt className="w-6 h-6 mr-2" />
                  Recent Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h4 className="font-semibold">{transaction.client}</h4>
                            <p className="text-sm text-slate-600">{transaction.vertical}</p>
                          </div>
                          <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          ${transaction.amount.toLocaleString()}
                        </div>
                        <div className="text-sm text-slate-600">
                          via {transaction.method} • {transaction.date}
                        </div>
                        {transaction.fees > 0 && (
                          <div className="text-xs text-red-600">
                            Fees: ${transaction.fees.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-6 h-6 mr-2" />
                  Payment Security & Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Security Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Two-Factor Authentication</h4>
                      <p className="text-sm text-slate-600 mb-3">Secure all payment operations with 2FA</p>
                      <Badge variant="default" className="bg-green-600">Enabled</Badge>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">PCI Compliance</h4>
                      <p className="text-sm text-slate-600 mb-3">Level 1 PCI DSS certified</p>
                      <Badge variant="default" className="bg-green-600">Compliant</Badge>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Fraud Detection</h4>
                      <p className="text-sm text-slate-600 mb-3">AI-powered fraud prevention</p>
                      <Badge variant="default" className="bg-green-600">Active</Badge>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">SSL Encryption</h4>
                      <p className="text-sm text-slate-600 mb-3">256-bit SSL encryption</p>
                      <Badge variant="default" className="bg-green-600">Enabled</Badge>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">API Configuration</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">Stripe API Keys</h4>
                        <p className="text-sm text-slate-600">Configure Stripe integration</p>
                      </div>
                      <Button 
                        onClick={() => handlePaymentSetup('Stripe')}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        Configure
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">BlueVine API</h4>
                        <p className="text-sm text-slate-600">Banking integration settings</p>
                      </div>
                      <Button 
                        onClick={() => handlePaymentSetup('BlueVine')}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Configure
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}