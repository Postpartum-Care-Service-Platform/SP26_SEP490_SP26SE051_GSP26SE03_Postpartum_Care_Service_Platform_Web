'use client';

import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import type { Activity } from '@/types/activity';

import styles from './activity-table.module.css';

const Edit2OutlineIcon = ({ fill = '#A47BC8', size = 16 }: { fill?: string; size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" className="eva eva-edit-2-outline" fill={fill}>
    <g data-name="Layer 2">
      <g data-name="edit-2">
        <rect width="24" height="24" opacity="0" />
        <path d="M19 20H5a1 1 0 0 0 0 2h14a1 1 0 0 0 0-2z" />
        <path d="M5 18h.09l4.17-.38a2 2 0 0 0 1.21-.57l9-9a1.92 1.92 0 0 0-.07-2.71L16.66 2.6A2 2 0 0 0 14 2.53l-9 9a2 2 0 0 0-.57 1.21L4 16.91a1 1 0 0 0 .29.8A1 1 0 0 0 5 18zM15.27 4L18 6.73l-2 1.95L13.32 6zm-8.9 8.91L12 7.32l2.7 2.7-5.6 5.6-3 .28z" />
      </g>
    </g>
  </svg>
);

const Trash2OutlineIcon = ({ fill = '#FD6161', size = 16 }: { fill?: string; size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" className="eva eva-trash-2-outline" fill={fill}>
    <g data-name="Layer 2">
      <g data-name="trash-2">
        <rect width="24" height="24" opacity="0" />
        <path d="M21 6h-5V4.33A2.42 2.42 0 0 0 13.5 2h-3A2.42 2.42 0 0 0 8 4.33V6H3a1 1 0 0 0 0 2h1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8h1a1 1 0 0 0 0-2zM10 4.33c0-.16.21-.33.5-.33h3c.29 0 .5.17.5.33V6h-4zM18 19a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V8h12z" />
        <path d="M9 17a1 1 0 0 0 1-1v-4a1 1 0 0 0-2 0v4a1 1 0 0 0 1 1z" />
        <path d="M15 17a1 1 0 0 0 1-1v-4a1 1 0 0 0-2 0v4a1 1 0 0 0 1 1z" />
      </g>
    </g>
  </svg>
);

type Props = {
  activities: Activity[];
  onEdit?: (activity: Activity) => void;
  onDelete?: (activity: Activity) => void;
  deletingId?: number | null;
  currentPage?: number;
  pageSize?: number;
};

const TARGET_LABEL: Record<string | number, string> = {
  0: 'Mẹ',
  1: 'Bé',
  2: 'Cả hai',
  'Mom': 'Mẹ',
  'Baby': 'Bé',
  'Both': 'Cả hai',
};

export function ActivityTable({ activities, onEdit, onDelete, deletingId, currentPage = 1, pageSize = 10 }: Props) {
  return (
    <div className={styles.tableWrapper}>
      <div className={styles.scrollContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.sttHeaderCell} title="Số thứ tự">STT</th>
              <th>Tên hoạt động</th>
              <th>Mô tả</th>
              <th>Giá</th>
              <th>Loại</th>
              <th>Đối tượng</th>
              <th>Thời lượng (phút)</th>
              <th>Trạng thái</th>
              <th className={styles.stickyColHeader}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {activities.length === 0 ? (
              <tr>
                <td colSpan={9} className={styles.emptyState}>
                  Chưa có hoạt động nào
                </td>
              </tr>
            ) : (
              activities.map((activity, index) => {
                const isActive = activity.status === 0 || activity.status === 'Active';
                const stt = (currentPage - 1) * pageSize + index + 1;

                return (
                  <tr key={activity.id} className={styles.tableRow}>
                    <td className={styles.sttDataCell}>
                      <span className={styles.sttCell} title={`ID gốc: ${activity.id}`}>
                        {stt}
                      </span>
                    </td>
                    <td className={styles.name}>
                      <div className={styles.tooltipWrapper}>
                        <span className={styles.textTruncate}>{activity.name || '-'}</span>
                        <span className={styles.tooltip}>{activity.name || '-'}</span>
                      </div>
                    </td>
                    <td className={styles.truncateCell}>
                      {activity.description ? (
                        <div className={styles.tooltipWrapper}>
                          <span className={styles.textTruncate}>{activity.description}</span>
                          <span className={styles.tooltip}>{activity.description}</span>
                        </div>
                      ) : '-'}
                    </td>
                    <td>{activity.price != null ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(activity.price) : '-'}</td>
                    <td>{activity.activityTypeName || '-'}</td>
                    <td>
                      <span className={styles.targetBadge}>
                        {TARGET_LABEL[activity.target] ?? activity.target ?? '-'}
                      </span>
                    </td>
                    <td>{activity.duration != null ? activity.duration : '-'}</td>
                    <td>
                      <span
                        className={`${styles.statusBadge} ${isActive ? styles.statusActive : styles.statusInactive}`}
                      >
                        {isActive ? 'Hoạt động' : 'Tạm dừng'}
                      </span>
                    </td>
                    <td className={styles.stickyCol}>
                      <div className={styles.actions}>
                        {/* Tooltip wrapper cho nút Chỉnh sửa */}
                        <div className={styles.tooltipWrapper}>
                          <Button
                            variant="outline"
                            size="sm"
                            className={`${styles.editButton} btn-icon btn-sm`}
                            onClick={() => onEdit?.(activity)}
                            aria-label={`Chỉnh sửa ${activity.name}`}
                          >
                            <Edit2OutlineIcon fill="#A47BC8" size={16} />
                          </Button>
                          <span className={styles.tooltip}>Chỉnh sửa</span>
                        </div>

                        {/* Tooltip wrapper cho nút Xóa */}
                        <div className={styles.tooltipWrapper}>
                          <Button
                            variant="outline"
                            size="sm"
                            className={`${styles.deleteButton} btn-icon btn-sm`}
                            onClick={() => onDelete?.(activity)}
                            aria-label={`Xóa ${activity.name}`}
                            disabled={deletingId === activity.id}
                          >
                            <Trash2OutlineIcon fill="#FD6161" size={16} />
                          </Button>
                          <span className={styles.tooltip}>Xóa</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
