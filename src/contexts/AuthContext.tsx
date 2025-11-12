'use client';

import { createContext } from 'react';
import { AuthContextType } from '@/api/user/types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
