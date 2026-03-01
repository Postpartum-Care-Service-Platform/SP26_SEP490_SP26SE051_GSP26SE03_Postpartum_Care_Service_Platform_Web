'use client';

import styles from './activity-stats-cards.module.css';
import { activityStatsConfig } from './activityStatsConfig';
import { StatCard } from './StatCard';

import type { ActivityStats } from './types';

type Props = {
  stats: ActivityStats;
};

export function ActivityStatsCards({ stats }: Props) {
  return (
    <div className={styles.container}>
      {activityStatsConfig.map((config) => {
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
