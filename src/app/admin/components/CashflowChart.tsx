'use client';

import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import styles from './cashflow-chart.module.css';

const data = [
  { name: 'Th1', income: 6000, expense: 3000 },
  { name: 'Th2', income: 4200, expense: 5500 },
  { name: 'Th3', income: 5500, expense: 4500 },
  { name: 'Th4', income: 7500, expense: 2000 },
  { name: 'Th5', income: 4500, expense: 4500 },
  { name: 'Th6', income: 6500, expense: 4000 },
  { name: 'Th7', income: 3000, expense: 4500 },
  { name: 'Th8', income: 4500, expense: 5000 },
  { name: 'Th9', income: 7500, expense: 5000 },
  { name: 'Th10', income: 6000, expense: 4500 },
  { name: 'Th11', income: 4000, expense: 6500 },
  { name: 'Th12', income: 5000, expense: 3500 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.tooltip}>
        <p className={styles.tooltipLabel}>{label} 2025</p>
        <div className={styles.tooltipContent}>
          <div className={styles.tooltipItem}>
            <span className={styles.tooltipName}>Doanh thu</span>
            <span style={{ color: '#fd7e14' }}>${payload[0].value.toLocaleString()}</span>
          </div>
          <div className={styles.tooltipItem}>
            <span className={styles.tooltipName}>Chi phí</span>
            <span style={{ color: '#ff922b' }}>${payload[1].value.toLocaleString()}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const CashflowChart = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h3 className={styles.title}>Dòng tiền</h3>
          <div className={styles.balanceBlock}>
            <span className={styles.balanceLabel}>Tổng số dư:</span>
            <span className={styles.balanceValue}>$562.000</span>
          </div>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.legend}>
            <div className={styles.legendItem}>
              <div className={styles.legendDot} style={{ backgroundColor: '#fd7e14' }} />
              Doanh thu
            </div>
            <div className={styles.legendItem}>
              <div className={styles.legendDot} style={{ backgroundColor: '#ff922b' }} />
              Chi phí
            </div>
          </div>

          <button className={styles.periodButton}>
            Năm nay
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
          </button>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.chartContainer}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#888', fontSize: 11, fontWeight: 500 }}
                dy={10}
              />
              <YAxis
                tickFormatter={(val) => val === 0 ? '0' : `${val / 1000}K`}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#888', fontSize: 11, fontWeight: 500 }}
              />
              <Tooltip content={<CustomTooltip />} />
              
              <Line 
                type="linear" 
                dataKey="income" 
                stroke="#fd7e14" 
                strokeWidth={1.5} 
                dot={false}
                activeDot={{ r: 4, stroke: '#fff', strokeWidth: 2 }} 
              />
              <Line 
                type="linear" 
                dataKey="expense" 
                stroke="#ff922b" 
                strokeWidth={1} 
                strokeDasharray="5 5" 
                dot={false}
                activeDot={{ r: 4, stroke: '#fff', strokeWidth: 2 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
