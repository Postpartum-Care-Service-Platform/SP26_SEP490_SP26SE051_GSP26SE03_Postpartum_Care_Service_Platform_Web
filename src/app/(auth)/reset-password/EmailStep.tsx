'use client';

import React from 'react';

import { Button } from '@/components/ui/button/Button';
import { Input } from '@/components/ui/Input/Input';

import styles from './reset-password.module.css';

interface EmailStepProps {
  email: string;
  setEmail: (email: string) => void;
  handleSendEmail: (e: React.FormEvent) => void;
  isLocked: boolean;
  cooldown: number;
  fieldErrors: { email?: string };
  setFieldErrors: (errors: { email?: string }) => void;
}

export function EmailStep({
  email,
  setEmail,
  handleSendEmail,
  isLocked,
  cooldown,
  fieldErrors,
  setFieldErrors,
}: EmailStepProps) {
  return (
    <form className={styles.form} onSubmit={handleSendEmail}>
      <label className={styles.label}>
        Email
        <Input
          className={`${styles.input} ${fieldErrors.email ? styles.inputError : ''} ${
            isLocked ? styles.inputDisabled : ''
          }`}
          type="email"
          placeholder="your@email.com"
          autoComplete="off"
          value={email}
          disabled={isLocked}
          onChange={(e) => {
            setEmail(e.target.value);
            if (fieldErrors.email) setFieldErrors({});
          }}
        />
        {fieldErrors.email && <div className={styles.fieldError}>{fieldErrors.email}</div>}
      </label>

      <Button
        className={`${styles.buttonPrimary} ${isLocked ? styles.disabled : ''}`}
        type="submit"
        disabled={isLocked}
        fullWidth
      >
        {isLocked ? `Vui lòng đợi ${cooldown}s` : 'Gửi mã OTP'}
      </Button>
    </form>
  );
}

