'use client';

import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import React, { useState } from 'react';

import { PasswordStrengthChecker } from '@/components/auth/PasswordStrengthChecker';
import { Button } from '@/components/ui/button/Button';

import styles from './reset-password.module.css';

interface NewPasswordStepProps {
  resetToken: string;
  newPassword: string;
  setNewPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
  handleSetNewPassword: (e: React.FormEvent) => void;
  fieldErrors: { newPassword?: string; confirmPassword?: string };
  setFieldErrors: (errors: { newPassword?: string; confirmPassword?: string }) => void;
  isLoading: boolean;
}

export function NewPasswordStep({
  resetToken,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  handleSetNewPassword,
  fieldErrors,
  setFieldErrors,
  isLoading,
}: NewPasswordStepProps) {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  return (
    <form className={styles.form} onSubmit={handleSetNewPassword}>
      <label className={styles.label}>
        Mật khẩu mới
        <div className={styles.passwordWrap}>
          <input
            className={`${styles.passwordInput} ${fieldErrors.newPassword ? styles.passwordInputError : ''}`}
            type={showNewPassword ? 'text' : 'password'}
            placeholder="Nhập mật khẩu mới"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              if (fieldErrors.newPassword) setFieldErrors({ ...fieldErrors, newPassword: undefined });
            }}
            onFocus={() => setIsPasswordFocused(true)}
            onBlur={() => setIsPasswordFocused(false)}
            disabled={isLoading}
          />
          <button type="button" className={styles.eyeButton} onClick={() => setShowNewPassword((v) => !v)}>
            {showNewPassword ? <EyeOpenIcon width={18} height={18} /> : <EyeClosedIcon width={18} height={18} />}
          </button>
          <PasswordStrengthChecker password={newPassword} isVisible={isPasswordFocused} />
        </div>
        {fieldErrors.newPassword && <div className={styles.fieldError}>{fieldErrors.newPassword}</div>}
      </label>

      <div style={{ height: 16 }} />

      <label className={styles.label}>
        Xác nhận mật khẩu mới
        <div className={styles.passwordWrap}>
          <input
            className={`${styles.passwordInput} ${fieldErrors.confirmPassword ? styles.passwordInputError : ''}`}
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Nhập lại mật khẩu mới"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (fieldErrors.confirmPassword) setFieldErrors({ ...fieldErrors, confirmPassword: undefined });
            }}
            disabled={isLoading}
          />
          <button type="button" className={styles.eyeButton} onClick={() => setShowConfirmPassword((v) => !v)}>
            {showConfirmPassword ? <EyeOpenIcon width={18} height={18} /> : <EyeClosedIcon width={18} height={18} />}
          </button>
        </div>
        {fieldErrors.confirmPassword && <div className={styles.fieldError}>{fieldErrors.confirmPassword}</div>}
      </label>

      <Button className={styles.buttonPrimary} type="submit" disabled={isLoading} fullWidth>
        {isLoading ? 'Đang xử lý...' : 'Xác nhận'}
      </Button>
    </form>
  );
}
