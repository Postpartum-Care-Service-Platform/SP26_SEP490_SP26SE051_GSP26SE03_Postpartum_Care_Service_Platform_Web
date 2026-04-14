'use client';

import React from 'react';
import { Check, X, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RefundRequest } from '@/types/refund-request';
import styles from './refund-table.module.css';

interface Props {
  refunds: RefundRequest[];
  onApprove: (refund: RefundRequest) => void;
  onReject: (refund: RefundRequest) => void;
  onView: (refund: RefundRequest) => void;
  pagination?: {
    currentPage: number;
    pageSize: number;
    totalPages?: number;
    totalItems?: number;
    onPageChange?: (page: number) => void;
  };
}

const formatDate = (dateString?: string | null) => {
  if (!dateString || dateString.startsWith('0001')) return '-';
  try {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
};

const formatCurrency = (amount: number | null) => {
  if (amount === null) return '-';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

export function RefundTable({ refunds, onApprove, onReject, onView, pagination }: Props) {
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Pending': return styles.statusPending;
      case 'Approved': return styles.statusApproved;
      case 'Rejected': return styles.statusRejected;
      default: return '';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'Pending': return 'Chờ duyệt';
      case 'Approved': return 'Đã duyệt';
      case 'Rejected': return 'Từ chối';
      default: return status;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.sttHeaderCell}>STT</th>
              <th>Booking</th>
              <th>Khách hàng</th>
              <th>Số tiền yêu cầu</th>
              <th>Ngân hàng</th>
              <th>Lý do</th>
              <th>Trạng thái</th>
              <th>Ngày yêu cầu</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {refunds.length === 0 ? (
              <tr>
                <td colSpan={9} className={styles.emptyState}>
                  Không có yêu cầu hoàn tiền nào
                </td>
              </tr>
            ) : (
              refunds.map((refund, index) => {
                const stt = pagination
                  ? (pagination.currentPage - 1) * pagination.pageSize + index + 1
                  : index + 1;

                return (
                  <tr key={refund.id} className={styles.tableRow}>
                    <td className={styles.sttDataCell}>
                      <span className={styles.sttCell}>{stt}</span>
                    </td>
                    <td>
                      <span className={styles.bookingId}>#{refund.bookingId}</span>
                    </td>
                    <td>
                      <div className={styles.tooltipWrapper}>
                        <div className={styles.textTruncate} style={{ fontWeight: 500 }}>{refund.accountHolder}</div>
                        <div className={styles.tooltip}>{refund.accountHolder}</div>
                      </div>
                      <div style={{ fontSize: '11px', color: '#868e96' }}>ID: {refund.customerId.substring(0, 8)}...</div>
                    </td>
                    <td>
                      <div className={styles.amount}>{formatCurrency(refund.requestedAmount)}</div>
                      {refund.approvedAmount !== null && (
                        <div className={styles.approvedAmount}>Duyệt: {formatCurrency(refund.approvedAmount)}</div>
                      )}
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{refund.bankName}</div>
                      <div style={{ fontSize: '12px' }}>{refund.accountNumber}</div>
                    </td>
                    <td>
                      <div className={styles.tooltipWrapper}>
                        <span className={styles.textTruncate} style={{ maxWidth: '150px' }}>{refund.reason}</span>
                        <span className={styles.tooltip}>{refund.reason}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`${styles.statusBadge} ${getStatusClass(refund.status)}`}>
                        {getStatusLabel(refund.status)}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '12px', color: '#868e96' }}>{formatDate(refund.createdAt)}</span>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        {refund.status === 'Pending' ? (
                          <>
                            <button 
                              onClick={() => onApprove(refund)} 
                              className={`${styles.actionButton} ${styles.approveBtn}`}
                            >
                              <Check size={14} />
                              Duyệt
                            </button>
                            <button 
                              onClick={() => onReject(refund)} 
                              className={`${styles.actionButton} ${styles.rejectBtn}`}
                            >
                              <X size={14} />
                              Từ chối
                            </button>
                          </>
                        ) : (
                          <button 
                            onClick={() => onView(refund)} 
                            className={`${styles.actionButton} ${styles.viewBtn}`}
                          >
                            <Eye size={14} />
                            Xem
                          </button>
                        )}
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
