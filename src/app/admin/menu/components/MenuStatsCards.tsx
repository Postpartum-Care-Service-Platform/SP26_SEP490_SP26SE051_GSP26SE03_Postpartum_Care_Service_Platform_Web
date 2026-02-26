'use client';

import styles from './menu-stats-cards.module.css';
import { menuStatsConfig } from './menuStatsConfig';
import { StatCard } from './StatCard';

import type { MenuStats } from './types';


type Props = {
  stats: MenuStats;
};

export function MenuStatsCards({ stats }: Props) {
  return (
    <div className={styles.container}>
      {menuStatsConfig.map((config) => {
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
