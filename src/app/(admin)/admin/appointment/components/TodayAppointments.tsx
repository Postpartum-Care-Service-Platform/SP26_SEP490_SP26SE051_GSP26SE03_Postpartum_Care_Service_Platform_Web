'use client';

'use client';

import { MixerHorizontalIcon } from '@radix-ui/react-icons';
import { AppointmentTimelineItem } from './AppointmentTimelineItem';
import { mockTimelineAppointments } from './mockTimelineData';
import styles from './today-appointments.module.css';

export function TodayAppointments() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Today Appointments</h3>
        <button className={styles.filterButton}>
          <MixerHorizontalIcon />
          <span>Filter</span>
        </button>
      </div>
            <div className={styles.timeline}>
        {mockTimelineAppointments.map((appointment) => (
          <AppointmentTimelineItem key={appointment.id} appointment={appointment} />
        ))}
      </div>
    </div>
  );
}
