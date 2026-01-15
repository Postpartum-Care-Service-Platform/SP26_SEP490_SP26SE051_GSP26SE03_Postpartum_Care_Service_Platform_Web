'use client';

import { AppointmentCard } from './AppointmentCard';
import { appointmentStatsConfig } from './appointmentStatsConfig';
import styles from './appointment-stats-cards.module.css';

export function AppointmentStatsCards() {
  return (
    <div className={styles.container}>
      {appointmentStatsConfig.map((item) => (
        <AppointmentCard
          key={item.key}
          image={item.image}
          value={item.value}
          label={item.label}
          icon={item.icon}
          iconColor={item.iconColor}
          iconTextColor={item.iconTextColor}
          backgroundColor={item.backgroundColor}
          valueColor={item.valueColor}
          labelColor={item.labelColor}
          trend={item.trend}
        />
      ))}
    </div>
  );
}

