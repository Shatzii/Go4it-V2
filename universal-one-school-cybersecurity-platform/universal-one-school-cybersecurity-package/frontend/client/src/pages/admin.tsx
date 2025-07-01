import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertCircle, RefreshCw, UserPlus, UserX, Shield, Settings, DatabaseIcon, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Client, User } from "@shared/schema";

// User creation dialog component
function CreateUserDialog({ clientId, onSuccess }: { clientId: number; onSuccess: () => void }) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    role: "user",
    clientId
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSubmit = async () => {
    if (!formData.username || !formData.password || !formData.email) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        toast({
          title: "Success",
          description: `User ${formData.username} has been created`
        });
        setIsOpen(false);
        setFormData({
          username: "",
          password: "",
          email: "",
          role: "user",
          clientId
        });
        onSuccess();
      } else {
        const data = await response.json();
        toast({
          title: "Error",
          description: data.message || "Failed to create user",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            Add a new user account to the organization
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => handleChange("username", e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => handleChange("role", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrator</SelectItem>
                <SelectItem value="user">Standard User</SelectItem>
                <SelectItem value="readonly">Read Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              "Create User"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Client creation dialog component
function CreateClientDialog({ onSuccess }: { onSuccess: () => void }) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    contactEmail: "",
    contactPhone: "",
    subscription: "basic"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSubmit = async () => {
    if (!formData.name || !formData.contactEmail) {
      toast({
        title: "Error",
        description: "Client name and contact email are required",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        toast({
          title: "Success",
          description: `Client ${formData.name} has been created`
        });
        setIsOpen(false);
        setFormData({
          name: "",
          industry: "",
          contactEmail: "",
          contactPhone: "",
          subscription: "basic"
        });
        onSuccess();
      } else {
        const data = await response.json();
        toast({
          title: "Error",
          description: data.message || "Failed to create client",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <DatabaseIcon className="h-4 w-4 mr-2" />
          Add Client
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Client</DialogTitle>
          <DialogDescription>
            Add a new client organization to the platform
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Client Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Input
              id="industry"
              value={formData.industry}
              onChange={(e) => handleChange("industry", e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contactEmail">Contact Email</Label>
            <Input
              id="contactEmail"
              type="email"
              value={formData.contactEmail}
              onChange={(e) => handleChange("contactEmail", e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contactPhone">Contact Phone</Label>
            <Input
              id="contactPhone"
              value={formData.contactPhone}
              onChange={(e) => handleChange("contactPhone", e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subscription">Subscription</Label>
            <Select
              value={formData.subscription}
              onValueChange={(value) => handleChange("subscription", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a subscription" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Client"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Main Admin Page Component
export default function AdminPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  
  // Get all clients
  const { data: clients = [], isLoading: isClientsLoading } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });
  
  // Get users for selected client
  const { data: users = [], isLoading: isUsersLoading } = useQuery<User[]>({
    queryKey: ["/api/users", selectedClientId],
    enabled: !!selectedClientId,
  });
  
  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      return apiRequest(`/api/users/${userId}`, { method: "DELETE" });
    },
    onSuccess: () => {
      toast({
        title: "User Deleted",
        description: "The user has been successfully removed."
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users", selectedClientId] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive"
      });
    }
  });
  
  // Handle user deletion
  const handleDeleteUser = (userId: number, username: string) => {
    if (window.confirm(`Are you sure you want to delete user ${username}?`)) {
      deleteUserMutation.mutate(userId);
    }
  };
  
  // Reset notification settings for client
  const resetClientNotifications = async (clientId: number) => {
    try {
      const response = await fetch(`/api/clients/${clientId}/notifications/reset`, {
        method: "POST"
      });
      
      if (response.ok) {
        toast({
          title: "Notifications Reset",
          description: "Notification settings have been reset to defaults."
        });
      } else {
        const data = await response.json();
        toast({
          title: "Error",
          description: data.message || "Failed to reset notifications",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <CreateClientDialog onSuccess={() => queryClient.invalidateQueries({ queryKey: ["/api/clients"] })} />
      </div>
      
      <Tabs defaultValue="clients">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="users" disabled={!selectedClientId}>Users</TabsTrigger>
        </TabsList>
        
        <TabsContent value="clients" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Client Organizations</CardTitle>
              <CardDescription>Manage client organizations and security settings</CardDescription>
            </CardHeader>
            <CardContent>
              {isClientsLoading ? (
                <div className="flex justify-center p-10">
                  <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : clients.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Industry</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Subscription</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clients.map(client => (
                      <TableRow key={client.id} className={selectedClientId === client.id ? "bg-blue-900/20" : ""}>
                        <TableCell className="font-medium">{client.name}</TableCell>
                        <TableCell>{client.industry}</TableCell>
                        <TableCell>{client.contactEmail}</TableCell>
                        <TableCell>
                          <Badge className={
                            client.subscription === 'enterprise' ? 'bg-blue-600' :
                            client.subscription === 'professional' ? 'bg-purple-600' :
                            'bg-gray-600'
                          }>
                            {client.subscription}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedClientId(client.id)}
                            >
                              <UserPlus className="h-4 w-4 mr-1" />
                              Manage Users
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => resetClientNotifications(client.id)}
                            >
                              <Settings className="h-4 w-4 mr-1" />
                              Reset Alerts
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No clients found. Create your first client organization to get started.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
              <CardDescription>Global platform configuration options</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notifications" className="text-base">Email Notifications</Label>
                    <p className="text-sm text-gray-400">Send security alerts via email</p>
                  </div>
                  <Switch id="notifications" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="slack" className="text-base">Slack Integration</Label>
                    <p className="text-sm text-gray-400">Send security alerts to Slack</p>
                  </div>
                  <Switch id="slack" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auditing" className="text-base">Enhanced Auditing</Label>
                    <p className="text-sm text-gray-400">Enable detailed audit logs</p>
                  </div>
                  <Switch id="auditing" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="2fa" className="text-base">Require 2FA</Label>
                    <p className="text-sm text-gray-400">Enforce two-factor authentication</p>
                  </div>
                  <Switch id="2fa" defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4 pt-4">
          {selectedClientId && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  Users for {clients.find(c => c.id === selectedClientId)?.name}
                </h2>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => setSelectedClientId(null)}>
                    Back to Clients
                  </Button>
                  <CreateUserDialog 
                    clientId={selectedClientId} 
                    onSuccess={() => queryClient.invalidateQueries({ queryKey: ["/api/users", selectedClientId] })} 
                  />
                </div>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage users for the selected client</CardDescription>
                </CardHeader>
                <CardContent>
                  {isUsersLoading ? (
                    <div className="flex justify-center p-10">
                      <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                  ) : users.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Username</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map(user => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.username}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge className={
                                user.role === 'admin' ? 'bg-blue-600' : 
                                user.role === 'readonly' ? 'bg-gray-600' : 
                                'bg-green-600'
                              }>
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                {user.isActive ? (
                                  <>
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                    <span>Active</span>
                                  </>
                                ) : (
                                  <>
                                    <div className="w-2 h-2 bg-gray-500 rounded-full mr-2"></div>
                                    <span>Inactive</span>
                                  </>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleDeleteUser(user.id, user.username)}
                                  disabled={deleteUserMutation.isPending}
                                >
                                  <UserX className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Shield className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        No users found for this client. Add users to get started.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage security settings for the selected client</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="client-2fa" className="text-base">Require 2FA</Label>
                        <p className="text-sm text-gray-400">Enforce two-factor authentication for all users</p>
                      </div>
                      <Switch id="client-2fa" defaultChecked={true} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="auto-logout" className="text-base">Auto Logout</Label>
                        <p className="text-sm text-gray-400">Automatically log out inactive users</p>
                      </div>
                      <Switch id="auto-logout" defaultChecked={true} />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password-policy">Password Policy</Label>
                      <Select defaultValue="strong">
                        <SelectTrigger>
                          <SelectValue placeholder="Select password policy" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic (8+ characters)</SelectItem>
                          <SelectItem value="medium">Medium (8+ chars, mixed case)</SelectItem>
                          <SelectItem value="strong">Strong (12+ chars, mixed case, symbols)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="pt-4">
                      <Button className="w-full">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Save Security Settings
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}