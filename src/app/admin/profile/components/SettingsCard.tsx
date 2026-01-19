'use client';

import { ChangePasswordForm } from './ChangePasswordForm';
import styles from './settings-card.module.css';

export function SettingsCard() {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h4 className={styles.title}>Cài đặt</h4>
      </div>
      <div className={styles.content}>
        <ChangePasswordForm />
      </div>
    </div>
  );
}
