import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertTriangle, 
  Search, 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  ShieldOff, 
  Key, 
  RefreshCw,
  Trash, 
  User, 
  Terminal,
  Clock
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface UserToken {
  id: number;
  userId: number;
  token: string;
  tokenType: string;
  description: string;
  expiresAt: string;
  createdAt: string;
  lastUsedAt: string | null;
  userAgent: string | null;
  ipAddress: string | null;
  isRevoked: boolean;
  username: string;
  userEmail: string;
  userName: string;
}

export default function CyberShieldSecurityManager() {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [processingCleanup, setProcessingCleanup] = useState(false);

  // Fetch all user tokens
  const { data: userTokens, isLoading } = useQuery({
    queryKey: ["/api/admin/security/user-tokens"],
  });

  // Mutation to revoke a token
  const revokeMutation = useMutation({
    mutationFn: async (tokenId: number) => {
      return await apiRequest("/api/admin/security/revoke-token", "POST", { tokenId });
    },
    onSuccess: () => {
      toast({
        title: "Token Revoked",
        description: "The token has been successfully revoked.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/security/user-tokens"] });
    },
    onError: (error) => {
      console.error("Error revoking token:", error);
      toast({
        title: "Error",
        description: "There was a problem revoking the token.",
        variant: "destructive",
      });
    }
  });

  // Mutation to revoke all tokens for a user
  const revokeAllMutation = useMutation({
    mutationFn: async (userId: number) => {
      return await apiRequest("/api/admin/security/revoke-all-user-tokens", "POST", { userId });
    },
    onSuccess: () => {
      toast({
        title: "All Tokens Revoked",
        description: "All tokens for this user have been successfully revoked.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/security/user-tokens"] });
    },
    onError: (error) => {
      console.error("Error revoking all tokens:", error);
      toast({
        title: "Error",
        description: "There was a problem revoking all tokens for this user.",
        variant: "destructive",
      });
    }
  });

  // Clean up expired tokens
  const cleanupExpiredMutation = useMutation({
    mutationFn: async () => {
      setProcessingCleanup(true);
      return await apiRequest("/api/admin/security/cleanup-expired-tokens", "POST");
    },
    onSuccess: () => {
      toast({
        title: "Cleanup Complete",
        description: "Expired tokens have been cleaned up successfully.",
        variant: "default",
      });
      setProcessingCleanup(false);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/security/user-tokens"] });
    },
    onError: (error) => {
      console.error("Error cleaning up expired tokens:", error);
      toast({
        title: "Error",
        description: "There was a problem cleaning up expired tokens.",
        variant: "destructive",
      });
      setProcessingCleanup(false);
    }
  });

  // Filter tokens based on search query
  const filteredTokens = userTokens ? userTokens.filter((token: UserToken) => {
    if (!searchQuery) return true;
    
    const lowerCaseQuery = searchQuery.toLowerCase();
    return (
      token.username?.toLowerCase().includes(lowerCaseQuery) ||
      token.userEmail?.toLowerCase().includes(lowerCaseQuery) ||
      token.userName?.toLowerCase().includes(lowerCaseQuery) ||
      token.tokenType?.toLowerCase().includes(lowerCaseQuery) ||
      token.ipAddress?.toLowerCase().includes(lowerCaseQuery) ||
      token.userAgent?.toLowerCase().includes(lowerCaseQuery)
    );
  }) : [];

  // Format date helper
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleString();
  };

  // Get token status
  const getTokenStatus = (token: UserToken) => {
    if (token.isRevoked) {
      return { 
        label: "Revoked", 
        color: "bg-red-100 text-red-800", 
        icon: <ShieldOff className="h-3.5 w-3.5 mr-1" />
      };
    }
    
    if (new Date(token.expiresAt) < new Date()) {
      return { 
        label: "Expired", 
        color: "bg-orange-100 text-orange-800",
        icon: <AlertTriangle className="h-3.5 w-3.5 mr-1" />
      };
    }
    
    return { 
      label: "Active", 
      color: "bg-green-100 text-green-800",
      icon: <ShieldCheck className="h-3.5 w-3.5 mr-1" />
    };
  };

  // Group tokens by user
  const getUserGroups = () => {
    const userMap = new Map();
    
    filteredTokens.forEach((token: UserToken) => {
      if (!userMap.has(token.userId)) {
        userMap.set(token.userId, {
          userId: token.userId,
          username: token.username,
          userEmail: token.userEmail,
          userName: token.userName,
          tokens: []
        });
      }
      userMap.get(token.userId).tokens.push(token);
    });
    
    return Array.from(userMap.values());
  };

  // Get token icon based on type
  const getTokenTypeIcon = (tokenType: string) => {
    switch (tokenType) {
      case 'access':
        return <Key className="h-3.5 w-3.5 mr-1" />;
      case 'refresh':
        return <RefreshCw className="h-3.5 w-3.5 mr-1" />;
      case 'remember':
        return <Clock className="h-3.5 w-3.5 mr-1" />;
      case 'reset':
        return <Terminal className="h-3.5 w-3.5 mr-1" />;
      default:
        return <Shield className="h-3.5 w-3.5 mr-1" />;
    }
  };

  return (
    <div>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShieldAlert className="h-5 w-5 mr-2" />
            CyberShield Security Dashboard
          </CardTitle>
          <CardDescription>
            Manage authentication tokens and security features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Security Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <ShieldCheck className="h-8 w-8 text-green-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium">Active Tokens</p>
                      <p className="text-2xl font-bold">
                        {userTokens ? userTokens.filter((t: UserToken) => !t.isRevoked && new Date(t.expiresAt) > new Date()).length : 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <ShieldOff className="h-8 w-8 text-red-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium">Revoked Tokens</p>
                      <p className="text-2xl font-bold">
                        {userTokens ? userTokens.filter((t: UserToken) => t.isRevoked).length : 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <AlertTriangle className="h-8 w-8 text-orange-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium">Expired Tokens</p>
                      <p className="text-2xl font-bold">
                        {userTokens ? userTokens.filter((t: UserToken) => !t.isRevoked && new Date(t.expiresAt) < new Date()).length : 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Actions */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by username, email, IP address..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button 
                variant="outline" 
                onClick={() => cleanupExpiredMutation.mutate()}
                disabled={processingCleanup}
              >
                {processingCleanup ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Cleaning up...
                  </>
                ) : (
                  <>
                    <Trash className="h-4 w-4 mr-2" />
                    Clean Up Expired Tokens
                  </>
                )}
              </Button>
            </div>

            {/* User Groups and Tokens */}
            <div className="space-y-6">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading security data...</p>
                </div>
              ) : getUserGroups().length > 0 ? (
                getUserGroups().map((userGroup) => (
                  <Card key={userGroup.userId} className="overflow-hidden">
                    <CardHeader className="bg-muted/50 py-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <User className="h-5 w-5 mr-2" />
                          <div>
                            <h3 className="font-medium text-sm">{userGroup.userName} ({userGroup.username})</h3>
                            <p className="text-xs text-muted-foreground">{userGroup.userEmail}</p>
                          </div>
                        </div>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => revokeAllMutation.mutate(userGroup.userId)}
                        >
                          Revoke All Tokens
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead>Expires</TableHead>
                            <TableHead>Last Used</TableHead>
                            <TableHead>IP Address</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {userGroup.tokens.map((token: UserToken) => {
                            const status = getTokenStatus(token);
                            return (
                              <TableRow key={token.id}>
                                <TableCell>
                                  <Badge variant="outline" className="flex items-center space-x-1">
                                    {getTokenTypeIcon(token.tokenType)}
                                    <span>{token.tokenType.charAt(0).toUpperCase() + token.tokenType.slice(1)}</span>
                                  </Badge>
                                </TableCell>
                                <TableCell>{formatDate(token.createdAt)}</TableCell>
                                <TableCell>{formatDate(token.expiresAt)}</TableCell>
                                <TableCell>{formatDate(token.lastUsedAt)}</TableCell>
                                <TableCell>
                                  <span className="text-xs">{token.ipAddress || "Unknown"}</span>
                                </TableCell>
                                <TableCell>
                                  <Badge className={`${status.color} flex items-center`}>
                                    {status.icon}
                                    <span>{status.label}</span>
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => revokeMutation.mutate(token.id)}
                                    disabled={token.isRevoked}
                                  >
                                    {token.isRevoked ? "Revoked" : "Revoke"}
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No tokens found matching your search criteria.</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}