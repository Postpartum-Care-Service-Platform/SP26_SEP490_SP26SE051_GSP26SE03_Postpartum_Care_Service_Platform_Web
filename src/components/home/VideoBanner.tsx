'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import styles from './VideoBanner.module.css';

interface VideoBannerProps {
  videoSrc?: string;
  title?: string;
  subtitle?: string;
}

export const VideoBanner: React.FC<VideoBannerProps> = ({
  videoSrc = '/herobanner.mp4',
  title,
  subtitle,
}) => {
  const router = useRouter();

  // Hàm scroll đến section tư vấn
  const handleScrollToConsultation = () => {
    const consultationSection = document.getElementById('tu-van');
    if (consultationSection) {
      consultationSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Hàm navigate đến trang booking
  const handleNavigateToBooking = () => {
    router.push('/main/booking');
  };

  return (
    <section className={styles.videoBanner}>
      {/* Video background với autoplay - Tối ưu loading với preload metadata */}
      <video
        className={styles.video}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-label="Video banner dịch vụ chăm sóc mẹ sau sinh"
      >
        <source src={videoSrc} type="video/mp4" />
        {/* Fallback nếu trình duyệt không hỗ trợ video */}
        Trình duyệt của bạn không hỗ trợ video.
      </video>

      {/* Overlay để làm tối video một chút để text dễ đọc hơn */}
      <div className={styles.overlay} />

      {/* Nội dung text trên video */}
      {(title || subtitle) && (
        <div className={styles.content}>
          {title && <h1 className={styles.title}>{title}</h1>}
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          
          {/* Container cho các nút CTA */}
          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={handleScrollToConsultation}
              className={`${styles.ctaButton} ${styles.primaryButton}`}
              aria-label="Đặt lịch tư vấn"
            >
              Đặt Lịch Tư Vấn
            </button>
            <button
              type="button"
              onClick={handleNavigateToBooking}
              className={`${styles.ctaButton} ${styles.secondaryButton}`}
              aria-label="Đặt gói dịch vụ"
            >
              Đặt Gói
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
