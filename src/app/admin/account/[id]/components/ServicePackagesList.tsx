'use client';

import { Package, Calendar, Clock, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import React from 'react';

import styles from './service-packages-list.module.css';

interface ServicePackage {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'pending';
  price: string;
  startDate: string;
  endDate: string;
  sessionsTotal: number;
  sessionsUsed: number;
  description: string;
}

interface ServicePackagesListProps {
  packages?: ServicePackage[];
  loading?: boolean;
}

export const ServicePackagesList: React.FC<ServicePackagesListProps> = ({ 
  packages = [], 
  loading 
}) => {
  if (loading) {
    return (
      <div className={styles.container}>
        <div style={{ textAlign: 'center', padding: '40px' }}>Đang tải thông tin gói dịch vụ...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Danh sách gói dịch vụ</h3>
        <span className={styles.count}>{packages.length} gói</span>
      </div>

      {packages.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <Package size={40} />
          </div>
          <h4 className={styles.emptyText}>Chưa có gói dịch vụ nào</h4>
          <p className={styles.emptySubtext}>
            Khách hàng này hiện chưa đăng ký bất kỳ gói dịch vụ chăm sóc nào tại The Joyful Nest.
          </p>
          <button className={styles.registerButton}>
            Đăng ký gói ngay
          </button>
        </div>
      ) : (
        <div className={styles.packagesGrid}>
          {packages.map((pkg) => (
            <div key={pkg.id} className={`${styles.packageCard} ${styles[pkg.status]}`}>
              <div className={styles.cardHeader}>
                <div className={styles.nameSection}>
                  <h4 className={styles.packageName}>{pkg.name}</h4>
                  <div className={styles.statusBadge}>
                    {pkg.status === 'active' && <Clock size={12} />}
                    {pkg.status === 'completed' && <CheckCircle2 size={12} />}
                    {pkg.status === 'pending' && <AlertCircle size={12} />}
                    <span>{pkg.status.charAt(0).toUpperCase() + pkg.status.slice(1)}</span>
                  </div>
                </div>
                <p className={styles.price}>{pkg.price}</p>
              </div>

              <p className={styles.description}>{pkg.description}</p>

              <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                  <Calendar size={14} className={styles.statIcon} />
                  <div className={styles.statInfo}>
                    <span className={styles.statLabel}>Thời gian</span>
                    <span className={styles.statValue}>{pkg.startDate} - {pkg.endDate}</span>
                  </div>
                </div>
                <div className={styles.statItem}>
                  <Package size={14} className={styles.statIcon} />
                  <div className={styles.statInfo}>
                    <span className={styles.statLabel}>Buổi thực hiện</span>
                    <span className={styles.statValue}>{pkg.sessionsUsed}/{pkg.sessionsTotal} buổi</span>
                  </div>
                </div>
              </div>

              <div className={styles.progressBarWrapper}>
                <div className={styles.progressLabel}>
                  <span>Tiến độ thực hiện</span>
                  <span>{Math.round((pkg.sessionsUsed / pkg.sessionsTotal) * 100)}%</span>
                </div>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill} 
                    style={{ width: `${(pkg.sessionsUsed / pkg.sessionsTotal) * 100}%` }} 
                  />
                </div>
              </div>

              <button className={styles.detailsButton}>
                Xem chi tiết
                <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
