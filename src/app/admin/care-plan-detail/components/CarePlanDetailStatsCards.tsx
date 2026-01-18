'use client';

import { StatCard } from './StatCard';
import { carePlanDetailStatsConfig } from './carePlanDetailStatsConfig';
import type { CarePlanDetailStats } from './types';

import styles from './care-plan-detail-stats-cards.module.css';

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
