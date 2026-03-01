'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import LogoSymbol from '@/assets/images/Symbol-Orange-180x180.png';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/routes/routes';

import { UserNav } from './UserNav';
import '@/styles/header.css';

const MENU_ITEMS = [
  { label: 'The Joyful Experience', href: '/the-joyful-experience' },
  { label: 'Phòng Nghỉ', href: '/phong-nghi' },
  { label: 'Ẩm Thực', href: '/am-thuc' },
  { label: 'Sức Khỏe', href: '/suc-khoe' },
  { label: 'Tiện Ích', href: '/tien-ich' },
  { label: 'Giới Thiệu', href: '/gioi-thieu' },
  { label: 'Kiến Thức', href: '/kien-thuc' },
];

export function Header() {
  const { isAuthenticated } = useAuth();

  return (
    <header className="tjn-header" aria-label="Site header">
      <div className="tjn-header__container">
        <div className="tjn-header__inner">
          {/* Logo */}
          <Link className="tjn-header__brand" href="/" aria-label="The Joyful Nest">
            <Image className="tjn-header__logo" src={LogoSymbol} alt="The Joyful Nest" priority />
            <span className="tjn-header__brandText">The Joyful Nest</span>
          </Link>

          {/* Menu */}
          <nav className="tjn-header__nav" aria-label="Primary">
            <div className="row-menu-inner">
              {MENU_ITEMS.map((item) => (
                <a key={item.label} className="tjn-header__link" href={item.href}>
                  {item.label}
                </a>
              ))}
            </div>
          </nav>

          {/* Actions */}
          <div className="tjn-header__actions" aria-label="Header actions">
            {isAuthenticated ? (
              <UserNav />
            ) : (
              <>
                <a className="tjn-header__login" href={ROUTES.login}>
                  Đăng nhập
                </a>
                <a className="tjn-header__quote" href="/bao-gia">
                  Yêu cầu báo giá
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
