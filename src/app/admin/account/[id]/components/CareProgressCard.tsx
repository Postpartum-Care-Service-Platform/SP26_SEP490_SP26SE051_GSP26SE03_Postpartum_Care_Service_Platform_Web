import { CheckCircle2, Clock, XCircle, ChevronRight, Layers } from 'lucide-react';
import React from 'react';

import styles from './care-progress-card.module.css';

interface Activity {
  familyScheduleId: number;
  activityName: string;
  startTime: string;
  endTime: string;
  target: 'Mom' | 'Baby';
  status: 'Done' | 'Missed' | 'Pending';
}

interface CareProgressData {
  progressPercent: number;
  totalActivities: number;
  completedActivities: number;
  missedActivities: number;
  pendingActivities: number;
  activities: Activity[];
}

interface CareProgressCardProps {
  data: CareProgressData;
}

export const CareProgressCard: React.FC<CareProgressCardProps> = ({ data }) => {
  if (!data) return null;

  const activities = data.activities || [];

  return (
    <div className={styles.card}>
      {/* ── New Stats Grid Section ── */}
      <div className={styles.statsGrid}>
        {/* Card: Completed */}
        <div className={styles.statBox}>
          <div className={styles.statIconWrapper} style={{ color: '#22c55e' }}>
            <CheckCircle2 size={18} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValueLabel}>{(data.completedActivities ?? 0)} Hoàn thành</span>
          </div>
        </div>

        {/* Card: Missed */}
        <div className={styles.statBox}>
          <div className={styles.statIconWrapper} style={{ color: '#ef4444' }}>
            <XCircle size={18} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValueLabel}>{(data.missedActivities ?? 0)} Bỏ lỡ</span>
          </div>
        </div>

        {/* Card: Pending */}
        <div className={styles.statBox}>
          <div className={styles.statIconWrapper} style={{ color: '#fa8314' }}>
            <Clock size={18} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValueLabel}>{(data.pendingActivities ?? 0)} Đang chờ</span>
          </div>
        </div>

        {/* Card: Total */}
        <div className={styles.statBox}>
          <div className={styles.statIconWrapper} style={{ color: '#3b82f6' }}>
            <Layers size={18} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValueLabel}>{(data.totalActivities ?? 0)} Tổng số</span>
          </div>
        </div>
      </div>

      <div className={styles.divider} />

      {/* ── Vertical Timeline Section Title ── */}
      <div style={{ padding: '16px 0 8px' }}>
        <h3 style={{
          fontSize: '15px',
          fontWeight: 700,
          color: '#1a1d23',
          margin: 0,
          fontFamily: 'var(--font-admin-title, "Lexend Deca", sans-serif)'
        }}>
          Nhật ký công việc
        </h3>
      </div>

      {/* ── Vertical Timeline List ── */}
      <div className={styles.activityList}>
        {activities.slice(0, 3).map((activity) => {
          let nodeColor = '#f1f3f5';
          let iconColor = '#adb5bd';
          if (activity.status === 'Done') { nodeColor = '#ecfdf5'; iconColor = '#22c55e'; }
          if (activity.status === 'Missed') { nodeColor = '#fef2f2'; iconColor = '#ef4444'; }
          if (activity.status === 'Pending') { nodeColor = '#fff7ed'; iconColor = '#fa8314'; }

          return (
            <div key={activity.familyScheduleId} className={styles.activityItem}>
              {/* Vertical Dot/Icon */}
              <div className={styles.statusNode} style={{ backgroundColor: nodeColor }}>
                {activity.status === 'Done' && <CheckCircle2 size={16} color={iconColor} />}
                {activity.status === 'Missed' && <XCircle size={16} color={iconColor} />}
                {activity.status === 'Pending' && <Clock size={16} color={iconColor} />}
              </div>

              {/* Content on the right */}
              <div className={styles.activityContent}>
                <div className={styles.activityHeader}>
                  <h5 className={styles.activityTitle}>{activity.activityName}</h5>
                  <span className={styles.timeText}>
                    {activity.startTime?.substring(0, 5) || '--:--'} - {activity.endTime?.substring(0, 5) || '--:--'}
                  </span>
                </div>
                <div className={styles.activityDetails}>
                  <span className={`${styles.targetBadge} ${activity.target === 'Mom' ? styles.targetMom : styles.targetBaby}`}>
                    {activity.target === 'Mom' ? 'Mẹ' : 'Bé'}
                  </span>
                  <div className={styles.dividerDot} />
                  <span style={{ fontSize: '12px', color: '#8c94a3' }}>Dịch vụ tại trung tâm</span>
                </div>
              </div>
            </div>
          );
        })}

        {activities.length === 0 && (
          <div style={{ padding: '32px 0', textAlign: 'center' }}>
            <p style={{ color: '#adb5bd', fontSize: '13px', margin: 0 }}>Không có hoạt động nào được ghi nhận.</p>
          </div>
        )}
      </div>

      <button
        className={styles.viewAllBtn}
        onClick={() => {
          const element = document.getElementById('room-allotment-schedule');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      >
        Xem tất cả {data.totalActivities ?? 0} hoạt động
      </button>
    </div>
  );
};
