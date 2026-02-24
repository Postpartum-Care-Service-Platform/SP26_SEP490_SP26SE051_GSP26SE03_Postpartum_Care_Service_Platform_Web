'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={styles.menuButton} aria-label="Menu">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M4 8C4 8.55228 3.55228 9 3 9C2.44772 9 2 8.55228 2 8C2 7.44772 2.44772 7 3 7C3.55228 7 4 7.44772 4 8Z"
                  fill="currentColor"
                />
                <path
                  d="M9 8C9 8.55228 8.55228 9 8 9C7.44772 9 7 8.55228 7 8C7 7.44772 7.44772 7 8 7C8.55228 7 9 7.44772 9 8Z"
                  fill="currentColor"
                />
                <path
                  d="M14 8C14 8.55228 13.5523 9 13 9C12.4477 9 12 8.55228 12 8C12 7.44772 12.4477 7 13 7C13.5523 7 14 7.44772 14 8Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className={styles.dropdownContent} align="end">
            <DropdownMenuItem className={styles.dropdownItem}>Last 7 Days</DropdownMenuItem>
            <DropdownMenuItem className={styles.dropdownItem}>Last 30 Days</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className={styles.body}>
        <div className={styles.stats}>
          <div className={styles.trend}>
            <span className={styles.trendValue} style={{ color: trendColor }}>
              <CountUp value={Math.abs(parseFloat(trend.replace(/[%+-]/g, '')))} format="percentage" />%
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
          <div className={styles.mainValue}>
            <CountUp value={parseFloat(value.replace('%', ''))} format="percentage" />%
          </div>
        </div>
        <div className={styles.chartContainer}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColor} stopOpacity={0.3} />
                  <stop offset="90%" stopColor={chartColor} stopOpacity={0} />
                  <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="5 5" stroke="#e0e0e0" vertical={true} horizontal={false} />
              <XAxis hide />
              <YAxis hide />
              <Area
                type="monotone"
                dataKey="value"
                stroke={chartColor}
                strokeWidth={1}
                fill={`url(#${gradientId})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
