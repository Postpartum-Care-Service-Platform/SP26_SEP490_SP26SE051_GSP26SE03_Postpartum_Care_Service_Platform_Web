'use client';

import React, { useState } from 'react';
import styles from './revenue-chart.module.css';

// Using realistic large numbers to test dynamic scaling
const MOCK_DATA = [
  { month: 'JAN', weeks: [ {n: 20000, e: 40000}, {n: 30000, e: 50000}, {n: 50000, e: 80000}, {n: 20000, e: 30000} ] },
  { month: 'FEB', weeks: [ {n: 80000, e: 40000}, {n: 120000, e: 60000}, {n: 150000, e: 80000}, {n: 90000, e: 50000} ] },
  { month: 'MAR', weeks: [ {n: 50000, e: 50000}, {n: 100000, e: 80000}, {n: 70000, e: 100000}, {n: 120000, e: 120000} ] },
  { month: 'APR', weeks: [ {n: 40000, e: 60000}, {n: 60000, e: 90000}, {n: 50000, e: 120000}, {n: 80000, e: 80000} ] },
  { month: 'MAY', weeks: [ {n: 100000, e: 150000}, {n: 180000, e: 200000}, {n: 120000, e: 100000}, {n: 80000, e: 120000} ] }, // high point
  { month: 'JUN', weeks: [ {n: 80000, e: 40000}, {n: 120000, e: 50000}, {n: 100000, e: 60000}, {n: 60000, e: 40000} ] }, 
  { month: 'JUL', weeks: [ {n: 40000, e: 80000}, {n: 180000, e: 120000}, {n: 140000, e: 100000}, {n: 50000, e: 50000} ] },
  { month: 'AUG', weeks: [ {n: 50000, e: 40000}, {n: 80000, e: 80000}, {n: 150000, e: 100000}, {n: 90000, e: 60000} ] },
  { month: 'SEP', weeks: [ {n: 40000, e: 50000}, {n: 80000, e: 100000}, {n: 180000, e: 140000}, {n: 50000, e: 50000} ] },
  { month: 'OCT', weeks: [ {n: 40000, e: 40000}, {n: 60000, e: 50000}, {n: 100000, e: 80000}, {n: 80000, e: 60000} ] },
  { month: 'NOV', weeks: [ {n: 30000, e: 30000}, {n: 50000, e: 60000}, {n: 80000, e: 100000}, {n: 120000, e: 80000} ] },
  { month: 'DEC', weeks: [ {n: 40000, e: 50000}, {n: 70000, e: 80000}, {n: 100000, e: 120000}, {n: 50000, e: 60000} ] },
];

export const RevenueChart = () => {
  const [activeTab, setActiveTab] = useState('Monthly');
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

  // Calculate dynamic threshold based on visual blocks
  // With a chart height of ~340px and blocks taking 12px vertical space (10px + 2px gap)
  // we can neatly fit around 25 blocks maximum. Let's use 25 as our top bound.
  const MAX_BLOCKS = 25;
  
  // Calculate top of the Y-axis. We want nice round numbers (e.g. 400,000, not 380,000)
  // Round to nearest 100k for the top of the graph (or 10k depending on scale)
  const roundScale = Math.pow(10, Math.floor(Math.log10(maxColumnValue || 1)));
  const yAxisMax = Math.ceil(maxColumnValue / roundScale) * roundScale;

  // Each square block equals this amount of revenue
  const valuePerBlock = yAxisMax / MAX_BLOCKS;

  // Generate Y-Axis steps (6 markers: 100%, 80%, 60%, 40%, 20%, 0)
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
    if (val >= 1000000) return `${(val / 1000000).toFixed(1).replace('.0', '')}M`;
    return `${Math.round(val / 1000)}k`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.titleText}>Total Revenue :</span>
          <span className={styles.titleValue}>$3,420,320</span> {/* Dummy aggregate */}
        </div>
        
        <div className={styles.legendGroup}>
          <div className={styles.legendItem}>
            <span className={styles.legendIconNew}>+</span>
            <span className={styles.legendText}>NEW USER</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendIconExist}></span>
            <span className={styles.legendText}>EXISTING USER</span>
          </div>
        </div>

        <div className={styles.tabGroup}>
          {['Weekly', 'Monthly', 'Yearly'].map((tab) => (
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
             
             // Tooltip aggregates logic
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
                      {monthData.month} 2025
                    </div>
                    <div className={styles.tooltipRow}>
                      <span className={styles.tooltipIconNew}>+</span>
                      <span className={styles.tooltipLabel}>New User</span>
                      <span className={styles.tooltipDesc}>{formatCurrencyLabel(sumNew)}</span>
                    </div>
                    <div className={styles.tooltipRow}>
                      <span className={styles.tooltipIconExist}>•</span>
                      <span className={styles.tooltipLabel}>Existing User</span>
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
