'use client';

import { Check, X } from 'lucide-react';
import React from 'react';

import styles from './password-strength-checker.module.css';

type PasswordStrength = 'weak' | 'medium' | 'strong';

type PasswordCriteria = {
  label: string;
  test: (password: string) => boolean;
};

const criteria: PasswordCriteria[] = [
  {
    label: 'Có chữ hoa',
    test: (pwd) => /[A-Z]/.test(pwd),
  },
  {
    label: 'Có chữ thường',
    test: (pwd) => /[a-z]/.test(pwd),
  },
  {
    label: 'Có số',
    test: (pwd) => /[0-9]/.test(pwd),
  },
  {
    label: 'Ít nhất 8 ký tự',
    test: (pwd) => pwd.length >= 8,
  },
];

function calculateStrength(password: string): PasswordStrength {
  const count = criteria.filter((c) => c.test(password)).length;
  if (count <= 2) return 'weak';
  if (count === 3) return 'medium';
  return 'strong';
}

function getStrengthConfig(strength: PasswordStrength) {
  switch (strength) {
    case 'weak':
      return {
        label: 'Yếu',
        color: '#dc2626',
        bgColor: 'rgba(220, 38, 38, 0.1)',
        progress: 33,
      };
    case 'medium':
      return {
        label: 'Trung bình',
        color: '#f59e0b',
        bgColor: 'rgba(245, 158, 11, 0.1)',
        progress: 66,
      };
    case 'strong':
      return {
        label: 'Mạnh',
        color: '#22c55e',
        bgColor: 'rgba(34, 197, 94, 0.1)',
        progress: 100,
      };
  }
}

type Props = {
  password: string;
  isVisible: boolean;
};

export function PasswordStrengthChecker({ password, isVisible }: Props) {
  if (!isVisible) return null;

  const strength = calculateStrength(password);
  const config = getStrengthConfig(strength);
  const passedCount = criteria.filter((c) => c.test(password)).length;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>Mật khẩu phải có:</span>
        <span className={styles.strength} style={{ color: config.color }}>
          {config.label}
        </span>
      </div>

      <div className={styles.progressBar}>
        {criteria.map((criterion, index) => {
          const passed = criterion.test(password);
          return (
            <div
              key={index}
              className={styles.progressSegment}
              style={{
                backgroundColor: passed ? config.color : 'rgba(0, 0, 0, 0.1)',
              }}
            />
          );
        })}
      </div>

      <div className={styles.checklist}>
        {criteria.map((criterion, index) => {
          const passed = criterion.test(password);
          return (
            <div key={index} className={styles.checklistItem}>
              <div
                className={styles.icon}
                style={{
                  backgroundColor: passed ? '#22c55e' : '#dc2626',
                }}
              >
                {passed ? <Check size={12} /> : <X size={12} />}
              </div>
              <span
                className={styles.label}
                style={{
                  color: passed ? '#22c55e' : '#1e1e1e',
                }}
              >
                {criterion.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

