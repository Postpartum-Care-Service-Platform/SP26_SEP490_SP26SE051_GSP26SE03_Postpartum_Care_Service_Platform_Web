'use client';

import React from 'react';

import styles from './admin-page-layout.module.css';

interface AdminPageLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  controlPanel?: React.ReactNode;
  pagination?: React.ReactNode;
  noScroll?: boolean;
  noCard?: boolean;
}

export function AdminPageLayout({
  children,
  header,
  controlPanel,
  pagination,
  noScroll = false,
  noCard = false,
}: AdminPageLayoutProps) {
  if (noCard) {
    return (
      <div className={styles.container}>
        {header && <div className={styles.header}>{header}</div>}
        <div className={`${styles.scrollArea} ${noScroll ? styles.noScroll : ''}`}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header + Breadcrumbs - Outside the card */}
      {header && <div className={styles.header}>{header}</div>}

      {/* Main Table Card - Unified background, radius, and shadow */}
      <div className={styles.contentCard}>
        {/* Control Panel - Sticky top of card */}
        {controlPanel && <div className={styles.controlPanel}>{controlPanel}</div>}

        {/* Scrollable Table Area */}
        <div className={`${styles.scrollArea} ${noScroll ? styles.noScroll : ''}`}>
          <div className={styles.tableContainer}>{children}</div>
        </div>

        {/* Pagination - Sticky bottom of card */}
        {pagination && <div className={styles.pagination}>{pagination}</div>}
      </div>
    </div>
  );
}

