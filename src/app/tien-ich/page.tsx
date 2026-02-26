'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';

import babyImage from '@/assets/images/gallery/baby.webp';
import foodImage from '@/assets/images/gallery/food.avif';
import momentImage from '@/assets/images/gallery/moment.avif';
import room2Image from '@/assets/images/gallery/room-2.avif';
import roomImage from '@/assets/images/gallery/room.jpg';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import amenityService from '@/services/amenity-service.service';
import type { AmenityService } from '@/types/amenity-service';

import styles from './tien-ich.module.css';

// Mapping ảnh cho các tiện ích (có thể mở rộng)
const amenityImages = [
  roomImage,
  foodImage,
  momentImage,
  room2Image,
  babyImage,
  roomImage,
  foodImage,
  momentImage,
];

// Icon mapping cho các tiện ích phổ biến
const getAmenityIcon = (name: string): string => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('spa') || lowerName.includes('massage')) return '💆';
  if (lowerName.includes('gym') || lowerName.includes('thể dục')) return '💪';
  if (lowerName.includes('pool') || lowerName.includes('bơi')) return '🏊';
  if (lowerName.includes('restaurant') || lowerName.includes('nhà hàng')) return '🍽️';
  if (lowerName.includes('library') || lowerName.includes('thư viện')) return '📚';
  if (lowerName.includes('playground') || lowerName.includes('sân chơi')) return '🎮';
  if (lowerName.includes('parking') || lowerName.includes('đỗ xe')) return '🅿️';
  if (lowerName.includes('wifi') || lowerName.includes('internet')) return '📶';
  if (lowerName.includes('yoga') || lowerName.includes('thiền')) return '🧘';
  if (lowerName.includes('care') || lowerName.includes('chăm sóc')) return '👶';
  return '✨';
};

export default function TienIchPage() {
  const [amenities, setAmenities] = useState<AmenityService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        setLoading(true);
        const data = await amenityService.getAllAmenityServices();
        // Lọc chỉ lấy các tiện ích đang active
        const activeAmenities = data.filter((amenity) => amenity.isActive !== false);
        setAmenities(activeAmenities);
        setError(null);
      } catch (err) {
        console.error('Lỗi khi tải danh sách tiện ích:', err);
        setError('Không thể tải danh sách tiện ích. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchAmenities();
  }, []);

  return (
    <div className="app-shell__inner">
      <Header />
      <main className={`app-shell__main ${styles.main}`}>
        <section className={styles.tienIchSection}>
          <div className={styles.container}>
            {/* Header với tiêu đề */}
            <div className={styles.header}>
              <h1 className={styles.title}>Tiện Ích Tại Trung Tâm</h1>
              <p className={styles.description}>
                Khám phá các tiện ích đẳng cấp được thiết kế để mang lại trải nghiệm tuyệt vời cho
                mẹ và bé trong suốt thời gian lưu trú tại The Joyful Nest.
              </p>
            </div>

            {/* Loading state */}
            {loading && (
              <div className={styles.loading}>
                <div className={styles.spinner} />
                <p>Đang tải danh sách tiện ích...</p>
              </div>
            )}

            {/* Error state */}
            {error && <div className={styles.error}>{error}</div>}

            {/* Grid hiển thị các tiện ích */}
            {!loading && !error && amenities.length > 0 && (
              <div className={styles.amenitiesGrid}>
                {amenities.map((amenity, index) => {
                  const imageIndex = index % amenityImages.length;
                  const amenityImage = amenityImages[imageIndex];
                  return (
                    <div key={amenity.id} className={styles.amenityCard}>
                      {/* Hình ảnh tiện ích */}
                      <div className={styles.imageWrapper}>
                        <Image
                          src={amenityImage}
                          alt={amenity.name}
                          fill
                          className={styles.image}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        {/* Icon overlay */}
                        <div className={styles.iconOverlay}>
                          <span className={styles.icon}>{getAmenityIcon(amenity.name)}</span>
                        </div>
                        {/* Overlay màu đen từ trái qua phải khi hover */}
                        <div className={styles.overlay}>
                          <div className={styles.overlayContent}>
                            <span className={styles.overlayIcon}>{getAmenityIcon(amenity.name)}</span>
                            <p className={styles.overlayText}>Khám phá ngay</p>
                          </div>
                        </div>
                      </div>

                    {/* Nội dung card */}
                    <div className={styles.cardContent}>
                      <h3 className={styles.amenityName}>{amenity.name}</h3>
                      {amenity.description && (
                        <p className={styles.amenityDescription}>{amenity.description}</p>
                      )}
                    </div>
                  </div>
                  );
                })}
              </div>
            )}

            {/* Empty state */}
            {!loading && !error && amenities.length === 0 && (
              <div className={styles.emptyState}>
                <p>Hiện tại chưa có tiện ích nào được cập nhật.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
