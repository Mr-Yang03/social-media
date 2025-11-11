import apiClient from '@/lib/api-client';
import { LoginCredentials, RegisterCredentials, AuthResponse, User } from '@/types/auth';

// Mock login - in real app, this would be a proper backend endpoint
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    // Get users from json-server
    const response = await apiClient.get('/users', {
      params: {
        email: credentials.email,
      },
    });

    const users = response.data;
    const user = users.find(
      (u: User & { password: string }) => 
        u.email === credentials.email && u.password === credentials.password
    );

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Generate a simple token (in production, this should be done server-side)
    const token = btoa(`${user.id}:${Date.now()}`);

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
    throw error;
  }
};

// Mock register - in real app, this would be a proper backend endpoint
export const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  try {
    // Check if user already exists
    const existingUsers = await apiClient.get('/users', {
      params: {
        email: credentials.email,
      },
    });

    if (existingUsers.data.length > 0) {
      throw new Error('Email already registered');
    }

    // Create new user
    const newUser = {
      email: credentials.email,
      password: credentials.password,
      name: credentials.name,
      createdAt: new Date().toISOString(),
    };

    const response = await apiClient.post('/users', newUser);
    const user = response.data;

    // Generate a simple token
    const token = btoa(`${user.id}:${Date.now()}`);

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
    throw error;
  }
};

// Mock check session - in real app, this would verify token with backend
export const checkSession = async (token: string): Promise<User> => {
  try {
    // Decode token to get user ID (very simple, not secure for production)
    const decoded = atob(token);
    const userId = decoded.split(':')[0];

    const response = await apiClient.get(`/users/${userId}`);
    const { password, ...userWithoutPassword } = response.data;

    return userWithoutPassword;
  } catch (error) {
    throw new Error('Session expired');
  }
};

import axios from 'axios';
