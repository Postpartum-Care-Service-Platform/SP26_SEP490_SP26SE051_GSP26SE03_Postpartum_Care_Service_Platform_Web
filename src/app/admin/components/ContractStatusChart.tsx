'use client';

import { useState, useEffect } from 'react';
import statisticsService from '@/services/statistics.service';
import styles from './contract-status-chart.module.css';

type StatusDistribution = {
  status: string;
  count: number;
  percentage: number;
};

export const ContractStatusChart = () => {
  const [data, setData] = useState<StatusDistribution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await statisticsService.getContractStatusDistribution();
        if (Array.isArray(res)) {
          setData(res);
        }
      } catch (error) {
        console.error('Failed to fetch contract status distribution', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'signed':
      case 'completed':
        return '#fa8314'; // Brand Orange (Deep)
      case 'sent':
      case 'upcoming':
      case 'active':
        return '#ff9f43'; // Medium Orange
      case 'draft':
      case 'pending':
        return '#ffbe76'; // Light Orange
      case 'cancelled':
        return '#e0a681'; // Muted Orange
      default:
        return '#ffdfba'; // Very Light Orange
    }
  };

  const getStatusTranslation = (status: string) => {
    switch (status.toLowerCase()) {
      case 'signed': return 'Đã ký';
      case 'sent': return 'Đã gửi';
      case 'draft': return 'Bản nháp';
      case 'completed': return 'Hoàn thành';
      case 'pending': return 'Đang chờ';
      default: return status;
    }
  };

  if (loading) return <div className={styles.container}>Đang tải...</div>;

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>PHÂN BỔ TRẠNG THÁI HỢP ĐỒNG</h3>
      <div className={styles.chartArea}>
        {data.map((item, index) => (
          <div key={index} className={styles.row}>
            <div className={styles.labelContainer}>
              <span className={styles.statusLabel}>{item.status}</span>
              <span className={styles.translationLabel}>({getStatusTranslation(item.status)})</span>
            </div>
            <div className={styles.barWrapper}>
              <div 
                className={styles.bar} 
                style={{ 
                  width: `${item.percentage}%`, 
                  backgroundColor: getStatusColor(item.status) 
                }}
              >
                {item.percentage > 10 && (
                  <span className={styles.percentageInside}>{item.percentage}%</span>
                )}
              </div>
              {item.percentage <= 10 && (
                <span className={styles.percentageOutside}>{item.percentage}%</span>
              )}
            </div>
            <div className={styles.countContainer}>
              <span className={styles.countText}>{item.count}</span>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.footer}>
        <p className={styles.summaryText}>
          Tỷ lệ ký kết thành công: {data.find(d => d.status.toLowerCase() === 'signed')?.percentage || 0}%
        </p>
      </div>
    </div>
  );
};
