'use client';

import { X } from 'lucide-react';
import React, { useState } from 'react';

import apiClient from '@/services/apiClient';

import styles from './admin-layout.module.css';

export type SystemSetting = {
  id: number;
  key: string;
  value: string;
  description: string;
  group: string;
  dataType: string;
  isEditable: boolean;
  updatedAt: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  groupKey: string | null;
  groupDisplayName: string;
  settings: SystemSetting[];
};

export function AdminSettingsSidebar({ open, onClose, groupKey, groupDisplayName, settings }: Props) {
  const [localValues, setLocalValues] = useState<Record<number, string>>({});
  const [savingId, setSavingId] = useState<number | null>(null);

  if (!open || !groupKey) return null;

  const handleChange = (id: number, value: string) => {
    setLocalValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleSaveOne = async (setting: SystemSetting) => {
    if (!setting.isEditable) return;

    const newValue = localValues[setting.id] ?? setting.value;
    if (newValue === setting.value) return;

    try {
      setSavingId(setting.id);
      // Gửi request cập nhật giá trị setting.
      // Tuỳ API backend, bạn có thể cần chỉnh lại URL hoặc payload cho phù hợp.
      await apiClient.put(`/SystemSetting/${setting.id}`, {
        ...setting,
        value: newValue,
      });
    } finally {
      setSavingId(null);
    }
  };

  const handleOverlayClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.settingsSidebarOverlay} aria-hidden={!open} onClick={handleOverlayClick}>
      <aside className={styles.settingsSidebar} aria-label={`Cấu hình nhóm ${groupDisplayName}`}>
      <header className={styles.settingsSidebarHeader}>
        <div>
          <div className={styles.settingsSidebarTitle}>{groupDisplayName}</div>
          <div className={styles.settingsSidebarSubtitle}>Xem và chỉnh sửa các cấu hình thuộc nhóm này.</div>
        </div>
        <button type="button" className={styles.settingsSidebarCloseBtn} onClick={onClose} aria-label="Đóng">
          <X size={18} />
        </button>
      </header>

      <div className={styles.settingsSidebarBody}>
        {settings.length === 0 ? (
          <p className={styles.settingsSidebarEmpty}>Chưa có cấu hình cho nhóm này.</p>
        ) : (
          <ul className={styles.settingsList}>
            {settings.map((setting) => {
              const currentValue = localValues[setting.id] ?? setting.value;
              const isSaving = savingId === setting.id;
              const isDisabled = !setting.isEditable || isSaving;

              return (
                <li key={setting.id} className={styles.settingsItem}>
                  <div className={styles.settingsItemHeader}>
                    <span className={styles.settingsKey}>{setting.key}</span>
                    <span className={styles.settingsDataType}>{setting.dataType}</span>
                  </div>
                  <p className={styles.settingsDescription}>{setting.description}</p>
                  <div className={styles.settingsControlRow}>
                    <input
                      className={styles.settingsInput}
                      type="text"
                      value={currentValue}
                      disabled={isDisabled}
                      onChange={(e) => handleChange(setting.id, e.target.value)}
                    />
                    <button
                      type="button"
                      className={styles.settingsSaveBtn}
                      disabled={isDisabled}
                      onClick={() => handleSaveOne(setting)}
                    >
                      {isSaving ? 'Đang lưu...' : 'Lưu'}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      </aside>
    </div>
  );
}

export default AdminSettingsSidebar;

