'use client';

import Image from 'next/image';

import styles from './top-doctors.module.css';

type Doctor = {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  avatar?: string;
};

type TopDoctorsProps = {
  doctors?: Doctor[];
};

const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Emma Watson',
    specialty: 'Cardiologist',
    rating: 4.9,
  },
  {
    id: '2',
    name: 'Dr. Olivia Green',
    specialty: 'Dermatologist',
    rating: 4.5,
  },
  {
    id: '3',
    name: 'Dr. Ethan Carter',
    specialty: 'Cardiologist',
    rating: 4.9,
  },
  {
    id: '4',
    name: 'Dr. William Brown',
    specialty: 'Pediatrician',
    rating: 4.8,
  },
  {
    id: '5',
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiology',
    rating: 4.7,
  },
];

export function TopDoctors({ doctors = mockDoctors }: TopDoctorsProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Top Doctors</h3>
        <a href="#" className={styles.seeAllLink}>
          See All <span className={styles.arrow}>→</span>
        </a>
      </div>
      <div className={styles.body}>
        {doctors.map((doctor) => (
          <div key={doctor.id} className={styles.doctorItem}>
            <div className={styles.avatarContainer}>
              {doctor.avatar ? (
                <Image
                  src={doctor.avatar}
                  alt={doctor.name}
                  width={40}
                  height={40}
                  className={styles.avatar}
                />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  <span>{doctor.name.charAt(0)}</span>
                </div>
              )}
            </div>
            <div className={styles.doctorInfo}>
              <h4 className={styles.doctorName}>{doctor.name}</h4>
              <p className={styles.specialty}>{doctor.specialty}</p>
            </div>
            <div className={styles.ratingBadge}>
              <span className={styles.star}>★</span>
              <span className={styles.rating}>{doctor.rating}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
