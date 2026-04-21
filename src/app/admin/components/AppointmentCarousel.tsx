'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import styles from './appointment-carousel.module.css';

type Appointment = {
  id: string;
  doctorName: string;
  specialty: string;
  room: string;
  time: string;
  avatar?: string;
};

type AppointmentCarouselProps = {
  appointments?: Appointment[];
};

const mockAppointments: Appointment[] = [
  {
    id: '1',
    doctorName: 'Dr. Priya Sharma',
    specialty: 'Pediatrics',
    room: 'Room 118',
    time: '12:00 PM',
  },
  {
    id: '2',
    doctorName: 'Dr. Sarah Johnson',
    specialty: 'Cardiology',
    room: 'Room 202',
    time: '10:30 AM',
  },
  {
    id: '3',
    doctorName: 'Dr. Michael Chen',
    specialty: 'Orthopedics',
    room: 'Room 305',
    time: '2:15 PM',
  },
];

export function AppointmentCarousel({
  appointments = [],
}: AppointmentCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setCurrentIndex(0);
    if (appointments.length > 1) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % appointments.length);
      }, 4000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [appointments]);

  if (appointments.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>Không có lịch hẹn trong ngày này</p>
      </div>
    );
  }

  const currentAppointment = appointments[currentIndex];

  if (!currentAppointment) {
    return <div className={styles.emptyState}>Đang tải...</div>;
  }

  const initials = (currentAppointment.specialty || currentAppointment.doctorName || '?').charAt(0).toUpperCase();

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.carouselContent}>
        <div 
          className={styles.carouselTrack}
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {appointments.map((appointment) => {
            const initials = (appointment.specialty || appointment.doctorName || '?').charAt(0).toUpperCase();
            
            return (
              <div key={appointment.id} className={styles.appointmentCard}>
                <div className={styles.avatarContainer}>
                  {appointment.avatar ? (
                    <Image
                      src={appointment.avatar}
                      alt={appointment.doctorName}
                      width={40}
                      height={40}
                      className={styles.avatar}
                    />
                  ) : (
                    <div className={styles.avatarPlaceholder}>
                      <span>{initials}</span>
                    </div>
                  )}
                </div>
                <div className={styles.appointmentInfo}>
                  <h4 className={styles.doctorName}>{appointment.doctorName}</h4>
                  <p className={styles.appointmentDetails}>
                    {appointment.specialty} · {appointment.room}
                  </p>
                </div>
                <div className={styles.timeBadge}>
                  <span>{appointment.time}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {appointments.length > 1 && (
        <div className={styles.indicators}>
          {appointments.map((_, index) => (
            <button
              key={index}
              className={`${styles.indicator} ${index === currentIndex ? styles.active : ''}`}
              onClick={() => {
                setCurrentIndex(index);
              }}
              aria-label={`Đi đến lịch hẹn ${index + 1}`}
              type="button"
            />
          ))}
        </div>
      )}
    </div>
  );
}
