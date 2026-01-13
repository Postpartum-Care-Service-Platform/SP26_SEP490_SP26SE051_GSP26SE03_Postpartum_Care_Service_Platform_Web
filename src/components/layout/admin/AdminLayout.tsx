'use client';

import React from 'react';

import { ScrollToTop } from '@/components/ui';

import { AdminHeader } from './AdminHeader';
import { AdminSidebar } from './AdminSidebar';

import styles from './admin-layout.module.css';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div className={styles.container}>
      <AdminSidebar collapsed={collapsed} onToggleCollapsed={() => setCollapsed(!collapsed)} />
      <div className={styles.main}>
        <AdminHeader collapsed={collapsed} onToggleCollapsed={() => setCollapsed(!collapsed)} />
        <div className={styles.content}>{children}</div>
      </div>
      <ScrollToTop />
    </div>
  );
}

