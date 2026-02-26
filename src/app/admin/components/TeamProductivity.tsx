'use client';

import { useState } from 'react';
import {
  CartesianGrid,
  Legend,
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

import { CountUp } from './CountUp';
import styles from './team-productivity.module.css';

type TeamProductivityPoint = {
  month: string;
  team: number;
  productivity: number;
};

const data: TeamProductivityPoint[] = [
  { month: 'Jan', team: 12, productivity: 52 },
  { month: 'Feb', team: 12, productivity: 52 },
  { month: 'Mar', team: 25, productivity: 30 },
  { month: 'Apr', team: 25, productivity: 30 },
  { month: 'May', team: 37, productivity: 20 },
  { month: 'Jun', team: 37, productivity: 20 },
  { month: 'Jul', team: 20, productivity: 40 },
  { month: 'Aug', team: 20, productivity: 40 },
  { month: 'Sep', team: 40, productivity: 55 },
  { month: 'Oct', team: 40, productivity: 55 },
  { month: 'Nov', team: 22, productivity: 35 },
  { month: 'Dec', team: 22, productivity: 35 },
];

type TeamProductivityTooltipItem = {
  color?: string;
  name?: string;
  value?: number;
  payload?: TeamProductivityPoint;
};

type TeamProductivityTooltipProps = {
  active?: boolean;
  payload?: TeamProductivityTooltipItem[];
};

const CustomTooltip = ({ active, payload }: TeamProductivityTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.tooltip}>
        <p className={styles.tooltipLabel}>{payload[0].payload?.month}</p>
        <div className={styles.tooltipContent}>
          {payload.map((entry, index) => (
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
  const [period, setPeriod] = useState('Monthly');

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Team & Productivity</h3>
        <div className={styles.headerRight}>
          <DropdownMenu>
            <DropdownMenuTrigger className={styles.periodButton}>
              {period}
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                className={styles.chevron}
              >
                <path
                  d="M3 4.5L6 7.5L9 4.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={styles.dropdownContent} align="end">
              <DropdownMenuItem
                className={styles.dropdownItem}
                onClick={() => setPeriod('Weekly')}
              >
                Weekly
              </DropdownMenuItem>
              <DropdownMenuItem
                className={styles.dropdownItem}
                onClick={() => setPeriod('Monthly')}
              >
                Monthly
              </DropdownMenuItem>
              <DropdownMenuItem
                className={styles.dropdownItem}
                onClick={() => setPeriod('Yearly')}
              >
                Yearly
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className={styles.contentWrapper}>
        <div className={styles.statsRow}>
          <div className={styles.statItem}>
            <div className={styles.statValue}>
              <CountUp value={320} format="number" />
            </div>
            <p className={styles.statLabel}>Total Deals</p>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>
              <CountUp value={185} format="number" />
            </div>
            <p className={styles.statLabel}>Calls Made</p>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>
              <CountUp value={72} format="number" />
            </div>
            <p className={styles.statLabel}>Meetings</p>
          </div>
        </div>
        <div className={styles.body}>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="4 4" stroke="#f1f1f1" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: '#373d3f' }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#373d3f' }}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 60]}
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
                    <span style={{ fontSize: '12px', color: '#373d3f' }}>
                      {value}
                    </span>
                  )}
                />
                <Line
                  type="monotone"
                  dataKey="team"
                  name="Team"
                  stroke="#fd6161"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="productivity"
                  name="Productivity"
                  stroke="#4ec5ad"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
