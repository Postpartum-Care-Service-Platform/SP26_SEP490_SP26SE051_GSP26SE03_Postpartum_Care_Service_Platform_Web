'use client';

import { EyeOpenIcon, EyeClosedIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

import { PasswordStrengthChecker } from '@/components/auth/PasswordStrengthChecker';
import { useToast } from '@/components/ui/toast/use-toast';
import { AUTH_CHANGE_PASSWORD_MESSAGES } from '@/messages/auth/change-password';
import authService from '@/services/auth.service';

import styles from './change-password-form.module.css';

type FieldErrors = {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
};

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error) {
    return error.message || fallback;
  }
  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message?: unknown }).message === 'string'
  ) {
    return (error as { message: string }).message;
  }
  if (typeof error === 'object' && error !== null && 'data' in error) {
    const data = (error as { data?: unknown }).data;
    if (
      typeof data === 'object' &&
      data !== null &&
      'error' in data &&
      typeof (data as { error?: unknown }).error === 'string'
    ) {
      return (data as { error: string }).error;
    }
  }
  return fallback;
};

export function ChangePasswordForm() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isNewPasswordFocused, setIsNewPasswordFocused] = useState(false);

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const validate = () => {
    const nextErrors: FieldErrors = {};

    if (!formData.currentPassword.trim()) {
      nextErrors.currentPassword = AUTH_CHANGE_PASSWORD_MESSAGES.requiredCurrentPassword;
    }

    if (!formData.newPassword.trim()) {
      nextErrors.newPassword = AUTH_CHANGE_PASSWORD_MESSAGES.requiredNewPassword;
    } else if (formData.newPassword.length < 8) {
      nextErrors.newPassword = AUTH_CHANGE_PASSWORD_MESSAGES.passwordTooShort;
    }

    if (!formData.confirmPassword.trim()) {
      nextErrors.confirmPassword = AUTH_CHANGE_PASSWORD_MESSAGES.requiredConfirmPassword;
    } else if (formData.newPassword && formData.confirmPassword !== formData.newPassword) {
      nextErrors.confirmPassword = AUTH_CHANGE_PASSWORD_MESSAGES.passwordMismatch;
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (fieldErrors[name as keyof FieldErrors]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setFieldErrors({});

    try {
      await authService.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmNewPassword: formData.confirmPassword,
      });

      toast({
        title: AUTH_CHANGE_PASSWORD_MESSAGES.changePasswordSuccess,
        variant: 'success',
      });

      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err: unknown) {
      const message = getErrorMessage(err, AUTH_CHANGE_PASSWORD_MESSAGES.changePasswordFailed);

      if (message.includes('current password') || message.includes('mật khẩu hiện tại')) {
        setFieldErrors((prev) => ({
          ...prev,
          currentPassword: AUTH_CHANGE_PASSWORD_MESSAGES.invalidCurrentPassword,
        }));
      }

      toast({
        title: message,
        variant: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h5 className={styles.formTitle}>Đổi mật khẩu</h5>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="currentPassword" className={styles.label}>
            Mật khẩu hiện tại
          </label>
          <div className={styles.inputWrapper}>
            <input
              type={showCurrentPassword ? 'text' : 'password'}
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className={`${styles.input} ${fieldErrors.currentPassword ? styles.inputError : ''}`}
              disabled={isLoading}
            />
            <button
              type="button"
              className={styles.eyeButton}
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              disabled={isLoading}
            >
              {showCurrentPassword ? (
                <EyeOpenIcon width={18} height={18} />
              ) : (
                <EyeClosedIcon width={18} height={18} />
              )}
            </button>
          </div>
          {fieldErrors.currentPassword && (
            <div className={styles.errorMessage}>{fieldErrors.currentPassword}</div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="newPassword" className={styles.label}>
            Mật khẩu mới
          </label>
          <div className={styles.inputWrapper}>
            <input
              type={showNewPassword ? 'text' : 'password'}
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              onFocus={() => setIsNewPasswordFocused(true)}
              onBlur={() => setIsNewPasswordFocused(false)}
              className={`${styles.input} ${fieldErrors.newPassword ? styles.inputError : ''}`}
              disabled={isLoading}
            />
            <button
              type="button"
              className={styles.eyeButton}
              onClick={() => setShowNewPassword(!showNewPassword)}
              disabled={isLoading}
            >
              {showNewPassword ? (
                <EyeOpenIcon width={18} height={18} />
              ) : (
                <EyeClosedIcon width={18} height={18} />
              )}
            </button>
          </div>
          {fieldErrors.newPassword && (
            <div className={styles.errorMessage}>{fieldErrors.newPassword}</div>
          )}
          <PasswordStrengthChecker password={formData.newPassword} isVisible={isNewPasswordFocused} />
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword" className={styles.label}>
            Xác nhận mật khẩu mới
          </label>
          <div className={styles.inputWrapper}>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`${styles.input} ${fieldErrors.confirmPassword ? styles.inputError : ''}`}
              disabled={isLoading}
            />
            <button
              type="button"
              className={styles.eyeButton}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isLoading}
            >
              {showConfirmPassword ? (
                <EyeOpenIcon width={18} height={18} />
              ) : (
                <EyeClosedIcon width={18} height={18} />
              )}
            </button>
          </div>
          {fieldErrors.confirmPassword && (
            <div className={styles.errorMessage}>{fieldErrors.confirmPassword}</div>
          )}
        </div>
      </div>

      <div className={styles.buttonWrapper}>
        <button type="submit" className={styles.submitButton} disabled={isLoading}>
          {isLoading ? 'Đang xử lý...' : 'Cập nhật mật khẩu'}
        </button>
      </div>
    </form>
  );
}
