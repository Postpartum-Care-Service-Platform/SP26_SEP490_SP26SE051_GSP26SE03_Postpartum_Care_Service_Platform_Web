'use client';

import Image from 'next/image';
import React from 'react';

import LogoSymbol from '@/assets/images/Symbol-Orange-32x32.png';
import LogoSymbol64 from '@/assets/images/Symbol-Orange-180x180.png';

import styles from './logo-loader.module.css';

type LogoLoaderSize = 'sm' | 'md' | 'lg';

export type LogoLoaderProps = {
  size?: LogoLoaderSize;
  text?: string;
  className?: string;
};

const sizeConfig: Record<LogoLoaderSize, { logo: typeof LogoSymbol; dimension: number }> = {
  sm: { logo: LogoSymbol, dimension: 32 },
  md: { logo: LogoSymbol, dimension: 48 },
  lg: { logo: LogoSymbol64, dimension: 64 },
};

export function LogoLoader({ size = 'md', text, className }: LogoLoaderProps) {
  const config = sizeConfig[size];
  const Logo = config.logo;

  return (
    <div className={`${styles.container} ${className || ''}`} role="status" aria-label="Đang tải">
      <div className={styles.logoWrapper}>
        <Image src={Logo} alt="Serena Postnatal" width={config.dimension} height={config.dimension} priority />
      </div>
      {text && <span className={styles.text}>{text}</span>}
    </div>
  );
}

