'use client';

import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import type { User, AuthResponse } from '@/types/auth';
import authService from '@/services/auth.service';

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
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);

      if (storedToken) setToken(storedToken);
      if (storedRefreshToken) setRefreshToken(storedRefreshToken);
      if (storedUser) setUser(JSON.parse(storedUser) as User);
    } catch {
      // ignore
    }
  }, []);

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

