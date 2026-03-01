'use client';

import styles from './package-stats-cards.module.css';
import { packageStatsConfig } from './packageStatsConfig';
import { StatCard } from './StatCard';

import type { PackageStats } from './types';


type Props = {
  stats: PackageStats;
};

export function PackageStatsCards({ stats }: Props) {
  return (
    <div className={styles.container}>
      {packageStatsConfig.map((config) => {
        const value = stats[config.key];
        // Format giá tiền nếu là giá
        const displayValue =
          config.key === 'avgPrice' || config.key === 'highestPrice'
            ? new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
                minimumFractionDigits: 0,
              }).format(value)
            : value;

        return (
          <StatCard
            key={config.key}
            image={config.image}
            value={displayValue}
            label={config.label}
            icon={config.icon}
            iconColor={config.iconColor}
            backgroundColor={config.backgroundColor}
          />
        );
      })}
    </div>
  );
}
