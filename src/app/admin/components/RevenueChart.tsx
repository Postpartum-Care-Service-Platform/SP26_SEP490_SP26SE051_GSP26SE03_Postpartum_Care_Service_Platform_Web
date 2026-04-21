'use client';

import React, { useState, useEffect, useRef } from 'react';
import { format, endOfMonth } from 'date-fns';
import { DateRange } from 'react-day-picker';
import styles from './revenue-chart.module.css';
import statisticsService from '@/services/statistics.service';
import { DatePickerWithRange } from './DateRangePicker';

interface RevenueGrowthItem {
  month: string;
  newUserRevenue: number;
  existingUserRevenue: number;
  newUserCount: number;
  existingUserCount: number;
}

export const RevenueChart = () => {
  const [hoveredMonthIndex, setHoveredMonthIndex] = useState<number | null>(null);
  const [data, setData] = useState<RevenueGrowthItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ currentRevenue: 0 });
  const [tooltipData, setTooltipData] = useState<{ x: number, y: number, data: RevenueGrowthItem } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleDateText, setVisibleDateText] = useState("");

  const currentYear = new Date().getFullYear();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(currentYear - 5, 0, 1),
    to: new Date(currentYear + 10, 11, 31),
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = dateRange?.from && dateRange?.to ? {
        startDate: format(dateRange.from, 'yyyy-MM-dd'),
        endDate: format(dateRange.to, 'yyyy-MM-dd')
      } : undefined;

      const [growthRes, overviewRes] = await Promise.all([
        statisticsService.getRevenueGrowth(params),
        statisticsService.getRevenueOverview({
          period: 'month',
          ...params
        })
      ]);

      // Ensure all values are actual numbers
      const sanitizedGrowth = (growthRes || []).map((item: any) => ({
        ...item,
        newUserRevenue: Number(item.newUserRevenue || 0),
        existingUserRevenue: Number(item.existingUserRevenue || 0)
      }));

      setData(sanitizedGrowth);
      setStats({
        currentRevenue: Number(overviewRes?.currentRevenue || 0)
      });
    } catch (error) {
      console.error('Failed to fetch revenue data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setTooltipData(null); 
    if (!data.length) return;
    const scrollLeft = e.currentTarget.scrollLeft;
    const containerWidth = e.currentTarget.clientWidth;
    
    const colWidth = 36;
    const startIndex = Math.floor(scrollLeft / colWidth);
    const endIndex = Math.min(Math.floor((scrollLeft + containerWidth) / colWidth), data.length - 1);
    
    if (data[startIndex] && data[endIndex]) {
      const startParts = data[startIndex].month.split('-');
      const endParts = data[endIndex].month.split('-');
      setVisibleDateText(`${startParts[1]}/${startParts[0]} - ${endParts[1]}/${endParts[0]}`);
    }
  };

  useEffect(() => {
    if (data.length > 0 && !visibleDateText) {
      const startParts = data[0].month.split('-');
      const endParts = data[Math.min(10, data.length - 1)].month.split('-');
      setVisibleDateText(`${startParts[1]}/${startParts[0]} - ${endParts[1]}/${endParts[0]}`);
    }
  }, [data, visibleDateText]);

  const range = (n: number) => Array.from({ length: n }, (_, i) => i);
  
  // Refined scaling logic
  const maxMonthlyRevenue = Math.max(...data.map(m => m.newUserRevenue + m.existingUserRevenue), 1000);
  const MAX_BLOCKS = 20;
  
  // Calculate a cleaner Y-Axis max that provides better cube resolution
  const yAxisMax = maxMonthlyRevenue > 0 
    ? Math.ceil(maxMonthlyRevenue * 1.1 / 10000) * 10000 
    : 100000;
  
  const valuePerBlock = yAxisMax / MAX_BLOCKS;

  const yAxisSteps = [yAxisMax, yAxisMax * 0.8, yAxisMax * 0.6, yAxisMax * 0.4, yAxisMax * 0.2, 0];

  const renderCurrencyLabel = (val: number) => {
    if (val === 0) return <>{val}<span className={styles.yLabelSuffix}></span></>;
    return <>{val / 1000}<span className={styles.yLabelSuffix}>k</span></>;
  };

  const formatCurrencyLabel = (val: number) => {
    if (val === 0) return '0';
    if (val >= 1000000) return `${(val / 1000000).toFixed(1).replace('.0', '')}tr`;
    return `${Math.round(val / 1000)}k`;
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.titleText}>Tổng doanh thu</span>
          <span className={styles.titleValue}>
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats.currentRevenue)}
          </span>
        </div>

        <div className={styles.legendGroup}>
          <div className={styles.legendItem}>
            <span className={styles.legendIconNew}>+</span>
            <span className={styles.legendText}>NGƯỜI DÙNG CŨ</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendIconExist}></span>
            <span className={styles.legendText}>NGƯỜI DÙNG MỚI</span>
          </div>
        </div>

        <div className={styles.tabGroup}>
          <DatePickerWithRange date={dateRange} setDate={setDateRange} displayValue={visibleDateText} />
        </div>
      </div>

      <div className={styles.chartWrapper}>
        <div className={styles.yAxis}>
          {yAxisSteps.map((v, i) => (
            <div key={i} className={styles.yLabelRow}>
              <span className={styles.yLabelText}>{renderCurrencyLabel(v)}</span>
              <div className={styles.yDashedLine} />
            </div>
          ))}
        </div>

        <div 
          className={styles.chartArea} 
          ref={scrollRef} 
          onScroll={handleScroll} 
          onMouseLeave={() => {
            setHoveredMonthIndex(null);
            setTooltipData(null);
          }}
        >
          {loading ? (
            <div className={styles.loadingOverlay}>Đang cập nhật...</div>
          ) : data.length > 0 ? (
            data.map((monthData, mIndex) => {
              const isHovered = hoveredMonthIndex === mIndex;
              return (
                <div
                  key={monthData.month}
                  className={`${styles.column} ${isHovered ? styles.hoverActive : ''}`}
                  onMouseEnter={(e) => {
                    setHoveredMonthIndex(mIndex);
                    const rect = e.currentTarget.getBoundingClientRect();
                    const containerRect = containerRef.current?.getBoundingClientRect();
                    if (containerRect) {
                      setTooltipData({
                        x: rect.left - containerRect.left + rect.width / 2,
                        y: rect.top - containerRect.top,
                        data: monthData
                      });
                    }
                  }}
                >
                  <div className={styles.weeksContainer}>
                    {range(4).map(wIndex => (
                      <div key={wIndex} className={styles.weekColumn}>
                        {monthData.newUserRevenue + monthData.existingUserRevenue > 0 && range(MAX_BLOCKS).map(bIndex => {
                          const reverseIndex = MAX_BLOCKS - 1 - bIndex;
                          const blockThreshold = reverseIndex * valuePerBlock;
                          
                          const existRev = monthData.existingUserRevenue;
                          const newRev = monthData.newUserRevenue;
                          const totalRev = existRev + newRev;

                          let blockClass = styles.blockEmpty;
                          if (blockThreshold < existRev) {
                            blockClass = styles.blockExist;
                          } else if (blockThreshold < totalRev) {
                            blockClass = styles.blockNew;
                          }

                          if (blockClass === styles.blockEmpty) return null;

                          return (
                             <div 
                               key={bIndex} 
                               className={`${styles.block} ${blockClass}`} 
                             />
                          );
                        })}
                      </div>
                    ))}
                  </div>

                  <div className={styles.xLabel}>
                    {monthData.month.split('-')[1] === '01' 
                      ? `01/${monthData.month.split('-')[0]}` 
                      : parseInt(monthData.month.split('-')[1])}
                  </div>
                </div>
              );
            })
          ) : (
            <div className={styles.noData}>Không có dữ liệu</div>
          )}
        </div>

        {tooltipData && (
          <div 
            className={styles.tooltip} 
            style={{ 
              left: `${tooltipData.x}px`, 
              top: `${tooltipData.y}px`,
              position: 'absolute',
              pointerEvents: 'none'
            }}
          >
            <div className={styles.tooltipMonth}>{tooltipData.data.month}</div>
            <div className={styles.tooltipRow}>
              <span className={styles.tooltipIconNew}>+</span>
              <span className={styles.tooltipLabel}>Người dùng cũ</span>
              <span className={styles.tooltipDesc}>{formatCurrencyLabel(tooltipData.data.existingUserRevenue)}</span>
            </div>
            <div className={styles.tooltipRow}>
              <span className={styles.tooltipIconExist}></span>
              <span className={styles.tooltipLabel}>Người dùng mới</span>
              <span className={styles.tooltipDesc}>{formatCurrencyLabel(tooltipData.data.newUserRevenue)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
