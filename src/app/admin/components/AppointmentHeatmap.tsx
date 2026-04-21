'use client';

import { useState, useEffect, useCallback } from 'react';
import { format, subDays } from 'date-fns';
import { DateRange } from 'react-day-picker';
import styles from './appointment-heatmap.module.css';
import statisticsService from '@/services/statistics.service';
import { DatePickerWithRange } from './DateRangePicker';
import { AppointmentHeatmap3D } from './AppointmentHeatmap3D';

interface HeatmapPoint {
  date: string;
  dayOfWeek: number;
  hour: number;
  count: number;
  percentage: number;
}

const HOURS = Array.from({ length: 11 }, (_, i) => i + 8);

const getDayName = (dayOfWeek: number) => {
  const days = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
  return days[dayOfWeek];
};

const getIntensityColor = (count: number, max: number) => {
  if (count === 0) return 'transparent';
  const colors = [
    '#fff4e6', '#ffe8cc', '#ffd8a8', '#ffc078', '#ffa94d',
    '#ff922b', '#fd7e14', '#f76707', '#e8590c', '#d9480f'
  ];
  const level = Math.min(Math.floor((count / (max || 1)) * 9), 9);
  return colors[level];
};

const formatDateLabel = (dateStr: string, dayOfWeek: number) => {
  if (!dateStr) return '';
  try {
    const [year, month, day] = dateStr.split('-');
    return `${getDayName(dayOfWeek)}, ${day}/${month}/${year}`;
  } catch {
    return dateStr;
  }
};

export function AppointmentHeatmap() {
  const [data, setData] = useState<HeatmapPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [maxCount, setMaxCount] = useState(10);

  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 29),
    to: new Date(),
  });

  const setPreset = (days: number | 'current_month') => {
    const today = new Date();
    if (days === 'current_month') {
      setDateRange({
        from: new Date(today.getFullYear(), today.getMonth(), 1),
        to: today,
      });
    } else {
      setDateRange({
        from: subDays(today, days - 1),
        to: today,
      });
    }
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const params = dateRange?.from && dateRange?.to ? {
        startDate: format(dateRange.from, 'yyyy-MM-dd'),
        endDate: format(dateRange.to, 'yyyy-MM-dd')
      } : undefined;

      const res = await statisticsService.getAppointmentHeatmap(params);

      // Lấy danh sách points
      const points = res?.points || res?.Points || [];
      setData(points);

      // Lấy maxCount và cập nhật state
      const mCount = res?.maxCount ?? res?.MaxCount ?? 0;
      if (mCount > 0) {
        setMaxCount(mCount);
      } else if (points.length > 0) {
        // Fallback: tự tính nếu API không trả về
        setMaxCount(Math.max(...points.map((p: any) => p.count || p.Count || 0)));
      } else {
        setMaxCount(10);
      }
    } catch (error) {
      console.error('Failed to fetch heatmap data', error);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getIntensityClass = (count: number) => {
    if (count === 0) return styles.level0;
    const ratio = count / maxCount;
    if (ratio < 0.1) return styles.level1;
    if (ratio < 0.2) return styles.level2;
    if (ratio < 0.3) return styles.level3;
    if (ratio < 0.4) return styles.level4;
    if (ratio < 0.5) return styles.level5;
    if (ratio < 0.6) return styles.level6;
    if (ratio < 0.7) return styles.level7;
    if (ratio < 0.8) return styles.level8;
    return styles.level9;
  };

  // Group and sort data by date
  const groupedByDate = data.reduce((acc, point) => {
    const dateKey = point.date || 'unknown';
    if (!acc[dateKey]) {
      acc[dateKey] = {
        date: point.date,
        dayOfWeek: point.dayOfWeek,
        points: []
      };
    }
    acc[dateKey].points.push(point);
    return acc;
  }, {} as Record<string, { date: string; dayOfWeek: number; points: HeatmapPoint[] }>);

  const sortedDates = Object.values(groupedByDate).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h3 className={styles.title}>Mật độ đặt lịch hẹn theo khung giờ</h3>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.viewToggle}>
            <button
              className={`${styles.toggleBtn} ${viewMode === '2d' ? styles.activeToggle : ''}`}
              onClick={() => setViewMode('2d')}
            >
              2D
            </button>
            <button
              className={`${styles.toggleBtn} ${viewMode === '3d' ? styles.activeToggle : ''}`}
              onClick={() => setViewMode('3d')}
            >
              3D
            </button>
          </div>
          <div className={styles.presets}>
            <button
              className={`${styles.presetBtn} ${dateRange?.from && format(dateRange.from, 'yyyy-MM-dd') === format(subDays(new Date(), 6), 'yyyy-MM-dd') ? styles.activePreset : ''}`}
              onClick={() => setPreset(7)}
            >
              7 ngày
            </button>
            <button
              className={`${styles.presetBtn} ${dateRange?.from && format(dateRange.from, 'yyyy-MM-dd') === format(subDays(new Date(), 29), 'yyyy-MM-dd') ? styles.activePreset : ''}`}
              onClick={() => setPreset(30)}
            >
              30 ngày
            </button>
            <button
              className={`${styles.presetBtn} ${dateRange?.from && dateRange.from.getDate() === 1 ? styles.activePreset : ''}`}
              onClick={() => setPreset('current_month')}
            >
              Tháng này
            </button>
          </div>
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
        </div>
      </div>

      <div className={styles.heatmapWrapper}>
        {loading ? (
          <div className={styles.loadingOverlay}>Đang tải dữ liệu...</div>
        ) : viewMode === '3d' ? (
          <AppointmentHeatmap3D data={data} maxCount={maxCount} />
        ) : (
          <div className={styles.grid}>
            <div className={styles.emptyHeaderCell} />
            {HOURS.map(hour => (
              <div key={hour} className={styles.hourLabel}>
                {hour}h
              </div>
            ))}

            {sortedDates.map(dateGroup => {
              const isToday = dateGroup.date === format(new Date(), 'yyyy-MM-dd');
              return (
                <div key={dateGroup.date} className={styles.row}>
                  <div className={styles.dayLabel}>
                    <div className={styles.dateInfo}>
                      <span className={`${styles.fullDate} ${isToday ? styles.todayLabel : ''}`}>
                        {formatDateLabel(dateGroup.date, dateGroup.dayOfWeek)}
                        <span className={styles.dailyTotalSimple}> ({dateGroup.points.reduce((sum, p) => sum + (p.count || 0), 0)})</span>
                      </span>
                    </div>
                  </div>
                  {HOURS.map(hour => {
                    const point = dateGroup.points.find(p => p.hour === hour);
                    const count = point?.count || 0;
                    return (
                      <div
                        key={hour}
                        className={`${styles.cell} ${getIntensityClass(count)}`}
                      >
                        {count > 0 && <span className={styles.cellValue}>{count}</span>}
                        <div className={styles.tooltip}>
                          {formatDateLabel(dateGroup.date, dateGroup.dayOfWeek)}, {hour}h: {count} lịch hẹn
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className={styles.heatmapFooter}>
        <div className={styles.legendContainer}>
          <div className={styles.legendHeader}>
            <span className={styles.legendLabel}>Mật độ lịch hẹn</span>
            <span className={styles.maxIndicator}>
              (Tối đa: {maxCount})
            </span>
          </div>
          <div className={styles.scaleWrapper}>
            <div className={styles.colorBar}></div>
            <div className={styles.scaleTicks}>
              {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
                <span key={i} className={styles.tick}>
                  {Math.round(maxCount * p)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
