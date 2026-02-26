'use client';

import { ChevronDown, Menu } from 'lucide-react';
import React from 'react';

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown/Dropdown';

import styles from './admin-layout.module.css';
import { AdminControlPanel } from './AdminControlPanel';
import { NotificationDropdown } from './NotificationDropdown';
import { UserDropdown } from './UserDropdown';

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

