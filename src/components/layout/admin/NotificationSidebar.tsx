'use client';

import React from 'react';
import { X } from 'lucide-react';

import { NotificationSidebarList } from './NotificationSidebarList';

import styles from './notification-sidebar.module.css';

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
};

export function NotificationSidebar({ open, onClose, title = 'Thông báo' }: Props) {
  React.useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={styles.root}>
      <button className={styles.overlay} type="button" aria-label="Đóng" onClick={onClose} />
      <aside className={styles.sidebar} role="dialog" aria-modal="true" aria-label={title}>
        <div className={styles.header}>
          <div className={styles.title}>{title}</div>
          <button className={styles.closeBtn} type="button" onClick={onClose} aria-label="Đóng">
            <X size={18} />
          </button>
        </div>
        <div className={styles.content}>
          <NotificationSidebarList />
        </div>
      </aside>
    </div>
  );
}
