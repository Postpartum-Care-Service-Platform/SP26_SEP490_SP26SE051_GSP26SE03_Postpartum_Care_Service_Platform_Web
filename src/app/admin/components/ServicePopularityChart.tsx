'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import styles from './service-popularity.module.css';

const data = [
  { name: 'Massage Bầu', value: 340, color: '#fa8314' }, // Orange
  { name: 'Khám Nhi', value: 200, color: '#c3ef5d' },   // Light Lime
  { name: 'Khám Hậu Sản', value: 317, color: '#099335' }, // Green
];

export const ServicePopularityChart = () => {
  const totalOrders = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className={styles.container}>
      <div className={styles.chartTitle}>Service Popularity</div>
      <div className={styles.chartWrapper}>
        <div className={styles.centerLayer}>
          <span className={styles.centerLabel}>Total orders</span>
          <span className={styles.centerValue}>{totalOrders}</span>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={75}
              outerRadius={115}
              cornerRadius={12}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: any) => [`${value} orders`, '']}
              itemStyle={{ color: '#111', fontWeight: 600 }}
              contentStyle={{ borderRadius: '8px', border: '1px solid #eaeaea', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} 
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className={styles.legendContainer}>
        {data.map((item, index) => (
          <div key={index} className={styles.legendItem}>
            <div className={styles.legendDot} style={{ backgroundColor: item.color }} />
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
