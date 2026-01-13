'use client';

import { OverviewStatCard } from './OverviewStatCard';
import { overviewStatsConfig } from './overviewStatsConfig';
import styles from './overview-stats-cards.module.css';

export function OverviewStatsCards() {
  return (
    <div className={styles.container}>
      {overviewStatsConfig.map((config, index) => (
        <OverviewStatCard key={index} {...config} />
      ))}
    </div>
  );
}

