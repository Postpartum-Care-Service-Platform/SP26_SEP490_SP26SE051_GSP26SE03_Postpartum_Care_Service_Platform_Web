'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';

import { CountUp } from './CountUp';
import styles from './gender-stats-card.module.css';

type GenderStatsCardProps = {
  title: string;
  value: string;
  trend: string;
  trendColor: string;
  chartColor: string;
  data?: { value: number }[];
};

const mockData = [
  { value: 75 },
  { value: 47 },
  { value: 57 },
  { value: 28 },
  { value: 38 },
  { value: 9 },
  { value: 47 },
  { value: 28 },
];

export function GenderStatsCard({
  title,
  value,
  trend,
  trendColor,
  chartColor,
  data = mockData,
}: GenderStatsCardProps) {
  const gradientId = `gradient-${title.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
      </div>
      <div className={styles.body}>
        <div className={styles.stats}>
          {trend && (
            <div className={styles.trend}>
              <span className={styles.trendValue} style={{ color: trendColor }}>
                <CountUp
                  value={Math.abs(parseFloat(trend.replace(/[%+-]/g, '')))}
                  format="percentage"
                />
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                style={{ color: trendColor }}
              >
                <g>
                  <path
                    d="M21 7a.78.78 0 0 0 0-.21.64.64 0 0 0-.05-.17 1.1 1.1 0 0 0-.09-.14.75.75 0 0 0-.14-.17l-.12-.07a.69.69 0 0 0-.19-.1h-.2A.7.7 0 0 0 20 6h-5a1 1 0 0 0 0 2h2.83l-4 4.71-4.32-2.57a1 1 0 0 0-1.28.22l-5 6a1 1 0 0 0 .13 1.41A1 1 0 0 0 4 18a1 1 0 0 0 .77-.36l4.45-5.34 4.27 2.56a1 1 0 0 0 1.27-.21L19 9.7V12a1 1 0 0 0 2 0V7z"
                    fill="currentColor"
                  />
                </g>
              </svg>
            </div>
          )}
          <div className={styles.mainValue}>
            <CountUp 
              value={parseFloat(value.replace(/[%+-]/g, '')) || 0} 
              format="percentage"
              duration={1500}
            />
          </div>
        </div>
        <div className={styles.chartContainer}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColor} stopOpacity={0.3} />
                  <stop offset="90%" stopColor={chartColor} stopOpacity={0} />
                  <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f0f0f0"
                vertical={true}
                horizontal={false}
              />
              <XAxis hide />
              <YAxis hide />
              <Area
                type="monotone"
                dataKey="value"
                stroke={chartColor}
                strokeWidth={2}
                fill={`url(#${gradientId})`}
                activeDot={{ r: 4, fill: chartColor, stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
