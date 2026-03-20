'use client';

import {
  Activity,
  CalendarCheck,
  CreditCard,
  FileText,
  MessageSquare,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown/Dropdown';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/routes/routes';

import styles from './user-dropdown.module.css';

export function UserDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const isManager = pathname?.startsWith('/manager');
  
  const menuItems = [
    { 
      icon: User, 
      label: 'Hồ sơ', 
      route: isManager ? ROUTES.managerProfile : ROUTES.adminProfile 
    },
    { 
      icon: MessageSquare, 
      label: 'Tin nhắn', 
      route: isManager ? ROUTES.managerChat : ROUTES.adminChat 
    },
    { 
      icon: CalendarCheck, 
      label: 'Đặt lịch', 
      route: isManager ? ROUTES.managerAppointment : ROUTES.adminAppointment 
    },
    { 
      icon: Activity, 
      label: 'Nhiệm vụ', 
      route: isManager ? ROUTES.managerWorkSchedule : ROUTES.adminWorkSchedule 
    },
    { 
      icon: FileText, 
      label: 'Hợp đồng', 
      route: isManager ? ROUTES.managerContract : ROUTES.adminContract 
    },
    { 
      icon: CreditCard, 
      label: 'Giao dịch', 
      route: isManager ? ROUTES.managerTransaction : ROUTES.adminTransaction 
    },
  ];

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
            return (
              <Link
                key={item.label}
                href={item.route || '#'}
                className={styles.menuItem}
              >
                <Icon size={20} className={styles.menuIcon} />
                <span className={styles.menuLabel}>{item.label}</span>
              </Link>
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

