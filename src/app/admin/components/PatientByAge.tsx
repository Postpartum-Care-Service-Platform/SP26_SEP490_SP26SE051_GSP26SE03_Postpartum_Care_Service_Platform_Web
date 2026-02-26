'use client';

import { useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import styles from './patient-by-age.module.css';

type AgeGroup = {
  name: string;
  value: number;
  color: string;
};

type PatientByAgeProps = {
  data?: AgeGroup[];
};

const mockData: AgeGroup[] = [
  { name: '41+ yrs', value: 21, color: '#ffffcb' },
  { name: '0 - 10 yrs', value: 18, color: '#ab9eb7' },
  { name: '11 - 20 yrs', value: 15, color: '#7c909f' },
  { name: '21 - 30 yrs', value: 22, color: '#ffbfbf' },
  { name: '31 - 40 yrs', value: 19, color: '#9fa4bf' },
];

type TooltipProps = {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload?: AgeGroup;
  }>;
};

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const color = data.payload?.color || '#8884d8';
    return (
      <div className={styles.tooltip} style={{ backgroundColor: color }}>
        <p className={styles.tooltipText}>
          {data.name}: {data.value}
        </p>
      </div>
    );
  }
  return null;
};

type LegendPayloadItem = {
  value: string;
  color: string;
  payload: AgeGroup;
};

type LegendProps = {
  payload?: LegendPayloadItem[];
};

const CustomLegend = ({ payload }: LegendProps) => {
  const [_selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <div className={styles.legend}>
      {payload?.map((entry, index) => (
        <label
          key={index}
          className={styles.legendItem}
          onMouseEnter={() => setSelectedIndex(index)}
          onMouseLeave={() => setSelectedIndex(null)}
        >
          <input
            type="radio"
            name="ageGroup"
            className={styles.radioButton}
            style={{
              accentColor: entry.color,
            }}
          />
          <span className={styles.legendLabel}>{entry.value}</span>
        </label>
      ))}
    </div>
  );
};

export function PatientByAge({ data = mockData }: PatientByAgeProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Patient by Age</h3>
      </div>
      <div className={styles.body}>
        <div className={styles.chartContainer}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <CustomLegend
          payload={data.map((item) => ({
            value: item.name,
            color: item.color,
            payload: item,
          }))}
        />
      </div>
    </div>
  );
}
