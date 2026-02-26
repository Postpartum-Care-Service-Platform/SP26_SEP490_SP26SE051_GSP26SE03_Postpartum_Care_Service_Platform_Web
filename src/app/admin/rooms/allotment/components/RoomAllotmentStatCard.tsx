'use client';

import styles from './room-allotment-stat-card.module.css';

import type React from 'react';

export type RoomAllotmentStatCardProps = {
  title: string;
  value: string | number;
  subtitle: string;
  borderColor: string;
  icon: React.ComponentType<any>;
  iconBgColor: string;
  iconColor: string;
};

type Props = RoomAllotmentStatCardProps;

export function RoomAllotmentStatCard({
  title,
  value,
  subtitle,
  borderColor,
  icon: Icon,
  iconBgColor,
  iconColor,
}: Props) {
  return (
    <div className={styles.card} style={{ borderColor }}>
      <div className={styles.cardBody}>
        <div className={styles.topRow}>
          <div className={styles.title}>{title}</div>
          <div className={styles.iconWrapper} style={{ backgroundColor: iconBgColor }}>
            <Icon className={styles.icon} style={{ color: iconColor }} size={20} />
          </div>
        </div>
        <div className={styles.value}>{typeof value === 'number' ? value.toLocaleString() : value}</div>
        <div className={styles.subtitle}>{subtitle}</div>
      </div>
    </div>
  );
}

