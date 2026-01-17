'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import packageService from '@/services/package.service';
import type { Package } from '@/types/package';

import styles from './PackagesSection.module.css';

export const PackagesSection: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [mousePositions, setMousePositions] = useState<{ [key: number]: { x: number; y: number } }>({});
  const cardRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

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

        {/* Grid hiển thị các gói dịch vụ */}
        {packages.length > 0 ? (
          <div className={styles.packagesGrid}>
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                ref={(el) => (cardRefs.current[pkg.id] = el)}
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
                {/* Hình ảnh gói dịch vụ */}
                {pkg.imageUrl && (
                  <div className={styles.imageWrapper}>
                    <Image
                      src={pkg.imageUrl}
                      alt={pkg.name}
                      fill
                      className={styles.image}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}

                {/* Nội dung card */}
                <div className={styles.cardContent}>
                  <h3 className={styles.packageName}>{pkg.name}</h3>

                  {pkg.description && (
                    <p className={styles.packageDescription}>{pkg.description}</p>
                  )}

                  {/* Danh sách tính năng */}
                  {pkg.features && pkg.features.length > 0 && (
                    <ul className={styles.featuresList}>
                      {pkg.features.map((feature, index) => (
                        <li key={index} className={styles.featureItem}>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Thông tin giá và thời gian */}
                  <div className={styles.packageInfo}>
                    {pkg.price && (
                      <div className={styles.price}>
                        <span className={styles.priceLabel}>Giá:</span>
                        <span className={styles.priceValue}>
                          {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                          }).format(pkg.price)}
                        </span>
                      </div>
                    )}

                    {pkg.duration && (
                      <div className={styles.duration}>
                        <span className={styles.durationLabel}>Thời gian:</span>
                        <span className={styles.durationValue}>{pkg.duration} ngày</span>
                      </div>
                    )}
                  </div>

                  {/* Nút xem chi tiết */}
                  <Link href={`/packages/${pkg.id}`} className={styles.viewDetailsButton}>
                    Xem Chi Tiết
                  </Link>
                </div>
              </div>
            ))}
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
