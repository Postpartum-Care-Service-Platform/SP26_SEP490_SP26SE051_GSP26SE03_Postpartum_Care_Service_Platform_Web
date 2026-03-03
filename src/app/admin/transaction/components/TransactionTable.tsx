'use client';

import { Eye } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import type { Transaction } from '@/types/transaction';

import styles from './transaction-table.module.css';

const formatDate = (dateString: string) => {
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

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

const getStatusBadgeClass = (status: string) => {
  const normalized = status.trim().toLowerCase();
  switch (normalized) {
    case 'paid':
    case 'success':
    case 'succeeded':
    case 'completed':
      return styles.statusPaid;
    case 'pending':
    case 'processing':
    case 'in_progress':
      return styles.statusPending;
    case 'failed':
    case 'canceled':
    case 'cancelled':
    case 'refunded':
    case 'expired':
      return styles.statusFailed;
    default:
      return '';
  }
};

const getStatusLabel = (status: string) => {
  const normalized = status.trim().toLowerCase();
  switch (normalized) {
    case 'paid':
    case 'success':
    case 'succeeded':
    case 'completed':
      return 'Đã thanh toán';
    case 'pending':
    case 'processing':
    case 'in_progress':
      return 'Đang xử lý';
    case 'failed':
      return 'Thất bại';
    case 'canceled':
    case 'cancelled':
      return 'Đã hủy';
    case 'refunded':
      return 'Đã hoàn tiền';
    case 'expired':
      return 'Đã hết hạn';
    default:
      return 'Không xác định';
  }
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'Deposit':
      return 'Tiền đặt cọc';
    case 'Payment':
      return 'Thanh toán';
    case 'Refund':
      return 'Hoàn tiền';
    default:
      return type;
  }
};

type Props = {
  transactions: Transaction[];
  onView?: (transaction: Transaction) => void;
  pagination?: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (page: number) => void;
  };
};

export function TransactionTable({ transactions, onView, pagination }: Props) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID Giao dịch</th>
            <th>ID đặt phòng</th>
            <th>Khách hàng</th>
            <th>Số tiền</th>
            <th>Loại</th>
            <th>Ghi chú</th>
            <th>Phương thức</th>
            <th>Ngày giao dịch</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={10} className={styles.emptyState}>
                Chưa có giao dịch nào
              </td>
            </tr>
          ) : (
            transactions.map((transaction) => (
              <tr key={transaction.id} className={styles.tableRow}>
                <td className={styles.idCell}>{transaction.id.slice(0, 8)}...</td>
                <td>{transaction.bookingId}</td>
                <td>
                  <div className={styles.customerInfo}>
                    <div className={styles.customerName}>{transaction.customer.username}</div>
                    <div className={styles.customerEmail}>{transaction.customer.email}</div>
                  </div>
                </td>
                <td className={styles.amount}>{formatCurrency(transaction.amount)}</td>
                <td>{getTypeLabel(transaction.type)}</td>
                <td className={styles.noteCell}>{transaction.note || '-'}</td>
                <td>{transaction.paymentMethod}</td>
                <td>{formatDate(transaction.transactionDate)}</td>
                <td>
                  <span className={`${styles.statusBadge} ${getStatusBadgeClass(transaction.status)}`}>
                    {getStatusLabel(transaction.status)}
                  </span>
                </td>
                <td>
                  <div className={styles.actions}>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`${styles.viewButton} btn-icon btn-sm`}
                      onClick={() => onView?.(transaction)}
                      aria-label={`Xem chi tiết giao dịch ${transaction.id}`}
                    >
                      <Eye size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {pagination && pagination.totalPages > 0 && (
        <div className={styles.paginationWrapper}>
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            pageSize={pagination.pageSize}
            totalItems={pagination.totalItems}
            onPageChange={pagination.onPageChange}
            showResultCount={true}
          />
        </div>
      )}
    </div>
  );
}
