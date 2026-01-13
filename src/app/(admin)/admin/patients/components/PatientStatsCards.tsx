'use client';

import { StatCard } from './StatCard';
import { patientStatsConfig } from './patientStatsConfig';
import type { PatientStats } from './types';

import styles from './patient-stats-cards.module.css';

type Props = {
  stats: PatientStats;
};

export function PatientStatsCards({ stats }: Props) {
  return (
    <div className={styles.container}>
      {patientStatsConfig.map((config) => (
        <StatCard
          key={config.key}
          image={config.image}
          value={stats[config.key]}
          label={config.label}
          icon={config.icon}
          iconColor={config.iconColor}
          backgroundColor={config.backgroundColor}
        />
      ))}
    </div>
  );
}

