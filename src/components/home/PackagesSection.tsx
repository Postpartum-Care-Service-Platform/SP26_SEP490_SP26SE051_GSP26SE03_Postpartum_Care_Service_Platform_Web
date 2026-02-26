'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState, useRef } from 'react';

import packageService from '@/services/package.service';
import type { Package } from '@/types/package';

import styles from './PackagesSection.module.css';

export const PackagesSection: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [mousePositions, setMousePositions] = useState<{ [key: number]: { x: number; y: number } }>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const carouselRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Số lượng gói hiển thị mỗi lần
  const itemsPerPage = 3;

  useEffect(() => {
    // Fetch danh sách packages từ API
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const data = await packageService.getAllPackages();
        // Lọc chỉ lấy các package đang active (nếu có field isActive)
        const activePackages = data.filter((pkg) => pkg.isActive !== false);
        setPackages(activePackages);
        setError(null);
      } catch (err) {
        console.error('Lỗi khi tải danh sách gói dịch vụ:', err);
        setError('Không thể tải danh sách dịch vụ. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  // Xử lý mouse move để di chuyển hình tròn theo chuột
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, cardId: number) => {
    const card = cardRefs.current[cardId];
    if (card) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePositions((prev) => ({
        ...prev,
        [cardId]: { x, y },
      }));
    }
  };

  const handleMouseEnter = (cardId: number) => {
    setHoveredCard(cardId);
  };

  const handleMouseLeave = () => {
    setHoveredCard(null);
  };

  // Tính toán số trang
  const totalPages = Math.ceil(packages.length / itemsPerPage);

  // Xử lý chuyển trang trước
  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  // Xử lý chuyển trang sau
  const handleNext = () => {
    setCurrentIndex((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  // Lấy các gói hiển thị cho trang hiện tại
  const getVisiblePackages = () => {
    const start = currentIndex * itemsPerPage;
    const end = start + itemsPerPage;
    return packages.slice(start, end);
  };

  if (loading) {
    return (
      <section className={styles.packagesSection}>
        <div className={styles.container}>
          <div className={styles.loading}>Đang tải dịch vụ...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.packagesSection}>
        <div className={styles.container}>
          <div className={styles.error}>{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.packagesSection}>
      <div className={styles.container}>
        {/* Tiêu đề phần dịch vụ */}
        <div className={styles.header}>
          <h2 className={styles.title}>Các Gói Dịch Vụ Chăm Sóc</h2>
          <p className={styles.description}>
            Chúng tôi cung cấp các gói dịch vụ toàn diện, được thiết kế đặc biệt để hỗ trợ mẹ và
            bé trong những ngày đầu quan trọng nhất.
          </p>
        </div>

        {/* Carousel hiển thị các gói dịch vụ */}
        {packages.length > 0 ? (
          <div className={styles.carouselContainer}>
            {/* Nút điều hướng trái */}
            {packages.length > itemsPerPage && (
              <button
                type="button"
                className={styles.navButton}
                onClick={handlePrevious}
                aria-label="Xem gói trước"
              >
                <ChevronLeft size={32} />
              </button>
            )}

            {/* Container carousel */}
            <div className={styles.carouselWrapper} ref={carouselRef}>
              <div
                ref={trackRef}
                className={styles.carouselTrack}
                style={{
                  transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`,
                }}
              >
                {packages.map((pkg) => (
              <div
                key={pkg.id}
                ref={(el) => {
                  cardRefs.current[pkg.id] = el;
                }}
                className={styles.packageCard}
                onMouseMove={(e) => handleMouseMove(e, pkg.id)}
                onMouseEnter={() => handleMouseEnter(pkg.id)}
                onMouseLeave={handleMouseLeave}
              >
                {/* Hình tròn màu cam di chuyển theo chuột */}
                {hoveredCard === pkg.id && mousePositions[pkg.id] && (
                  <div
                    className={styles.hoverCircle}
                    style={{
                      left: `${mousePositions[pkg.id].x}px`,
                      top: `${mousePositions[pkg.id].y}px`,
                    }}
                  />
                )}
                {/* Nội dung card */}
                <div className={styles.cardContent}>
                  {/* Header với tên gói và badge duration */}
                  <div className={styles.cardHeader}>
                    <h3 className={styles.packageName}>{pkg.packageName}</h3>
                    {pkg.durationDays && (
                      <div className={styles.durationBadge}>
                        <span className={styles.durationText}>{pkg.durationDays} ngày</span>
                      </div>
                    )}
                  </div>

                  {/* Mô tả gói dịch vụ */}
                  {pkg.description && pkg.description.trim() && (
                    <div className={styles.descriptionSection}>
                      <p className={styles.packageDescription}>{pkg.description}</p>
                    </div>
                  )}

                  {/* Phần giá - nổi bật */}
                  <div className={styles.priceSection}>
                    <div className={styles.priceLabel}>Giá gói</div>
                    <div className={styles.priceValue}>
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      }).format(pkg.basePrice)}
                    </div>
                  </div>

                  {/* Nút đặt gói dịch vụ */}
                  <Link href={`/main/booking?packageId=${pkg.id}`} className={styles.viewDetailsButton}>
                    <span>Đặt Ngay</span>
                    <span className={styles.buttonArrow}>→</span>
                  </Link>
                </div>
              </div>
                ))}
              </div>
            </div>

            {/* Nút điều hướng phải */}
            {packages.length > itemsPerPage && (
              <button
                type="button"
                className={styles.navButton}
                onClick={handleNext}
                aria-label="Xem gói sau"
              >
                <ChevronRight size={32} />
              </button>
            )}

            {/* Dots indicator (optional) */}
            {packages.length > itemsPerPage && totalPages > 1 && (
              <div className={styles.dotsIndicator}>
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`${styles.dot} ${index === currentIndex ? styles.dotActive : ''}`}
                    onClick={() => setCurrentIndex(index)}
                    aria-label={`Chuyển đến trang ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>Hiện tại chưa có gói dịch vụ nào.</p>
          </div>
        )}
      </div>
    </section>
  );
};
