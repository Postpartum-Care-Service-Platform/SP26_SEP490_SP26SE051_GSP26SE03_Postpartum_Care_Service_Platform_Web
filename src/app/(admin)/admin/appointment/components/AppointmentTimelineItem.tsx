'use client';

import Image from 'next/image';
import styles from './appointment-timeline-item.module.css';

export type TimelineAppointment = {
  id: string;
  time: string;
  patientName: string;
  patientAvatar: string;
  doctorName: string;
  department: string;
  description: string;
  status: 'Upcoming' | 'Completed' | 'In Progress' | 'Cancelled' | 'Rescheduled' | 'Scheduled';
};

type Props = {
  appointment: TimelineAppointment;
};

const getStatusClass = (status: TimelineAppointment['status']) => {
  switch (status) {
    case 'Upcoming':
      return styles.statusUpcoming;
    case 'Completed':
      return styles.statusCompleted;
    case 'In Progress':
      return styles.statusInProgress;
    case 'Cancelled':
      return styles.statusCancelled;
    case 'Rescheduled':
      return styles.statusRescheduled;
    case 'Scheduled':
      return styles.statusScheduled;
    default:
      return '';
  }
};

export function AppointmentTimelineItem({ appointment }: Props) {
  return (
    <div className={styles.item}>
      <div className={styles.time}>{appointment.time}</div>
      <div className={styles.line}>
        <div className={styles.avatarWrapper}>
          <Image
            src={appointment.patientAvatar}
            alt={appointment.patientName}
            width={32}
            height={32}
            className={styles.avatar}
          />
        </div>
      </div>
      <div className={styles.details}>
        <div className={styles.title}>
          {appointment.patientName} → {appointment.doctorName} ({appointment.department})
        </div>
        <p className={styles.description}>{appointment.description}</p>
        <div className={styles.statusWrapper}>
          <span className={`${styles.statusBadge} ${getStatusClass(appointment.status)}`}>
            {appointment.status}
          </span>
        </div>
      </div>
    </div>
  );
}
