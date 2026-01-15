'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { useToast } from '@/components/ui/toast/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import authService from '@/services/auth.service';
import { AUTH_LOGIN_MESSAGES } from '@/messages/auth/login';
import { ROUTES } from '@/routes/routes';

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { login } = useAuth();
  const [isProcessing, setIsProcessing] = React.useState(true);

  React.useEffect(() => {
    const handleGoogleCallback = async () => {
      const hash = window.location.hash.startsWith('#') ? window.location.hash.substring(1) : '';
      const hashParams = new URLSearchParams(hash);

      const idToken = hashParams.get('id_token') || searchParams.get('id_token');
      const error = hashParams.get('error') || searchParams.get('error');

      if (error || !idToken) {
        toast({ title: 'Đăng nhập Google thất bại', variant: 'error' });
        setTimeout(() => {
          window.location.href = ROUTES.login;
        }, 1500);
        return;
      }

      try {
        const authResponse = await authService.loginWithGoogle({ idToken });
        if (!authResponse?.accessToken || !authResponse?.user) {
          throw new Error('Có lỗi xảy ra: Thiếu thông tin xác thực');
        }

        login(authResponse);
        toast({ title: AUTH_LOGIN_MESSAGES.loginSuccess, variant: 'success' });

        const userRole = authResponse.user.role?.toLowerCase();
        const redirectPath = userRole === 'admin' ? ROUTES.admin : ROUTES.main;

        window.location.href = redirectPath;
      } catch (err: any) {
        console.error('Google login error:', err);
        toast({ title: err?.message || 'Đăng nhập Google thất bại', variant: 'error' });
        setTimeout(() => {
          window.location.href = ROUTES.login;
        }, 1500);
      } finally {
        setIsProcessing(false);
      }
    };

    handleGoogleCallback();
  }, [login, router, searchParams, toast]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        backgroundColor: 'var(--color-bg-primary)',
        padding: '24px',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '14px',
          color: 'var(--color-text-primary)',
        }}
      >
        {isProcessing ? 'Đang xử lý đăng nhập Google...' : 'Đang chuyển hướng...'}
      </div>
    </div>
  );
}


