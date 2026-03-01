'use client';

import type { Feedback } from '@/types/feedback';

import styles from './feedback-card.module.css';

type Props = {
  feedback: Feedback;
  onEdit?: (feedback: Feedback) => void;
  onDelete?: (feedback: Feedback) => void;
};

export function FeedbackCard({ feedback, onEdit, onDelete }: Props) {
  const createdDate = feedback.createdAt ? new Date(feedback.createdAt) : null;
  const createdLabel = createdDate
    ? createdDate.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    : '';

  const initial = feedback.customerName?.charAt(0).toUpperCase() || '?';

  const renderStars = (rating: number) => {
    const max = 5;
    const value = Math.round(Math.min(Math.max(rating / 2, 0), max));
    return new Array(max).fill(null).map((_, index) => (
      <span
        key={index}
        className={index < value ? styles.starActive : styles.star}
      >
        ★
      </span>
    ));
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.titleRow}>
          <div className={styles.title}>{feedback.title || 'Không có tiêu đề'}</div>
          <div className={styles.rating}>{renderStars(feedback.rating)}</div>
        </div>
        <div className={styles.metaRow}>
          <span className={styles.metaItem}>Loại: {feedback.feedbackTypeName}</span>
          {createdLabel && (
            <span className={styles.metaItem}>Ngày tạo: {createdLabel}</span>
          )}
        </div>
      </div>

      <div className={styles.content}>
        {feedback.content || 'Không có nội dung phản hồi.'}
      </div>

      <div className={styles.cardFooter}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>{initial}</div>
          <div className={styles.userMeta}>
            <div className={styles.userName}>{feedback.customerName}</div>
            <div className={styles.userSub}>Khách hàng</div>
          </div>
        </div>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.primaryAction}
            onClick={() => onEdit?.(feedback)}
          >
            Sửa
          </button>
          <button
            type="button"
            className={styles.secondaryAction}
            onClick={() => onDelete?.(feedback)}
          >
            Xóa
          </button>
          <button type="button" className={styles.iconButton}>
            ...
          </button>
        </div>
      </div>
    </div>
  );
}


