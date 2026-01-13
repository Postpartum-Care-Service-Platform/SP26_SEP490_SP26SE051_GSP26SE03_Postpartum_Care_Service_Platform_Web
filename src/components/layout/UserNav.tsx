'use client';

import { BellIcon, ExitIcon, PersonIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import { ROUTES } from '@/routes/routes';

export function UserNav() {
  const router = useRouter();

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      router.push(ROUTES.home);
      window.location.reload();
    }
  };

  return (
    <div className="tjn-header__user-nav">
      <button className="tjn-header__icon-button" aria-label="Notifications">
        <BellIcon width={20} height={20} />
      </button>

      <DropdownMenu.Root modal={false}>
        <DropdownMenu.Trigger asChild>
          <button className="tjn-header__avatar-button" aria-label="User menu">
            <Image
              src="/placeholder-avatar.png"
              alt="User Avatar"
              width={40}
              height={40}
              className="tjn-header__avatar-img"
            />
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
