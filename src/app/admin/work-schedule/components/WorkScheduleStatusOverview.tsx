'use client';

import React from 'react';

import statisticsService from '@/services/statistics.service';
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

interface StatusBreakdown {
  status: string;
  count: number;
  color: string;
}

interface WorkActivity {
  id: number;
  staffName: string;
  action: string;
  taskName: string;
  timestamp: string;
}

export function WorkScheduleStatusOverview() {
  const [breakdown, setBreakdown] = React.useState<StatusBreakdown[]>([]);
  const [activities, setActivities] = React.useState<WorkActivity[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [breakdownData, activityData] = await Promise.all([
          statisticsService.getWorkScheduleStatusBreakdown(),
          statisticsService.getRecentWorkActivities({ limit: 5 })
        ]);
        setBreakdown(breakdownData);
        setActivities(activityData);
      } catch (error) {
        console.error('Failed to fetch status overview data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalItems = breakdown.reduce((acc, curr) => acc + curr.count, 0);

  // SVG Donut Calculations
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeWidth = 28;
  const size = 250;
  const center = size / 2;

  let currentOffset = 0;
  // We add a small gap between segments
  const gapSize = totalItems > 0 ? 1.5 : 0; 

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
      case 'đã lên lịch': return 'Đã lên lịch';
      case 'done':
      case 'hoàn thành': return 'Hoàn thành';
      case 'missed':
      case 'bỏ lỡ': return 'Bỏ lỡ';
      case 'staffdone':
      case 'nv hoàn thành': return 'NV hoàn thành';
      case 'cancelled':
      case 'đã hủy': return 'Đã hủy';
      default: return status;
    }
  };

  return (
    <div className={layoutStyles.pageContainer}>
      <div className={styles.row}>
        <div className={styles.card}>
          <div className={styles.header}>
            <div>
              <div className={styles.title}>Tổng quan trạng thái</div>
              <div className={styles.subTitle}>
                Ảnh chụp nhanh về trạng thái các công việc của bạn.
              </div>
            </div>
          </div>
          <div className={styles.body}>
            <div className={styles.donutWrapper}>
              <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={styles.donutSvg}>
                {/* Background track */}
                <circle
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke="#F2F4F7"
                  strokeWidth={strokeWidth}
                />
                {/* Status segments */}
                {breakdown.map((item, idx) => {
                  const percentage = (item.count / totalItems) * 100;
                  const dashArray = (percentage / 100) * circumference;
                  
                  // Ensure even 1 item is visible as a dot
                  // If we use strokeLinecap: round, a dashArray of 0.1 still shows a dot
                  // But we need some space for the gap.
                  const visualDash = item.count > 0 
                    ? Math.max(0.1, dashArray - gapSize) 
                    : 0;

                  const dashOffset = -currentOffset;
                  currentOffset += dashArray;

                  return (
                    <circle
                      key={idx}
                      cx={center}
                      cy={center}
                      r={radius}
                      fill="none"
                      stroke={item.color}
                      strokeWidth={strokeWidth}
                      strokeDasharray={`${visualDash} ${circumference - visualDash}`}
                      strokeDashoffset={dashOffset}
                      strokeLinecap="round"
                      transform={`rotate(-90 ${center} ${center})`}
                      style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                    />
                  );
                })}
              </svg>
              <div className={styles.donutInner}>
                <div className={styles.totalLabel}>Tổng cộng</div>
                <div className={styles.totalValue}>{isLoading ? '...' : totalItems}</div>
              </div>
            </div>

            <div className={styles.legendContainer}>
              {breakdown.map((item, idx) => (
                <div key={idx} className={styles.legendRow}>
                  <div className={styles.legendLabelGroup}>
                    <span className={styles.dot} style={{ backgroundColor: item.color }} />
                    <span className={styles.statusName}>{getStatusLabel(item.status)}</span>
                  </div>
                  <span className={styles.statusValueText}>{item.count} công việc</span>
                </div>
              ))}
              {breakdown.length === 0 && !isLoading && (
                <div className={styles.noData}>Không tìm thấy dữ liệu</div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.header}>
            <div className={styles.title}>Hoạt động gần đây</div>
          </div>
          <div className={styles.body} style={{ alignItems: 'stretch', gap: '0', marginTop: '12px' }}>
            {activities.length > 0 ? (
              <div className={styles.activitiesList}>
                {activities.map((act) => (
                  <div key={act.id} className={styles.activityItem}>
                    <span className={styles.topRightBadge}>
                      {act.status}
                    </span>
                    <div className={styles.activityHeader}>
                      <div className={styles.avatarWrapper}>
                        {act.staffAvatar ? (
                          <img src={act.staffAvatar} alt={act.staffFullName || act.staffName} className={styles.avatarImg} />
                        ) : (
                          <div className={styles.avatarPlaceholder}>{(act.staffFullName || act.staffName).charAt(0)}</div>
                        )}
                      </div>
                      <div className={styles.activityContent}>
                        <div className={styles.staffName}>{act.staffFullName || act.staffName}</div>
                        <div className={styles.activityActionText}>
                          {act.action}: <strong className={styles.taskName}>{act.taskName}</strong>
                        </div>
                        <div className={styles.badgeRow}>
                          <span className={styles.timeBadge}>
                            {new Date(act.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} • {new Date(act.timestamp).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.activitiesBody}>
                <ActivitiesGraphic />
                <div className={styles.activitiesTextBlock}>
                  <div className={styles.activitiesTitle}>
                    {isLoading ? 'Đang tải hoạt động...' : 'Chưa có hoạt động'}
                  </div>
                  {!isLoading && (
                    <div className={styles.activitiesText}>
                      Tạo một vài công việc và phân công nhân viên để xem dòng hoạt động tại đây.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
