'use client';

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
  return (
    <section className={styles.videoBanner}>
      {/* Video background với autoplay */}
      <video
        className={styles.video}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
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
        </div>
      )}
    </section>
  );
};
