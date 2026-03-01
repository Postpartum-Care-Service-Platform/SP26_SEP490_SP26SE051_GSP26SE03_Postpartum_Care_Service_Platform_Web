'use client';

import styles from './food-stats-cards.module.css';
import { foodStatsConfig } from './foodStatsConfig';
import { StatCard } from './StatCard';

import type { FoodStats } from './types';

type Props = {
  stats: FoodStats;
};

export function FoodStatsCards({ stats }: Props) {
  return (
    <div className={styles.container}>
      {foodStatsConfig.map((config) => {
        const value = stats[config.key];

        return (
          <StatCard
            key={config.key}
            image={config.image}
            value={value}
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
