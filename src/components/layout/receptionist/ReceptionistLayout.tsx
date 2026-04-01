'use client';

import React from 'react';

import { ScrollToTop } from '@/components/ui';

import styles from '../admin/admin-layout.module.css';
import { AdminHeader } from '../admin/AdminHeader';
import { ReceptionistSidebar } from './ReceptionistSidebar';
import { receptionistNav } from '@/configs/receptionistNav';
import { NotificationSidebar } from '../admin/NotificationSidebar';

export function ReceptionistLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [notificationSidebarOpen, setNotificationSidebarOpen] = React.useState(false);

  return (
    <div className={styles.container}>
      <ReceptionistSidebar
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed(!collapsed)}
        navSections={receptionistNav}
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
