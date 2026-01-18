'use client';

import { useState, useEffect } from 'react';
import { ExitIcon, PersonIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import userService from '@/services/user.service';
import { NotificationDropdown } from './NotificationDropdown';
import type { Account } from '@/types/account';

import { ROUTES } from '@/routes/routes';

export function UserNav() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAccount();
  }, []);

  const loadAccount = async () => {
    try {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }
      }
      
      const data = await userService.getCurrentAccount();
      setAccount(data);
    } catch (err) {
      // Silently fail - user might not be logged in
      console.error('Failed to load account for avatar:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    if (typeof window !== 'undefined') {
      router.push(ROUTES.home);
      window.location.reload();
    }
  };

  // Lấy avatar từ account hoặc ownerProfile
  const avatarUrl = account?.avatarUrl || account?.ownerProfile?.avatarUrl || null;
  const displayName = account?.ownerProfile?.fullName || account?.username || user?.username || 'User';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="tjn-header__user-nav">
      <NotificationDropdown />

      <DropdownMenu.Root modal={false}>
        <DropdownMenu.Trigger asChild>
          <button className="tjn-header__avatar-button" aria-label="User menu">
            {!loading && avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={displayName}
                width={40}
                height={40}
                className="tjn-header__avatar-img"
                unoptimized={avatarUrl.startsWith('http')}
                onError={(e) => {
                  // Fallback nếu ảnh lỗi
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.parentElement?.querySelector('.tjn-header__avatar-fallback') as HTMLElement;
                  if (fallback) {
                    fallback.style.display = 'flex';
                  }
                }}
              />
            ) : null}
            <div
              className="tjn-header__avatar-fallback"
              style={{
                display: (!loading && avatarUrl) ? 'none' : 'flex',
              }}
            >
              {loading ? '...' : initials}
            </div>
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content
          className="tjn-header__dropdown-content"
          sideOffset={8}
          align="end"
        >
          <DropdownMenu.Item asChild>
            <Link href={ROUTES.profile} className="tjn-header__dropdown-item">
              <PersonIcon width={16} height={16} style={{ marginRight: 8 }} />
              Thông tin cá nhân
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="tjn-header__dropdown-separator" />
          <DropdownMenu.Item
            className="tjn-header__dropdown-item tjn-header__dropdown-item--logout"
            onSelect={handleLogout}
          >
            <ExitIcon width={16} height={16} style={{ marginRight: 8 }} />
            Đăng xuất
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  );
}
