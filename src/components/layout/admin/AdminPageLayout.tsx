'use client';

import React from 'react';

import styles from './admin-page-layout.module.css';
import { DataLoader } from '@/components/ui';

interface AdminPageLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  controlPanel?: React.ReactNode;
  pagination?: React.ReactNode;
  noScroll?: boolean;
  noHorizontalScroll?: boolean;
  noCard?: boolean;
  hideScrollbar?: boolean;
  isLoading?: boolean;
}

export function AdminPageLayout({
  children,
  header,
  controlPanel,
  pagination,
  noScroll = false,
  noHorizontalScroll = false,
  noCard = false,
  hideScrollbar = false,
  isLoading = false,
}: AdminPageLayoutProps) {
  if (noCard) {
    return (
      <div className={styles.container}>
        {header && <div className={styles.header}>{header}</div>}
        {controlPanel && <div className={styles.controlPanel}>{controlPanel}</div>}
        <div className={`${styles.scrollArea} ${noScroll ? styles.noScroll : ''} ${noHorizontalScroll ? styles.noHorizontalScroll : ''} ${hideScrollbar ? styles.hideScrollbar : ''}`}>
          {isLoading ? (
            <div className={styles.dataLoaderWrapper}>
              <DataLoader minHeight="calc(100vh - 200px)" />
            </div>
          ) : children}
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
        <div className={`${styles.scrollArea} ${noScroll ? styles.noScroll : ''} ${hideScrollbar ? styles.hideScrollbar : ''}`}>
          <div className={`${styles.horizontalScroll} ${noHorizontalScroll ? styles.noHorizontalScroll : ''}`}>
            <div className={styles.tableContainer}>
              {isLoading ? (
                <DataLoader minHeight="calc(100vh - 350px)" />
              ) : children}
            </div>
          </div>
        </div>

        {/* Pagination - Sticky bottom of card */}
        {pagination && <div className={styles.pagination}>{pagination}</div>}
      </div>
    </div>
  );
}
