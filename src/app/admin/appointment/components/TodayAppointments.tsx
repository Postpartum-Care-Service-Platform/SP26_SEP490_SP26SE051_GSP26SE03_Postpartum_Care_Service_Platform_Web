'use client';

import { MixerHorizontalIcon } from '@radix-ui/react-icons';

import { AppointmentTimelineItem, type TimelineAppointment } from './AppointmentTimelineItem';
import styles from './today-appointments.module.css';

type Props = {
  appointments: TimelineAppointment[];
};

export function TodayAppointments({ appointments }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Lịch hẹn hôm nay</h3>
        <button className={styles.filterButton}>
          <MixerHorizontalIcon />
          <span>Lọc</span>
        </button>
      </div>
      <div className={styles.timeline}>
        {appointments.length === 0 ? (
          <div className={styles.empty}>Hôm nay chưa có lịch hẹn nào.</div>
        ) : (
          appointments.map((appointment) => (
            <AppointmentTimelineItem key={appointment.id} appointment={appointment} />
          ))
        )}
      </div>
    </div>
  );
}
