'use client';

import { Cross1Icon } from '@radix-ui/react-icons';
import { Eye } from 'lucide-react';

import type { Feedback } from '@/types/feedback';

import styles from './feedback-detail-modal.module.css';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feedback?: Feedback | null;
};

const renderStars = (rating: number) => {
  const max = 5;
  const value = Math.round(Math.min(Math.max(rating / 2, 0), max));
  return (
    <span>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} style={{ color: i < value ? '#f59e0b' : '#d1d5db', fontSize: 20 }}>★</span>
      ))}
      <span style={{ fontSize: 13, color: '#6c757d', marginLeft: 6 }}>({rating}/10)</span>
    </span>
  );
};

const normalizeImages = (images: any): string[] => {
  if (!images) return [];
  if (Array.isArray(images)) return images;
  if (typeof images === 'object') return Object.values(images) as string[];
  return [];
};

export function FeedbackDetailModal({ open, onOpenChange, feedback }: Props) {
  if (!open || !feedback) return null;

  const date = feedback.createdAt
    ? new Date(feedback.createdAt).toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' })
    : '—';

  return (
    <div className={styles.modalOverlay} onClick={() => onOpenChange(false)}>
      <div className={styles.modalContent} role="dialog" aria-modal="true"
        aria-labelledby="feedback-detail-title" onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 id="feedback-detail-title" className={styles.modalTitle}>Chi tiết phản hồi</h2>
          <button type="button" onClick={() => onOpenChange(false)} className={styles.closeButton} aria-label="Đóng">
            <Cross1Icon />
          </button>
        </div>

        <div className={styles.modalBody}>
          {/* Stars */}
          <div className={styles.starsRow}>{renderStars(feedback.rating)}</div>

          {/* Title */}
          <div className={styles.feedbackTitle}>{feedback.title || 'Không có tiêu đề'}</div>

          {/* Content */}
          <div className={styles.feedbackContent}>{feedback.content || 'Không có nội dung.'}</div>

          {/* Meta */}
          <div className={styles.metaGrid}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Khách hàng</span>
              <span className={styles.metaValue}>{feedback.customerName || '—'}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Loại phản hồi</span>
              <span className={styles.metaValue}>{feedback.feedbackTypeName || '—'}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Ngày tạo</span>
              <span className={styles.metaValue}>{date}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Trạng thái</span>
              <span className={`${styles.statusBadge} ${feedback.isDeleted ? styles.statusDeleted : styles.statusActive}`}>
                {feedback.isDeleted ? 'Đã ẩn' : 'Hiển thị'}
              </span>
            </div>
          </div>

          {/* Images */}
          {(() => {
            const images = normalizeImages(feedback.images);
            return images.length > 0 && (
              <div className={styles.imagesSection}>
                <div className={styles.metaLabel}>Hình ảnh</div>
                <div className={styles.imagesGrid}>
                  {images.map((src, i) => (
                    <a key={i} href={src} target="_blank" rel="noopener noreferrer">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt={`Ảnh phản hồi ${i + 1}`} className={styles.thumbnail} />
                    </a>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>

        <div className={styles.modalFooter}>
          <button type="button" className={`${styles.button} ${styles.buttonOutline}`}
            onClick={() => onOpenChange(false)}>Đóng</button>
        </div>
      </div>
    </div>
  );
}
