'use client';

import Image from 'next/image';
import { MessageCircle, Users, Archive, Camera, Settings, Bell } from 'lucide-react';

import LogoSymbol from '@/assets/images/Symbol-Orange-32x32.png';

import styles from './chat-sidebar.module.css';

type ChatNavItem = {
  id: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  onClick: () => void;
};

type Props = {
  activeView: string;
  onViewChange: (view: string) => void;
};

export function ChatSidebar({ activeView, onViewChange }: Props) {
  const navItems: ChatNavItem[] = [
    {
      id: 'chat',
      icon: MessageCircle,
      label: 'Chat',
      onClick: () => onViewChange('chat'),
    },
    {
      id: 'support-requests',
      icon: Bell,
      label: 'Yêu cầu chat',
      onClick: () => onViewChange('support-requests'),
    },
    {
      id: 'contacts',
      icon: Users,
      label: 'Contacts',
      onClick: () => onViewChange('contacts'),
    },
    {
      id: 'archive',
      icon: Archive,
      label: 'Archive',
      onClick: () => onViewChange('archive'),
    },
    {
      id: 'media',
      icon: Camera,
      label: 'Media',
      onClick: () => onViewChange('media'),
    },
    {
      id: 'settings',
      icon: Settings,
      label: 'Settings',
      onClick: () => onViewChange('settings'),
    },
  ];

  const regularItems = navItems.filter((item) => item.id !== 'settings');
  const settingsItem = navItems.find((item) => item.id === 'settings');

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <Image src={LogoSymbol} alt="Logo" width={32} height={32} />
      </div>
      <nav className={styles.nav}>
        {regularItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
              onClick={item.onClick}
              title={item.label}
              aria-label={item.label}
            >
              <Icon size={20} className={styles.icon} />
            </button>
          );
        })}
      </nav>
      {settingsItem && (() => {
        const SettingsIcon = settingsItem.icon;
        return (
          <div className={styles.settingsWrapper}>
            <button
              type="button"
              className={`${styles.navItem} ${activeView === settingsItem.id ? styles.navItemActive : ''}`}
              onClick={settingsItem.onClick}
              title={settingsItem.label}
              aria-label={settingsItem.label}
            >
              <SettingsIcon size={20} className={styles.icon} />
            </button>
          </div>
        );
      })()}
    </aside>
  );
}

