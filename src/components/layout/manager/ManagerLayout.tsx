'use client';

import React from 'react';

import { ScrollToTop } from '@/components/ui';

import styles from '../admin/admin-layout.module.css';
import { AdminHeader } from '../admin/AdminHeader';
import { AdminSidebar } from '../admin/AdminSidebar';
import { NotificationSidebar } from '../admin/NotificationSidebar';
import { managerNav } from '@/configs/managerNav';

export function ManagerLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [notificationSidebarOpen, setNotificationSidebarOpen] = React.useState(false);

  return (
    <div className={styles.container}>
      <AdminSidebar
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed(!collapsed)}
        navSections={managerNav}
        brandText="The Joyful Nest"
      />
      <div className={`${styles.main} ${collapsed ? styles.mainCollapsed : ''}`}>
        <AdminHeader
          collapsed={collapsed}
          onToggleCollapsed={() => setCollapsed(!collapsed)}
          onOpenNotifications={() => setNotificationSidebarOpen(true)}
          isNotificationSidebarOpen={notificationSidebarOpen}
        />
        <div className={styles.content}>{children}</div>
      </div>

      <NotificationSidebar open={notificationSidebarOpen} onClose={() => setNotificationSidebarOpen(false)} />

      <ScrollToTop />
    </div>
  );
}
