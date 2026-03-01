'use client';

import Image from 'next/image';

import styles from './appointment-timeline-item.module.css';

export type TimelineAppointment = {
  id: number;
  time: string;
  patientName: string;
  patientAvatar: string | null;
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

const getStatusLabel = (status: TimelineAppointment['status']) => {
  switch (status) {
    case 'Upcoming':
      return 'Sắp diễn ra';
    case 'Completed':
      return 'Hoàn thành';
    case 'In Progress':
      return 'Đang diễn ra';
    case 'Cancelled':
      return 'Đã hủy';
    case 'Rescheduled':
      return 'Đã dời lịch';
    case 'Scheduled':
      return 'Đã lên lịch';
    default:
      return status;
  }
};

export function AppointmentTimelineItem({ appointment }: Props) {
  return (
    <div className={styles.item}>
      <div className={styles.time}>{appointment.time}</div>
      <div className={styles.line}>
        <div className={styles.avatarWrapper}>
          {appointment.patientAvatar ? (
            <Image
              src={appointment.patientAvatar}
              alt={appointment.patientName}
              className={styles.avatar}
              width={32}
              height={32}
            />
          ) : (
            <div className={styles.avatarFallback}>{appointment.patientName.charAt(0)}</div>
          )}
        </div>
      </div>
      <div className={styles.details}>
        <div className={styles.title}>
          {appointment.patientName} → {appointment.doctorName} ({appointment.department})
        </div>
        <p className={styles.description}>{appointment.description}</p>
        <div className={styles.statusWrapper}>
          <span className={`${styles.statusBadge} ${getStatusClass(appointment.status)}`}>
            {getStatusLabel(appointment.status)}
          </span>
        </div>
      </div>
    </div>
  );
}
