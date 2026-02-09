'use client';

import React from 'react';
import { Bell, ChevronDown, Menu } from 'lucide-react';

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown/Dropdown';

import { UserDropdown } from './UserDropdown';
import { NotificationDropdown } from './NotificationDropdown';
import { AdminControlPanel } from './AdminControlPanel';

import styles from './admin-layout.module.css';

type Props = {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onOpenNotifications: () => void;
};

export function AdminHeader({ collapsed, onToggleCollapsed, onOpenNotifications }: Props) {
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
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <button className={styles.pillButton} type="button" aria-label="Điều khiển">
                  <span>Điều khiển</span>
              <ChevronDown size={14} />
            </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className={styles.controlDropdownContent} align="start" side="bottom" sideOffset={10}>
                <AdminControlPanel />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.iconGroup}>
            <NotificationDropdown onViewAll={onOpenNotifications} />
          </div>

          <UserDropdown />
        </div>
      </div>
    </header>
  );
}

