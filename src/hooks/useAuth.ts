import { useSession, signIn, signOut } from 'next-auth/react';
import { useCallback } from 'react';

import { ROUTES } from '@/routes/routes';
import type { LoginRequest } from '@/types/auth';

export const useAuth = () => {
  const { data: session, status } = useSession();

  const user = session?.user;
  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';


  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      const result = await signIn('credentials', {
        redirect: false,
        emailOrUsername: credentials.emailOrUsername,
        password: credentials.password,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      return result;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut({ redirect: true, callbackUrl: ROUTES.login });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    session,
    status,
  };
};
