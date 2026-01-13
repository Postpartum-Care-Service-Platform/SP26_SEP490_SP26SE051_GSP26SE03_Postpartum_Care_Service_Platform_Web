'use client';

import Image, { type StaticImageData } from 'next/image';
import type React from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';

import styles from './appointment-card.module.css';

type Props = {
  image: StaticImageData;
  value: number;
  label: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  iconColor?: string;
  iconTextColor?: string;
  backgroundColor?: string;
  valueColor?: string;
  labelColor?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
};

export function AppointmentCard({
  image,
  value,
  label,
  icon: Icon,
  iconColor,
  iconTextColor,
  backgroundColor,
  valueColor,
  labelColor,
  trend,
}: Props) {
  return (
    <div className={styles.card} style={{ backgroundColor }}>
      <div className={styles.pillsImage}>
        <Image src={image} alt="" fill className={styles.pillsImg} sizes="112px" />
      </div>
      <div className={styles.content}>
        <div className={styles.topSection}>
          {Icon && (
            <div className={styles.iconWrapper} style={{ backgroundColor: iconColor }}>
              <Icon className={styles.icon} style={{ color: iconTextColor }} />
            </div>
          )}
        </div>
        <div className={styles.label} style={{ color: labelColor }}>
          {label}
        </div>
        <div className={styles.valueRow}>
          <div className={styles.value} style={{ color: valueColor }}>
            {value.toLocaleString()}
          </div>
          {trend && (
            <div className={styles.trend}>
              {trend.isPositive ? (
                <TrendingUp className={styles.trendIcon} style={{ color: '#10b981' }} />
              ) : (
                <TrendingDown className={styles.trendIcon} style={{ color: '#ef4444' }} />
              )}
              <span className={trend.isPositive ? styles.trendPositive : styles.trendNegative}>
                {trend.isPositive ? '+' : ''}
                {trend.value}
              </span>
              <span className={styles.trendLabel}>This month</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

