'use client';

import Image from 'next/image';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';

import styles from './invoice-list.module.css';

import { Transaction } from '@/types/transaction';

type InvoiceListProps = {
  transactions?: Transaction[];
  hideHeader?: boolean;
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

const getStatusClass = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'paid':
    case 'completed':
    case 'success':
      return styles.statusPaid;
    case 'pending':
    case 'processing':
      return styles.statusPartial;
    case 'failed':
    case 'cancelled':
      return styles.statusOverdue;
    default:
      return '';
  }
};

const getStatusLabel = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'paid':
    case 'completed':
    case 'success':
      return 'Thành công';
    case 'pending':
      return 'Chờ xử lý';
    case 'failed':
      return 'Thất bại';
    case 'cancelled':
      return 'Đã hủy';
    default:
      return status || 'N/A';
  }
};

const EyeOutlineIcon = ({
  fill = '#A47BC8',
  size = 16,
}: {
  fill?: string;
  size?: number;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className="eva eva-eye-outline"
    fill={fill}
  >
    <g data-name="Layer 2">
      <g data-name="eye">
        <rect width="24" height="24" opacity="0" />
        <path d="M21.87 11.5c-.64-1.11-4.16-6.68-10.14-6.5-5.53.14-8.73 5-9.6 6.5a1 1 0 0 0 0 1c.63 1.09 4 6.5 9.89 6.5h.25c5.53-.14 8.74-5 9.6-6.5a1 1 0 0 0 0-1zM12.22 17c-4.31.1-7.12-3.59-8-5 1-1.61 3.61-4.9 7.61-5 4.29-.11 7.11 3.59 8 5-1.03 1.61-3.61 4.9-7.61 5z" />
        <path d="M12 8.5a3.5 3.5 0 1 0 3.5 3.5A3.5 3.5 0 0 0 12 8.5zm0 5a1.5 1.5 0 1 1 1.5-1.5 1.5 1.5 0 0 1-1.5 1.5z" />
      </g>
    </g>
  </svg>
);

const Edit2OutlineIcon = ({
  fill = '#A47BC8',
  size = 16,
}: {
  fill?: string;
  size?: number;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className="eva eva-edit-2-outline"
    fill={fill}
  >
    <g data-name="Layer 2">
      <g data-name="edit-2">
        <rect width="24" height="24" opacity="0" />
        <path d="M19 20H5a1 1 0 0 0 0 2h14a1 1 0 0 0 0-2z" />
        <path d="M5 18h.09l4.17-.38a2 2 0 0 0 1.21-.57l9-9a1.92 1.92 0 0 0-.07-2.71L16.66 2.6A2 2 0 0 0 14 2.53l-9 9a2 2 0 0 0-.57 1.21L4 16.91a1 1 0 0 0 .29.8A1 1 0 0 0 5 18zM15.27 4L18 6.73l-2 1.95L13.32 6zm-8.9 8.91L12 7.32l2.7 2.7-5.6 5.6-3 .28z" />
      </g>
    </g>
  </svg>
);


export function InvoiceList({ transactions = [], hideHeader = false }: InvoiceListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const PAGE_SIZE_OPTIONS = [5, 10, 20];
  const totalItems = transactions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = transactions.slice(startIndex, endIndex);

  return (
    <div className={`${styles.container} ${hideHeader ? styles.containerNoPadding : ''}`}>
      {!hideHeader && (
        <div className={styles.header}>
          <h3 className={styles.title}>Danh sách giao dịch</h3>
          <a href="#" className={styles.seeAllLink}>
            Xem tất cả <span className={styles.arrow}>→</span>
          </a>
        </div>
      )}
      <div className={styles.body}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Mã giao dịch</th>
              <th>Khách hàng</th>
              <th>Ngày giao dịch</th>
              <th>Số tiền</th>
              <th>Phương thức</th>
              <th>Trạng thái</th>
              <th>Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {currentTransactions.length === 0 ? (
              <tr>
                <td colSpan={7} className={styles.emptyState}>
                  Chưa có giao dịch nào
                </td>
              </tr>
            ) : (
              currentTransactions.map((tx) => (
                <tr key={tx.id}>
                  <td className={styles.invoiceId}>#{tx.id.slice(0, 8)}...</td>
                  <td>
                    <div className={styles.clientCell}>
                      <div className={styles.avatarPlaceholder}>
                        <span>{tx.customer?.username?.charAt(0) || 'U'}</span>
                      </div>
                      <div className={styles.clientInfo}>
                        <div className={styles.clientName}>
                          {tx.customer?.username || 'N/A'}
                        </div>
                        <div className={styles.clientCompany}>
                          {tx.customer?.email || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{new Date(tx.transactionDate).toLocaleDateString('vi-VN')}</td>
                  <td>{formatCurrency(tx.amount)}</td>
                  <td>{tx.paymentMethod}</td>
                  <td>
                    <span
                      className={`${styles.statusBadge} ${getStatusClass(
                        tx.status
                      )}`}
                    >
                      {getStatusLabel(tx.status)}
                    </span>
                  </td>
                  <td style={{ fontSize: '12px', color: '#666' }}>
                    {tx.note || '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 0 && (
        <div className={styles.paginationWrapper}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={itemsPerPage}
            totalItems={totalItems}
            onPageChange={(page) => { setCurrentPage(page); }}
            pageSizeOptions={PAGE_SIZE_OPTIONS}
            onPageSizeChange={(size) => { setItemsPerPage(size); setCurrentPage(1); }}
            showResultCount={true}
          />
        </div>
      )}
    </div>
  );
}
