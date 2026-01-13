'use client';

import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import type { User, AuthResponse } from '@/types/auth';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (authResponse: AuthResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);

      if (storedToken) setToken(storedToken);
      if (storedUser) setUser(JSON.parse(storedUser) as User);
    } catch {
      // ignore
    }
  }, []);

  const login = (authResponse: AuthResponse) => {
    setUser(authResponse.user);
    setToken(authResponse.accessToken);

    try {
      localStorage.setItem(TOKEN_KEY, authResponse.accessToken);
      localStorage.setItem(USER_KEY, JSON.stringify(authResponse.user));
    } catch {
      // ignore
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);

    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch {
      // ignore
    }
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: !!token,
      login,
      logout,
    }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

