'use client';

import styles from './room-allotment-status-legend.module.css';

export function RoomAllotmentStatusLegend() {
  const statuses = [
    { label: 'Đã đặt', color: '#3b82f6' },
    { label: 'Đang sử dụng', color: '#10b981' },
    { label: 'Lên lịch dọn dẹp', color: '#fbbf24' },
    { label: 'Cần sửa chữa', color: '#ef4444' },
    { label: 'Có sẵn', color: '#a855f7' },
    { label: 'Bảo trì', color: '#d97706' },
  ];

  return (
    <div className={styles.legend}>
      {statuses.map((status) => (
        <div key={status.label} className={styles.legendItem}>
          <div className={styles.dot} style={{ backgroundColor: status.color }} />
          <span className={styles.label}>{status.label}</span>
        </div>
      ))}
    </div>
  );
}

