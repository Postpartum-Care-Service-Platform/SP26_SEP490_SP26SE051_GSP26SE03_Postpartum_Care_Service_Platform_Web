'use client';

import React from 'react';

import layoutStyles from './work-schedule-layout.module.css';
import styles from './work-schedule-status-overview.module.css';

function ActivitiesGraphic() {
  return (
    <svg
      width="96"
      height="96"
      viewBox="0 0 96 96"
      fill="none"
      aria-hidden="true"
    >
      <path d="M79.8599 43.4902H31.1499V67.2902H79.8599V43.4902Z" fill="#1868DB" />
      <path d="M64.72 28.71H16.01V52.51H64.72V28.71Z" fill="#DDDEE1" />
      <path d="M64.7199 43.4902H31.1499V52.5102H64.7199V43.4902Z" fill="#09326C" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M76.8299 52.09L66.3399 62.58L60.9199 57.01L63.2599 54.74L66.3799 57.94L74.5299 49.79L76.8399 52.1L76.8299 52.09Z"
        fill="white"
      />
    </svg>
  );
}

export function WorkScheduleStatusOverview() {
  return (
    <div className={layoutStyles.pageContainer}>
      <div className={styles.row}>
        <div className={styles.card}>
          <div className={styles.header}>
            <div>
              <div className={styles.title}>Status overview</div>
              <div className={styles.subTitle}>
                Get a snapshot of the status of your work items.
                <button type="button" className={styles.inlineLink}>
                  View all work items
                </button>
              </div>
            </div>
          </div>
          <div className={styles.body}>
            <div className={styles.donutWrapper}>
              <div className={styles.donutOuter}>
                <div className={styles.donutInner}>
                  <div className={styles.donutValue}>15</div>
                  <div className={styles.donutLabel}>Total work item...</div>
                </div>
              </div>
            </div>

            <div className={styles.legend}>
              <span className={styles.legendColor} />
              <span className={styles.legendText}>To Do: 15</span>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.activitiesBody}>
            <ActivitiesGraphic />
            <div className={styles.activitiesTextBlock}>
              <div className={styles.activitiesTitle}>No activity yet</div>
              <div className={styles.activitiesText}>
                Create a few work items and invite some teammates to your space
                to see your space activity.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
