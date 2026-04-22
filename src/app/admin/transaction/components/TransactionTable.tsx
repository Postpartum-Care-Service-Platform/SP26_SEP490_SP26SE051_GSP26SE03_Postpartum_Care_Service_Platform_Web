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
  currentPage?: number;
  pageSize?: number;
};

export function TransactionTable({ transactions, onView, currentPage = 1, pageSize = 10 }: Props) {
  return (
    <div className={styles.tableWrapper}>
      <div className={styles.scrollContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.stickyColHeader} style={{ width: '60px' }}>STT</th>
              <th>Khách hàng</th>
              <th>Số tiền</th>
              <th>Loại</th>
              <th>Ghi chú</th>
              <th>Phương thức</th>
              <th>Ngày giao dịch</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={8} className={styles.emptyState}>
                  Chưa có giao dịch nào
                </td>
              </tr>
            ) : (
              transactions.map((transaction, index) => (
                <tr key={transaction.id} className={styles.tableRow}>
                  <td className={styles.sttCol}>
                    <span className={styles.sttCell} title={`ID: ${transaction.id}\nBooking ID: ${transaction.bookingId}`}>
                      {(currentPage - 1) * pageSize + index + 1}
                    </span>
                  </td>
                  <td>
                    <div className={styles.customerInfo}>
                      {transaction.customer ? (
                        <>
                          <div className={styles.customerName}>{transaction.customer.username}</div>
                          <div className={styles.customerEmail}>{transaction.customer.email}</div>
                        </>
                      ) : (
                        <div className={styles.customerName}>Chưa xác định</div>
                      )}
                    </div>
                  </td>
                  <td className={styles.amount}>{formatCurrency(transaction.amount)}</td>
                  <td>{getTypeLabel(transaction.type)}</td>
                  <td className={styles.noteCell} title={transaction.note || undefined}>
                    {transaction.note ? (transaction.note.length > 30 ? transaction.note.slice(0, 30) + '...' : transaction.note) : '-'}
                  </td>
                  <td>{transaction.paymentMethod}</td>
                  <td>{formatDate(transaction.transactionDate)}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${getStatusBadgeClass(transaction.status)}`}>
                      {getStatusLabel(transaction.status)}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
