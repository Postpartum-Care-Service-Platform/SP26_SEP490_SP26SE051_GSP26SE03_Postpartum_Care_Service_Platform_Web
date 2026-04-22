'use client';

import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

import LogoSymbol from '@/assets/images/Symbol-Orange-180x180.png';
import { useToast } from '@/components/ui/toast/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { AUTH_LOGIN_MESSAGES } from '@/messages/auth/login';
import { AUTH_LOGIN_REGEX } from '@/messages/auth/login.regex';
import { ROUTES } from '@/routes/routes';
import authService from '@/services/auth.service';

import { LogoLoader } from '@/components/ui/logo-loader';
import styles from './login.module.css';

type ApiError = {
  status?: number;
  message?: string;
  data?: {
    error?: string;
  };
};

const getApiErrorDetails = (error: unknown): ApiError => {
  if (error instanceof Error) {
    return { message: error.message };
  }

  if (typeof error === 'object' && error !== null) {
    const maybeError = error as Partial<ApiError>;
    return {
      status: typeof maybeError.status === 'number' ? maybeError.status : undefined,
      message: typeof maybeError.message === 'string' ? maybeError.message : undefined,
      data:
        maybeError.data && typeof maybeError.data === 'object'
          ? (maybeError.data as { error?: string })
          : undefined,
    };
  }

  return {};
};

