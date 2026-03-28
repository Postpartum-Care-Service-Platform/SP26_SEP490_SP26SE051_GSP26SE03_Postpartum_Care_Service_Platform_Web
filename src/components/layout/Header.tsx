'use client';

import { ChevronDownIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
 
import LogoSymbol from '@/assets/images/Symbol-Orange-180x180.png';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/routes/routes';

import { UserNav } from './UserNav';
import '@/styles/header.css';

const MENU_ITEMS = [
  { label: 'The Joyful Experience', href: '/the-joyful-experience' },
  { 
    label: 'Phòng Nghỉ', 
    href: '/phong-nghi',
    children: [
      { label: 'Gói', href: '/phong-nghi/goi' }
    ]
  },
  { label: 'Ẩm Thực', href: '/am-thuc' },
  { label: 'Sức Khỏe', href: '/suc-khoe' },
  { label: 'Tiện Ích', href: '/tien-ich' },
  { label: 'Giới Thiệu', href: '/gioi-thieu' },
  { label: 'Kiến Thức', href: '/kien-thuc' },
];

export function Header() {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();

  return (
    <header className="tjn-header" aria-label="Site header">
      <div className="tjn-header__container">
        <div className="tjn-header__inner">
          {/* Logo */}
          <Link className="tjn-header__brand" href="/" aria-label="The Joyful Nest">
            <Image
              className="tjn-header__logo"
              src="/thejoyfulnest/food/Logo-Orange.svg"
              alt="The Joyful Nest"
              width={220}
              height={45}
              style={{ height: 'auto', width: 'auto', minWidth: '180px' }}
              priority
            />
          </Link>

          <nav className="tjn-header__nav" aria-label="Primary">
            <div className="row-menu-inner">
              {MENU_ITEMS.map((item) => {
                const hasChildren = item.children && item.children.length > 0;
                
                return (
                  <div key={item.label} className={`tjn-header__nav-item ${hasChildren ? 'has-dropdown' : ''}`}>
                    <Link
                      className={`tjn-header__link ${pathname === item.href ? 'is-active' : ''}`}
                      href={item.href}
                    >
                      {item.label}
                      {hasChildren && <ChevronDownIcon className="dropdown-icon" />}
                    </Link>
                    
                    {hasChildren && (
                      <div className="tjn-header__submenu">
                        {item.children?.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            className="tjn-header__submenu-link"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </nav>

          {/* Actions */}
          <div className="tjn-header__actions" aria-label="Header actions">
            {isAuthenticated ? (
              <UserNav />
            ) : (
              <>
                <Link className="tjn-header__login" href={ROUTES.login}>
                  Đăng nhập
                </Link>
                <Link className="tjn-header__quote" href="/bao-gia">
                  Yêu cầu báo giá
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
