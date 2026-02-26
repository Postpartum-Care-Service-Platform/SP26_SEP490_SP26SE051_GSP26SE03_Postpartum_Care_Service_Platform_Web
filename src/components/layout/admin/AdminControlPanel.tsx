'use client';

import { Bot, Briefcase, CreditCard, Lock, Monitor, PlusCircle, ShieldCheck, User } from 'lucide-react';
import React from 'react';

import styles from './admin-layout.module.css';
import { type SystemSetting } from './AdminSettingsSidebar';

type Item = {
  icon: React.ReactNode;
  groupKey?: string;
};

type Column = {
  title?: string;
  items: Item[];
};

type Props = {
  className?: string;
  loading: boolean;
  error: string | null;
  settingsByGroup: Record<string, SystemSetting[]>;
  onSelectGroup: (groupKey?: string) => void;
};

const columns: Column[] = [
  { items: [{ icon: <CreditCard size={18} />, groupKey: 'Payment' }] },
  { items: [{ icon: <Briefcase size={18} />, groupKey: 'Business' }] },
  { items: [{ icon: <ShieldCheck size={18} />, groupKey: 'Validation' }] },
  { items: [{ icon: <Monitor size={18} />, groupKey: 'App' }] },
  { items: [{ icon: <Bot size={18} />, groupKey: 'AI' }] },
  { items: [{ icon: <Lock size={18} />, groupKey: 'Auth' }] },
  { items: [{ icon: <User size={18} />, groupKey: 'Role' }] },
  { items: [{ icon: <PlusCircle size={18} /> }] },
];

const viGroupNames: Record<string, string> = {
  Payment: 'Thanh toán',
  Business: 'Kinh doanh',
  Validation: 'Ràng buộc dữ liệu',
  App: 'Ứng dụng',
  AI: 'AI & trợ lý ảo',
  Auth: 'Xác thực & bảo mật',
  Role: 'Vai trò',
};

export function AdminControlPanel({ className, loading, error, settingsByGroup, onSelectGroup }: Props) {
  const getTextsForGroup = (groupKey?: string): { title: string; description: string } => {
    if (!groupKey) {
      return { title: 'Thêm nhóm', description: 'Tạo nhóm cấu hình hệ thống mới.' };
    }

    const title = viGroupNames[groupKey] ?? groupKey;
    if (loading) return { title, description: 'Đang tải cấu hình...' };
    if (error) return { title, description: error };

    const groupSettings = settingsByGroup[groupKey] ?? [];
    if (groupSettings.length === 0) return { title, description: 'Chưa có dữ liệu cho nhóm này.' };

    return { title, description: groupSettings[0].description };
  };

  return (
    <div id="admin-control-panel" className={`${styles.controlPanel} ${className ?? ''}`} role="dialog" aria-label="Cài đặt hệ thống" aria-modal="false">
      <div className={styles.controlGrid}>
        {columns.map((col, idx) => (
          <div key={idx} className={styles.controlCol}>
            {col.title ? <div className={styles.controlColTitle}>{col.title}</div> : null}
            {col.items.map((item, itemIdx) => {
              const { title, description } = getTextsForGroup(item.groupKey);
              return (
                <button
                  key={`${item.groupKey ?? 'add'}-${itemIdx}`}
                  type="button"
                  className={styles.controlItem}
                  onClick={() => onSelectGroup(item.groupKey)}
                >
                  <span className={styles.controlIcon}>{item.icon}</span>
                  <span className={styles.controlText}>
                    <span className={styles.controlTitle}>{title}</span>
                    <span className={styles.controlDesc}>{description}</span>
                  </span>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
