'use client';

import React, { useState, useEffect } from 'react';
import { Cross1Icon } from '@radix-ui/react-icons';
import styles from './reject-request-modal.module.css';

interface RejectRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isSubmitting: boolean;
  requestTitle?: string;
}

export function RejectRequestModal({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting,
  requestTitle
}: RejectRequestModalProps) {
  const [reason, setReason] = useState('');

  // Reset reason when modal opens
  useEffect(() => {
    if (isOpen) {
      setReason('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;
    onConfirm(reason);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Từ chối yêu cầu gói dịch vụ</h2>
          <button onClick={onClose} className={styles.closeButton} aria-label="Close">
            <Cross1Icon />
          </button>
        </div>
        
        <form onSubmit={handleConfirm}>
          <div className={styles.modalBody}>
            <div className={styles.requestInfo}>
              <span className={styles.infoLabel}>Đang xử lý yêu cầu:</span>
              <span className={styles.infoValue}>{requestTitle || 'Yêu cầu tùy chỉnh'}</span>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="reject-reason">
                Lý do từ chối <span className={styles.required}>*</span>
              </label>
              <textarea
                id="reject-reason"
                className={styles.formControl}
                placeholder="Nhập lý do chi tiết để khách hàng nắm rõ lý do bị từ chối..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                autoFocus
              />
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button 
              type="button" 
              className={`${styles.button} ${styles.buttonOutline}`} 
              onClick={onClose} 
              disabled={isSubmitting}
            >
              Hủy bỏ
            </button>
            <button 
              type="submit" 
              className={`${styles.button} ${styles.buttonDestructive}`} 
              disabled={!reason.trim() || isSubmitting}
            >
              {isSubmitting ? 'Đang xử lý...' : 'Xác nhận từ chối'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
