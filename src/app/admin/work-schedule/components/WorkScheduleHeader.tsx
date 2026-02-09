'use client';

import React from 'react';
import { Breadcrumbs } from '@/components/ui/breadcrumbs/Breadcrumbs';
import styles from './work-schedule-header.module.css';

type Tab = {
  key: string;
  label: string;
  icon?: React.ReactNode;
};

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type Props = {
  title: string;
  breadcrumbs: BreadcrumbItem[];
  tabs: Tab[];
  activeTab: string;
  onTabChange: (key: string) => void;
};

export function WorkScheduleHeader({ title, breadcrumbs, tabs, activeTab, onTabChange }: Props) {
  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <h4 className={styles.title}>{title}</h4>
        <Breadcrumbs
          items={breadcrumbs}
          homeHref="/admin"
        />
      </div>

      <div className={styles.tabs} role="tablist" aria-label="Work schedule tabs">
        {tabs.map((t) => {
          const isActive = t.key === activeTab;
          return (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`${styles.tab} ${isActive ? styles.tabActive : ''}`}
              onClick={() => onTabChange(t.key)}
            >
              {t.icon && <span className={styles.tabIcon}>{t.icon}</span>}
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
