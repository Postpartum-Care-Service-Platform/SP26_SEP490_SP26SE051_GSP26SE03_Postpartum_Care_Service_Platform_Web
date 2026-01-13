'use client';

import Image from 'next/image';
import React from 'react';

import LogoSymbol from '@/assets/images/Symbol-Orange-180x180.png';

import styles from './page-loader.module.css';

export type PageLoaderProps = {
  text?: string;
  className?: string;
};

export function PageLoader({ text = 'Đang tải...', className }: PageLoaderProps) {
  return (
    <div className={`${styles.overlay} ${className || ''}`} role="status" aria-label="Đang tải trang">
      <div className={styles.content}>
        <div className={styles.logoWrapper}>
          <Image src={LogoSymbol} alt="Serena Postnatal" width={180} height={180} priority />
        </div>
        {text && <span className={styles.text}>{text}</span>}
      </div>
    </div>
  );
}

