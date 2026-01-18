'use client';

import type React from 'react';
import { Check, Clock, X, Calendar } from 'lucide-react';

import styles from './overview-stat-card.module.css';

export type TrendType = 'up' | 'down' | 'check';

export type OverviewStatCardProps = {
  icon: React.ComponentType<any>;
  iconBgColor: string;
  iconColor: string;
  trendType: TrendType;
  trendValue: string;
  value: string | number;
  valueColor?: string;
  mainLabel: string;
  description: string;
  descriptionBold: string;
};

type Props = OverviewStatCardProps;

const trendIcons = {
  up: '↑',
  down: '↓',
  check: '✓',
};

export function OverviewStatCard({
  icon: Icon,
  iconBgColor,
  iconColor,
  trendType,
  trendValue,
  value,
  valueColor,
  mainLabel,
  description,
  descriptionBold,
}: Props) {
  const trendColor = trendType === 'down' ? '#ef4444' : '#10b981';

  return (
    <div className={styles.card}>
      <div className={styles.cardBody}>
        <div className={styles.topSection}>
          <div className={styles.iconWrapper} style={{ backgroundColor: iconBgColor }}>
            <Icon className={styles.icon} style={{ color: iconColor }} size={20} />
          </div>
          <div className={styles.trend} style={{ color: trendColor }}>
            <span className={styles.trendValue}>{trendValue}</span>
            <span className={styles.trendIcon}>{trendIcons[trendType]}</span>
          </div>
        </div>

        <div className={styles.value} style={{ color: valueColor }}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>

        <div className={styles.mainLabel}>{mainLabel}</div>

        <div className={styles.description}>
          {description} <span className={styles.descriptionBold}>{descriptionBold}</span>
        </div>
      </div>
    </div>
  );
}

