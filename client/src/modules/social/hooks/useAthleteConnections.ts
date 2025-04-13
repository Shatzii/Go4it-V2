import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface Sport {
  name: string;
  level: string;
}

interface AthleteConnection {
  id: number;
  name: string;
  avatarUrl?: string;
  location: string;
  sports: Sport[];
  connectionType: 'peer' | 'mentor' | 'coach' | 'suggested';
  connectionStatus: 'pending' | 'connected' | 'none';
  garScore?: number;
}

interface ConnectionFilter {
  connectionType?: 'peer' | 'mentor' | 'coach' | 'suggested' | 'all';
  sportType?: string;
  searchQuery?: string;
}

/**
 * Custom hook for managing athlete connections
 * 
 * Provides functions for fetching, filtering, and managing connections 
 * as well as sending connection requests
 */
export function useAthleteConnections() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<ConnectionFilter>({
    connectionType: 'all',
    sportType: undefined,
    searchQuery: '',
  });
  
  // Fetch connections with current filters
  const { data: connections, isLoading, error } = useQuery({
    queryKey: ['/api/social/connections', filters],
    
    // In a real implementation, the queryFn would use the filters
    // The queryClient default fetcher will handle this automatically
  });
  
  // Send connection request
  const sendConnectionRequest = useMutation({
    mutationFn: async (connectionId: number) => {
      return apiRequest('POST', '/api/social/connections/request', { connectionId });
    },
    onSuccess: () => {
      // Invalidate connections cache to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/social/connections'] });
    },
  });
  
  // Cancel connection request
  const cancelConnectionRequest = useMutation({
    mutationFn: async (connectionId: number) => {
      return apiRequest('DELETE', `/api/social/connections/request/${connectionId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/social/connections'] });
    },
  });
  
  // Accept connection request
  const acceptConnectionRequest = useMutation({
    mutationFn: async (connectionId: number) => {
      return apiRequest('POST', `/api/social/connections/request/${connectionId}/accept`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/social/connections'] });
      queryClient.invalidateQueries({ queryKey: ['/api/social/connection-requests'] });
    },
  });
  
  // Update filters
  const updateFilters = (newFilters: Partial<ConnectionFilter>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return {
    connections,
    isLoading,
    error,
    filters,
    updateFilters,
    sendConnectionRequest,
    cancelConnectionRequest,
    acceptConnectionRequest,
  };
}