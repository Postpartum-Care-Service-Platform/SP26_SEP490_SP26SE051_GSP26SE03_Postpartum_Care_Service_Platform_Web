'use client';

import React, { useState } from 'react';
import styles from './revenue-chart.module.css';

// Using realistic large numbers to test dynamic scaling
const MOCK_DATA = [
  { month: 'Thg 1', weeks: [ {n: 20000, e: 40000}, {n: 30000, e: 50000}, {n: 50000, e: 80000}, {n: 20000, e: 30000} ] },
  { month: 'Thg 2', weeks: [ {n: 80000, e: 40000}, {n: 120000, e: 60000}, {n: 150000, e: 80000}, {n: 90000, e: 50000} ] },
  { month: 'Thg 3', weeks: [ {n: 50000, e: 50000}, {n: 100000, e: 80000}, {n: 70000, e: 100000}, {n: 120000, e: 120000} ] },
  { month: 'Thg 4', weeks: [ {n: 40000, e: 60000}, {n: 60000, e: 90000}, {n: 50000, e: 120000}, {n: 80000, e: 80000} ] },
  { month: 'Thg 5', weeks: [ {n: 100000, e: 150000}, {n: 180000, e: 200000}, {n: 120000, e: 100000}, {n: 80000, e: 120000} ] },
  { month: 'Thg 6', weeks: [ {n: 80000, e: 40000}, {n: 120000, e: 50000}, {n: 100000, e: 60000}, {n: 60000, e: 40000} ] }, 
  { month: 'Thg 7', weeks: [ {n: 40000, e: 80000}, {n: 180000, e: 120000}, {n: 140000, e: 100000}, {n: 50000, e: 50000} ] },
  { month: 'Thg 8', weeks: [ {n: 50000, e: 40000}, {n: 80000, e: 80000}, {n: 150000, e: 100000}, {n: 90000, e: 60000} ] },
  { month: 'Thg 9', weeks: [ {n: 40000, e: 50000}, {n: 80000, e: 100000}, {n: 180000, e: 140000}, {n: 50000, e: 50000} ] },
  { month: 'Thg 10', weeks: [ {n: 40000, e: 40000}, {n: 60000, e: 50000}, {n: 100000, e: 80000}, {n: 80000, e: 60000} ] },
  { month: 'Thg 11', weeks: [ {n: 30000, e: 30000}, {n: 50000, e: 60000}, {n: 80000, e: 100000}, {n: 120000, e: 80000} ] },
  { month: 'Thg 12', weeks: [ {n: 40000, e: 50000}, {n: 70000, e: 80000}, {n: 100000, e: 120000}, {n: 50000, e: 60000} ] },
];

export const RevenueChart = () => {
  const [activeTab, setActiveTab] = useState('Hàng tháng');
  const [hoveredMonthIndex, setHoveredMonthIndex] = useState<number | null>(null);

  const range = (n: number) => Array.from({ length: n }, (_, i) => i);

  // 1. Calculate Maximum Peak (the single tallest column in the data)
  let maxColumnValue = 0;
  MOCK_DATA.forEach(month => {
    month.weeks.forEach(week => {
      const colTotal = week.n + week.e;
      if (colTotal > maxColumnValue) maxColumnValue = colTotal;
    });
  });

  const MAX_BLOCKS = 25;
  const roundScale = Math.pow(10, Math.floor(Math.log10(maxColumnValue || 1)));
  const yAxisMax = Math.ceil(maxColumnValue / roundScale) * roundScale;

  const valuePerBlock = yAxisMax / MAX_BLOCKS;

  const yAxisSteps = [
    yAxisMax,
    yAxisMax * 0.8,
    yAxisMax * 0.6,
    yAxisMax * 0.4,
    yAxisMax * 0.2,
    0
  ];

  const formatCurrencyLabel = (val: number) => {
    if (val === 0) return '0';
    if (val >= 1000000) return `${(val / 1000000).toFixed(1).replace('.0', '')}tr`;
    return `${Math.round(val / 1000)}k`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.titleText}>Tổng doanh thu :</span>
          <span className={styles.titleValue}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(3420320000)}</span>
        </div>
        
        <div className={styles.legendGroup}>
          <div className={styles.legendItem}>
            <span className={styles.legendIconNew}>+</span>
            <span className={styles.legendText}>NGƯỜI DÙNG MỚI</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendIconExist}></span>
            <span className={styles.legendText}>NGƯỜI DÙNG CŨ</span>
          </div>
        </div>

        <div className={styles.tabGroup}>
          {['Hàng tuần', 'Hàng tháng', 'Hàng năm'].map((tab) => (
            <button
              key={tab}
              className={`${styles.tabItem} ${activeTab === tab ? styles.activeTab : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.chartWrapper}>
        <div className={styles.yAxis}>
          {yAxisSteps.map((v, i) => (
            <div key={i} className={styles.yLabelRow}>
              <span className={styles.yLabelText}>{formatCurrencyLabel(v)}</span>
              <div className={styles.yDashedLine} />
            </div>
          ))}
        </div>

        <div className={styles.chartArea} onMouseLeave={() => setHoveredMonthIndex(null)}>
          {MOCK_DATA.map((monthData, mIndex) => {
             const isHovered = hoveredMonthIndex === mIndex;
             
             const sumNew = monthData.weeks.reduce((acc, w) => acc + w.n, 0);
             const sumExist = monthData.weeks.reduce((acc, w) => acc + w.e, 0);

             return (
              <div 
                key={monthData.month} 
                className={`${styles.column} ${isHovered ? styles.hoverActive : ''}`}
                onMouseEnter={() => setHoveredMonthIndex(mIndex)}
              >
                {/* Visual tooltip */}
                {isHovered && (
                  <div className={styles.tooltip}>
                    <div className={styles.tooltipMonth}>
                      {monthData.month}, 2025
                    </div>
                    <div className={styles.tooltipRow}>
                      <span className={styles.tooltipIconNew}>+</span>
                      <span className={styles.tooltipLabel}>Người dùng mới</span>
                      <span className={styles.tooltipDesc}>{formatCurrencyLabel(sumNew)}</span>
                    </div>
                    <div className={styles.tooltipRow}>
                      <span className={styles.tooltipIconExist}>•</span>
                      <span className={styles.tooltipLabel}>Người dùng cũ</span>
                      <span className={styles.tooltipDesc}>{formatCurrencyLabel(sumExist)}</span>
                    </div>
                  </div>
                )}
                
                {/* Dotted tracking line */}
                {isHovered && <div className={styles.hoverGuide} />}

                {/* Weeks Rendering calculated dynamically by valuePerBlock */}
                <div style={{ display: 'flex', gap: '3px', zIndex: 1 }}>
                  {monthData.weeks.map((week, wIndex) => {
                    const blockCountNew = Math.round(week.n / valuePerBlock);
                    const blockCountExist = Math.round(week.e / valuePerBlock);
                    
                    return (
                      <div key={wIndex} style={{ display: 'flex', flexDirection: 'column-reverse', gap: '2px' }}>
                        {/* Orange blocks for existing users */}
                        {range(blockCountExist).map((i) => (
                          <div key={`e-${i}`} className={`${styles.block} ${styles.blockExist}`} />
                        ))}
                        {/* Grey blocks for new users stacked on top */}
                        {range(blockCountNew).map((i) => (
                          <div key={`n-${i}`} className={`${styles.block} ${styles.blockNew}`} />
                        ))}
                      </div>
                    )
                  })}
                </div>

                <div className={styles.xLabel}>{monthData.month}</div>
              </div>
             );
          })}
        </div>
      </div>
    </div>
  );
};
