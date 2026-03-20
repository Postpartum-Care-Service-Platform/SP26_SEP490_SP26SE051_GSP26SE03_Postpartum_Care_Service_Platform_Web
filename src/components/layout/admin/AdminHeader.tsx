'use client';

import { Menu } from 'lucide-react';
import React from 'react';

import styles from './admin-layout.module.css';
import { NotificationDropdown } from './NotificationDropdown';
import { UserDropdown } from './UserDropdown';

type Props = {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onOpenNotifications: () => void;
  isNotificationSidebarOpen: boolean;
};

export function AdminHeader({ collapsed, onToggleCollapsed, onOpenNotifications, isNotificationSidebarOpen }: Props) {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.headerLeft}>
            {collapsed && (
              <button className={styles.headerToggleBtn} type="button" onClick={onToggleCollapsed} aria-label="Toggle sidebar">
                <Menu size={18} />
              </button>
            )}
          </div>

          <div className={styles.headerRight}>
            <div className={styles.iconGroup}>
              <NotificationDropdown onViewAll={onOpenNotifications} isSidebarOpen={isNotificationSidebarOpen} />
            </div>

            <UserDropdown />
          </div>
        </div>
      </header>
    </>
  );
}
