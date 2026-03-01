'use client';

import React, { ReactNode, createContext, useContext, useMemo, useState } from 'react';

import authService from '@/services/auth.service';
import type { AuthResponse, User } from '@/types/auth';

const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

interface AuthContextType {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (authResponse: AuthResponse) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const storedUser = localStorage.getItem(USER_KEY);
      return storedUser ? (JSON.parse(storedUser) as User) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  });

  const [refreshToken, setRefreshToken] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    } catch {
      return null;
    }
  });

  const login = (authResponse: AuthResponse) => {
    setUser(authResponse.user);
    setToken(authResponse.accessToken);
    setRefreshToken(authResponse.refreshToken);

    try {
      localStorage.setItem(TOKEN_KEY, authResponse.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, authResponse.refreshToken);
      localStorage.setItem(USER_KEY, JSON.stringify(authResponse.user));
    } catch {
      // ignore
    }
  };

  const logout = async () => {
    try {
      const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (storedRefreshToken) {
        try {
          await authService.logout({ refreshToken: storedRefreshToken });
        } catch (error) {
          console.error('Logout API error:', error);
        }
      }
    } catch {
      // ignore
    }

    setUser(null);
    setToken(null);
    setRefreshToken(null);

    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch {
      // ignore
    }
  };

  const value = useMemo(
    () => ({
      user,
      token,
      refreshToken,
      isAuthenticated: !!token,
      login,
      logout,
    }),
    [user, token, refreshToken]
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

