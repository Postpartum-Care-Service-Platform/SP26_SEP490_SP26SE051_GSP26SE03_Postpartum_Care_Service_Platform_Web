'use client';

import { StatCard } from './StatCard';
import { foodStatsConfig } from './foodStatsConfig';
import type { FoodStats } from './types';

import styles from './food-stats-cards.module.css';

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
