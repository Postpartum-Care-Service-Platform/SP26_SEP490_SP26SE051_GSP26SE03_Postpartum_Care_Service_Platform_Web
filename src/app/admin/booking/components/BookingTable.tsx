'use client';

import { useState } from 'react';
import { Eye, Inbox } from 'lucide-react';
import type { AdminBooking } from '@/types/admin-booking';
import { ContractPreviewModal } from './ContractPreviewModal';

import styles from './booking-table.module.css';

type Props = {
  bookings: AdminBooking[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    pageSizeOptions?: number[];
    onPageSizeChange?: (size: number) => void;
  };
  onViewBooking?: (booking: AdminBooking) => void;
  loading?: boolean;
  error?: string | null;
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
    case 'completed':
      return 'Hoàn thành';
    case 'in_progress':
    case 'inprogress':
      return 'Đang thực hiện';
    case 'checked_in':
    case 'checkedin':
      return 'Đã nhận phòng';
    case 'checked_out':
    case 'checkedout':
      return 'Đã trả phòng';
    case 'no_show':
    case 'noshow':
      return 'Không đến';
    case 'schedulecompleted':
    case 'schedule_completed':
      return 'Hoàn thành lịch trình';
    default:
      return status || 'Không rõ';
  }
};

const getContractStatusLabel = (status: string | null | undefined) => {
  if (!status) return '-';
  const normalized = status.trim().toLowerCase();
  switch (normalized) {
    case 'draft':
      return 'Bản nháp hợp đồng';
    case 'sent':
      return 'Đã gửi hợp đồng';
    case 'signed':
      return 'Đã ký hợp đồng';
    case 'cancelled':
      return 'Đã hủy hợp đồng';
    case 'expired':
      return 'Hết hạn hợp đồng';
    case 'pending':
      return 'Chờ ký hợp đồng';
    case 'active':
      return 'Hợp đồng còn hiệu lực';
    case 'terminated':
      return 'Chấm dứt hợp đồng';
    case 'schedulecompleted':
    case 'schedule_completed':
      return 'Hoàn thành lịch trình';
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
    case 'full':
      return 'Thanh toán toàn bộ';
    case 'remaining':
      return 'Thanh toán phần còn lại';
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

export function BookingTable({ bookings, pagination, onViewBooking, loading, error }: Props) {
  const [selectedContract, setSelectedContract] = useState<{ id: number; code: string; fileUrl: string | null } | null>(null);

  if (loading) {
     return <div className={styles.statusCell}>Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className={styles.statusCell}>{error}</div>;
  }

  return (
    <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th title="Số thứ tự" className={styles.sttHeader}>STT</th>
              <th>Khách hàng</th>
              <th>Số điện thoại</th>
              <th>Gói dịch vụ</th>
              <th>Phòng</th>
              <th className={styles.dateHeader}>Thời hạn gói</th>
              <th className={styles.dateHeader}>Ngày đặt</th>
              <th>Tổng giá</th>
              <th>Thành tiền</th>
              <th>Đã thanh toán</th>
              <th>Còn lại</th>
              <th>Trạng thái booking</th>
              <th>Mã hợp đồng</th>
              <th>Trạng thái hợp đồng</th>
              <th>Giao dịch gần nhất</th>
              <th className={styles.stickyActionsCol}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
               <tr>
                <td colSpan={18}>
                  <div className={styles.emptyState}>
                    <Inbox size={48} className={styles.emptyIcon} />
                    <p className={styles.emptyText}>Chưa có booking nào</p>
                  </div>
                </td>
              </tr>
            ) : (
              bookings.map((booking, index) => {
                const bookingStt = pagination
                  ? (pagination.currentPage - 1) * pagination.pageSize + index + 1
                  : index + 1;

                return (
                  <tr key={booking.id}>
                    <td className={styles.sttCell}>{bookingStt}</td>
                    <td>
                      <div className={styles.customerInfo}>
                        <div className={styles.tooltipWrapper}>
                          <span className={styles.customerName}>{booking.customer.username}</span>
                          <span className={styles.tooltip}>{booking.customer.username}</span>
                        </div>
                        <div className={styles.tooltipWrapper}>
                          <span className={styles.customerEmail}>{booking.customer.email}</span>
                          <span className={styles.tooltip}>{booking.customer.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>{booking.customer.phone}</td>
                    <td>
                      {booking.package ? (
                        <div className={styles.tooltipWrapper}>
                          <span className={styles.textTruncate}>{`${booking.package.packageName} (${booking.package.durationDays} ngày)`}</span>
                          <span className={styles.tooltip}>{`${booking.package.packageName} (${booking.package.durationDays} ngày)`}</span>
                        </div>
                      ) : '-'}
                    </td>
                    <td>
                      {booking.room ? (
                        <div className={styles.tooltipWrapper}>
                          <span className={styles.textTruncate}>{`Phòng ${booking.room.name} (Tầng ${booking.room.floor})`}</span>
                          <span className={styles.tooltip}>{`Phòng ${booking.room.name} (Tầng ${booking.room.floor})`}</span>
                        </div>
                      ) : '-'}
                    </td>
                    <td>
                      {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                    </td>
                    <td>{formatDate(booking.bookingDate)}</td>
                    <td>{formatCurrency(booking.totalPrice)}</td>
                    <td className={styles.amount}>
                      {formatCurrency(booking.finalAmount)}
                    </td>
                    <td>{formatCurrency(booking.paidAmount)}</td>
                    <td>{formatCurrency(booking.remainingAmount)}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${getStatusClass(booking.status)}`}>
                        {getStatusLabel(booking.status)}
                      </span>
                    </td>
                    <td>
                      {booking.contract?.contractCode ? (
                        <div className={styles.tooltipWrapper}>
                          <span
                            className={`${styles.textTruncate} ${styles.contractLink}`}
                            onClick={() => booking.contract && setSelectedContract({
                              id: booking.contract.id,
                              code: booking.contract.contractCode,
                              fileUrl: booking.contract.fileUrl
                            })}
                          >
                            {booking.contract.contractCode}
                          </span>
                          <span className={styles.tooltip}>{booking.contract.contractCode}</span>
                        </div>
                      ) : '-'}
                    </td>
                    <td>
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
                          {lastTx ? (() => {
                            const text = `${formatCurrency(lastTx.amount)} - ${getTransactionTypeLabel(lastTx.type)} (${getTransactionStatusLabel(lastTx.status)})`;
                            return (
                              <div className={styles.tooltipWrapper}>
                                <span className={styles.textTruncate}>{text}</span>
                                <span className={styles.tooltip}>{text}</span>
                              </div>
                            );
                          })() : '-'}
                        </td>
                      );
                    })()}
                    <td className={styles.stickyActionsCol}>
                      <div className={styles.actions}>
                        <div className={styles.tooltipWrapper}>
                          <button
                            type="button"
                            className={styles.actionButton}
                            onClick={() => onViewBooking?.(booking)}
                            aria-label={`Xem chi tiết booking ${booking.id}`}
                          >
                            <Eye size={18} />
                          </button>
                          <span className={styles.tooltip}>Xem chi tiết</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

      {/* Contract Preview Modal */}
      {selectedContract && (
        <ContractPreviewModal
          contract={selectedContract}
          onClose={() => setSelectedContract(null)}
        />
      )}
    </div>
  );
}
