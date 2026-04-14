'use client';

import { X } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { RefundRequest } from '@/types/refund-request';
import styles from './refund-action-modal.module.css';

interface RefundActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'approve' | 'reject' | 'view';
  refund: RefundRequest | null;
  onConfirm: (data: { amount?: number; note: string }) => Promise<void>;
}

export const RefundActionModal = ({
  isOpen,
  onClose,
  type,
  refund,
  onConfirm,
}: RefundActionModalProps) => {
  const [amount, setAmount] = useState<number>(0);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (refund) {
      if (type === 'view') {
        setAmount(refund.approvedAmount || refund.requestedAmount);
        setNote(refund.adminNote || '');
      } else {
        setAmount(refund.requestedAmount);
        setNote('');
      }
    }
  }, [refund, isOpen, type]);

  if (!isOpen || !refund) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'view') {
      onClose();
      return;
    }
    try {
      setLoading(true);
      await onConfirm({
        amount: type === 'approve' ? amount : undefined,
        note,
      });
      onClose();
    } catch (err) {
      // Error handled by parent
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    if (type === 'view') return 'Chi tiết yêu cầu hoàn tiền';
    return type === 'approve' ? 'Duyệt yêu cầu hoàn tiền' : 'Từ chối yêu cầu hoàn tiền';
  };

  const formatCurrency = (val: number | null) => {
    if (val === null) return '-';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>{getTitle()}</h3>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            <div className={styles.infoBox}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Booking ID:</span>
                <span className={styles.infoValue}>#{refund.bookingId}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Khách hàng:</span>
                <span className={styles.infoValue}>{refund.accountHolder}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Số tiền yêu cầu:</span>
                <span className={styles.infoValue}>{formatCurrency(refund.requestedAmount)}</span>
              </div>
              {refund.status !== 'Pending' && (
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Trạng thái:</span>
                  <span className={`${styles.infoValue} ${refund.status === 'Approved' ? styles.statusApproved : styles.statusRejected}`}>
                    {refund.status === 'Approved' ? 'Đã duyệt' : 'Từ chối'}
                  </span>
                </div>
              )}
            </div>

            {type === 'view' ? (
              <div className={styles.viewContent}>
                {refund.status === 'Approved' && (
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Số tiền đã duyệt hoàn</label>
                    <div className={styles.staticValue}>{formatCurrency(refund.approvedAmount)}</div>
                  </div>
                )}
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    {refund.status === 'Approved' ? 'Ghi chú phê duyệt' : 'Lý do từ chối'}
                  </label>
                  <div className={styles.textareaField} style={{ backgroundColor: '#f8f9fa', minHeight: '80px', border: 'none' }}>
                    {refund.adminNote || 'Không có ghi chú'}
                  </div>
                </div>
              </div>
            ) : (
              <>
                {type === 'approve' && (
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Số tiền duyệt hoàn <span className={styles.required}>*</span></label>
                    <input
                      type="number"
                      className={styles.inputField}
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      required
                      min={0}
                    />
                  </div>
                )}

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    {type === 'approve' ? 'Ghi chú phê duyệt' : 'Lý do từ chối'} <span className={styles.required}>*</span>
                  </label>
                  <textarea
                    className={styles.textareaField}
                    rows={3}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder={type === 'approve' ? 'Nhập ghi chú...' : 'Nhập lý do từ chối...'}
                    required
                  ></textarea>
                </div>
              </>
            )}
          </div>

          <div className={styles.modalFooter}>
            <button
              type="button"
              className={`${styles.btn} ${styles.cancelBtn}`}
              onClick={onClose}
              disabled={loading}
            >
              {type === 'view' ? 'Đóng' : 'Hủy'}
            </button>
            {type !== 'view' && (
              <button 
                type="submit"
                className={`${styles.btn} ${type === 'approve' ? styles.confirmBtn : styles.dangerBtn}`}
                disabled={loading || (type === 'reject' && !note.trim())}
              >
                {loading ? 'Đang xử lý...' : type === 'approve' ? 'Xác nhận duyệt' : 'Xác nhận từ chối'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
