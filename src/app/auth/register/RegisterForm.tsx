'use client';

import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

import LogoSymbol from '@/assets/images/Symbol-Orange-180x180.png';
import { PasswordStrengthChecker } from '@/components/auth/PasswordStrengthChecker';
import { LogoLoader } from '@/components/ui/logo-loader';
import { useToast } from '@/components/ui/toast/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { AUTH_REGISTER_MESSAGES } from '@/messages/auth/register';
import { AUTH_REGISTER_REGEX } from '@/messages/auth/register.regex';
import authService from '@/services/auth.service';
import { setVerifyEmail } from '@/utils/emailVerificationStorage';
import { buildVerifyEmailRoute, ROUTES } from '@/routes/routes';
import styles from './register.module.css';

type FieldErrors = {
  username?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
};

export function RegisterForm() {
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = React.useState(false);

  const [isLoading, setIsLoading] = React.useState(false);
  const [fieldErrors, setFieldErrors] = React.useState<FieldErrors>({});

  const router = useRouter();
  const { toast } = useToast();

  const isEmail = (value: string) => AUTH_REGISTER_REGEX.email.test(value);
  const isPhone = (value: string) => AUTH_REGISTER_REGEX.phone.test(value);

  const validate = () => {
    const nextErrors: FieldErrors = {};

    if (!username.trim()) nextErrors.username = AUTH_REGISTER_MESSAGES.requiredUsername;

    if (!email.trim()) {
      nextErrors.email = AUTH_REGISTER_MESSAGES.requiredEmail;
    } else if (!isEmail(email)) {
      nextErrors.email = AUTH_REGISTER_MESSAGES.invalidEmailFormat;
    }

    if (!phone.trim()) {
      nextErrors.phone = AUTH_REGISTER_MESSAGES.requiredPhone;
    } else if (!isPhone(phone)) {
      nextErrors.phone = AUTH_REGISTER_MESSAGES.invalidPhoneFormat;
    }

    if (!password) nextErrors.password = AUTH_REGISTER_MESSAGES.requiredPassword;

    if (!confirmPassword) {
      nextErrors.confirmPassword = AUTH_REGISTER_MESSAGES.requiredConfirmPassword;
    } else if (password && confirmPassword !== password) {
      nextErrors.confirmPassword = AUTH_REGISTER_MESSAGES.passwordMismatch;
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
      const authResponse = await authService.register({
        username: username.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
        confirmPassword,
      });

      const emailTrimmed = email.trim();
      setVerifyEmail(emailTrimmed);
      toast({ title: AUTH_REGISTER_MESSAGES.registerSuccess, variant: 'success' });
      router.push(buildVerifyEmailRoute(emailTrimmed));
    } catch (err: any) {
      const message = err?.message || err?.data?.error || AUTH_REGISTER_MESSAGES.registerFailed;

      const { mapRegisterErrorToField } = await import('@/utils/authErrorMapper');
      const field = mapRegisterErrorToField(message);

      setFieldErrors((prev) => ({
        ...prev,
        ...(field ? { [field]: message } : { email: message }),
      }));

      toast({ title: message, variant: 'error' });
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

      <div className={styles.heading}>Tạo tài khoản Serena Postnatal</div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label}>
          Tên đăng nhập
          <input
            className={`${styles.input} ${fieldErrors.username ? styles.inputError : ''}`}
            type="text"
            placeholder="Nhập tên đăng nhập"
            autoComplete="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (fieldErrors.username) {
                setFieldErrors((prev) => ({ ...prev, username: undefined }));
              }
            }}
            disabled={isLoading}
          />
          {fieldErrors.username && <div className={styles.fieldError}>{fieldErrors.username}</div>}
        </label>

        <label className={styles.label}>
          Email
          <input
            className={`${styles.input} ${fieldErrors.email ? styles.inputError : ''}`}
            type="email"
            placeholder="Nhập email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (fieldErrors.email) {
                setFieldErrors((prev) => ({ ...prev, email: undefined }));
              }
            }}
            disabled={isLoading}
          />
          {fieldErrors.email && <div className={styles.fieldError}>{fieldErrors.email}</div>}
        </label>

        <label className={styles.label}>
          Số điện thoại
          <input
            className={`${styles.input} ${fieldErrors.phone ? styles.inputError : ''}`}
            type="tel"
            placeholder="Nhập số điện thoại"
            autoComplete="tel"
            inputMode="numeric"
            value={phone}
            onChange={(e) => {
              const next = e.target.value.replace(/\D/g, '');
              setPhone(next);
              if (fieldErrors.phone) {
                setFieldErrors((prev) => ({ ...prev, phone: undefined }));
              }
            }}
            disabled={isLoading}
          />
          {fieldErrors.phone && <div className={styles.fieldError}>{fieldErrors.phone}</div>}
        </label>

        <label className={styles.label}>
          Mật khẩu
          <div className={styles.passwordWrap}>
            <input
              className={`${styles.passwordInput} ${fieldErrors.password ? styles.inputError : ''}`}
              type={showPassword ? 'text' : 'password'}
              placeholder="Nhập mật khẩu"
              autoComplete="new-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: undefined }));
              }}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
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
            <PasswordStrengthChecker password={password} isVisible={isPasswordFocused} />
          </div>
          {fieldErrors.password && <div className={styles.fieldError}>{fieldErrors.password}</div>}
        </label>

        <label className={styles.label}>
          Nhập lại mật khẩu
          <div className={styles.passwordWrap}>
            <input
              className={`${styles.passwordInput} ${fieldErrors.confirmPassword ? styles.inputError : ''}`}
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Nhập lại mật khẩu"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (fieldErrors.confirmPassword) {
                  setFieldErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                }
              }}
              disabled={isLoading}
            />
            <button
              className={styles.eyeButton}
              type="button"
              onClick={() => setShowConfirmPassword((v) => !v)}
              aria-label={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            >
              {showConfirmPassword ? (
                <EyeOpenIcon width={18} height={18} />
              ) : (
                <EyeClosedIcon width={18} height={18} />
              )}
            </button>
          </div>
          {fieldErrors.confirmPassword && (
            <div className={styles.fieldError}>{fieldErrors.confirmPassword}</div>
          )}
        </label>

        <button type="submit" className={styles.submit} disabled={isLoading}>
          {isLoading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <LogoLoader size="sm" />
              <span>Đang xử lý...</span>
            </div>
          ) : (
            'Đăng ký'
          )}
        </button>
      </form>

      <div className={styles.footerLinks}>
        <div className={styles.footerLinksRow}>
          Đã có tài khoản?{' '}
          <Link className={styles.footerLink} href={ROUTES.login}>
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}

