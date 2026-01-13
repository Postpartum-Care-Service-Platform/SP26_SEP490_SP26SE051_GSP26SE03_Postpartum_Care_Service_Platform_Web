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
import { loadScript } from '@/utils/loadScript';
import styles from './login.module.css';
import { ROUTES } from '@/routes/routes';

export function LoginForm() {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const [isGoogleReady, setIsGoogleReady] = React.useState(false);
  const googleBtnHostRef = React.useRef<HTMLDivElement | null>(null);
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

  React.useEffect(() => {
    let mounted = true;
    const initGoogle = async () => {
      if (!googleClientId) {
        console.error('Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID');
        setIsGoogleReady(false);
        return;
      }
      try {
        await loadScript('https://accounts.google.com/gsi/client');
        if (!mounted) return;
        window.google?.accounts?.id?.initialize({
          client_id: googleClientId,
          callback: async (response: { credential?: string }) => {
            const idToken = response?.credential;
            if (!idToken) {
              toast({ title: 'Không lấy được idToken từ Google', variant: 'error' });
              return;
            }

            try {
              setIsLoading(true);
              const authResponse = await authService.loginWithGoogle({ idToken });
              if (!authResponse?.accessToken || !authResponse?.user) throw { status: 0, message: 'Có lỗi xảy ra' };

              login(authResponse);
              toast({ title: AUTH_LOGIN_MESSAGES.loginSuccess, variant: 'success' });
              router.push(authResponse.user.role === 'admin' ? ROUTES.admin : ROUTES.home);
            } catch (err: any) {
              toast({ title: err?.message || 'Đăng nhập Google thất bại', variant: 'error' });
            } finally {
              setIsLoading(false);
            }
          },
          auto_select: false,
        });

        const host = googleBtnHostRef.current;
        if (host) {
          host.innerHTML = '';
          window.google?.accounts?.id?.renderButton(host, {
            type: 'standard',
            theme: 'outline',
            size: 'large',
            text: 'signin_with',
            shape: 'rectangular',
            width: 300,
            locale: 'vi',
          });
          setIsGoogleReady(true);
        } else {
          setIsGoogleReady(false);
        }
      } catch (e: any) {
        console.error('Failed to load Google Sign-In script:', e);
        setIsGoogleReady(false);
        toast({ title: 'Không thể tải Google Sign-In', variant: 'error' });
      }
    };

    initGoogle();

    return () => {
      mounted = false;
    };
  }, [googleClientId, login, router, toast]);

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
      router.push(authResponse.user.role === 'admin' ? ROUTES.admin : ROUTES.home);
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

      <button
        type="button"
        className={styles.googleBtn}
        disabled={isLoading || !isGoogleReady}
        onClick={() => {
          const realBtn = googleBtnHostRef.current?.querySelector<HTMLElement>('div[role="button"]');
          if (realBtn) {
            realBtn.click();
          } else {
            toast({ title: 'Không tìm thấy nút Google để thực thi', variant: 'error' });
          }
        }}
      >
        <Image
          src="/google-icon-logo-svgrepo-com.svg"
          alt="Google logo"
          width={18}
          height={18}
          className={styles.googleIcon}
        />
        Google
      </button>

      <div
        ref={googleBtnHostRef}
        style={{ position: 'absolute', top: -9999, left: -9999, height: 1, width: 1, overflow: 'hidden' }}
      />
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
