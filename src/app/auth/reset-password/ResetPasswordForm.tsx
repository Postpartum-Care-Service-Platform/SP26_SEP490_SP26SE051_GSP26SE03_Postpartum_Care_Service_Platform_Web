'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import LogoSymbol from '@/assets/images/Symbol-Orange-180x180.png';
import { useToast } from '@/components/ui/toast/use-toast';
import { AUTH_FORGOT_PASSWORD_MESSAGES, AUTH_FORGOT_PASSWORD_REGEX } from '@/messages/auth/forgot-password';
import { RESET_PASSWORD_MESSAGES } from '@/messages/auth/reset-password';
import { ROUTES } from '@/routes/routes';
import authService from '@/services/auth.service';

import { EmailStep } from './EmailStep';
import { NewPasswordStep } from './NewPasswordStep';
import OtpStep from './OtpStep';
import styles from './reset-password.module.css';

const RESEND_COOLDOWN_SEC = 30;

type Step = 'email' | 'otp' | 'new_password';

type EmailErrors = { email?: string };

type NewPasswordErrors = { newPassword?: string; confirmPassword?: string };

export default function ResetPasswordForm() {
  const { toast } = useToast();
  const [step, setStep] = useState<Step>('email');

  const [email, setEmail] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [otp, setOtp] = useState('');
  const [resetToken, setResetToken] = useState('');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [emailErrors, setEmailErrors] = useState<EmailErrors>({});
  const [newPasswordErrors, setNewPasswordErrors] = useState<NewPasswordErrors>({});

  /* cooldown */
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  /* ---------------- EMAIL step ---------------- */
  const validateEmail = () => {
    const errs: EmailErrors = {};
    const trimmed = email.trim();

    if (!trimmed) {
      errs.email = AUTH_FORGOT_PASSWORD_MESSAGES.requiredEmail;
    } else if (!AUTH_FORGOT_PASSWORD_REGEX.email.test(trimmed)) {
      errs.email = AUTH_FORGOT_PASSWORD_MESSAGES.invalidEmailFormat;
    }

    setEmailErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSendEmail = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!validateEmail()) return;

    try {
      setIsLoading(true);
      await authService.forgotPassword({ email: email.trim() });
      toast({ title: AUTH_FORGOT_PASSWORD_MESSAGES.sendOtpSuccess, variant: 'success' });
      setStep('otp');
      setCooldown(RESEND_COOLDOWN_SEC);
    } catch (err: any) {
      // Backend trả { error: "..." } -> interceptor map thành err.message
      const msg = err?.message || err?.data?.error || AUTH_FORGOT_PASSWORD_MESSAGES.sendOtpFailed;

      // Nếu đúng case email not found -> dùng message chuẩn
      if (msg.includes('Không tìm thấy tài khoản')) {
        setEmailErrors({ email: AUTH_FORGOT_PASSWORD_MESSAGES.emailNotFound });
      } else {
        setEmailErrors({ email: msg });
      }
    } finally {
      setIsLoading(false);
    }
  };

  /* resend */
  const handleResendSuccess = () => setCooldown(RESEND_COOLDOWN_SEC);

  /* ---------------- New Password step ---------------- */
  const handleSubmitNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    const errs: NewPasswordErrors = {};
    if (!newPassword || newPassword.length < 6) errs.newPassword = RESET_PASSWORD_MESSAGES.passwordTooShort;
    if (newPassword !== confirmPassword) errs.confirmPassword = RESET_PASSWORD_MESSAGES.passwordMismatch;

    if (Object.keys(errs).length) {
      setNewPasswordErrors(errs);
      return;
    }

    try {
      setIsLoading(true);
      await authService.resetPassword({ resetToken, newPassword, confirmNewPassword: confirmPassword });
      toast({ title: RESET_PASSWORD_MESSAGES.resetSuccess, variant: 'success' });

      // reset flow
      setStep('email');
      setEmail('');
      setOtp('');
      setResetToken('');
      setNewPassword('');
      setConfirmPassword('');
      setEmailErrors({});
      setNewPasswordErrors({});
    } catch (err: any) {
      // hiển thị dưới field (không toast)
      const msg = err?.message || err?.data?.error || RESET_PASSWORD_MESSAGES.resetFailed;
      setNewPasswordErrors({ newPassword: msg });
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

      <div className={styles.heading}>
        {step === 'email' ? 'Đặt lại mật khẩu' : step === 'otp' ? 'Nhập mã OTP' : 'Tạo mật khẩu mới'}
      </div>

      {step === 'email' && (
        <EmailStep
          email={email}
          setEmail={setEmail}
          handleSendEmail={handleSendEmail}
          isLocked={isLoading}
          cooldown={cooldown}
          fieldErrors={emailErrors}
          setFieldErrors={setEmailErrors}
        />
      )}

      {step === 'otp' && (
        <OtpStep
          email={email.trim()}
          otp={otp}
          setOtp={setOtp}
          isLoading={isLoading}
          cooldown={cooldown}
          onVerified={(token) => {
            setResetToken(token);
            setStep('new_password');
          }}
          onResendSuccess={handleResendSuccess}
          onBack={() => {
            setStep('email');
            setOtp('');
          }}
        />
      )}

      {step === 'new_password' && (
        <NewPasswordStep
          resetToken={resetToken}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          handleSetNewPassword={handleSubmitNewPassword}
          fieldErrors={newPasswordErrors}
          setFieldErrors={setNewPasswordErrors}
          isLoading={isLoading}
        />
      )}

      <div className={styles.footerLinks}>
        <div className={styles.footerLinksRow}>
          Nhớ mật khẩu rồi?{' '}
          <Link className={styles.footerLink} href={ROUTES.login}>
            Đăng nhập
          </Link>
        </div>
        <div>
          Chưa có tài khoản?{' '}
          <Link className={styles.footerLink} href="#">
            Đăng ký
          </Link>
        </div>
      </div>
    </div>
  );
}
