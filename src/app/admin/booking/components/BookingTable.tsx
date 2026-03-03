'use client';

import { Pagination } from '@/components/ui/pagination';
import type { AdminBooking } from '@/types/admin-booking';

import styles from './booking-table.module.css';

type Props = {
  bookings: AdminBooking[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (page: number) => void;
  };
};

const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
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

const getStatusClass = (status: string) => {
  const normalized = status.trim().toLowerCase();
  switch (normalized) {
    case 'confirmed':
      return styles.statusConfirmed;
    case 'cancelled':
      return styles.statusCancelled;
    default:
      return styles.statusPending;
  }
};

const getStatusLabel = (status: string) => {
  const normalized = status.trim().toLowerCase();
  switch (normalized) {
    case 'confirmed':
      return 'Đã xác nhận';
    case 'cancelled':
      return 'Đã hủy';
    case 'pending':
      return 'Đang chờ';
    default:
      return status || 'Không rõ';
  }
};

const getContractStatusLabel = (status: string | null | undefined) => {
  if (!status) return '-';
  const normalized = status.trim().toLowerCase();
  switch (normalized) {
    case 'draft':
      return 'Bản nháp';
    case 'sent':
      return 'Đã gửi';
    case 'signed':
      return 'Đã ký';
    case 'cancelled':
      return 'Đã hủy';
    case 'expired':
      return 'Hết hạn';
    default:
      return status;
  }
};

const getTransactionTypeLabel = (type: string) => {
  const normalized = type.trim().toLowerCase();
  switch (normalized) {
    case 'deposit':
      return 'Đặt cọc';
    case 'payment':
      return 'Thanh toán';
    case 'refund':
      return 'Hoàn tiền';
    default:
      return type;
  }
};

const getTransactionStatusLabel = (status: string) => {
  const normalized = status.trim().toLowerCase();
  switch (normalized) {
    case 'paid':
    case 'success':
    case 'succeeded':
      return 'Đã thanh toán';
    case 'pending':
    case 'processing':
      return 'Đang xử lý';
    case 'cancelled':
      return 'Đã hủy';
    case 'failed':
      return 'Thất bại';
    default:
      return status || 'Không rõ';
  }
};

export function BookingTable({ bookings, pagination }: Props) {
  return (
    <div className={styles.tableWrapper}>
      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Khách hàng</th>
              <th>Số điện thoại</th>
              <th>Gói dịch vụ</th>
              <th>Loại phòng</th>
              <th>Phòng</th>
              <th>Thời gian</th>
              <th>Ngày đặt</th>
              <th>Tổng giá</th>
              <th>Giảm giá</th>
              <th>Thành tiền</th>
              <th>Đã thanh toán</th>
              <th>Còn lại</th>
              <th>Trạng thái booking</th>
              <th>Mã hợp đồng</th>
              <th>Trạng thái HĐ</th>
              <th>Giao dịch gần nhất</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={16} className={styles.emptyState}>
                  Chưa có booking nào
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking.id}>
                  <td className={styles['cell-nowrap']}>{booking.id}</td>
                  <td>
                  <div className={styles.customerInfo}>
                    <span className={styles.customerName}>{booking.customer.username}</span>
                    <span className={styles.customerEmail}>{booking.customer.email}</span>
                  </div>
                  </td>
                  <td className={styles['cell-nowrap']}>{booking.customer.phone}</td>
                  <td className={styles['cell-nowrap']}>
                  {booking.package
                    ? `${booking.package.packageName} (${booking.package.durationDays} ngày)`
                    : '-'}
                  </td>
                  <td className={styles['cell-nowrap']}>
                  {booking.package?.roomTypeName || booking.room?.roomTypeName || '-'}
                  </td>
                  <td className={styles['cell-nowrap']}>
                  {booking.room
                    ? `Phòng ${booking.room.name} (Tầng ${booking.room.floor})`
                    : '-'}
                  </td>
                  <td className={styles['cell-nowrap']}>
                  {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                  </td>
                  <td className={styles['cell-nowrap']}>{formatDate(booking.bookingDate)}</td>
                  <td className={styles['cell-nowrap']}>{formatCurrency(booking.totalPrice)}</td>
                  <td className={styles['cell-nowrap']}>{formatCurrency(booking.discountAmount)}</td>
                  <td className={`${styles.amount} ${styles['cell-nowrap']}`}>
                    {formatCurrency(booking.finalAmount)}
                  </td>
                  <td className={styles['cell-nowrap']}>{formatCurrency(booking.paidAmount)}</td>
                  <td className={styles['cell-nowrap']}>{formatCurrency(booking.remainingAmount)}</td>
                  <td className={styles['cell-nowrap']}>
                    <span className={`${styles.statusBadge} ${getStatusClass(booking.status)}`}>
                      {getStatusLabel(booking.status)}
                    </span>
                  </td>
                  <td className={styles['cell-nowrap']}>{booking.contract?.contractCode ?? '-'}</td>
                  <td className={styles['cell-nowrap']}>
                    {getContractStatusLabel(booking.contract?.status)}
                  </td>
                  {(() => {
                    const lastTx =
                      booking.transactions && booking.transactions.length > 0
                        ? [...booking.transactions].sort(
                            (a, b) =>
                              new Date(b.transactionDate).getTime() -
                              new Date(a.transactionDate).getTime(),
                          )[0]
                        : undefined;
                    return (
                      <td>
                        {lastTx
                          ? `${formatCurrency(lastTx.amount)} - ${getTransactionTypeLabel(
                              lastTx.type,
                            )} (${getTransactionStatusLabel(lastTx.status)})`
                          : '-'}
                      </td>
                    );
                  })()}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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

