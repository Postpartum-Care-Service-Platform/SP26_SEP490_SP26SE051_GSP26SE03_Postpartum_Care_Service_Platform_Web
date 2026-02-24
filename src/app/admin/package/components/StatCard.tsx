'use client';

import type React from 'react';
import Image, { type StaticImageData } from 'next/image';

import styles from './stat-card.module.css';

type Props = {
  image?: StaticImageData;
  value: number | string;
  label: string;
  icon?: React.ComponentType<any>;
  iconColor?: string;
  backgroundColor?: string;
  valueColor?: string;
  labelColor?: string;
};

export function StatCard({
  image,
  value,
  label,
  icon: Icon,
  iconColor,
  backgroundColor,
  valueColor,
  labelColor,
}: Props) {
  return (
    <div className={styles.card} style={{ backgroundColor }}>
      {image && (
        <div className={styles.imageWrapper}>
          <Image
            src={image}
            alt={label}
            fill
            className={styles.image}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 16.66vw"
            priority
          />
        </div>
      )}
      <div className={styles.content}>
        {Icon && (
          <div className={styles.iconWrapper} style={{ backgroundColor: iconColor }}>
            <Icon className={styles.icon} />
          </div>
        )}
        <div className={styles.value} style={{ color: valueColor }}>
          {typeof value === 'number' ? value.toLocaleString('vi-VN') : value}
        </div>
        <div className={styles.label} style={{ color: labelColor }}>
          {label}
        </div>
      </div>
    </div>
  );
}