export function LoginForm() {
  const [emailOrUsername, setEmailOrUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [rememberMe, setRememberMe] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [savedAccounts, setSavedAccounts] = React.useState<string[]>([]);
  const [showSavedAccounts, setShowSavedAccounts] = React.useState(false);
  const dropdownRef = React.useRef<HTMLFormElement>(null);
  const [fieldErrors, setFieldErrors] = React.useState<{
    emailOrUsername?: string;
    password?: string;
  }>({});

  const { login } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  React.useEffect(() => {
    const saved = localStorage.getItem('saved_accounts');
    if (saved) {
      try {
        setSavedAccounts(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved accounts');
      }
    }
  }, []);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSavedAccounts(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleGoogleRedirect = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim();
    const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI?.trim();

    if (!clientId || !redirectUri) {
      toast({ title: 'Thiếu cấu hình Google OAuth', variant: 'error' });
      return;
    }

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'id_token',
      scope: 'openid email profile',
      prompt: 'select_account',
    });

    const state = window.crypto.randomUUID();
    params.set('state', state);

    const nonce = window.crypto.randomUUID();
    params.set('nonce', nonce);

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    window.location.href = authUrl;
  };

  const isEmail = (value: string) => AUTH_LOGIN_REGEX.email.test(value);
  const hasAtSymbol = (value: string) => value.includes('@');

  const validate = () => {
    const nextErrors: typeof fieldErrors = {};

    if (!emailOrUsername.trim()) {
      nextErrors.emailOrUsername = AUTH_LOGIN_MESSAGES.requiredEmailOrUsername;
    } else if (hasAtSymbol(emailOrUsername) && !isEmail(emailOrUsername)) {
      nextErrors.emailOrUsername = AUTH_LOGIN_MESSAGES.invalidEmailFormat;
    }

    if (!password) {
      nextErrors.password = AUTH_LOGIN_MESSAGES.requiredPassword;
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setFieldErrors({});

    try {
      const authResponse = await authService.login({ emailOrUsername, password, rememberMe });
      if (!authResponse?.accessToken || !authResponse?.user) {
        throw new Error('Có lỗi xảy ra');
      }

      login(authResponse);
      toast({ title: AUTH_LOGIN_MESSAGES.loginSuccess, variant: 'success' });

      // Lưu tài khoản sau khi đăng nhập thành công
      const updatedSaved = Array.from(new Set([emailOrUsername, ...savedAccounts])).slice(0, 5);
      localStorage.setItem('saved_accounts', JSON.stringify(updatedSaved));

      // Redirect dựa trên role
      const userRole = authResponse.user.role?.toLowerCase();
      switch (userRole) {
        case 'admin':
          router.push(ROUTES.admin);
          break;
        case 'manager':
          router.push(ROUTES.manager);
          break;
        case 'staff':
          router.push('/staff');
          break;
        case 'receptionist':
          router.push(ROUTES.receptionist);
          break;
        default:
          router.push(ROUTES.home);
      }
    } catch (err: unknown) {
      const { status, message, data } = getApiErrorDetails(err);
      if (status === 401) {
        setFieldErrors({
          emailOrUsername: AUTH_LOGIN_MESSAGES.invalidCredentials,
          password: AUTH_LOGIN_MESSAGES.invalidCredentials,
        });
      } else {
        const friendlyMessage = message || data?.error || 'Có lỗi xảy ra';
        setFieldErrors({ emailOrUsername: friendlyMessage });
      }
      console.error('Đăng nhập thất bại:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.brand}>
        <Image src={LogoSymbol} alt="thejoyfulnest" width={34} height={34} priority />
        <span className={styles.brandName}>thejoyfulnest</span>
      </div>
      <div className={styles.heading}>Đăng nhập vào thejoyfulnest</div>
      <div className={styles.googleBtnWrapper}>
        <button type="button" className={styles.googleBtn} disabled={isLoading} onClick={handleGoogleRedirect}>
          <Image
            src="/google-icon-logo-svgrepo-com.svg"
            alt="Google logo"
            width={18}
            height={18}
            className={styles.googleIcon}
          />
          Đăng nhập bằng Google
        </button>
      </div>
      <div className={styles.divider}>hoặc</div>
      <form className={styles.form} onSubmit={handleSubmit} ref={dropdownRef}>
        <label className={styles.label} style={{ position: 'relative' }}>
          Email hoặc tên đăng nhập
          <input
            className={`${styles.input} ${fieldErrors.emailOrUsername ? styles.inputError : ''}`}
            type="text"
            placeholder="Nhập email hoặc tên đăng nhập"
            autoComplete="chrome-off"
            value={emailOrUsername}
            onFocus={() => setShowSavedAccounts(true)}
            onClick={() => setShowSavedAccounts(true)}
            onChange={(e) => {
              setEmailOrUsername(e.target.value);
              if (fieldErrors.emailOrUsername) {
                setFieldErrors((prev) => ({ ...prev, emailOrUsername: undefined }));
              }
            }}
            disabled={isLoading}
          />
          {showSavedAccounts && (
            <div className={styles.customDropdown}>
              <div className={styles.dropdownHeader}>{AUTH_LOGIN_MESSAGES.savedAccounts}</div>
              {savedAccounts.length > 0 ? (
                savedAccounts.map((account) => (
                  <div
                    key={account}
                    className={styles.dropdownItem}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setEmailOrUsername(account);
                      setShowSavedAccounts(false);
                    }}
                  >
                    {account}
                  </div>
                ))
              ) : (
                <div 
                  className={styles.dropdownEmpty} 
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowSavedAccounts(false);
                  }}
                >
                  Bạn chưa đăng nhập lần nào trên máy này.
                </div>
              )}
            </div>
          )}
          {fieldErrors.emailOrUsername && (
            <div className={styles.fieldError}>{fieldErrors.emailOrUsername}</div>
          )}
        </label>

        <label className={styles.label}>
          Mật khẩu
          <div className={styles.passwordWrap}>
            <input
              className={`${styles.passwordInput} ${fieldErrors.password ? styles.inputError : ''}`}
              type={showPassword ? 'text' : 'password'}
              placeholder="Nhập mật khẩu"
              autoComplete="current-password"
              value={password}
              onFocus={() => setShowSavedAccounts(false)}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) {
                  setFieldErrors((prev) => ({ ...prev, password: undefined }));
                }
              }}
              disabled={isLoading}
            />
            <button
              className={styles.eyeButton}
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            >
              {showPassword ? <EyeOpenIcon width={18} height={18} /> : <EyeClosedIcon width={18} height={18} />}
            </button>
          </div>
          {fieldErrors.password && <div className={styles.fieldError}>{fieldErrors.password}</div>}
        </label>
        <div className={styles.rememberMeContainer}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span className={styles.checkboxText}>{AUTH_LOGIN_MESSAGES.rememberMe}</span>
          </label>
        </div>

        <button type="submit" className={styles.submit} disabled={isLoading}>
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <LogoLoader size="sm" />
              <span>Đang xử lý...</span>
            </div>
          ) : (
            'Đăng nhập'
          )}
        </button>
      </form>

      <div className={styles.footerLinks}>
        <div className={styles.footerLinksRow}>
          Chưa có tài khoản?{' '}
          <Link className={styles.footerLink} href={ROUTES.register}>
            Đăng ký
          </Link>
        </div>
        <div>
          Quên mật khẩu?{' '}
          <Link className={styles.footerLink} href={ROUTES.resetPassword}>
            Đặt lại
          </Link>
        </div>
      </div>
    </div>
  );
}
