'use client';

import { useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';

import statisticsService from '@/services/statistics.service';
import styles from './patient-visit-by-gender.module.css';

type MonthlyCompletionData = {
  month: string;
  completed: number;
  missed: number;
  cancelled: number;
  scheduled: number;
};

type PatientVisitTooltipItem = {
  color?: string;
  name?: string;
  value?: number;
};

type PatientVisitTooltipProps = {
  active?: boolean;
  label?: string;
  payload?: PatientVisitTooltipItem[];
};

const CustomTooltip = ({ active, payload, label }: PatientVisitTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.tooltip}>
        <p className={styles.tooltipLabel}>{label}</p>
        <div className={styles.tooltipContent}>
          {payload.map((item, index) => (
            <div key={index} className={styles.tooltipItem}>
              <span
                className={styles.tooltipDot}
                style={{ backgroundColor: item.color }}
              />
              <span>
                {item.name}: {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

type PatientVisitLegendItem = {
  value: string;
  color: string;
};

type PatientVisitLegendProps = {
  payload?: PatientVisitLegendItem[];
};

const CustomLegend = ({ payload }: PatientVisitLegendProps) => {
  return (
    <div className={styles.legend}>
      {payload?.map((entry, index) => (
        <div key={index} className={styles.legendItem}>
          <span
            className={styles.legendDot}
            style={{ backgroundColor: entry.color }}
          />
          <span className={styles.legendText}>{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export function PatientVisitByGender() {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [chartData, setChartData] = useState<MonthlyCompletionData[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper to get ranges based on period
  const getRanges = (period: string) => {
    const ranges = [];
    const now = new Date();
    
    if (period === 'monthly') {
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const start = new Date(Date.UTC(d.getFullYear(), d.getMonth(), 1));
        const end = new Date(Date.UTC(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59));
        
        ranges.push({
          name: d.toLocaleString('vi-VN', { month: 'short' }).replace('.', ''),
          start: start.toISOString().split('T')[0],
          end: end.toISOString().split('T')[0]
        });
      }
    } else {
      // Weekly: get last 7 weeks
      for (let i = 7; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - (i * 7 + (d.getDay() === 0 ? 6 : d.getDay() - 1))); // Start of week (Monday)
        const start = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        const end = new Date(start);
        end.setDate(end.getDate() + 6);
        end.setHours(23, 59, 59);

        ranges.push({
          name: `Tuần ${7 - i + 1}`, // Simplified week name
          label: `${start.getDate()}/${start.getMonth() + 1}`,
          start: start.toISOString().split('T')[0],
          end: end.toISOString().split('T')[0]
        });
      }
    }
    return ranges;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const ranges = getRanges(selectedPeriod);
        
        const results = await Promise.all(
          ranges.map(async (r) => {
            try {
              const res = await statisticsService.getActivityCompletionRate({
                startDate: r.start,
                endDate: r.end
              });
              return {
                month: r.label || r.name,
                completed: res?.completed || 0,
                missed: res?.missed || 0,
                cancelled: res?.cancelled || 0,
                scheduled: res?.scheduled || 0,
                total: res?.total || 0
              };
            } catch {
              return { month: r.label || r.name, completed: 0, missed: 0, cancelled: 0, scheduled: 0, total: 0 };
            }
          })
        );
        
        setChartData(results);
      } catch (err) {
        console.error('Error fetching activity history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedPeriod]);

  const meta = [
    { key: 'total', name: 'Tổng cộng', color: '#3B82F6' },
    { key: 'completed', name: 'Hoàn thành', color: '#4ec5ad' },
    { key: 'missed', name: 'Bỏ lỡ', color: '#fd6161' },
    { key: 'scheduled', name: 'Đã lên lịch', color: '#a47bc8' },
    { key: 'cancelled', name: 'Đã hủy', color: '#f5d178' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Thống kê Hoàn thành Hoạt động</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={styles.periodButton} aria-label="Chọn giai đoạn">
              <span>{selectedPeriod === 'monthly' ? 'Hàng tháng' : 'Hàng tuần'}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className={styles.chevron}
              >
                <path
                  d="M4 6L8 10L12 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className={styles.dropdownContent} align="end">
            <DropdownMenuItem
              className={`${styles.dropdownItem} ${selectedPeriod === 'monthly' ? styles.dropdownItemActive : ''}`}
              onClick={() => setSelectedPeriod('monthly')}
            >
              Hàng tháng
            </DropdownMenuItem>
            <DropdownMenuItem
              className={`${styles.dropdownItem} ${selectedPeriod === 'weekly' ? styles.dropdownItemActive : ''}`}
              onClick={() => setSelectedPeriod('weekly')}
            >
              Hàng tuần
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className={styles.body}>
        <div className={styles.chartContainer}>
          <ResponsiveContainer width="100%" height="100%" minHeight={200}>
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#888', fontSize: '12px' }}>
                Đang tải dữ liệu thực tế...
              </div>
            ) : (
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
              >
                <defs>
                  {meta.map(m => (
                    <linearGradient key={m.key} id={`${m.key}Gradient`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={m.color} stopOpacity={0.2} />
                      <stop offset="90%" stopColor={m.color} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                
                {/* Horizontal dash lines */}
                {[50, 100, 150, 200, 250].map((v) => (
                  <ReferenceLine
                    key={v}
                    y={v}
                    stroke="#eee"
                    strokeDasharray="4 4"
                    strokeWidth={1}
                  />
                ))}
                <ReferenceLine y={0} stroke="#eee" strokeWidth={1} />

                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#888', fontSize: 11 }}
                  dy={10}
                />
                <YAxis 
                  width={35}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#888', fontSize: 11 }}
                  domain={['0', 'auto']}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#b6b6b6', strokeDasharray: '3 3' }} />
                {meta.map(m => (
                  <Area
                    key={m.key}
                    type="monotone"
                    dataKey={m.key}
                    stroke={m.color}
                    strokeWidth={2}
                    fill={`url(#${m.key}Gradient)`}
                    name={m.name}
                    activeDot={{ r: 5, fill: m.color, stroke: '#fff', strokeWidth: 2 }}
                  />
                ))}
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
        <CustomLegend
          payload={meta.map(m => ({ value: m.name, color: m.color }))}
        />
      </div>
    </div>
  );
}
