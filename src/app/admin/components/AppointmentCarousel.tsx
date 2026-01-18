'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
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

export function AppointmentCarousel({ appointments = mockAppointments }: AppointmentCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (appointments.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % appointments.length);
      }, 3000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [appointments.length]);


  if (appointments.length === 0) {
    return null;
  }

  const currentAppointment = appointments[currentIndex];

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.carouselContent}>
        <div className={styles.appointmentCard}>
          <div className={styles.avatarContainer}>
            {currentAppointment.avatar ? (
              <Image
                src={currentAppointment.avatar}
                alt={currentAppointment.doctorName}
                width={40}
                height={40}
                className={styles.avatar}
              />
            ) : (
              <div className={styles.avatarPlaceholder}>
                <span>{currentAppointment.doctorName.charAt(0)}</span>
              </div>
            )}
          </div>
          <div className={styles.appointmentInfo}>
            <h4 className={styles.doctorName}>{currentAppointment.doctorName}</h4>
            <p className={styles.appointmentDetails}>
              {currentAppointment.specialty} · {currentAppointment.room}
            </p>
          </div>
          <div className={styles.timeBadge}>
            <span>{currentAppointment.time}</span>
          </div>
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
              aria-label={`Go to appointment ${index + 1}`}
              type="button"
            />
          ))}
        </div>
      )}
    </div>
  );
}
