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
import authService from '@/services/auth.service';
import styles from './login.module.css';
import { ROUTES } from '@/routes/routes';

export function LoginForm() {
  const [emailOrUsername, setEmailOrUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [fieldErrors, setFieldErrors] = React.useState<{
    emailOrUsername?: string;
    password?: string;
  }>({});

  const { login } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

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
      const authResponse = await authService.login({ emailOrUsername, password });
      if (!authResponse?.accessToken || !authResponse?.user) throw { status: 0, message: 'Có lỗi xảy ra' };

      login(authResponse);
      toast({ title: AUTH_LOGIN_MESSAGES.loginSuccess, variant: 'success' });
      router.push(authResponse.user.role?.toLowerCase() === 'admin' ? ROUTES.admin : ROUTES.main);
    } catch (err: any) {
      if (err?.status === 401) {
        setFieldErrors({
          emailOrUsername: AUTH_LOGIN_MESSAGES.invalidCredentials,
          password: AUTH_LOGIN_MESSAGES.invalidCredentials,
        });
      } else {
        setFieldErrors({ emailOrUsername: err?.message || 'Có lỗi xảy ra' });
      }
      console.error('Đăng nhập thất bại:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.brand}>
        <Image src={LogoSymbol} alt="Serena Postnatal" width={34} height={34} priority />
        <span className={styles.brandName}>Serena Postnatal</span>
      </div>
      <div className={styles.heading}>Đăng nhập vào Serena Postnatal</div>
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
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label}>
          Email hoặc Username
          <input
            className={`${styles.input} ${fieldErrors.emailOrUsername ? styles.inputError : ''}`}
            type="text"
            placeholder="Email hoặc username"
            autoComplete="username"
            value={emailOrUsername}
            onChange={(e) => {
              setEmailOrUsername(e.target.value);
              if (fieldErrors.emailOrUsername) {
                setFieldErrors((prev) => ({ ...prev, emailOrUsername: undefined }));
              }
            }}
            disabled={isLoading}
          />
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

        <button type="submit" className={styles.submit} disabled={isLoading}>
          {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
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
