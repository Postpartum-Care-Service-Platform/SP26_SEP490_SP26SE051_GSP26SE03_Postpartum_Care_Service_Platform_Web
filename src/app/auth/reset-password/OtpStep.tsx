'use client';

import React from 'react';

import { Button } from '@/components/ui/button/Button';
import authService from '@/services/auth.service';
import styles from './reset-password.module.css';

interface OtpStepProps {
  email: string;
  otp: string;
  setOtp: (val: string) => void;
  isLoading: boolean;
  cooldown: number;
  onVerified: (resetToken: string) => void;
  onResendSuccess: () => void;
  onBack: () => void;
}

function clampOtp(v: string) {
  return v.replace(/\D/g, '').slice(0, 6);
}

export default function OtpStep({
  email,
  otp,
  setOtp,
  isLoading,
  cooldown,
  onVerified,
  onResendSuccess,
  onBack,
}: OtpStepProps) {
  const [fieldError, setFieldError] = React.useState<string | null>(null);
  const otpRefs = React.useRef<Array<HTMLInputElement | null>>([]);
  const canResend = cooldown === 0 && !isLoading;

  const digits = React.useMemo(() => {
    const v = clampOtp(otp);
    return Array.from({ length: 6 }, (_, i) => v[i] ?? '');
  }, [otp]);

  React.useEffect(() => {
    if (!isLoading) otpRefs.current[0]?.focus();
  }, [isLoading]);

  const setByPaste = (value: string) => {
    const onlyNum = clampOtp(value);
    if (!onlyNum) return;

    setOtp(onlyNum);
    const nextFocus = onlyNum.length >= 6 ? 5 : onlyNum.length;
    otpRefs.current[nextFocus]?.focus();
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (clampOtp(otp).length !== 6) return;

    try {
      const res = await authService.verifyResetOtp({ email, otp: clampOtp(otp) });
      setFieldError(null);
      onVerified(res.resetToken || '');
    } catch (err: any) {
      setFieldError(err?.message || err?.data?.error || 'OTP không hợp lệ');
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    try {
      await authService.resendOtp({ email });
      onResendSuccess();
      setFieldError(null);
    } catch (err: any) {
      setFieldError(err?.message || err?.data?.error || 'Gửi lại OTP thất bại');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleVerifyOtp}>
      <div className={styles.otpRow}>
        {digits.map((d, idx) => (
          <input
            key={idx}
            ref={(el) => {
              otpRefs.current[idx] = el;
            }}
            className={`${styles.otpCell} ${isLoading ? styles.inputDisabled : ''} ${fieldError ? styles.inputError : ''}`}
            inputMode="numeric"
            autoComplete={idx === 0 ? 'one-time-code' : 'off'}
            value={d}
            disabled={isLoading}
            onPaste={(e) => {
              e.preventDefault();
              setByPaste(e.clipboardData.getData('text'));
            }}
            onChange={(e) => {
              const raw = e.target.value;

              if (raw.length > 1) {
                setByPaste(raw);
                return;
              }

              const nextChar = raw.replace(/\D/g, '').slice(-1);
              const current = clampOtp(otp);
              const arr = current.split('');
              while (arr.length < 6) arr.push('');
              arr[idx] = nextChar;
              setOtp(clampOtp(arr.join('')));
              if (nextChar && idx < 5) otpRefs.current[idx + 1]?.focus();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Backspace') {
                e.preventDefault();
                const cur = clampOtp(otp);
                if (cur[idx]) {
                  const next = cur.slice(0, idx) + cur.slice(idx + 1);
                  setOtp(next);
                } else if (idx > 0) {
                  const prev = idx - 1;
                  const next = cur.slice(0, prev) + cur.slice(prev + 1);
                  setOtp(next);
                  otpRefs.current[prev]?.focus();
                }
              }

              if (e.key === 'ArrowLeft' && idx > 0) otpRefs.current[idx - 1]?.focus();
              if (e.key === 'ArrowRight' && idx < 5) otpRefs.current[idx + 1]?.focus();
            }}
          />
        ))}
      </div>

      {fieldError && (
        <div className={styles.fieldError} style={{ textAlign: 'center' }}>
          {fieldError}
        </div>
      )}

      <Button className={styles.buttonPrimary} type="submit" disabled={isLoading || otp.length !== 6} fullWidth>
        Xác nhận OTP
      </Button>

      <Button
        className={styles.buttonSecondary}
        type="button"
        disabled={!canResend}
        onClick={handleResend}
        variant="outline"
        fullWidth
      >
        {canResend ? 'Gửi lại' : `Gửi lại (${cooldown}s)`}
      </Button>

      <Button className={styles.buttonTertiary} type="button" onClick={onBack} variant="outline" fullWidth>
        Đổi email
      </Button>
    </form>
  );
}
