'use client';

import * as Tooltip from '@radix-ui/react-tooltip';
import { X } from 'lucide-react';
import React from 'react';

import styles from './notification-sidebar.module.css';
import { NotificationSidebarList } from './NotificationSidebarList';

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
};

export function NotificationSidebar({ open, onClose, title = 'Thông báo' }: Props) {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

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
          <Tooltip.Provider delayDuration={200}>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button className={styles.closeBtn} type="button" onClick={onClose} aria-label="Đóng">
                  <X size={18} />
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content className={styles.tooltipContent} side="bottom" sideOffset={5}>
                  Đóng
                  <Tooltip.Arrow className={styles.tooltipArrow} />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        </div>
        <div className={styles.content}>
          <NotificationSidebarList />
        </div>
      </aside>
    </div>
  );
}
