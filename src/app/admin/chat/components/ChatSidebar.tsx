'use client';

import {
  Archive,
  Bell,
  Camera,
  MessageCircle,
  Settings,
  Users,
} from 'lucide-react';
import Image from 'next/image';

import LogoSymbol from '@/assets/images/Symbol-Orange-32x32.png';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import styles from './chat-sidebar.module.css';

type ChatNavItem = {
  id: string;
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
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
      label: 'Trò chuyện',
      onClick: () => onViewChange('chat'),
    },
    {
      id: 'support-requests',
      icon: Bell,
      label: 'Hỗ trợ trực tuyến',
      onClick: () => onViewChange('support-requests'),
    },
    {
      id: 'contacts',
      icon: Users,
      label: 'Danh bạ',
      onClick: () => onViewChange('contacts'),
    },
    {
      id: 'settings',
      icon: Settings,
      label: 'Cài đặt',
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
            <Tooltip key={item.id} delayDuration={300}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                  onClick={item.onClick}
                  aria-label={item.label}
                >
                  <Icon size={20} className={styles.icon} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                {item.label}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </nav>
      {settingsItem && (() => {
        const SettingsIcon = settingsItem.icon;
        return (
          <div className={styles.settingsWrapper}>
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className={`${styles.navItem} ${activeView === settingsItem.id ? styles.navItemActive : ''}`}
                  onClick={settingsItem.onClick}
                  aria-label={settingsItem.label}
                >
                  <SettingsIcon size={20} className={styles.icon} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                {settingsItem.label}
              </TooltipContent>
            </Tooltip>
          </div>
        );
      })()}
    </aside>
  );
}
