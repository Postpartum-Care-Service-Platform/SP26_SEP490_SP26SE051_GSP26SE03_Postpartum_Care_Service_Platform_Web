'use client';

import React from 'react';
import {
  Activity,
  Bell,
  CalendarCheck,
  FileText,
  MessageSquare,
  User,
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown/Dropdown';

import styles from './user-dropdown.module.css';

const menuItems = [
  { icon: User, label: 'Profile' },
  { icon: MessageSquare, label: 'Messages' },
  { icon: Activity, label: 'Activities' },
  { icon: CalendarCheck, label: 'Tasks' },
  { icon: FileText, label: 'Notes' },
  { icon: Bell, label: 'Notification' },
];

export function UserDropdown() {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button className={styles.user} type="button">
          <div className={styles.avatar}>C</div>
          <span className={styles.userName}>Charlie Stone</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={styles.userChevron}>
            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={styles.dropdownContent} align="end" sideOffset={8}>
        <div className={styles.dropdownHeader}>
          <div className={styles.headerAvatar}>C</div>
          <div className={styles.headerInfo}>
            <div className={styles.headerName}>Charlie Stone</div>
            <div className={styles.headerEmailWrapper}>
              <span className={styles.headerEmail}>admin@codubucks.in</span>
              <span className={styles.badge}>6+</span>
            </div>
          </div>
        </div>

        <div className={styles.menuGrid}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button key={item.label} className={styles.menuItem} type="button">
                <Icon size={20} className={styles.menuIcon} />
                <span className={styles.menuLabel}>{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className={styles.dropdownFooter}>
          <button className={styles.signInButton} type="button">
            Sign In
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

