'use client';

import { useState } from 'react';
import {
  Area,
  AreaChart,
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

import styles from './patient-visit-by-gender.module.css';

type GenderVisitData = {
  month: string;
  female: number;
  male: number;
};

type PatientVisitByGenderProps = {
  data?: GenderVisitData[];
};

const mockData: GenderVisitData[] = [
  { month: 'Feb', female: 65, male: 40 },
  { month: 'Mar', female: 85, male: 60 },
  { month: 'Apr', female: 75, male: 55 },
  { month: 'May', female: 55, male: 45 },
  { month: 'Jun', female: 78, male: 62 },
  { month: 'Jul', female: 50, male: 35 },
  { month: 'Aug', female: 88, male: 68 },
  { month: 'Sep', female: 65, male: 50 },
  { month: 'Oct', female: 75, male: 60 },
  { month: 'Nov', female: 80, male: 55 },
  { month: 'Dec', female: 55, male: 30 },
];

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

export function PatientVisitByGender({
  data = mockData,
}: PatientVisitByGenderProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('weekly');

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Patient visit by Gender</h3>
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
              className={`${styles.dropdownItem} ${selectedPeriod === 'monthly' ? styles.dropdownItemActive : ''}`}
              onClick={() => setSelectedPeriod('monthly')}
            >
              Monthly
            </DropdownMenuItem>
            <DropdownMenuItem
              className={`${styles.dropdownItem} ${selectedPeriod === 'weekly' ? styles.dropdownItemActive : ''}`}
              onClick={() => setSelectedPeriod('weekly')}
            >
              Weekly
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className={styles.body}>
        <div className={styles.chartContainer}>
          <ResponsiveContainer width="100%" height="100%" minHeight={200}>
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="femaleGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#a47bc8" stopOpacity={0.3} />
                  <stop offset="90%" stopColor="#a47bc8" stopOpacity={0} />
                  <stop offset="100%" stopColor="#a47bc8" stopOpacity={0} />
                </linearGradient>
                <linearGradient
                  id="maleGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#f5d178" stopOpacity={0.3} />
                  <stop offset="90%" stopColor="#f5d178" stopOpacity={0} />
                  <stop offset="100%" stopColor="#f5d178" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f0f0f0"
                vertical={true}
                horizontal={false}
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: '#888',
                  fontSize: 12,
                  fontFamily: 'inherit',
                  fontWeight: 500
                }}
                dy={10}
              />
              <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  stroke: '#b6b6b6',
                  strokeWidth: 1,
                  strokeDasharray: '3 3',
                }}
              />
              <Area
                type="monotone"
                dataKey="female"
                stroke="#a47bc8"
                strokeWidth={2}
                fill="url(#femaleGradient)"
                name="Female"
                activeDot={{ r: 6, fill: '#a47bc8', stroke: '#fff', strokeWidth: 2 }}
              />
              <Area
                type="monotone"
                dataKey="male"
                stroke="#f5d178"
                strokeWidth={2}
                fill="url(#maleGradient)"
                name="Male"
                activeDot={{ r: 6, fill: '#f5d178', stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <CustomLegend
          payload={[
            { value: 'Female', color: '#a47bc8' },
            { value: 'Male', color: '#f5d178' },
          ]}
        />
      </div>
    </div>
  );
}
