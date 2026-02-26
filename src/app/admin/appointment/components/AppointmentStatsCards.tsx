'use client';

import styles from './appointment-stats-cards.module.css';
import { AppointmentCard } from './AppointmentCard';
import { appointmentStatsConfig } from './appointmentStatsConfig';

type AppointmentStats = {
  today: number;
  upcoming: number;
  completed: number;
  cancelled: number;
  rescheduled: number;
};

type Props = {
  stats: AppointmentStats;
};

export function AppointmentStatsCards({ stats }: Props) {
  return (
    <div className={styles.container}>
      {appointmentStatsConfig.map((item) => {
        const value = stats[item.key];
        return (
          <AppointmentCard
            key={item.key}
            image={item.image}
            value={value}
            label={item.label}
            icon={item.icon}
            iconColor={item.iconColor}
            iconTextColor={item.iconTextColor}
            backgroundColor={item.backgroundColor}
            valueColor={item.valueColor}
            labelColor={item.labelColor}
            trend={item.trend}
          />
        );
      })}
    </div>
  );
}

