"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';

interface StaticSocialMediaListProps {
  showParentalControls?: boolean;
}

export function StaticSocialMediaList({ showParentalControls = false }: StaticSocialMediaListProps) {
  // Mock static data for demonstration
  const staticAccounts = [
    {
      id: '1',
      platform: 'Instagram',
      username: '@student_demo',
      isActive: true,
      riskLevel: 'low',
      lastActivity: '2024-01-15T14:30:00Z',
      parentalControls: {
        enabled: true,
        restrictions: ['No DMs from strangers', 'Content filtering']
      }
    },
    {
      id: '2',
      platform: 'TikTok',
      username: '@student_demo',
      isActive: true,
      riskLevel: 'medium',
      lastActivity: '2024-01-15T12:45:00Z',
      parentalControls: {
        enabled: true,
        restrictions: ['Time limits', 'Age-appropriate content']
      }
    },
    {
      id: '3',
      platform: 'Discord',
      username: 'student_demo#1234',
      isActive: false,
      riskLevel: 'high',
      lastActivity: '2024-01-15T09:15:00Z',
      parentalControls: {
        enabled: false,
        restrictions: []
      }
    }
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'high': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'low': return CheckCircle;
      case 'medium': return Shield;
      case 'high': return AlertTriangle;
      default: return Shield;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staticAccounts.map((account) => {
          const RiskIcon = getRiskIcon(account.riskLevel);
          
          return (
            <Card key={account.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{account.platform}</CardTitle>
                  <Badge variant={account.isActive ? 'default' : 'secondary'}>
                    {account.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{account.username}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <RiskIcon className={`w-4 h-4 ${getRiskColor(account.riskLevel)}`} />
                    <span className="text-sm">
                      Risk Level: <span className={`font-medium ${getRiskColor(account.riskLevel)}`}>
                        {account.riskLevel}
                      </span>
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    Last Activity: {new Date(account.lastActivity).toLocaleDateString()}
                  </div>

                  {showParentalControls && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium">Parental Controls</span>
                        <Badge variant={account.parentalControls.enabled ? 'default' : 'secondary'} className="text-xs">
                          {account.parentalControls.enabled ? 'On' : 'Off'}
                        </Badge>
                      </div>
                      {account.parentalControls.enabled && (
                        <ul className="text-xs text-gray-600 space-y-1">
                          {account.parentalControls.restrictions.map((restriction, idx) => (
                            <li key={idx} className="flex items-center gap-1">
                              <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                              {restriction}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}