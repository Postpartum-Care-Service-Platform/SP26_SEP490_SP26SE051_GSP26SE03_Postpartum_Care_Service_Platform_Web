'use client';

import React from 'react';

import statisticsService from '@/services/statistics.service';
import layoutStyles from './work-schedule-layout.module.css';
import styles from './work-schedule-overview.module.css';





function ScheduledIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.iconSvg}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  );
}

function DoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.iconSvg}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  );
}

function MissedIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.iconSvg}>
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
  );
}

function StaffDoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.iconSvg}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="8.5" cy="7" r="4"></circle>
      <polyline points="17 11 19 13 23 9"></polyline>
    </svg>
  );
}


function StatCard({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className={styles.card}>
      <div className={styles.icon}>{icon}</div>
      <div className={styles.text}>
        <div className={styles.title}>{title}</div>
      </div>
    </div>
  );
}

export function WorkScheduleOverview() {
  const [stats, setStats] = React.useState<{
    scheduledCount: number;
    doneCount: number;
    missedCount: number;
    staffDoneCount: number;
  } | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const data = await statisticsService.getWorkScheduleSummary();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch work schedule summary:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className={styles.wrap}>
      <div className={layoutStyles.pageContainer}>
        <div className={styles.row}>
          <StatCard
            icon={<ScheduledIcon />}
            title={`${isLoading ? '...' : stats?.scheduledCount ?? 0} đã lên lịch`}
          />
          <StatCard
            icon={<DoneIcon />}
            title={`${isLoading ? '...' : stats?.doneCount ?? 0} đã hoàn thành`}
          />
          <StatCard
            icon={<MissedIcon />}
            title={`${isLoading ? '...' : stats?.missedCount ?? 0} đã bỏ lỡ`}
          />
          <StatCard
            icon={<StaffDoneIcon />}
            title={`${isLoading ? '...' : stats?.staffDoneCount ?? 0} NV hoàn thành`}
          />
        </div>
      </div>
    </div>
  );
}

