'use client';

import styles from './patient-stats-cards.module.css';
import { patientStatsConfig } from './patientStatsConfig';
import { StatCard } from './StatCard';

import type { PatientStats } from './types';

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

