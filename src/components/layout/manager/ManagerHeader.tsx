'use client';

import { Bell, Menu, Search, User } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { ChatNotification } from '../admin/ChatNotification';
import { NotificationDropdown } from '../admin/NotificationDropdown';

import styles from './manager-header.module.css';

type Props = {
  collapsed: boolean;
  onToggleCollapsed: () => void;
};

export function ManagerHeader({ collapsed, onToggleCollapsed }: Props) {
  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <button
          type="button"
          className={styles.menuBtn}
          onClick={onToggleCollapsed}
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>

        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.headerRight}>
        <div className={styles.iconGroup}>
          <ChatNotification />
          <NotificationDropdown />
        </div>

        <Link href="/dashboard/profile" className={styles.userBtn}>
          <div className={styles.avatar}>
            <User size={18} />
          </div>
          <span className={styles.userName}>Manager</span>
        </Link>
      </div>
    </header>
  );
}
