import React, { useState } from 'react';
import { useRoute } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { apiRequest } from '@/lib/queryClient';
import { 
  ArrowLeft,
  Crown,
  Edit,
  Key,
  Lock,
  MoreVertical,
  Plus,
  Shield,
  Trash2,
  User,
  UserCheck,
  UserPlus,
  Users
} from 'lucide-react';
import { Link } from 'wouter';

interface ServerUser {
  id: string;
  username: string;
  fullName?: string;
  email?: string;
  role: 'admin' | 'user' | 'guest';
  groups: string[];
  homeDirectory: string;
  shell: string;
  lastLogin?: string;
  status: 'active' | 'disabled' | 'locked';
  sshKeys: number;
  permissions: string[];
}

interface UserGroup {
  id: string;
  name: string;
  description: string;
  members: number;
  permissions: string[];
}

const userSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  fullName: z.string().optional(),
  email: z.string().email().optional(),
  role: z.enum(['admin', 'user', 'guest']),
  groups: z.array(z.string()),
  homeDirectory: z.string().min(1, 'Home directory is required'),
  shell: z.string().min(1, 'Shell is required'),
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
  generateSSHKey: z.boolean().optional(),
});

type UserFormValues = z.infer<typeof userSchema>;

const UsersPage: React.FC = () => {
  const [, params] = useRoute('/servers/:id/users');
  const serverId = params?.id;
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<ServerUser | null>(null);

  // Sample users data
  const sampleUsers: ServerUser[] = [
    {
      id: 'user-1',
      username: 'admin',
      fullName: 'System Administrator',
      email: 'admin@server.local',
      role: 'admin',
      groups: ['sudo', 'admin', 'staff'],
      homeDirectory: '/home/admin',
      shell: '/bin/bash',
      lastLogin: new Date(Date.now() - 2 * 3600000).toISOString(),
      status: 'active',
      sshKeys: 3,
      permissions: ['*']
    },
    {
      id: 'user-2',
      username: 'developer',
      fullName: 'John Developer',
      email: 'john@company.com',
      role: 'user',
      groups: ['developers', 'docker'],
      homeDirectory: '/home/developer',
      shell: '/bin/bash',
      lastLogin: new Date(Date.now() - 5 * 3600000).toISOString(),
      status: 'active',
      sshKeys: 1,
      permissions: ['read', 'write', 'execute']
    },
    {
      id: 'user-3',
      username: 'backup',
      fullName: 'Backup Service Account',
      role: 'user',
      groups: ['backup'],
      homeDirectory: '/var/lib/backup',
      shell: '/bin/sh',
      status: 'active',
      sshKeys: 1,
      permissions: ['read']
    }
  ];

  // Sample groups data
  const sampleGroups: UserGroup[] = [
    {
      id: 'group-1',
      name: 'sudo',
      description: 'Superuser privileges',
      members: 2,
      permissions: ['sudo', 'admin']
    },
    {
      id: 'group-2',
      name: 'developers',
      description: 'Development team access',
      members: 1,
      permissions: ['docker', 'git', 'deploy']
    },
    {
      id: 'group-3',
      name: 'backup',
      description: 'Backup operations',
      members: 1,
      permissions: ['backup', 'restore']
    }
  ];

  // Form for creating/editing users
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: '',
      fullName: '',
      email: '',
      role: 'user',
      groups: [],
      homeDirectory: '',
      shell: '/bin/bash',
      generateSSHKey: false,
    },
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: async (userData: UserFormValues) => {
      const response = await apiRequest('POST', `/api/servers/${serverId}/users`, userData);
      if (!response.ok) throw new Error('Failed to create user');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/servers/${serverId}/users`] });
      toast({
        title: "User created",
        description: "New user has been created successfully.",
      });
      setIsCreatingUser(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to create user",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await apiRequest('DELETE', `/api/servers/${serverId}/users/${userId}`);
      if (!response.ok) throw new Error('Failed to delete user');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/servers/${serverId}/users`] });
      toast({
        title: "User deleted",
        description: "User has been removed successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete user",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCreateUser = () => {
    form.reset({
      username: '',
      fullName: '',
      email: '',
      role: 'user',
      groups: [],
      homeDirectory: '',
      shell: '/bin/bash',
      generateSSHKey: false,
    });
    setIsCreatingUser(true);
  };

  const onSubmit = (data: UserFormValues) => {
    // Auto-generate home directory if not provided
    if (!data.homeDirectory) {
      data.homeDirectory = `/home/${data.username}`;
    }
    createUserMutation.mutate(data);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown className="h-4 w-4 text-amber-500" />;
      case 'user': return <User className="h-4 w-4 text-blue-500" />;
      case 'guest': return <UserCheck className="h-4 w-4 text-slate-500" />;
      default: return <User className="h-4 w-4 text-slate-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500';
      case 'disabled': return 'bg-amber-500';
      case 'locked': return 'bg-rose-500';
      default: return 'bg-slate-500';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/servers">
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Servers
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-white">
              <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">User</span> Management
            </h1>
          </div>
          <Button
            onClick={handleCreateUser}
            className="bg-gradient-to-r from-blue-600 to-indigo-700"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="bg-slate-800 mb-6">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Users List */}
              <div className="lg:col-span-2">
                <Card className="border-slate-800 bg-slate-900">
                  <CardHeader>
                    <CardTitle className="text-white">System Users</CardTitle>
                    <CardDescription className="text-slate-400">
                      Manage user accounts and their access permissions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {sampleUsers.map((user) => (
                      <div
                        key={user.id}
                        className={`rounded-lg border border-slate-800 bg-slate-950 p-4 hover:bg-slate-800 cursor-pointer transition-colors ${
                          selectedUser?.id === user.id ? 'border-blue-500' : ''
                        }`}
                        onClick={() => setSelectedUser(user)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            {getRoleIcon(user.role)}
                            <div>
                              <h3 className="text-lg font-medium text-white">{user.username}</h3>
                              {user.fullName && (
                                <p className="text-sm text-slate-400">{user.fullName}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={`${getStatusColor(user.status)} text-white`}>
                              {user.status}
                            </Badge>
                            <Badge variant="outline" className="border-slate-700 text-slate-400">
                              {user.role}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-slate-400">Home:</span>
                            <p className="text-white font-mono">{user.homeDirectory}</p>
                          </div>
                          <div>
                            <span className="text-slate-400">Shell:</span>
                            <p className="text-white font-mono">{user.shell}</p>
                          </div>
                          <div>
                            <span className="text-slate-400">Groups:</span>
                            <p className="text-white">{user.groups.join(', ')}</p>
                          </div>
                          <div>
                            <span className="text-slate-400">SSH Keys:</span>
                            <p className="text-white">{user.sshKeys}</p>
                          </div>
                          {user.lastLogin && (
                            <div className="col-span-2">
                              <span className="text-slate-400">Last Login:</span>
                              <p className="text-white">{formatDate(user.lastLogin)}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* User Details */}
              <div className="lg:col-span-1">
                <Card className="border-slate-800 bg-slate-900">
                  <CardHeader>
                    <CardTitle className="text-white">User Details</CardTitle>
                    <CardDescription className="text-slate-400">
                      Detailed information and actions for selected user
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectedUser ? (
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-slate-400">Username</label>
                          <p className="text-white font-mono">{selectedUser.username}</p>
                        </div>
                        
                        {selectedUser.email && (
                          <div>
                            <label className="text-sm font-medium text-slate-400">Email</label>
                            <p className="text-white">{selectedUser.email}</p>
                          </div>
                        )}
                        
                        <div>
                          <label className="text-sm font-medium text-slate-400">Role</label>
                          <div className="flex items-center space-x-2 mt-1">
                            {getRoleIcon(selectedUser.role)}
                            <Badge className="bg-blue-600 text-white">
                              {selectedUser.role}
                            </Badge>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-slate-400">Groups</label>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {selectedUser.groups.map((group, index) => (
                              <Badge key={index} variant="outline" className="border-slate-700 text-slate-400">
                                {group}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-slate-400">Permissions</label>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {selectedUser.permissions.map((permission, index) => (
                              <Badge key={index} variant="outline" className="border-slate-700 text-slate-400">
                                {permission}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="space-y-2 pt-4">
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full border-slate-700"
                          >
                            <Key className="mr-2 h-4 w-4" />
                            Manage SSH Keys
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full border-slate-700"
                          >
                            <Lock className="mr-2 h-4 w-4" />
                            Reset Password
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full border-slate-700"
                            onClick={() => setIsEditingUser(selectedUser.id)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit User
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="w-full"
                            onClick={() => deleteUserMutation.mutate(selectedUser.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete User
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Users className="h-12 w-12 mx-auto text-slate-600 mb-4" />
                        <h3 className="text-lg font-medium text-slate-400 mb-2">Select a user</h3>
                        <p className="text-slate-500">
                          Click on a user to view details and manage their account.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Groups Tab */}
          <TabsContent value="groups" className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sampleGroups.map((group) => (
                <Card key={group.id} className="border-slate-800 bg-slate-900">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-white">{group.name}</CardTitle>
                    <CardDescription className="text-slate-400">
                      {group.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Members:</span>
                        <span className="text-white">{group.members}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Permissions:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {group.permissions.map((permission, index) => (
                            <Badge key={index} variant="outline" className="border-slate-700 text-slate-400 text-xs">
                              {permission}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Permissions Tab */}
          <TabsContent value="permissions" className="space-y-6">
            <Card className="border-slate-800 bg-slate-900">
              <CardHeader>
                <CardTitle className="text-white">Permission Matrix</CardTitle>
                <CardDescription className="text-slate-400">
                  Overview of user and group permissions across the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Shield className="h-12 w-12 mx-auto text-slate-600 mb-4" />
                  <h3 className="text-lg font-medium text-slate-400 mb-2">Advanced Permissions</h3>
                  <p className="text-slate-500">
                    Detailed permission management features coming soon.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create/Edit User Dialog */}
      <Dialog open={isCreatingUser || !!isEditingUser} onOpenChange={(open) => {
        if (!open) {
          setIsCreatingUser(false);
          setIsEditingUser(null);
        }
      }}>
        <DialogContent className="border-slate-800 bg-slate-900 text-white sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isEditingUser ? 'Edit User' : 'Create New User'}</DialogTitle>
            <DialogDescription className="text-slate-400">
              {isEditingUser ? 'Update user account settings' : 'Create a new user account with specified permissions'}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input {...field} className="border-slate-700 bg-slate-800 text-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} className="border-slate-700 bg-slate-800 text-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" className="border-slate-700 bg-slate-800 text-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-slate-700 bg-slate-800 text-white">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="border-slate-700 bg-slate-800 text-white">
                          <SelectItem value="admin">Administrator</SelectItem>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="guest">Guest</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="shell"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shell</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-slate-700 bg-slate-800 text-white">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="border-slate-700 bg-slate-800 text-white">
                          <SelectItem value="/bin/bash">bash</SelectItem>
                          <SelectItem value="/bin/sh">sh</SelectItem>
                          <SelectItem value="/bin/zsh">zsh</SelectItem>
                          <SelectItem value="/bin/fish">fish</SelectItem>
                          <SelectItem value="/usr/sbin/nologin">nologin</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="homeDirectory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Home Directory</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="/home/username" className="border-slate-700 bg-slate-800 text-white" />
                    </FormControl>
                    <FormDescription className="text-slate-500">
                      Leave empty to auto-generate based on username
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="generateSSHKey"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Generate SSH Key</FormLabel>
                      <FormDescription className="text-slate-500">
                        Automatically generate SSH key pair for this user
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreatingUser(false);
                    setIsEditingUser(null);
                  }}
                  className="border-slate-700"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={createUserMutation.isPending}
                >
                  {createUserMutation.isPending ? 'Creating...' : (isEditingUser ? 'Update User' : 'Create User')}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersPage;