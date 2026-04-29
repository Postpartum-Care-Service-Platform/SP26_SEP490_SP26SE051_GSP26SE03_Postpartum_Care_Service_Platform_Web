'use client';

import Image from 'next/image';
import React from 'react';

import LogoSymbol from '@/assets/images/Symbol-Orange-180x180.png';

import styles from './data-loader.module.css';

export interface DataLoaderProps {
  text?: string;
  className?: string;
  minHeight?: string | number;
}

export function DataLoader({ 
  text = 'Đang tải dữ liệu...', 
  className,
  minHeight = '400px'
}: DataLoaderProps) {
  return (
    <div 
      className={`${styles.container} ${className || ''}`} 
      style={{ minHeight }}
      role="status" 
      aria-label="Đang tải dữ liệu"
    >
      <div className={styles.content}>
        <div className={styles.logoWrapper}>
          <Image 
            src={LogoSymbol} 
            alt="thejoyfulnest" 
            width={120} 
            height={120} 
            priority 
            className={styles.logo}
          />
        </div>
        {text && <span className={styles.text}>{text}</span>}
      </div>
    </div>
  );
}
