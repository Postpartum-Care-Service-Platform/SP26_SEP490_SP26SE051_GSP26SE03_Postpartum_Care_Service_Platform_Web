'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';

import LogoSymbol from '@/assets/images/Symbol-Orange-180x180.png';
import { UserNav } from './UserNav';
import { ROUTES } from '@/routes/routes';

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // This check runs only on the client side
    const token = localStorage.getItem('token'); // Use your actual token key
    setIsLoggedIn(!!token);
  }, []);

  return (
    <header className="tjn-header" aria-label="Site header">
      <div className="tjn-header__container">
        <div className="tjn-header__inner">
          {/* Logo */}
          <a className="tjn-header__brand" href="/" aria-label="The Joyful Nest">
            <Image className="tjn-header__logo" src={LogoSymbol} alt="The Joyful Nest" priority />
            <span className="tjn-header__brandText">The Joyful Nest</span>
          </a>

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
            {isLoggedIn ? (
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
