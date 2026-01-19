'use client';

import { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
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
  { month: 'Jan', female: 800, male: 600 },
  { month: 'Feb', female: 600, male: 400 },
  { month: 'Mar', female: 900, male: 700 },
  { month: 'Apr', female: 1200, male: 900 },
  { month: 'May', female: 1000, male: 800 },
  { month: 'Jun', female: 850, male: 650 },
  { month: 'Jul', female: 1100, male: 900 },
  { month: 'Aug', female: 750, male: 550 },
  { month: 'Sep', female: 1300, male: 1000 },
  { month: 'Oct', female: 950, male: 750 },
  { month: 'Nov', female: 1150, male: 900 },
  { month: 'Dec', female: 900, male: 700 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.tooltip}>
        <p className={styles.tooltipLabel}>{label}</p>
        <div className={styles.tooltipContent}>
          {payload.map((item: any, index: number) => (
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

const CustomLegend = ({ payload }: any) => {
  return (
    <div className={styles.legend}>
      {payload?.map((entry: any, index: number) => (
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

export function PatientVisitByGender({ data = mockData }: PatientVisitByGenderProps) {
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
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="femaleGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a47bc8" stopOpacity={0.3} />
                  <stop offset="90%" stopColor="#a47bc8" stopOpacity={0} />
                  <stop offset="100%" stopColor="#a47bc8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="maleGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f5d178" stopOpacity={0.3} />
                  <stop offset="90%" stopColor="#f5d178" stopOpacity={0} />
                  <stop offset="100%" stopColor="#f5d178" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="5 5" stroke="#e0e0e0" vertical={true} horizontal={false} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6c757d', fontSize: 12, fontFamily: 'Funnel Sans, sans-serif' }}
              />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#b6b6b6', strokeWidth: 1, strokeDasharray: '3 3' }} />
              <Area
                type="monotone"
                dataKey="female"
                stroke="#a47bc8"
                strokeWidth={1}
                fill="url(#femaleGradient)"
                name="Female"
              />
              <Area
                type="monotone"
                dataKey="male"
                stroke="#f5d178"
                strokeWidth={1}
                fill="url(#maleGradient)"
                name="Male"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <CustomLegend payload={[
          { value: 'Female', color: '#a47bc8' },
          { value: 'Male', color: '#f5d178' }
        ]} />
      </div>
    </div>
  );
}
