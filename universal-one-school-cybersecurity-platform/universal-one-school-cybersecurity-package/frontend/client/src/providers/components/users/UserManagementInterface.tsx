import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from 'date-fns';
import {
  UserIcon,
  Users,
  UserPlus,
  Shield,
  ShieldCheck,
  ShieldAlert,
  MoreHorizontal,
  RefreshCw,
  Search,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  AlertCircle,
  Lock,
  Key,
  FileText as FileSpreadsheet
} from 'lucide-react';

// User interface
interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'client_admin' | 'user' | 'analyst' | 'auditor';
  clientId: number | null;
  isActive: boolean;
  lastLogin?: string;
  createdAt?: string;
}

// Client interface
interface Client {
  id: number;
  name: string;
  domain?: string;
  isActive: boolean;
}

// Form schema for creating/editing users
const userFormSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }).optional(),
  confirmPassword: z.string().optional(),
  role: z.enum(['admin', 'client_admin', 'user', 'analyst', 'auditor'], {
    message: "Please select a valid role.",
  }),
  clientId: z.number().nullable(),
  isActive: z.boolean().default(true),
}).refine(data => {
  if (data.password && data.confirmPassword) {
    return data.password === data.confirmPassword;
  }
  return true;
}, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Role permissions matrix
const rolePermissions = {
  admin: {
    name: 'Administrator',
    description: 'Full system access including user management',
    permissions: [
      'manage_users', 'manage_clients', 'view_all_clients', 
      'manage_alerts', 'manage_threats', 'view_reports',
      'configure_system', 'audit_logs'
    ]
  },
  client_admin: {
    name: 'Client Administrator',
    description: 'Full access to a specific client account',
    permissions: [
      'manage_client_users', 'view_client', 
      'manage_alerts', 'manage_threats', 'view_reports'
    ]
  },
  analyst: {
    name: 'Security Analyst',
    description: 'Analyzes security events and responds to incidents',
    permissions: [
      'view_client', 'manage_alerts', 'manage_threats', 
      'view_reports', 'investigate_incidents'
    ]
  },
  user: {
    name: 'Standard User',
    description: 'Basic access to security information',
    permissions: [
      'view_client', 'view_alerts', 'view_threats', 
      'view_basic_reports'
    ]
  },
  auditor: {
    name: 'Auditor',
    description: 'Read-only access for compliance auditing',
    permissions: [
      'view_client', 'view_reports', 'view_alerts', 
      'view_threats', 'audit_logs', 'export_data'
    ]
  }
};

export function UserManagementInterface() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('users');
  
  // Create form
  const createForm = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'user',
      clientId: null,
      isActive: true
    }
  });
  
  // Edit form
  const editForm = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      username: '',
      email: '',
      role: 'user',
      clientId: null,
      isActive: true
    }
  });
  
  // Reset password form
  const resetPasswordForm = useForm<{ newPassword: string, confirmPassword: string }>({
    resolver: zodResolver(
      z.object({
        newPassword: z.string().min(8, {
          message: "Password must be at least 8 characters.",
        }),
        confirmPassword: z.string()
      }).refine(data => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
      })
    ),
    defaultValues: {
      newPassword: '',
      confirmPassword: ''
    }
  });
  
  // Fetch users
  const { data: users = [], isLoading: isLoadingUsers, refetch: refetchUsers } = useQuery<User[]>({
    queryKey: ['/api/users'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) throw new Error('Failed to fetch users');
        return await response.json();
      } catch (error) {
        console.error('Error fetching users:', error);
        // Return mock data for demo
        return [
          { id: 1, username: 'admin', email: 'admin@sentinel.ai', role: 'admin', clientId: null, isActive: true, lastLogin: '2025-05-20T10:30:00Z', createdAt: '2025-01-01T00:00:00Z' },
          { id: 2, username: 'client1_admin', email: 'admin@client1.com', role: 'client_admin', clientId: 1, isActive: true, lastLogin: '2025-05-19T14:22:10Z', createdAt: '2025-01-10T00:00:00Z' },
          { id: 3, username: 'analyst1', email: 'analyst@sentinel.ai', role: 'analyst', clientId: 1, isActive: true, lastLogin: '2025-05-22T08:45:30Z', createdAt: '2025-02-15T00:00:00Z' },
          { id: 4, username: 'user1', email: 'user@client1.com', role: 'user', clientId: 1, isActive: true, lastLogin: '2025-05-18T11:20:15Z', createdAt: '2025-03-05T00:00:00Z' },
          { id: 5, username: 'auditor1', email: 'auditor@compliance.org', role: 'auditor', clientId: 1, isActive: true, lastLogin: '2025-05-15T16:10:45Z', createdAt: '2025-04-10T00:00:00Z' },
          { id: 6, username: 'inactive_user', email: 'inactive@example.com', role: 'user', clientId: 2, isActive: false, lastLogin: '2025-04-01T09:12:30Z', createdAt: '2025-02-20T00:00:00Z' },
        ];
      }
    }
  });
  
  // Fetch clients
  const { data: clients = [], isLoading: isLoadingClients } = useQuery<Client[]>({
    queryKey: ['/api/clients'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/clients');
        if (!response.ok) throw new Error('Failed to fetch clients');
        return await response.json();
      } catch (error) {
        console.error('Error fetching clients:', error);
        // Return mock data for demo
        return [
          { id: 1, name: 'Acme Corporation', domain: 'acme.com', isActive: true },
          { id: 2, name: 'Globex Industries', domain: 'globex.com', isActive: true },
          { id: 3, name: 'Oceanic Airlines', domain: 'oceanic-air.com', isActive: false },
        ];
      }
    }
  });
  
  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: async (userData: z.infer<typeof userFormSchema>) => {
      // This would normally call your API to create a user
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create user');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      toast({
        title: 'User Created',
        description: 'New user has been created successfully.'
      });
      setIsCreateDialogOpen(false);
      createForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
  
  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async ({ id, userData }: { id: number, userData: Partial<User> }) => {
      // This would normally call your API to update a user
      const response = await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update user');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      toast({
        title: 'User Updated',
        description: 'User has been updated successfully.'
      });
      setIsEditDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
  
  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (id: number) => {
      // This would normally call your API to delete a user
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete user');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      toast({
        title: 'User Deleted',
        description: 'User has been deleted successfully.'
      });
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
  
  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: async ({ id, password }: { id: number, password: string }) => {
      // This would normally call your API to reset a user's password
      const response = await fetch(`/api/users/${id}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to reset password');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Password Reset',
        description: 'Password has been reset successfully.'
      });
      setIsResetPasswordDialogOpen(false);
      resetPasswordForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
  
  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    return format(new Date(dateString), 'MMM d, yyyy h:mm a');
  };
  
  // Get client name by ID
  const getClientName = (clientId: number | null) => {
    if (!clientId) return 'System-wide';
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : `Client ID ${clientId}`;
  };
  
  // Get Role badge
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <Badge className="bg-red-600 hover:bg-red-700">
            <ShieldAlert className="mr-1 h-3 w-3" />
            Admin
          </Badge>
        );
      case 'client_admin':
        return (
          <Badge className="bg-orange-600 hover:bg-orange-700">
            <Shield className="mr-1 h-3 w-3" />
            Client Admin
          </Badge>
        );
      case 'analyst':
        return (
          <Badge className="bg-blue-600 hover:bg-blue-700">
            <Search className="mr-1 h-3 w-3" />
            Analyst
          </Badge>
        );
      case 'auditor':
        return (
          <Badge className="bg-purple-600 hover:bg-purple-700">
            <FileSpreadsheet className="mr-1 h-3 w-3" />
            Auditor
          </Badge>
        );
      default:
        return (
          <Badge className="bg-green-600 hover:bg-green-700">
            <UserIcon className="mr-1 h-3 w-3" />
            User
          </Badge>
        );
    }
  };
  
  // Handle create form submission
  const onCreateSubmit = (data: z.infer<typeof userFormSchema>) => {
    createUserMutation.mutate(data);
  };
  
  // Handle edit form submission
  const onEditSubmit = (data: z.infer<typeof userFormSchema>) => {
    if (!selectedUser) return;
    
    // Remove password fields if not provided
    const updateData = { ...data };
    if (!updateData.password) {
      delete updateData.password;
      delete updateData.confirmPassword;
    }
    
    updateUserMutation.mutate({ id: selectedUser.id, userData: updateData });
  };
  
  // Handle reset password form submission
  const onResetPasswordSubmit = (data: { newPassword: string, confirmPassword: string }) => {
    if (!selectedUser) return;
    resetPasswordMutation.mutate({ id: selectedUser.id, password: data.newPassword });
  };
  
  // Handle delete user
  const handleDeleteUser = () => {
    if (!selectedUser) return;
    deleteUserMutation.mutate(selectedUser.id);
  };
  
  // Handle opening the edit dialog
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    editForm.reset({
      username: user.username,
      email: user.email,
      role: user.role,
      clientId: user.clientId,
      isActive: user.isActive
    });
    setIsEditDialogOpen(true);
  };
  
  // Handle opening the reset password dialog
  const handleResetPassword = (user: User) => {
    setSelectedUser(user);
    resetPasswordForm.reset();
    setIsResetPasswordDialogOpen(true);
  };
  
  // Handle opening the delete dialog
  const handleConfirmDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };
  
  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    // Search filter
    const searchMatch = searchQuery 
      ? user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    // Role filter
    const roleMatch = selectedRole 
      ? user.role === selectedRole
      : true;
    
    // Client filter
    const clientMatch = selectedClientId !== null
      ? user.clientId === selectedClientId
      : true;
    
    return searchMatch && roleMatch && clientMatch;
  });
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Users className="mr-2 h-6 w-6" />
            User Management
          </h2>
          <p className="text-gray-400">
            Create, modify, and manage user accounts and permissions
          </p>
        </div>
        
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Create User
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">
            <Users className="mr-2 h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="roles">
            <Shield className="mr-2 h-4 w-4" />
            Roles & Permissions
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="space-y-4">
          {/* Filters and search */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex flex-wrap gap-2 items-center">
                  <Select
                    value={selectedRole || ''}
                    onValueChange={(value) => setSelectedRole(value || null)}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="All Roles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Roles</SelectItem>
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="client_admin">Client Admin</SelectItem>
                      <SelectItem value="analyst">Analyst</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="auditor">Auditor</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select
                    value={selectedClientId?.toString() || ''}
                    onValueChange={(value) => setSelectedClientId(value ? parseInt(value) : null)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="All Organizations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Organizations</SelectItem>
                      <SelectItem value="null">System-wide</SelectItem>
                      {clients.map(client => (
                        <SelectItem key={client.id} value={client.id.toString()}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedRole(null);
                      setSelectedClientId(null);
                      setSearchQuery('');
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
                
                <div className="relative flex-1 md:max-w-sm w-full">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Users table */}
          <Card>
            <CardHeader className="pb-0">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">User Accounts</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetchUsers()}
                  disabled={isLoadingUsers}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingUsers ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
              <CardDescription>
                Manage user accounts and access permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingUsers ? (
                <div className="flex justify-center items-center h-60">
                  <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-60 text-center">
                  <Users className="h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-1">No users found</h3>
                  <p className="text-sm text-gray-400 mb-4 max-w-md">
                    {searchQuery || selectedRole || selectedClientId !== null
                      ? 'No users match your current filters. Try adjusting your search criteria.'
                      : 'No users have been created yet. Click the "Create User" button to add your first user.'}
                  </p>
                  {(searchQuery || selectedRole || selectedClientId !== null) && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedRole(null);
                        setSelectedClientId(null);
                        setSearchQuery('');
                      }}
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              ) : (
                <div className="border rounded-md border-gray-800">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Username</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Organization</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Login</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.username}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{getRoleBadge(user.role)}</TableCell>
                          <TableCell>{getClientName(user.clientId)}</TableCell>
                          <TableCell>
                            {user.isActive ? (
                              <Badge variant="outline" className="text-green-400 border-green-400">
                                <CheckCircle className="mr-1 h-3 w-3" />
                                Active
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-gray-400 border-gray-400">
                                <XCircle className="mr-1 h-3 w-3" />
                                Inactive
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-gray-400">
                            {formatDate(user.lastLogin)}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit User
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleResetPassword(user)}>
                                  <Key className="mr-2 h-4 w-4" />
                                  Reset Password
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleConfirmDelete(user)}
                                  className="text-red-500 focus:text-red-500"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-gray-400">
                Showing {filteredUsers.length} of {users.length} users
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Roles & Permissions</CardTitle>
              <CardDescription>
                Predefined user roles and their associated permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(rolePermissions).map(([role, data]) => (
                  <div key={role} className="border border-gray-800 rounded-lg p-4">
                    <div className="flex flex-col md:flex-row justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium flex items-center">
                          {role === 'admin' && <ShieldAlert className="h-5 w-5 mr-2 text-red-500" />}
                          {role === 'client_admin' && <Shield className="h-5 w-5 mr-2 text-orange-500" />}
                          {role === 'analyst' && <Search className="h-5 w-5 mr-2 text-blue-500" />}
                          {role === 'user' && <UserIcon className="h-5 w-5 mr-2 text-green-500" />}
                          {role === 'auditor' && <FileSpreadsheet className="h-5 w-5 mr-2 text-purple-500" />}
                          {data.name}
                        </h3>
                        <p className="text-sm text-gray-400 mt-1">{data.description}</p>
                      </div>
                      {getRoleBadge(role)}
                    </div>
                    
                    <div className="bg-gray-800 rounded-lg p-4">
                      <h4 className="text-sm font-medium mb-3">Permissions:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {data.permissions.map(permission => (
                          <div key={permission} className="flex items-center space-x-2">
                            <Checkbox id={`${role}-${permission}`} checked disabled />
                            <Label htmlFor={`${role}-${permission}`} className="capitalize">
                              {permission.replace(/_/g, ' ')}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Create User Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Add a new user to the system. Fill in all the required information.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...createForm}>
            <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
              <FormField
                control={createForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={createForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="user@example.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={createForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input placeholder="Create password" type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={createForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input placeholder="Confirm password" type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={createForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="admin">Administrator</SelectItem>
                          <SelectItem value="client_admin">Client Admin</SelectItem>
                          <SelectItem value="analyst">Analyst</SelectItem>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="auditor">Auditor</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        User's permission level in the system
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={createForm.control}
                  name="clientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organization</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(value === 'null' ? null : parseInt(value))}
                        defaultValue={field.value === null ? 'null' : field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select client" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="null">System-wide (No Organization)</SelectItem>
                          {clients.map(client => (
                            <SelectItem key={client.id} value={client.id.toString()}>
                              {client.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Organization this user belongs to
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={createForm.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-800 p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Active</FormLabel>
                      <FormDescription>
                        Active users can log in to the system
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createUserMutation.isPending}>
                  {createUserMutation.isPending ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Create User
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Edit User Dialog */}
      {selectedUser && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update user information and permissions.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
                <FormField
                  control={editForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="user@example.com" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Alert variant="warning" className="bg-amber-950/30 border-amber-800">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Leave password fields empty to keep current password
                  </AlertDescription>
                </Alert>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Leave blank to keep current" type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={editForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <Input placeholder="Confirm new password" type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="admin">Administrator</SelectItem>
                            <SelectItem value="client_admin">Client Admin</SelectItem>
                            <SelectItem value="analyst">Analyst</SelectItem>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="auditor">Auditor</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          User's permission level in the system
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={editForm.control}
                    name="clientId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(value === 'null' ? null : parseInt(value))}
                          defaultValue={field.value === null ? 'null' : field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select client" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="null">System-wide (No Organization)</SelectItem>
                            {clients.map(client => (
                              <SelectItem key={client.id} value={client.id.toString()}>
                                {client.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Organization this user belongs to
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={editForm.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-800 p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Active</FormLabel>
                        <FormDescription>
                          {field.value 
                            ? 'User can log in to the system' 
                            : 'User cannot log in while inactive'}
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={updateUserMutation.isPending}>
                    {updateUserMutation.isPending ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Edit className="mr-2 h-4 w-4" />
                        Update User
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Reset Password Dialog */}
      {selectedUser && (
        <Dialog open={isResetPasswordDialogOpen} onOpenChange={setIsResetPasswordDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reset Password</DialogTitle>
              <DialogDescription>
                Reset password for user: <span className="font-semibold">{selectedUser.username}</span>
              </DialogDescription>
            </DialogHeader>
            
            <Form {...resetPasswordForm}>
              <form onSubmit={resetPasswordForm.handleSubmit(onResetPasswordSubmit)} className="space-y-4">
                <Alert variant="warning" className="bg-gray-800 border-amber-600">
                  <Lock className="h-4 w-4 text-amber-500" />
                  <AlertDescription>
                    This will reset the user's password. They will need to use the new password to log in.
                  </AlertDescription>
                </Alert>
                
                <FormField
                  control={resetPasswordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter new password" type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={resetPasswordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input placeholder="Confirm new password" type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsResetPasswordDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="destructive" disabled={resetPasswordMutation.isPending}>
                    {resetPasswordMutation.isPending ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Resetting...
                      </>
                    ) : (
                      <>
                        <Key className="mr-2 h-4 w-4" />
                        Reset Password
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Delete User Confirmation Dialog */}
      {selectedUser && (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete User</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the user: <span className="font-semibold">{selectedUser.username}</span>?
              </DialogDescription>
            </DialogHeader>
            
            <Alert variant="destructive" className="bg-red-950/30 border-red-800">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This action cannot be undone. The user will be permanently deleted from the system.
              </AlertDescription>
            </Alert>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeleteUser}
                disabled={deleteUserMutation.isPending}
              >
                {deleteUserMutation.isPending ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete User
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}