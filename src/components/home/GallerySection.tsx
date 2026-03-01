'use client';

import Image from 'next/image';
import React from 'react';

import babyImage from '@/assets/images/gallery/baby.webp';
import foodImage from '@/assets/images/gallery/food.avif';
import momentImage from '@/assets/images/gallery/moment.avif';
import room2Image from '@/assets/images/gallery/room-2.avif';
import roomImage from '@/assets/images/gallery/room.jpg';

import styles from './GallerySection.module.css';

export const GallerySection: React.FC = () => {
  // Danh sách các khoảng khắc gia đình
  const galleryItems = [
    {
      id: 1,
      image: roomImage,
      alt: 'Phòng nghỉ sang trọng',
      title: 'Không gian nghỉ ngơi',
    },
    {
      id: 2,
      image: foodImage,
      alt: 'Ẩm thực dinh dưỡng',
      title: 'Bữa ăn đầy đủ chất',
    },
    {
      id: 3,
      image: momentImage,
      alt: 'Khoảng khắc đáng nhớ',
      title: 'Những khoảnh khắc',
    },
    {
      id: 4,
      image: room2Image,
      alt: 'Phòng nghỉ hiện đại',
      title: 'Tiện nghi hiện đại',
    },
    {
      id: 5,
      image: babyImage,
      alt: 'Bé yêu',
      title: 'Bé yêu khỏe mạnh',
    },
  ];

  return (
    <section className={styles.gallerySection}>
      <div className={styles.container}>
        {/* Tiêu đề section */}
        <div className={styles.header}>
          <h2 className={styles.title}>Những Khoảng Khắc Gia Đình</h2>
          <p className={styles.description}>
            Lưu giữ những khoảnh khắc đáng nhớ trong hành trình chăm sóc mẹ và bé tại The Joyful
            Nest
          </p>
        </div>

        {/* Grid gallery */}
        <div className={styles.galleryGrid}>
          {galleryItems.map((item, index) => (
            <div
              key={item.id}
              className={`${styles.galleryItem} ${index === 0 ? styles.featured : ''}`}
            >
              <div className={styles.imageWrapper}>
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  className={styles.image}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  loading="lazy"
                />
                {/* Overlay màu đen từ trái qua phải */}
                <div className={styles.blackOverlay} />
                {/* Overlay với title */}
                <div className={styles.overlay}>
                  <h3 className={styles.itemTitle}>{item.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
