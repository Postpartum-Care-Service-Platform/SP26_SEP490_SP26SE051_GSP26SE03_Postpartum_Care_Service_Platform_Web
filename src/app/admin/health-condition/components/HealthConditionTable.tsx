'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { HealthCondition } from '@/types/health-record';
import styles from './health-condition-table.module.css';

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
  conditions: HealthCondition[];
  onEdit?: (condition: HealthCondition) => void;
  onDelete?: (condition: HealthCondition) => void;
  deletingId?: number | null;
  currentPage?: number;
  pageSize?: number;
};

const formatDate = (dateString?: string) => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
};

const translateCategory = (category: string) => {
  const map: Record<string, string> = {
    'ALLERGY': 'Dị ứng',
    'DISEASE': 'Bệnh lý',
    'OTHER': 'Khác'
  };
  return map[category] || category;
};

const translateAppliesTo = (appliesTo: string) => {
  const map: Record<string, string> = {
    'MOM': 'Mẹ',
    'BABY': 'Bé',
    'BOTH': 'Cả hai'
  };
  return map[appliesTo] || appliesTo;
};

const getCategoryBadgeClass = (category: string) => {
  switch (category) {
    case 'ALLERGY': return styles.badgeAllergy;
    case 'DISEASE': return styles.badgeDisease;
    default: return styles.badgeOther;
  }
};

export function HealthConditionTable({ 
  conditions, 
  onEdit, 
  onDelete, 
  deletingId, 
  currentPage = 1, 
  pageSize = 10 
}: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.sttHeaderCell}>STT</th>
              <th>Mã</th>
              <th>Tên tình trạng</th>
              <th>Phân loại</th>
              <th>Đối tượng</th>
              <th>Mô tả</th>
              <th>Cập nhật lần cuối</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {conditions.length === 0 ? (
              <tr>
                <td colSpan={8} className={styles.emptyState}>
                  Chưa có tình trạng sức khỏe nào
                </td>
              </tr>
            ) : (
              conditions.map((condition, index) => {
                const stt = (currentPage - 1) * pageSize + index + 1;

                return (
                  <tr key={condition.id} className={styles.tableRow}>
                    <td className={styles.sttDataCell}>
                      <span className={styles.sttCell}>{stt}</span>
                    </td>
                    <td className={styles.code}><code>{condition.code}</code></td>
                    <td className={styles.name}>{condition.name}</td>
                    <td>
                      <span className={`${styles.badge} ${getCategoryBadgeClass(condition.category)}`}>
                        {translateCategory(condition.category)}
                      </span>
                    </td>
                    <td>
                      <span className={styles.appliesToBadge}>
                        {translateAppliesTo(condition.appliesTo)}
                      </span>
                    </td>
                    <td className={styles.truncateCell}>
                      <div className={styles.tooltipWrapper}>
                        <span className={styles.textTruncate}>{condition.description}</span>
                        <span className={styles.tooltip}>{condition.description}</span>
                      </div>
                    </td>
                    <td>{formatDate(condition.updatedAt)}</td>
                    <td>
                      <div className={styles.actions}>
                        <div className={styles.tooltipWrapper}>
                          <Button
                            variant="outline"
                            size="sm"
                            className={styles.editButton}
                            onClick={() => onEdit?.(condition)}
                          >
                            <Edit2OutlineIcon fill="#A47BC8" size={16} />
                          </Button>
                          <span className={styles.tooltip}>Chỉnh sửa</span>
                        </div>
                        <div className={styles.tooltipWrapper}>
                          <Button
                            variant="outline"
                            size="sm"
                            className={styles.deleteButton}
                            onClick={() => onDelete?.(condition)}
                            disabled={deletingId === condition.id}
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
