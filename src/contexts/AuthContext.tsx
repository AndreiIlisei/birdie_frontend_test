'use client';

import { createContext, useContext, ReactNode } from 'react';
import { GetMeApiResponse } from '@/types';

const AuthContext = createContext<GetMeApiResponse | null | undefined>(undefined);

// Provides authenticated user data throughout the protected parts of the app.
export const AuthProvider = ({ user, children }: { user: GetMeApiResponse | null; children: ReactNode }) => {
  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

// A custom hook to access the authenticated user's data.
export const useAuth = (): GetMeApiResponse | null => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};