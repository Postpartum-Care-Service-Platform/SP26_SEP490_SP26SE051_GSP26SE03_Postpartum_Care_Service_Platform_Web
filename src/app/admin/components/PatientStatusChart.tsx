'use client';

import { ChevronDownIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
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

import styles from './patient-status-chart.module.css';

const dayLabelMap: Record<string, string> = {
  Mon: 'Thứ 2',
  Tue: 'Thứ 3',
  Wed: 'Thứ 4',
  Thu: 'Thứ 5',
  Fri: 'Thứ 6',
  Sat: 'Thứ 7',
  Sun: 'Chủ nhật',
};

const mockData = [
  { day: 'Mon', dayLabel: 'Thứ 2', admissions: 54, discharges: 36 },
  { day: 'Tue', dayLabel: 'Thứ 3', admissions: 7, discharges: 15 },
  { day: 'Wed', dayLabel: 'Thứ 4', admissions: 75, discharges: 50 },
  { day: 'Thu', dayLabel: 'Thứ 5', admissions: 25, discharges: 12 },
  { day: 'Fri', dayLabel: 'Thứ 6', admissions: 60, discharges: 35 },
  { day: 'Sat', dayLabel: 'Thứ 7', admissions: 15, discharges: 5 },
  { day: 'Sun', dayLabel: 'Chủ nhật', admissions: 20, discharges: 10 },
];

const TIME_OPTIONS = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const admissionsData = payload.find((p: any) => p.dataKey === 'admissions');
    const dischargesData = payload.find((p: any) => p.dataKey === 'discharges');
    const row = payload[0]?.payload as
      | { day?: string; dayLabel?: string }
      | undefined;
    const dayLabel =
      row?.dayLabel || (row?.day ? dayLabelMap[row.day] : '') || '';

    return (
      <div className={styles.tooltip}>
        <div className={styles.tooltipLabel}>{dayLabel}</div>
        {admissionsData && (
          <div className={styles.tooltipItem}>
            <span
              className={styles.tooltipIcon}
              style={{ backgroundColor: '#A47BC8' }}
            ></span>
            <span>
              Admissions: <strong>{admissionsData.value}</strong> Patients
            </span>
          </div>
        )}
        {dischargesData && (
          <div className={styles.tooltipItem}>
            <span
              className={styles.tooltipIcon}
              style={{ backgroundColor: '#5288AF' }}
            ></span>
            <span>
              Discharges: <strong>{dischargesData.value}</strong> Patients
            </span>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export function PatientStatusChart() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('weekly');

  const selectedLabel =
    TIME_OPTIONS.find((opt) => opt.value === selectedTimeframe)?.label ||
    'Weekly';

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h4 className={styles.title}>Patient Status</h4>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <button className={styles.timeframeButton}>
              {selectedLabel}
              <ChevronDownIcon className={styles.chevronIcon} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className={styles.dropdownContent}>
            {TIME_OPTIONS.map((option) => (
              <DropdownMenuItem
                key={option.value}
                className={`${styles.dropdownItem} ${
                  selectedTimeframe === option.value
                    ? styles.dropdownItemActive
                    : ''
                }`}
                onClick={() => setSelectedTimeframe(option.value)}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.chartWrapper}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={mockData}
              margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
              <XAxis dataKey="day" hide />
              <YAxis hide />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  stroke: '#6c757d',
                  strokeWidth: 1,
                  strokeDasharray: '3 3',
                }}
                labelFormatter={() => null}
              />
              <Line
                type="monotone"
                dataKey="admissions"
                stroke="#A47BC8"
                strokeWidth={2}
                dot={false}
                name="Admissions"
              />
              <Line
                type="monotone"
                dataKey="discharges"
                stroke="#5288AF"
                strokeWidth={2}
                dot={false}
                name="Discharges"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
