'use client';

import type { FeedbackType } from '@/types/feedback-type';

import styles from './feedback-type-card.module.css';

type Props = {
  item: FeedbackType;
  onEdit?: (item: FeedbackType) => void;
  onDelete?: (item: FeedbackType) => void;
  onRestore?: (item: FeedbackType) => void;
};

export function FeedbackTypeCard({ item, onEdit, onDelete, onRestore }: Props) {
  const isDeleted = !!item.isDeleted;
  const statusLabel = isDeleted ? 'Đã ẩn' : 'Đang sử dụng';

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.titleRow}>
          <div className={styles.title}>{item.name}</div>
          <span className={`${styles.statusBadge} ${isDeleted ? styles.statusInactive : styles.statusActive}`}>
            {statusLabel}
          </span>
        </div>
        <div className={styles.metaRow}>
          <span className={styles.metaItem}>ID: {item.id}</span>
        </div>
      </div>

      <div className={styles.content}>{item.description || 'Chưa có mô tả cho loại phản hồi này.'}</div>

      <div className={styles.cardFooter}>
        <div className={styles.actions}>
          <button type="button" className={styles.primaryAction} onClick={() => onEdit?.(item)}>
            Sửa
          </button>
          {isDeleted ? (
            <button type="button" className={styles.secondaryAction} onClick={() => onRestore?.(item)}>
              Khôi phục
            </button>
          ) : (
            <button type="button" className={styles.secondaryAction} onClick={() => onDelete?.(item)}>
              Ẩn
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


