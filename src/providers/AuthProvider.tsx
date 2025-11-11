'use client';

import { useState, useEffect, ReactNode } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { User, LoginCredentials, RegisterCredentials } from '@/types/auth';
import * as authApi from '@/apis/auth.api';
import { useRouter } from 'next/navigation';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check session on mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    setIsLoading(true);
    try {
      const storedToken = localStorage.getItem('auth_token');
      if (storedToken) {
        const user = await authApi.checkSession(storedToken);
        setUser(user);
        setToken(storedToken);
      }
    } catch (error) {
      // Session invalid, clear storage
      localStorage.removeItem('auth_token');
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authApi.login(credentials);
      setUser(response.user);
      setToken(response.token);
      localStorage.setItem('auth_token', response.token);
      router.push('/');
    } catch (error) {
      throw error;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      const response = await authApi.register(credentials);
      setUser(response.user);
      setToken(response.token);
      localStorage.setItem('auth_token', response.token);
      router.push('/');
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        checkSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
