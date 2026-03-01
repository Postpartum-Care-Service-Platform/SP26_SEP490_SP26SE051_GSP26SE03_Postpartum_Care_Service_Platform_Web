'use client';

import styles from './care-plan-detail-stats-cards.module.css';
import { carePlanDetailStatsConfig } from './carePlanDetailStatsConfig';
import { StatCard } from './StatCard';

import type { CarePlanDetailStats } from './types';

type Props = {
  stats: CarePlanDetailStats;
};

export function CarePlanDetailStatsCards({ stats }: Props) {
  return (
    <div className={styles.container}>
      {carePlanDetailStatsConfig.map((config) => {
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
