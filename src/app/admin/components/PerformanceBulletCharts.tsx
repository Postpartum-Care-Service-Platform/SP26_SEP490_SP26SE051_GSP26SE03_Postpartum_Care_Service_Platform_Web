'use client';

import { useState, useEffect } from 'react';
import statisticsService from '@/services/statistics.service';
import styles from './performance-bullet-charts.module.css';

type BulletItem = {
  label: string;
  subLabel: string;
  currentValue: number;
  lastMonthValue: number;
  targetValue: number;
  maxValue: number;
  unit: string;
  percentage?: number; // New field for tooltip
};

export const PerformanceBulletCharts = () => {
  const [data, setData] = useState<BulletItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Fetching KPI data...');

        // Helper to wrap API calls safely
        const safeFetch = async (apiCall: Promise<any>) => {
          try {
            return await apiCall;
          } catch (e) {
            console.error('API call failed:', e);
            return null;
          }
        };

        const [contractsRes] = await Promise.all([
          safeFetch(statisticsService.getContractStatusDistribution())
        ]);

        console.log('KPI Data results:', { contractsRes });

        const kpis: BulletItem[] = [];

        // 1. Contracts (Only show statuses with data)
        if (Array.isArray(contractsRes)) {
          const maxStatusCount = Math.max(...contractsRes.map(item => item.count), 10);
          
          const statusTranslations: Record<string, string> = {
            'draft': 'Hợp đồng (Bản nháp)',
            'sent': 'Hợp đồng (Đã gửi)',
            'signed': 'Hợp đồng (Đã ký)',
            'cancelled': 'Hợp đồng (Bị hủy)',
            'printed': 'Hợp đồng (Đã in)'
          };

          // Show all statuses from the API
          contractsRes
            .forEach(item => {
              const statusKey = item.status.toLowerCase();
              kpis.push({
                label: statusTranslations[statusKey] || `Hợp đồng (${item.status})`,
                subLabel: 'Tổng số lượt',
                currentValue: item.count,
                lastMonthValue: -1, // Flag to hide comparison bar
                targetValue: -1,     // Flag to hide target line
                maxValue: Math.max(maxStatusCount, 10),
                unit: '',
                percentage: item.percentage // Storing the percentage
              });
            });
        }

        console.log('Final KPIs populated:', kpis);
        setData(kpis);
      } catch (error) {
        console.error('Unexpected error in PerformanceBulletCharts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>PHÂN BỐ TRẠNG THÁI HỢP ĐỒNG</h3>
      </div>

      <div className={styles.chartList}>
        {data.length === 0 ? (
          <div className={styles.noData}>Không có dữ liệu hiển thị</div>
        ) : (
          data.map((item, index) => {
            const currentPercent = Math.min((item.currentValue / (item.maxValue || 1)) * 100, 100);
            const lastMonthPercent = Math.min((item.lastMonthValue / (item.maxValue || 1)) * 100, 100);
            const targetPercent = Math.min((item.targetValue / (item.maxValue || 1)) * 100, 100);

            return (
              <div key={index} className={styles.chartRow}>
                <div className={styles.labelSection}>
                  <span className={styles.mainLabel}>{item.label}</span>
                  <span className={styles.subLabel}>{item.subLabel}</span>
                </div>

                <div className={styles.barSection}>
                  <div className={styles.track}>
                    {/* Qualitative Ranges (Background layers) */}
                    <div className={styles.rangeGood}></div>
                    <div className={styles.rangeAverage}></div>
                    
                    {/* Last Month Measure */}
                    {item.lastMonthValue > 0 && (
                      <div 
                        className={styles.barLastMonth} 
                        style={{ width: `${lastMonthPercent}%` }}
                      ></div>
                    )}

                    {/* Primary Measure (Current) */}
                    <div 
                      className={styles.barCurrent} 
                      style={{ width: `${currentPercent}%` }}
                    >
                      {item.percentage !== undefined && (
                        <div className={styles.tooltip}>
                          {item.percentage}%
                        </div>
                      )}
                    </div>

                    {/* Comparative Marker (Target) */}
                    {item.targetValue >= 0 && (
                      <div 
                        className={styles.targetLine} 
                        style={{ left: `${targetPercent}%` }}
                      ></div>
                    )}
                  </div>

                  {/* Axis Labels */}
                  <div className={styles.axis}>
                    <span>0</span>
                    <span>{Math.round(item.maxValue / 2)}{item.unit}</span>
                    <span>{item.maxValue}{item.unit}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
