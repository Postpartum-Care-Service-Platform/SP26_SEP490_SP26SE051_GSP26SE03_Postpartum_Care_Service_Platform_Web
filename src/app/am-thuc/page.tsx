'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import menuService from '@/services/menu.service';
import type { Menu } from '@/types/menu';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

import styles from './am-thuc.module.css';

// Helper function để lấy icon theo loại món ăn
const getFoodTypeIcon = (foodType: string): string => {
  const lowerType = foodType.toLowerCase();
  if (lowerType.includes('cháo')) return '🍲';
  if (lowerType.includes('canh')) return '🥣';
  if (lowerType.includes('món mặn')) return '🍖';
  if (lowerType.includes('món xào')) return '🍳';
  if (lowerType.includes('tráng miệng')) return '🍰';
  return '🍽️';
};

// Helper function để lấy màu theo loại buổi
const getMenuTypeColor = (menuTypeName: string): string => {
  if (menuTypeName === 'Sáng') return '#FFB84D';
  if (menuTypeName === 'Trưa') return '#FF6B6B';
  if (menuTypeName === 'Tối') return '#4ECDC4';
  return '#FA8314';
};

// Carousel Component cho Menu Cards
const MenuCarousel = ({ 
  menus, 
  typeColor 
}: { 
  menus: Menu[]; 
  typeColor: string;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className={styles.carouselWrapper}>
      <button
        className={styles.carouselButton}
        onClick={() => scroll('left')}
        aria-label="Previous menu"
        style={{ borderColor: typeColor, color: typeColor }}
      >
        <ChevronLeft size={24} />
      </button>
      <div ref={scrollRef} className={styles.menusCarousel}>
        {menus.map((menu) => (
          <div key={menu.id} className={styles.menuCard}>
            <div className={styles.menuCardHeader}>
              <h3 className={styles.menuName}>{menu.menuName}</h3>
              {menu.description && (
                <p className={styles.menuDescription}>{menu.description}</p>
              )}
            </div>

            <FoodCarousel foods={menu.foods || []} />
          </div>
        ))}
      </div>
      <button
        className={styles.carouselButton}
        onClick={() => scroll('right')}
        aria-label="Next menu"
        style={{ borderColor: typeColor, color: typeColor }}
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

// Carousel Component cho Food Cards
const FoodCarousel = ({ foods }: { foods: Menu['foods'] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.6;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!foods || foods.length === 0) {
    return <p className={styles.noFoods}>Chưa có món ăn trong menu này</p>;
  }

  return (
    <div className={styles.foodCarouselWrapper}>
      <button
        className={styles.foodCarouselButton}
        onClick={() => scroll('left')}
        aria-label="Previous food"
      >
        <ChevronLeft size={20} />
      </button>
      <div ref={scrollRef} className={styles.foodsCarousel}>
        {foods.map((food) => (
          <div key={food.id} className={styles.foodCard}>
            <div className={styles.foodImageWrapper}>
              {food.imageUrl ? (
                <Image
                  src={food.imageUrl}
                  alt={food.name}
                  fill
                  className={styles.foodImage}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className={styles.foodImagePlaceholder}>
                  <span className={styles.foodIcon}>
                    {getFoodTypeIcon(food.foodType || food.type)}
                  </span>
                </div>
              )}
              <div className={styles.foodTypeBadge}>
                {food.foodType || food.type}
              </div>
            </div>

            <div className={styles.foodContent}>
              <h4 className={styles.foodName}>{food.name}</h4>
              {food.description && (
                <p className={styles.foodDescription}>{food.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      <button
        className={styles.foodCarouselButton}
        onClick={() => scroll('right')}
        aria-label="Next food"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default function AmThucPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        setLoading(true);
        const data = await menuService.getAllMenus();
        // Lọc chỉ lấy các menu đang active
        const activeMenus = data.filter((menu) => menu.isActive !== false);
        setMenus(activeMenus);
        setError(null);
      } catch (err) {
        console.error('Lỗi khi tải danh sách menu:', err);
        setError('Không thể tải danh sách menu. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, []);

  // Nhóm menu theo menuTypeName
  const groupedMenus = menus.reduce((acc, menu) => {
    const typeName = menu.menuTypeName;
    if (!acc[typeName]) {
      acc[typeName] = [];
    }
    acc[typeName].push(menu);
    return acc;
  }, {} as Record<string, Menu[]>);

  // Thứ tự hiển thị các buổi
  const menuTypeOrder = ['Sáng', 'Trưa', 'Tối'];

  return (
    <div className="app-shell__inner">
      <Header />
      <main className={`app-shell__main ${styles.main}`}>
        <section className={styles.amThucSection}>
          <div className={styles.container}>
            {/* Header với tiêu đề */}
            <div className={styles.header}>
              <h1 className={styles.title}>Thực Đơn Ẩm Thực</h1>
              <p className={styles.description}>
                Khám phá thực đơn đa dạng và bổ dưỡng được thiết kế đặc biệt cho mẹ sau sinh, 
                giúp phục hồi sức khỏe và tăng chất lượng sữa mẹ.
              </p>
            </div>

            {/* Loading state */}
            {loading && (
              <div className={styles.loading}>
                <div className={styles.spinner} />
                <p>Đang tải thực đơn...</p>
              </div>
            )}

            {/* Error state */}
            {error && <div className={styles.error}>{error}</div>}

            {/* Hiển thị menu theo từng buổi */}
            {!loading && !error && Object.keys(groupedMenus).length > 0 && (
              <div className={styles.menuGroups}>
                {menuTypeOrder.map((typeName) => {
                  const menusByType = groupedMenus[typeName];
                  if (!menusByType || menusByType.length === 0) return null;

                  const typeColor = getMenuTypeColor(typeName);

                  return (
                    <div key={typeName} className={styles.menuTypeSection}>
                      <div className={styles.menuTypeHeader} style={{ borderColor: typeColor }}>
                        <h2 className={styles.menuTypeTitle} style={{ color: typeColor }}>
                          {typeName}
                        </h2>
                        <div className={styles.menuTypeLine} style={{ backgroundColor: typeColor }} />
                      </div>

                      <MenuCarousel menus={menusByType} typeColor={typeColor} />
                    </div>
                  );
                })}
              </div>
            )}

            {/* Empty state */}
            {!loading && !error && Object.keys(groupedMenus).length === 0 && (
              <div className={styles.emptyState}>
                <p>Hiện tại chưa có thực đơn nào được cập nhật.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
