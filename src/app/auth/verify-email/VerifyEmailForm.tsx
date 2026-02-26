'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

import LogoSymbol from '@/assets/images/Symbol-Orange-180x180.png';
import { OtpInput } from '@/components/auth/OtpInput';
import { useToast } from '@/components/ui/toast/use-toast';
import { AUTH_VERIFY_EMAIL_MESSAGES } from '@/messages/auth/verify-email';
import { AUTH_VERIFY_EMAIL_REGEX } from '@/messages/auth/verify-email.regex';
import { ROUTES } from '@/routes/routes';
import authService from '@/services/auth.service';
import { clearVerifyEmail, getVerifyEmail, setVerifyEmail } from '@/utils/emailVerificationStorage';

import styles from './verify-email.module.css';

type FieldErrors = {
  email?: string;
  otp?: string;
};

const RESEND_COOLDOWN_SECONDS = 60;

export function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const emailFromQuery = (searchParams.get('email') ?? '').trim();

  const [email, setEmail] = React.useState('');
  const [otp, setOtp] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [fieldErrors, setFieldErrors] = React.useState<FieldErrors>({});
  const [cooldown, setCooldown] = React.useState(0);
  const [isEmailLocked, setIsEmailLocked] = React.useState(false);

  React.useEffect(() => {
    const stored = getVerifyEmail();
    const initial = emailFromQuery || stored;

    setEmail(initial);

    if (emailFromQuery) {
      setVerifyEmail(emailFromQuery);
      setIsEmailLocked(true);
    }
  }, [emailFromQuery]);

  React.useEffect(() => {
    if (cooldown <= 0) return;

    const t = window.setInterval(() => {
      setCooldown((s) => (s > 0 ? s - 1 : 0));
    }, 1000);

    return () => window.clearInterval(t);
  }, [cooldown]);

  const canResend = cooldown === 0 && !isLoading;

  const validate = () => {
    const nextErrors: FieldErrors = {};

    if (!email.trim()) {
      nextErrors.email = AUTH_VERIFY_EMAIL_MESSAGES.requiredEmail;
    } else if (!AUTH_VERIFY_EMAIL_REGEX.email.test(email.trim())) {
      nextErrors.email = AUTH_VERIFY_EMAIL_MESSAGES.invalidEmailFormat;
    }

    if (!otp.trim()) nextErrors.otp = AUTH_VERIFY_EMAIL_MESSAGES.requiredOtp;

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const emailTrimmed = email.trim();

    setIsLoading(true);
    setFieldErrors({});

    try {
      await authService.verifyEmail({ email: emailTrimmed, otp: otp.trim() });
      clearVerifyEmail();
      toast({ title: AUTH_VERIFY_EMAIL_MESSAGES.verifySuccess, variant: 'success' });
      router.push(ROUTES.login);
    } catch (err: any) {
      const message = err?.message || err?.data?.error || AUTH_VERIFY_EMAIL_MESSAGES.verifyFailed;
      toast({ title: message, variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    const emailTrimmed = email.trim();

    if (!emailTrimmed) {
      setFieldErrors((prev) => ({ ...prev, email: AUTH_VERIFY_EMAIL_MESSAGES.requiredEmail }));
      return;
    }

    if (!AUTH_VERIFY_EMAIL_REGEX.email.test(emailTrimmed)) {
      setFieldErrors((prev) => ({ ...prev, email: AUTH_VERIFY_EMAIL_MESSAGES.invalidEmailFormat }));
      return;
    }

    try {
      setIsLoading(true);
      await authService.resendOtp({ email: emailTrimmed });
      setVerifyEmail(emailTrimmed);
      setIsEmailLocked(true);
      toast({ title: 'Đã gửi lại mã OTP', variant: 'success' });
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err: any) {
      const message = err?.message || err?.data?.error || 'Gửi lại OTP thất bại';
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

      <div className={styles.heading}>Xác thực email</div>

      {email.trim() && isEmailLocked ? (
        <div className={styles.subheading}>
          Nhập mã OTP đã được gửi đến email: <b>{email}</b>
        </div>
      ) : (
        <div className={styles.subheading}>Nhập OTP và email để tiếp tục xác thực.</div>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>
        <div>
          <OtpInput
            value={otp}
            onChange={setOtp}
            disabled={isLoading}
            length={6}
            className={styles.otpRow}
            cellClassName={`${styles.otpCell} ${isLoading ? styles.inputDisabled : ''} ${fieldErrors.otp ? styles.inputError : ''}`}
            error={!!fieldErrors.otp}
          />
          {fieldErrors.otp && <div className={styles.fieldError}>{fieldErrors.otp}</div>}
        </div>

        {!isEmailLocked && (
          <label className={styles.label}>
            Email
            <input
              className={`${styles.input} ${fieldErrors.email ? styles.inputError : ''}`}
              type="email"
              placeholder="Nhập email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                const next = e.target.value;
                setEmail(next);
                if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: undefined }));
              }}
              disabled={isLoading}
            />
            {fieldErrors.email && <div className={styles.fieldError}>{fieldErrors.email}</div>}
          </label>
        )}

        <button type="submit" className={styles.submit} disabled={isLoading || otp.length !== 6}>
          {isLoading ? 'Đang xử lý...' : 'Xác thực'}
        </button>

        <button type="button" className={styles.resendBtn} disabled={!canResend} onClick={handleResend}>
          {canResend ? 'Gửi lại OTP' : `Gửi lại (${cooldown}s)`}
        </button>
      </form>

      <div className={styles.footerLinks}>
        <Link className={styles.footerLink} href={ROUTES.login}>
          Quay về đăng nhập
        </Link>
      </div>
    </div>
  );
}
