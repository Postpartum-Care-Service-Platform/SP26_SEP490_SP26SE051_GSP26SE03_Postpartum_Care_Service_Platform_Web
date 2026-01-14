'use client';

import React from 'react';
import Image from 'next/image';

import earthImage from '@/assets/images/home/home-earth.avif';
import jupiterImage from '@/assets/images/home/home-jupiter-2.avif';
import rocketImage from '@/assets/images/home/home-rocket.avif';
import saturnImage from '@/assets/images/home/home-saturn.avif';

import { AppointmentForm } from './AppointmentForm';

import styles from './IntroductionSection.module.css';

export const IntroductionSection: React.FC = () => {
  return (
    <section className={styles.introduction}>
      <div className={styles.container}>
        {/* Tiêu đề phần giới thiệu */}
        <div className={styles.header}>
          <h2 className={styles.title}>Đặt Lịch Tư Vấn & Tham Quan</h2>
          <p className={styles.description}>
          Hãy điền thông tin để chúng tôi có thể liên hệ và sắp xếp lịch hẹn phù hợp nhất cho bạn.
          </p>
        </div>

        {/* Container cho không gian vũ trụ */}
        <div className={styles.spaceContainer}>
          {/* Form đặt lịch ở giữa */}
          <div className={styles.formCenter}>
            <AppointmentForm />
          </div>

          {/* Các hành tinh ở vị trí ngẫu nhiên với z-index cao */}
          {/* Trái Đất */}
          <div className={`${styles.planet} ${styles.planetEarth}`}>
            <Image
              src={earthImage}
              alt="Trái Đất - Không gian phát triển cho bé"
              width={150}
              height={150}
              className={styles.planetImage}
            />
          </div>

          {/* Sao Mộc */}
          <div className={`${styles.planet} ${styles.planetJupiter}`}>
            <Image
              src={jupiterImage}
              alt="Sao Mộc - Không gian phát triển cho bé"
              width={180}
              height={180}
              className={styles.planetImage}
            />
          </div>

          {/* Sao Thổ */}
          <div className={`${styles.planet} ${styles.planetSaturn}`}>
            <Image
              src={saturnImage}
              alt="Sao Thổ - Không gian phát triển cho bé"
              width={160}
              height={160}
              className={styles.planetImage}
            />
          </div>

          {/* Tên lửa với hiệu ứng lửa */}
          <div className={styles.rocketContainer}>
            <div className={styles.rocketWrapper}>
              {/* Hiệu ứng lửa phía sau tên lửa */}
              <div className={styles.fireEffect}>
                <div className={styles.fire1} />
                <div className={styles.fire2} />
                <div className={styles.fire3} />
              </div>
              <Image
                src={rocketImage}
                alt="Tên lửa - Không gian phát triển cho bé"
                width={200}
                height={300}
                className={styles.rocketImage}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
