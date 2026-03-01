'use client';

import styles from './overview-stats-cards.module.css';
import { OverviewStatCard } from './OverviewStatCard';
import { overviewStatsConfig } from './overviewStatsConfig';

export function OverviewStatsCards() {
  return (
    <div className={styles.container}>
      {overviewStatsConfig.map((config, index) => (
        <OverviewStatCard key={index} {...config} />
      ))}
    </div>
  );
}

