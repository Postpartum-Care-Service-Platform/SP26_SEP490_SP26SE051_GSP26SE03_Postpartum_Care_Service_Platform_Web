'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import styles from './service-popularity.module.css';
import statisticsService from '@/services/statistics.service';
import { 
  startOfMonth, endOfMonth, 
  startOfQuarter, endOfQuarter, 
  format 
} from 'date-fns';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown';

interface PackageStat {
  packageId: number;
  packageName: string;
  bookingCount: number;
  totalRevenue: number;
  color?: string;
}

const COLORS = ['#fa8314', '#A47BC8', '#099335', '#F5D178', '#3b82f6'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className={styles.chartTooltip}>
        <div className={styles.tooltipName}>{data.packageName}</div>
        <div className={styles.tooltipDetails}>
          {data.bookingCount} đơn ({data.totalRevenue.toLocaleString('vi-VN')}đ)
        </div>
      </div>
    );
  }
  return null;
};

export const ServicePopularityChart = () => {
  const [data, setData] = useState<PackageStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'month' | 'quarter' | 'all'>('all');

  const fetchPopularServices = useCallback(async () => {
    try {
      setLoading(true);
      let startDate: string | undefined;
      let endDate: string | undefined;

      const now = new Date();
      if (filter === 'month') {
        startDate = format(startOfMonth(now), 'yyyy-MM-dd');
        endDate = format(endOfMonth(now), 'yyyy-MM-dd');
      } else if (filter === 'quarter') {
        startDate = format(startOfQuarter(now), 'yyyy-MM-dd');
        endDate = format(endOfQuarter(now), 'yyyy-MM-dd');
      }

      const response = await statisticsService.getPopularServices({ 
        startDate, 
        endDate, 
        limit: 5 
      });
      
      const mappedData = (response || []).map((item: any, index: number) => ({
        ...item,
        color: COLORS[index % COLORS.length]
      }));
      
      setData(mappedData);
    } catch (error) {
      console.error('Failed to fetch popular services', error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchPopularServices();
  }, [fetchPopularServices]);

  const totalOrders = data.reduce((sum, item) => sum + item.bookingCount, 0);

  const filterLabel = {
    month: 'Tháng này',
    quarter: 'Quý này',
    all: 'Toàn thời gian'
  }[filter];

  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (e: React.MouseEvent, name: string) => {
    setHoveredItem(name);
    setTooltipPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setTooltipPos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div className={styles.container}>
      {/* Custom Tooltip Overlay */}
      {hoveredItem && (
        <div 
          className={styles.customTooltip} 
          style={{ top: tooltipPos.y - 45, left: tooltipPos.x + 15 }}
        >
          {hoveredItem}
        </div>
      )}

      <div className={styles.header}>
        <div className={styles.chartTitle}>Phổ biến gói dịch vụ</div>
        <DropdownMenu>
          <DropdownMenuTrigger className={styles.filterButton}>
            <span>{filterLabel}</span>
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
              <path d="M1 1L5 5L9 1" stroke="#6c757d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className={styles.dropdownContent}>
            <DropdownMenuItem className={styles.dropdownItem} onClick={() => setFilter('month')}>Tháng này</DropdownMenuItem>
            <DropdownMenuItem className={styles.dropdownItem} onClick={() => setFilter('quarter')}>Quý này</DropdownMenuItem>
            <DropdownMenuItem className={styles.dropdownItem} onClick={() => setFilter('all')}>Toàn thời gian</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={75}
              outerRadius={115}
              cornerRadius={12}
              paddingAngle={5}
              dataKey="bookingCount"
              stroke="none"
              animationBegin={0}
              animationDuration={800}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              content={<CustomTooltip />}
              wrapperStyle={{ zIndex: 1000, pointerEvents: 'none' }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className={styles.centerLayer}>
          <span className={styles.centerLabel}>Tổng đơn</span>
          <span className={styles.centerValue}>{totalOrders}</span>
        </div>
      </div>
      
      <div className={styles.legendContainer}>
        {data.map((item, index) => (
          <div 
            key={index} 
            className={styles.legendItem}
            onMouseEnter={(e) => handleMouseEnter(e, item.packageName)}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div className={styles.legendDot} style={{ backgroundColor: item.color }} />
            <div className={styles.legendInfo}>
              <span className={styles.legendName}>{item.packageName}</span>
              <span className={styles.legendValue}>{item.bookingCount} đơn</span>
            </div>
          </div>
        ))}
        {data.length === 0 && !loading && (
          <div className={styles.emptyState}>Không có dữ liệu trong khoảng thời gian này</div>
        )}
      </div>
    </div>
  );
};
