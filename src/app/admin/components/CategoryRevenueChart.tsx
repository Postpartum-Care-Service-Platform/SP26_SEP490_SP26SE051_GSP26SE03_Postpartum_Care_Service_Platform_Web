'use client';

import React from 'react';
import { Calendar, Sparkles, ChevronRight } from 'lucide-react';
import styles from './category-revenue-chart.module.css';

const MOCK_DATA = [
  { val: 40 }, { val: 65 }, { val: 30 }, { val: 80 }, { val: 55 },
  { val: 40 }, { val: 50 }, { val: 70 }, { val: 60 }, { val: 85 },
  { val: 65 }, { val: 50 }, { val: 90 }, { val: 70 }, { val: 45 },
  { val: 50 }, { val: 30 },
];

export const CategoryRevenueChart = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <span className={styles.titleText}>Revenue by Category</span>
          <span className={styles.titleValue}>$20,320</span>
        </div>
        
        <button className={styles.dateFilter}>
          <Calendar size={14} />
          Jan 1 - Aug 30
        </button>
      </div>

      <button className={styles.insightButton}>
        <Sparkles size={14} className={styles.insightIcon} />
        Get AI insight for better analysis
        <ChevronRight size={14} className={styles.insightArrow} />
      </button>

      <div className={styles.chartWrapper}>
        <div className={styles.yAxis}>
          <div className={styles.yDashedLine} />
          <div className={styles.yDashedLine} />
          <div className={styles.yDashedLine} />
          <div className={styles.yDashedLine} />
          <div className={styles.yDashedLine} />
        </div>

        <div className={styles.chartArea}>
          {MOCK_DATA.map((item, index) => (
            <div key={index} className={styles.barTrack}>
              <div 
                className={styles.barFill} 
                style={{ height: `${item.val}%` }} 
              />
            </div>
          ))}
        </div>

        <div className={styles.xAxis}>
          <span>1 JAN</span>
          <span>30 JAN 2025</span>
        </div>
      </div>
    </div>
  );
};
