'use client';

import { useState } from 'react';

import { ChangePasswordForm } from './ChangePasswordForm';
import styles from './settings-card.module.css';
import { UserInfoForm } from './UserInfoForm';

type SettingsTab = 'user-info' | 'security';

export function SettingsCard() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('user-info');

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.tabs}>
          <button
            type="button"
            className={`${styles.tabButton} ${activeTab === 'user-info' ? styles.active : ''}`}
            onClick={() => setActiveTab('user-info')}
          >
            Thông tin người dùng
          </button>
          <button
            type="button"
            className={`${styles.tabButton} ${activeTab === 'security' ? styles.active : ''}`}
            onClick={() => setActiveTab('security')}
          >
            Bảo mật
          </button>
        </div>
      </div>
      <div className={styles.content}>{activeTab === 'security' ? <ChangePasswordForm /> : <UserInfoForm />}</div>
    </div>
  );
}
