import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../utils/api';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const { data: userData, isLoading } = useQuery(['user'], api.getUser, {
    onSuccess: (data) => {
      setUser(data);
      setLoading(false);
    },
    onError: () => {
      setUser(null);
      setLoading(false);
    },
  });

  useEffect(() => {
    if (!isLoading && userData) {
      setUser(userData);
    }
  }, [isLoading, userData]);

  const login = async (credentials) => {
    const response = await api.login(credentials);
    setUser(response.data);
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  return { user, loading, login, logout };
};

export default useAuth;