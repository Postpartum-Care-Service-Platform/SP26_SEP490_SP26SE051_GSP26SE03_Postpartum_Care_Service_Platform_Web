'use client';

import { Cross1Icon } from '@radix-ui/react-icons';

import type { MedicalRecord } from '@/types/medical-record';

import styles from './medical-record-detail-modal.module.css';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record?: MedicalRecord | null;
};

export function MedicalRecordDetailModal({ open, onOpenChange, record }: Props) {
  if (!open || !record) return null;

  const date = record.createdAt
    ? new Date(record.createdAt).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    : '—';

  const isEmpty = (val: string | null | undefined) => !val || val.trim() === '';

  return (
    <div className={styles.modalOverlay} onClick={() => onOpenChange(false)}>
      <div
        className={styles.modalContent}
        role="dialog"
        aria-modal="true"
        aria-labelledby="medical-record-detail-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h2 id="medical-record-detail-title" className={styles.modalTitle}>
            Chi tiết hồ sơ y tế
          </h2>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className={styles.closeButton}
            aria-label="Đóng"
          >
            <Cross1Icon />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.metaGrid}>
            {/* Customer info */}
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Khách hàng</span>
              {isEmpty(record.customerName) ? (
                <span className={styles.metaValueMuted}>Chưa có tên</span>
              ) : (
                <span className={styles.metaValue}>{record.customerName}</span>
              )}
            </div>

            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Email</span>
              {isEmpty(record.customerEmail) ? (
                <span className={styles.metaValueMuted}>—</span>
              ) : (
                <span className={styles.metaValue}>{record.customerEmail}</span>
              )}
            </div>

            {/* Blood type */}
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Nhóm máu</span>
              {isEmpty(record.bloodType) ? (
                <span className={styles.metaValueMuted}>Chưa cập nhật</span>
              ) : (
                <span className={styles.bloodBadge}>{record.bloodType}</span>
              )}
            </div>

            {/* Date */}
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Ngày tạo</span>
              <span className={styles.metaValue}>{date}</span>
            </div>

            {/* Allergies */}
            <div className={styles.metaItemFull}>
              <span className={styles.metaLabel}>Dị ứng</span>
              {isEmpty(record.allergies) ? (
                <span className={styles.metaValueMuted}>Không có thông tin</span>
              ) : (
                <span className={styles.metaValue}>{record.allergies}</span>
              )}
            </div>

            {/* Medical history */}
            <div className={styles.metaItemFull}>
              <span className={styles.metaLabel}>Tiền sử bệnh</span>
              {isEmpty(record.medicalHistory) ? (
                <span className={styles.metaValueMuted}>Không có thông tin</span>
              ) : (
                <span className={styles.metaValue}>{record.medicalHistory}</span>
              )}
            </div>

            {/* Current medication */}
            <div className={styles.metaItemFull}>
              <span className={styles.metaLabel}>Thuốc đang dùng</span>
              {isEmpty(record.currentMedication) ? (
                <span className={styles.metaValueMuted}>Không có thông tin</span>
              ) : (
                <span className={styles.metaValue}>{record.currentMedication}</span>
              )}
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button
            type="button"
            className={`${styles.button} ${styles.buttonOutline}`}
            onClick={() => onOpenChange(false)}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
