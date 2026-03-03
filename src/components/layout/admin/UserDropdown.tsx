'use client';

import {
  Activity,
  CalendarCheck,
  CreditCard,
  FileText,
  MessageSquare,
  User,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown/Dropdown';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/routes/routes';

import styles from './user-dropdown.module.css';

const menuItems = [
  { icon: User, label: 'Hồ sơ', route: ROUTES.adminProfile },
  { icon: MessageSquare, label: 'Tin nhắn', route: ROUTES.adminChat },
  { icon: CalendarCheck, label: 'Đặt lịch', route: ROUTES.adminAppointment }, // Booking
  { icon: Activity, label: 'Nhiệm vụ', route: ROUTES.adminWorkSchedule },
  { icon: FileText, label: 'Hợp đồng', route: ROUTES.adminContract },
  { icon: CreditCard, label: 'Giao dịch', route: ROUTES.adminTransaction },
];

export function UserDropdown() {
  const router = useRouter();
  const { logout, user } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      router.push(ROUTES.login);
      window.location.href = ROUTES.login;
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const displayName = user?.username || '';
  const displayEmail = user?.email || '';
  const avatarInitial = displayName ? displayName.charAt(0).toUpperCase() : '';

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button className={styles.user} type="button">
          <div className={styles.avatar}>{avatarInitial}</div>
          <span className={styles.userName}>{displayName}</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={styles.userChevron}>
            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={styles.dropdownContent} align="end" sideOffset={8}>
        <div className={styles.dropdownHeader}>
          <div className={styles.headerAvatar}>{avatarInitial}</div>
          <div className={styles.headerInfo}>
            <div className={styles.headerName}>{displayName}</div>
            {displayEmail && (
              <div className={styles.headerEmailWrapper}>
                <span className={styles.headerEmail}>{displayEmail}</span>
              </div>
            )}
          </div>
        </div>

        <div className={styles.menuGrid}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const handleClick = () => {
              if (item.route) {
                router.push(item.route);
              }
            };
            return (
              <button
                key={item.label}
                className={styles.menuItem}
                type="button"
                onClick={handleClick}
              >
                <Icon size={20} className={styles.menuIcon} />
                <span className={styles.menuLabel}>{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className={styles.dropdownFooter}>
          <button
            className={styles.signInButton}
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? 'Đang đăng xuất...' : 'Đăng xuất'}
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

