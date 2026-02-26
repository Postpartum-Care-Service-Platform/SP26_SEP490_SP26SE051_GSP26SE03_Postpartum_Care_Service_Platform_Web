'use client';

import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
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

import styles from './average-patient-visit.module.css';

type VisitData = {
  month: string;
  actual: number;
  expected: number;
};

type AveragePatientVisitProps = {
  data?: VisitData[];
};

const mockData: VisitData[] = [
  { month: 'Jan', actual: 1220, expected: 1220 },
  { month: 'Feb', actual: 900, expected: 900 },
  { month: 'Mar', actual: 1350, expected: 1350 },
  { month: 'Apr', actual: 1800, expected: 1800 },
  { month: 'May', actual: 1450, expected: 1450 },
  { month: 'Jun', actual: 1200, expected: 1200 },
  { month: 'Jul', actual: 1500, expected: 1500 },
  { month: 'Aug', actual: 1100, expected: 1100 },
  { month: 'Sep', actual: 1850, expected: 1850 },
  { month: 'Oct', actual: 1400, expected: 1400 },
  { month: 'Nov', actual: 1700, expected: 1700 },
  { month: 'Dec', actual: 1300, expected: 1300 },
];

const CustomBarShape = (props: any) => {
  const { x, y, width, height, opacity = 0.4 } = props;
  if (
    typeof x === 'number' &&
    typeof y === 'number' &&
    typeof width === 'number' &&
    typeof height === 'number'
  ) {
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill="url(#barGradient)"
          opacity={opacity}
        />
        <line
          x1={x}
          y1={y}
          x2={x + width}
          y2={y}
          stroke="#fa8314"
          strokeWidth={2}
        />
      </g>
    );
  }
  return null;
};

const CustomCursor = (props: any) => {
  const { x, y, width, height } = props;
  if (
    typeof x === 'number' &&
    typeof y === 'number' &&
    typeof width === 'number' &&
    typeof height === 'number'
  ) {
    const centerX = x + width / 2;
    return (
      <line
        x1={centerX}
        y1={y}
        x2={centerX}
        y2={y + height}
        stroke="#6c757d"
        strokeWidth={1}
        strokeDasharray="3 3"
      />
    );
  }
  return null;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.tooltip}>
        <p className={styles.tooltipLabel}>{label}</p>
        <div className={styles.tooltipContent}>
          <div className={styles.tooltipItem}>
            <span
              className={styles.tooltipDot}
              style={{ backgroundColor: '#fa8314' }}
            />
            <span>Actual: {payload[0].value}</span>
          </div>
          <div className={styles.tooltipItem}>
            <span
              className={styles.tooltipLine}
              style={{ borderColor: '#fa8314' }}
            />
            <span>Expected: {payload[0].value}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function AveragePatientVisit({
  data = mockData,
}: AveragePatientVisitProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const expectedVisits = 1450;
  const actualVisits = 1380;
  const peakMonth = data.reduce(
    (max, item) => (item.actual > max.actual ? item : max),
    data[0]
  );
  const peakValue = peakMonth.actual;
  const peakMonthName = peakMonth.month;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Average Patient Visit</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={styles.periodButton} aria-label="Select period">
              <span>{selectedPeriod === 'monthly' ? 'Monthly' : 'Weekly'}</span>
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
              className={`${styles.dropdownItem} ${
                selectedPeriod === 'monthly' ? styles.dropdownItemActive : ''
              }`}
              onClick={() => setSelectedPeriod('monthly')}
            >
              Monthly
            </DropdownMenuItem>
            <DropdownMenuItem
              className={`${styles.dropdownItem} ${
                selectedPeriod === 'weekly' ? styles.dropdownItemActive : ''
              }`}
              onClick={() => setSelectedPeriod('weekly')}
            >
              Weekly
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className={styles.body}>
        <div className={styles.metrics}>
          <div className={styles.metricItem}>
            <div className={styles.metricValue}>
              {expectedVisits.toLocaleString('vi-VN')}{' '}
              <span className={styles.metricLabel}>/ Column</span>
            </div>
            <p className={styles.metricDescription}>Expected Visits</p>
          </div>
          <div className={styles.metricItem}>
            <div className={styles.metricValue}>
              {actualVisits.toLocaleString('vi-VN')}{' '}
              <span className={styles.metricLabel}>/ Stroke</span>
            </div>
            <p className={styles.metricDescription}>Actual Visits</p>
          </div>
          <div className={styles.metricItem}>
            <div className={styles.metricValue}>
              {peakMonthName}: {peakValue.toLocaleString('vi-VN')}
            </div>
            <p className={styles.metricDescription}>Peak Patient Visit Month</p>
          </div>
        </div>
        <div className={styles.chartContainer}>
          <ResponsiveContainer width="100%" height="100%" minHeight={300}>
            <BarChart
              data={data}
              margin={{ top: 20, right: 0, left: 0, bottom: 5 }}
              barCategoryGap={-0.4}
            >
              <defs>
                <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffd4a3" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#ffefdb" stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e0e0e0"
                horizontal={true}
                vertical={false}
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: '#6c757d',
                  fontSize: 12,
                  fontFamily: 'Funnel Sans, sans-serif',
                }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: '#6c757d',
                  fontSize: 12,
                  fontFamily: 'Funnel Sans, sans-serif',
                }}
                domain={[0, 2000]}
                ticks={[0, 500, 1000, 1500, 2000]}
              />
              <Tooltip content={<CustomTooltip />} cursor={<CustomCursor />} />
              <Bar
                dataKey="actual"
                onMouseEnter={(data, index) => {
                  if (typeof index === 'number') {
                    setHoveredIndex(index);
                  }
                }}
                onMouseLeave={() => setHoveredIndex(null)}
                shape={(props: any) => {
                  const index =
                    props.payload?.index ??
                    data.findIndex((d) => d.month === props.payload?.month);
                  const opacity = hoveredIndex === index ? 1 : 0.4;
                  return <CustomBarShape {...props} opacity={opacity} />;
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
