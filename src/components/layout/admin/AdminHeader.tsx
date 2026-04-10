'use client';

import { Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';
import React from 'react';

import styles from './admin-layout.module.css';
import { adminNav } from '@/configs/adminNav';
import { managerNav } from '@/configs/managerNav';
import { NotificationDropdown } from './NotificationDropdown';
import { ChatNotification } from './ChatNotification';
import { UserDropdown } from './UserDropdown';

type Props = {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onOpenNotifications: () => void;
  isNotificationSidebarOpen: boolean;
};

export function AdminHeader({ collapsed, onToggleCollapsed, onOpenNotifications, isNotificationSidebarOpen }: Props) {
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname === '/admin' || pathname === '/manager') return 'Bảng điều khiển';

    if (pathname?.endsWith('/profile')) return 'Hồ sơ';

    const currentNav = pathname?.startsWith('/manager') ? managerNav : adminNav;

    for (const section of currentNav as any[]) {
      for (const item of section.items) {
        // Check children first
        if (item.children) {
          const childMatch = item.children.find((child: any) => pathname.startsWith(child.href));
          if (childMatch) return childMatch.label;
        }

        // Check the item itself
        const baseHref = pathname?.startsWith('/manager') ? '/manager' : '/admin';
        if (item.href && pathname.startsWith(item.href) && item.href !== baseHref) {
          return item.label;
        }
      }
    }

    return 'Dashboard';
  };

  const title = getPageTitle();

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
            <h1 className={styles.pageTitle}>{title}</h1>
          </div>

          <div className={styles.headerRight}>
            <div className={styles.iconGroup}>
              <ChatNotification />
              <NotificationDropdown onViewAll={onOpenNotifications} isSidebarOpen={isNotificationSidebarOpen} />
            </div>

            <UserDropdown />
          </div>
        </div>
      </header>
    </>
  );
}
