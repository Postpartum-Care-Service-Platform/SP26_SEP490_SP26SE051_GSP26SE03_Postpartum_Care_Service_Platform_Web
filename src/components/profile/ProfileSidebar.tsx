'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  PersonIcon,
  GearIcon,
  LockClosedIcon,
  ClockIcon,
  FileTextIcon,
} from '@radix-ui/react-icons';

import { ROUTES } from '@/routes/routes';

const SIDEBAR_ITEMS = [
  { label: 'Thông tin cá nhân', href: ROUTES.profile, icon: PersonIcon },
  { label: 'Cài đặt', href: '/profile/settings', icon: GearIcon },
  { label: 'Bảo mật', href: '/profile/security', icon: LockClosedIcon },
  { label: 'Lịch sử đặt lịch', href: '/profile/bookings', icon: ClockIcon },
  { label: 'Tài liệu của tôi', href: '/profile/documents', icon: FileTextIcon },
] as const;

export function ProfileSidebar() {
  const pathname = usePathname();

  return (
    <aside className="profile-sidebar" aria-label="Profile sidebar">
      <div className="profile-sidebar__card">
        <div className="profile-sidebar__heading">Tài khoản</div>

        <nav className="profile-sidebar__nav" aria-label="Profile navigation">
          {SIDEBAR_ITEMS.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`profile-sidebar__link ${active ? 'is-active' : ''}`}
              >
                <Icon width={18} height={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
