'use client';

import React from 'react';

import styles from './admin-page-layout.module.css';

interface AdminPageLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  controlPanel?: React.ReactNode;
  pagination?: React.ReactNode;
}

export function AdminPageLayout({
  children,
  header,
  controlPanel,
  pagination,
}: AdminPageLayoutProps) {
  return (
    <div className={styles.container}>
      {/* Header + Breadcrumbs - Fixed at top */}
      {header && <div className={styles.header}>{header}</div>}

      {/* Control Panel - Fixed */}
      {controlPanel && <div className={styles.controlPanel}>{controlPanel}</div>}

      {/* Main content area - scrollable */}
      <div className={styles.scrollArea}>
        <div className={styles.tableContainer}>{children}</div>
      </div>

      {/* Pagination - Fixed at bottom */}
      {pagination && <div className={styles.pagination}>{pagination}</div>}
    </div>
  );
}
