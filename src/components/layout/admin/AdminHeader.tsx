'use client';

import React from 'react';
import { Bell, ChevronDown, Grid2x2, Menu, Search, Settings } from 'lucide-react';

import { UserDropdown } from './UserDropdown';
import { NotificationDropdown } from './NotificationDropdown';

import styles from './admin-layout.module.css';

type Props = {
  collapsed: boolean;
  onToggleCollapsed: () => void;
};

export function AdminHeader({ collapsed, onToggleCollapsed }: Props) {
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <div className={styles.headerLeft}>
          {collapsed && (
            <button className={styles.headerToggleBtn} type="button" onClick={onToggleCollapsed} aria-label="Toggle sidebar">
              <Menu size={18} />
            </button>
          )}
          <div className={styles.actionsGroup}>
            <button className={styles.pillButton} type="button">
              <span>Apps</span>
              <ChevronDown size={14} />
            </button>
            <button className={styles.pillButton} type="button">
              <span>Features</span>
              <ChevronDown size={14} />
            </button>
          </div>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.search}>
            <Search size={16} className={styles.searchIcon} />
            <input className={styles.searchInput} placeholder="Search..." />
          </div>

          <div className={styles.iconGroup}>
            <button className={styles.iconGhostBtn} type="button" aria-label="Apps">
              <Grid2x2 size={18} />
            </button>
            <button className={styles.iconGhostBtn} type="button" aria-label="Settings">
              <Settings size={18} />
            </button>
            <NotificationDropdown />
          </div>

          <UserDropdown />
        </div>
      </div>
    </header>
  );
}

