'use client';

import { AlertTriangle, Trash2 } from 'lucide-react';
import React from 'react';
import styles from './ConfirmModal.module.css';

type ConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning';
  isLoading?: boolean;
};

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Xác nhận xóa',
  message = 'Bạn có chắc chắn muốn thực hiện hành động này? Hành động này không thể hoàn tác.',
  confirmLabel = 'Xác nhận',
  cancelLabel = 'Hủy',
  variant = 'danger',
  isLoading = false
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={() => !isLoading && onClose()}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div 
           className={styles.iconWrapper} 
           style={{ 
             backgroundColor: variant === 'danger' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(249, 115, 22, 0.1)',
             color: variant === 'danger' ? '#ef4444' : '#f97316'
           }}
        >
          {variant === 'danger' ? (
             <Trash2 style={{ width: 32, height: 32 }} />
          ) : (
             <AlertTriangle style={{ width: 32, height: 32 }} />
          )}
        </div>
        
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.message}>{message}</p>
        
        <div className={styles.footer}>
          <button 
            type="button" 
            className={`${styles.button} ${styles.cancelButton}`} 
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelLabel}
          </button>
          <button 
            type="button" 
            className={`${styles.button} ${variant === 'danger' ? styles.confirmButton : styles.confirmButtonWarning}`} 
            onClick={() => {
              onConfirm();
              // Removed onClose() here because usually handleConfirm will close it after API success
            }}
            disabled={isLoading}
          >
            {isLoading ? 'Đang xử lý...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
