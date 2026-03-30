'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

import styles from './cashflow-chart.module.css';

const data = [
  { name: 'Jan', income: 6000, expense: -3000 },
  { name: 'Feb', income: 4200, expense: -5500 },
  { name: 'Mar', income: 5500, expense: -4500 },
  { name: 'Apr', income: 7500, expense: -2000 },
  { name: 'May', income: 4500, expense: -4500 },
  { name: 'Jun', income: 6500, expense: -4000 },
  { name: 'Jul', income: 3000, expense: -4500 },
  { name: 'Aug', income: 4500, expense: -5000 },
  { name: 'Sep', income: 7500, expense: -5000 },
  { name: 'Oct', income: 6000, expense: -4500 },
  { name: 'Nov', income: 4000, expense: -6500 },
  { name: 'Dec', income: 5000, expense: -3500 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.tooltip}>
        <p className={styles.tooltipLabel}>{label} 2025</p>
        <div className={styles.tooltipContent}>
          <div className={styles.tooltipItem}>
            <span className={styles.tooltipName}>Income</span>
            <span>${payload[0].value.toLocaleString()}</span>
          </div>
          <div className={styles.tooltipItem}>
            <span className={styles.tooltipName}>Expense</span>
            {/* Convert negative expense to absolute value string */}
            <span>${Math.abs(payload[1].value).toLocaleString()}</span>
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
        <h3 className={styles.title}>Cashflow</h3>
        <div className={styles.headerRight}>
          <div className={styles.legend}>
            <div className={styles.legendItem}>
              <div className={styles.legendDot} style={{ backgroundColor: '#204642' }} />
              Income
            </div>
            <div className={styles.legendItem}>
              <div className={styles.legendDot} style={{ backgroundColor: '#b6ea7b' }} />
              Expense
            </div>
          </div>
          
          <button className={styles.periodButton}>
            This Year
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
        <div className={styles.balanceBlock}>
          <span className={styles.balanceLabel}>Total Balance</span>
          <span className={styles.balanceValue}>$562.000</span>
        </div>
        
        <div className={styles.chartContainer}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
              barSize={42}
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
                tickFormatter={(val) => val === 0 ? '0' : val > 0 ? `${val / 1000}K` : `-${Math.abs(val) / 1000}K`}
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#888', fontSize: 11, fontWeight: 500 }} 
                domain={[-8000, 8000]}
                ticks={[-8000, -4000, 0, 4000, 8000]}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
              <ReferenceLine y={0} stroke="#eaeaea" />
              
              {/* Stacked bars configuration allows placing them on the same vertical axis, one positive, one negative */}
              <Bar dataKey="income" stackId="a" fill="#204642" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" stackId="a" fill="#b6ea7b" radius={[0, 0, 4, 4]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
