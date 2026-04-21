'use client';

import { useState, useEffect } from 'react';
import {
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import statisticsService from '@/services/statistics.service';
import { CountUp } from './CountUp';
import styles from './team-productivity.module.css';

type StaffPerformancePoint = {
  staffId: string;
  staffName: string;
  totalHours: number;
  serviceCount: number;
  avgRating: number | null;
};

type PerformanceTooltipProps = {
  active?: boolean;
  payload?: any[];
};

const CustomTooltip = ({ active, payload }: PerformanceTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.tooltip}>
        <p className={styles.tooltipLabel}>{payload[0].payload?.staffName}</p>
        <div className={styles.tooltipContent}>
          {payload.map((entry: any, index: number) => (
            <div key={index} className={styles.tooltipItem}>
              <span
                className={styles.tooltipDot}
                style={{ backgroundColor: entry.color }}
              />
              <span>
                {entry.name}: {entry.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export function TeamProductivity() {
  const [data, setData] = useState<StaffPerformancePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({
    services: 0,
    hours: 0,
    rating: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await statisticsService.getStaffPerformance();
        if (Array.isArray(res)) {
          setData(res);
          
          const sumServices = res.reduce((sum, item) => sum + (item.serviceCount || 0), 0);
          const sumHours = res.reduce((sum, item) => sum + (item.totalHours || 0), 0);
          const ratedStaff = res.filter(item => item.avgRating !== null);
          const avgRating = ratedStaff.length > 0 
            ? ratedStaff.reduce((sum, item) => sum + (item.avgRating || 0), 0) / ratedStaff.length 
            : 0;

          setTotals({
            services: sumServices,
            hours: Math.round(sumHours),
            rating: Number(avgRating.toFixed(1))
          });
        }
      } catch (error) {
        console.error('Failed to fetch staff performance', error);
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
        <h3 className={styles.title}>Hiệu suất Nhân viên</h3>
      </div>
      <div className={styles.contentWrapper}>
        <div className={styles.statsRow}>
          <div className={styles.statItem}>
            <div className={styles.statValue}>
              <CountUp value={totals.services} format="number" />
            </div>
            <p className={styles.statLabel}>Tổng Dịch vụ</p>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>
              <CountUp value={totals.hours} format="number" />
            </div>
            <p className={styles.statLabel}>Tổng Giờ làm</p>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>
              <CountUp value={totals.rating} format="number" />
            </div>
            <p className={styles.statLabel}>Đánh giá TB</p>
          </div>
        </div>
        <div className={styles.body}>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
              >
                {[30, 60, 90, 120, 150].map((v) => (
                  <ReferenceLine
                    key={v}
                    yAxisId="left"
                    y={v}
                    stroke="#ddd"
                    strokeDasharray="4 4"
                    strokeWidth={1}
                  />
                ))}
                <ReferenceLine
                  yAxisId="left"
                  y={0}
                  stroke="#ddd"
                  strokeWidth={1}
                />
                <XAxis
                  dataKey="staffName"
                  tick={{ fontSize: 11, fill: '#373d3f' }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  yAxisId="left"
                  width={40}
                  domain={[0, 150]}
                  ticks={[0, 30, 60, 90, 120, 150]}
                  interval={0}
                  tick={{ fontSize: 11, fill: '#373d3f' }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  width={40}
                  domain={[0, 5]}
                  ticks={[0, 1, 2, 3, 4, 5]}
                  interval={0}
                  tick={{ fontSize: 11, fill: '#373d3f' }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{
                    strokeDasharray: '3 3',
                    stroke: '#b6b6b6',
                  }}
                />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ paddingTop: '10px' }}
                  formatter={(value) => (
                    <span style={{ fontSize: '11px', color: '#373d3f' }}>
                      {value}
                    </span>
                  )}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="serviceCount"
                  name="Số dịch vụ"
                  stroke="#fd6161"
                  strokeWidth={2}
                  dot={true}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="totalHours"
                  name="Số giờ"
                  stroke="#4ec5ad"
                  strokeWidth={2}
                  dot={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
