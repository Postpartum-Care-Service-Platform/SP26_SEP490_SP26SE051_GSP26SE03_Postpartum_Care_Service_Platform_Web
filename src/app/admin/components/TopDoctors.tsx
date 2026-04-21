'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './top-doctors.module.css';
import statisticsService from '@/services/statistics.service';

interface Staff {
  staffId: string;
  staffName: string;
  avatar?: string;
  avgRating: number | null;
  totalFeedback: number;
  totalRevenue: number;
}

export function TopDoctors() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await statisticsService.getBestRatedStaff({ limit: 5 });
        // API trả về obj có field staff là array
        setStaffList(response.staff || []);
      } catch (error) {
        console.error('Failed to fetch top staff', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Nhân viên xuất sắc</h3>
        <a href="#" className={styles.seeAllLink}>
          Tất cả <span className={styles.arrow}>→</span>
        </a>
      </div>
      <div className={styles.body}>
        {loading ? (
          <div className={styles.loadingState}>Đang tải...</div>
        ) : staffList.length > 0 ? (
          staffList.map((staff) => (
            <div key={staff.staffId} className={styles.doctorItem}>
              <div className={styles.avatarContainer}>
                {staff.avatar ? (
                  <Image
                    src={staff.avatar}
                    alt={staff.staffName}
                    width={44}
                    height={44}
                    className={styles.avatar}
                    onError={(e) => {
                      // Fallback if image fails to load
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className={styles.avatarPlaceholder}>
                    <span>{staff.staffName.charAt(0).toUpperCase()}</span>
                  </div>
                )}
              </div>
              <div className={styles.doctorInfo}>
                <h4 className={styles.doctorName}>{staff.staffName}</h4>
                <div className={styles.metaRow}>
                  <p className={styles.specialty}>{staff.totalFeedback} đánh giá</p>
                  <div className={styles.revenueBadge}>
                    {staff.totalRevenue.toLocaleString('vi-VN')}₫
                  </div>
                </div>
              </div>
              <div className={styles.ratingBadge}>
                <span className={styles.star}>★</span>
                <span className={styles.rating}>
                  {staff.avgRating ? staff.avgRating.toFixed(1) : '0.0'}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>Chưa có dữ liệu nhân viên</div>
        )}
      </div>
    </div>
  );
}
