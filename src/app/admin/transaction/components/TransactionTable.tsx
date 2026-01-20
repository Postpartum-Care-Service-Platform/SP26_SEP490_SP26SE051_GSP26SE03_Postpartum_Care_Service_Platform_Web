'use client';

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
  switch (status) {
    case 'Paid':
      return styles.statusPaid;
    case 'Pending':
      return styles.statusPending;
    case 'Failed':
      return styles.statusFailed;
    default:
      return '';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'Paid':
      return 'Đã thanh toán';
    case 'Pending':
      return 'Đang chờ';
    case 'Failed':
      return 'Thất bại';
    default:
      return status;
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
  pagination?: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (page: number) => void;
  };
};

export function TransactionTable({ transactions, pagination }: Props) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID Giao dịch</th>
            <th>Booking ID</th>
            <th>Khách hàng</th>
            <th>Số tiền</th>
            <th>Loại</th>
            <th>Phương thức</th>
            <th>Ngày giao dịch</th>
            <th>Trạng thái</th>
            <th>Ghi chú</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={9} className={styles.emptyState}>
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
                <td>{transaction.paymentMethod}</td>
                <td>{formatDate(transaction.transactionDate)}</td>
                <td>
                  <span className={`${styles.statusBadge} ${getStatusBadgeClass(transaction.status)}`}>
                    {getStatusLabel(transaction.status)}
                  </span>
                </td>
                <td className={styles.noteCell}>{transaction.note || '-'}</td>
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
