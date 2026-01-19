'use client';

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import styles from './health-metrics-timeline.module.css';

type MetricTab = 'heartRate' | 'bloodPressure' | 'oxygenLevels' | 'overallStatus';

const mockData = [
  { date: 'Dec 23', value: 75 },
  { date: 'Dec 25', value: 78 },
  { date: 'Dec 27', value: 72 },
  { date: 'Dec 29', value: 80 },
  { date: 'Dec 31', value: 76 },
  { date: 'Jan 02', value: 74 },
  { date: 'Jan 04', value: 79 },
  { date: 'Jan 06', value: 77 },
  { date: 'Jan 08', value: 73 },
  { date: 'Jan 10', value: 81 },
  { date: 'Jan 12', value: 78 },
  { date: 'Jan 14', value: 76 },
  { date: 'Jan 16', value: 79 },
  { date: 'Jan 18', value: 77 },
];

export function HealthMetricsTimeline() {
  const [activeTab, setActiveTab] = useState<MetricTab>('heartRate');

  const tabs = [
    { id: 'heartRate' as MetricTab, label: 'Heart Rate' },
    { id: 'bloodPressure' as MetricTab, label: 'Blood Pressure' },
    { id: 'oxygenLevels' as MetricTab, label: 'Oxygen Levels' },
    { id: 'overallStatus' as MetricTab, label: 'Overall Status' },
  ];

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h5 className={styles.title}>Health Metrics Timeline</h5>
        <div className={styles.tabs}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab.id)}
              role="tab"
              aria-selected={activeTab === tab.id}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.chartContainer}>
          <ResponsiveContainer width="100%" height={151}>
            <AreaChart data={mockData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="30%" stopColor="var(--color-brand-accent)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="var(--color-brand-accent)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
              <XAxis
                dataKey="date"
                stroke="#8e8da4"
                fontSize={11}
                tick={{ fill: '#8e8da4' }}
              />
              <YAxis stroke="#8e8da4" fontSize={11} tick={{ fill: '#8e8da4' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  fontFamily: 'Funnel Sans, sans-serif',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="var(--color-brand-accent)"
                strokeWidth={2}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
