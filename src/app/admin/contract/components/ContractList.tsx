'use client';

import { Button } from '@/components/ui/button';
import type { Contract } from '@/types/contract';

import styles from './contract-list.module.css';

const Edit2OutlineIcon = ({ fill = '#A47BC8', size = 16 }: { fill?: string; size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill={fill}>
    <g data-name="Layer 2">
      <g data-name="edit-2">
        <rect width="24" height="24" opacity="0" />
        <path d="M19 20H5a1 1 0 0 0 0 2h14a1 1 0 0 0 0-2z" />
        <path d="M5 18h.09l4.17-.38a2 2 0 0 0 1.21-.57l9-9a1.92 1.92 0 0 0-.07-2.71L16.66 2.6A2 2 0 0 0 14 2.53l-9 9a2 2 0 0 0-.57 1.21L4 16.91a1 1 0 0 0 .29.8A1 1 0 0 0 5 18zM15.27 4L18 6.73l-2 1.95L13.32 6zm-8.9 8.91L12 7.32l2.7 2.7-5.6 5.6-3 .28z" />
      </g>
    </g>
  </svg>
);

const Trash2OutlineIcon = ({ fill = '#FD6161', size = 16 }: { fill?: string; size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill={fill}>
    <g data-name="Layer 2">
      <g data-name="trash-2">
        <rect width="24" height="24" opacity="0" />
        <path d="M21 6h-5V4.33A2.42 2.42 0 0 0 13.5 2h-3A2.42 2.42 0 0 0 8 4.33V6H3a1 1 0 0 0 0 2h1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8h1a1 1 0 0 0 0-2zM10 4.33c0-.16.21-.33.5-.33h3c.29 0 .5.17.5.33V6h-4zM18 19a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V8h12z" />
        <path d="M9 17a1 1 0 0 0 1-1v-4a1 1 0 0 0-2 0v4a1 1 0 0 0 1 1z" />
        <path d="M15 17a1 1 0 0 0 1-1v-4a1 1 0 0 0-2 0v4a1 1 0 0 0 1 1z" />
      </g>
    </g>
  </svg>
);

type Props = {
  contracts: Contract[];
  selectedContractId: number | null;
  onSelectContract?: (contract: Contract) => void;
  onEdit?: (contract: Contract) => void;
  onDelete?: (contract: Contract) => void;
};

const getStatusClass = (status: string) => {
  const normalized = status.trim();
  switch (normalized) {
    case 'Draft': return styles.statusDraft;
    case 'Sent': return styles.statusSent;
    case 'Signed':
    case 'ScheduleCompleted': return styles.statusSigned;
    case 'Cancelled': return styles.statusCancelled;
    case 'Expired': return styles.statusExpired;
    default: return '';
  }
};

const getStatusLabel = (status: string) => {
  const normalized = status.trim();
  switch (normalized) {
    case 'Draft': return 'Bản nháp';
    case 'Sent': return 'Đã gửi';
    case 'Signed': return 'Đã ký';
    case 'ScheduleCompleted': return 'Lịch đã hoàn tất';
    case 'Cancelled': return 'Đã hủy';
    case 'Expired': return 'Hết hạn';
    default: return status;
  }
};

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return '—';
  try {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric', month: '2-digit', day: '2-digit',
    });
  } catch {
    return dateString;
  }
};

export function ContractList({ contracts, selectedContractId, onSelectContract, onEdit, onDelete }: Props) {
  const handleRowClick = (contract: Contract, e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.actions')) return;
    onSelectContract?.(contract);
  };

  return (
    <div className={styles.listContainer}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th title="Số thứ tự">STT</th>
              <th>Mã hợp đồng</th>
              <th>Mã booking</th>
              <th>Khách hàng</th>
              <th>Ngày hợp đồng</th>
              <th>Hiệu lực từ</th>
              <th>Hiệu lực đến</th>
              <th>Ngày ký</th>
              <th>Ngày check-in</th>
              <th>Ngày check-out</th>
              <th>File hợp đồng</th>
              <th>Trạng thái</th>
              <th className={styles.stickyActionsCol}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {contracts.length === 0 ? (
              <tr>
                <td colSpan={13} className={styles.emptyState}>
                  Chưa có hợp đồng nào
                </td>
              </tr>
            ) : (
              contracts.map((contract, index) => (
                <tr
                  key={contract.id}
                  className={`${styles.tableRow} ${selectedContractId === contract.id ? styles.tableRowActive : ''}`}
                  onClick={(e) => handleRowClick(contract, e)}
                >
                  <td>
                    <span className={styles.sttCell} title={`ID: ${contract.id}`}>
                      {index + 1}
                    </span>
                  </td>
                  <td className={styles.contractCode}>{contract.contractCode}</td>
                  <td className={styles.bookingId}>#{contract.bookingId}</td>
                  <td>
                    <div className={styles.customerInfo}>
                      <span className={styles.customerName}>{contract.customer?.username ?? '—'}</span>
                      <span className={styles.customerEmail}>{contract.customer?.email ?? ''}</span>
                      {contract.customer?.phone && (
                        <span className={styles.customerPhone}>{contract.customer.phone}</span>
                      )}
                    </div>
                  </td>
                  <td>{formatDate(contract.contractDate)}</td>
                  <td>{formatDate(contract.effectiveFrom)}</td>
                  <td>{formatDate(contract.effectiveTo)}</td>
                  <td>{formatDate(contract.signedDate)}</td>
                  <td>{formatDate(contract.checkinDate)}</td>
                  <td>{formatDate(contract.checkoutDate)}</td>
                  <td>
                    {contract.fileUrl ? (
                      <a
                        href={contract.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.fileLink}
                        onClick={(e) => e.stopPropagation()}
                        title="Xem file hợp đồng"
                      >
                        📄 Xem file
                      </a>
                    ) : (
                      <span className={styles.noFile}>—</span>
                    )}
                  </td>
                  <td>
                    <span className={`${styles.statusBadge} ${getStatusClass(contract.status)}`}>
                      {getStatusLabel(contract.status)}
                    </span>
                  </td>
                  <td className={styles.stickyActionsCol}>
                    <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
                      <div className={styles.tooltipWrapper}>
                        <Button
                          variant="outline"
                          size="sm"
                          className={styles.editButton}
                          onClick={() => onEdit?.(contract)}
                          aria-label={`Chỉnh sửa ${contract.contractCode}`}
                        >
                          <Edit2OutlineIcon fill="#A47BC8" size={16} />
                        </Button>
                        <span className={styles.tooltip}>Chỉnh sửa</span>
                      </div>
                      <div className={styles.tooltipWrapper}>
                        <Button
                          variant="outline"
                          size="sm"
                          className={styles.deleteButton}
                          onClick={() => onDelete?.(contract)}
                          aria-label={`Xóa ${contract.contractCode}`}
                        >
                          <Trash2OutlineIcon fill="#FD6161" size={16} />
                        </Button>
                        <span className={styles.tooltip}>Xóa</span>
                      </div>
                    </div>
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
