import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, FileText } from 'lucide-react';
import type { Contract } from '@/types/contract';
import { ContractPreviewModal } from '../../booking/components/ContractPreviewModal';

import styles from './contract-list.module.css';

const Edit2OutlineIcon = ({ size = 16 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <g data-name="Layer 2">
      <g data-name="edit-2">
        <rect width="24" height="24" opacity="0" />
        <path d="M19 20H5a1 1 0 0 0 0 2h14a1 1 0 0 0 0-2z" />
        <path d="M5 18h.09l4.17-.38a2 2 0 0 0 1.21-.57l9-9a1.92 1.92 0 0 0-.07-2.71L16.66 2.6A2 2 0 0 0 14 2.53l-9 9a2 2 0 0 0-.57 1.21L4 16.91a1 1 0 0 0 .29.8A1 1 0 0 0 5 18zM15.27 4L18 6.73l-2 1.95L13.32 6zm-8.9 8.91L12 7.32l2.7 2.7-5.6 5.6-3 .28z" />
      </g>
    </g>
  </svg>
);

const Trash2OutlineIcon = ({ size = 16 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
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
  const [previewContract, setPreviewContract] = useState<{ id: number; code: string; fileUrl: string | null } | null>(null);

  const handleRowClick = (contract: Contract, e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.' + styles.actions)) return;
    onSelectContract?.(contract);
  };

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.stickySTTCol} title="Số thứ tự">STT</th>
            <th>Mã hợp đồng</th>
            <th>Mã booking</th>
            <th>Khách hàng</th>
            <th className={styles.dateCol}>Ngày hợp đồng</th>
            <th className={styles.dateCol}>Hiệu lực từ</th>
            <th className={styles.dateCol}>Hiệu lực đến</th>
            <th className={styles.dateCol}>Ngày ký</th>
            <th className={styles.dateCol}>Ngày check-in</th>
            <th className={styles.dateCol}>Ngày check-out</th>
            <th className={styles.fileCol}>File hợp đồng</th>
            <th className={styles.statusCol}>Trạng thái</th>
            <th className={styles.stickyActionsCol}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {contracts.length === 0 ? (
            <tr>
              <td colSpan={13}>
                <div className={styles.emptyState}>
                  <FileText size={48} className={styles.emptyIcon} />
                  <p className={styles.emptyText}>Chưa có hợp đồng nào</p>
                </div>
              </td>
            </tr>
          ) : (
            contracts.map((contract, index) => (
              <tr
                key={contract.id}
                className={`${styles.tableRow} ${selectedContractId === contract.id ? styles.tableRowActive : ''}`}
                onClick={(e) => handleRowClick(contract, e)}
              >
                <td className={styles.stickySTTCol}>
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
                <td className={styles.dateCol}>{formatDate(contract.contractDate)}</td>
                <td className={styles.dateCol}>{formatDate(contract.effectiveFrom)}</td>
                <td className={styles.dateCol}>{formatDate(contract.effectiveTo)}</td>
                <td className={styles.dateCol}>{formatDate(contract.signedDate)}</td>
                <td className={styles.dateCol}>{formatDate(contract.checkinDate)}</td>
                <td className={styles.dateCol}>{formatDate(contract.checkoutDate)}</td>
                <td className={styles.fileCol}>
                  {contract.fileUrl ? (
                    <button
                      type="button"
                      className={styles.fileLink}
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewContract({ id: contract.id, code: contract.contractCode, fileUrl: contract.fileUrl });
                      }}
                      title="Xem file hợp đồng"
                    >
                      <img
                        src="https://res.public.onecdn.static.microsoft/assets/fluentui-resources/1.1.0/app-min/assets/item-types/20/docx.svg"
                        alt="Word"
                        className={styles.fileIcon}
                      />
                      <div className={styles.fileInfo}>
                        <span className={styles.fileName}>{contract.contractCode}</span>
                      </div>
                    </button>
                  ) : (
                    <span className={styles.noFile}>—</span>
                  )}
                </td>
                <td className={styles.statusCol}>
                  <span className={`${styles.statusBadge} ${getStatusClass(contract.status)}`}>
                    {getStatusLabel(contract.status)}
                  </span>
                </td>
                <td className={styles.stickyActionsCol}>
                  <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.tooltipWrapper}>
                      <button
                        className={`${styles.actionButton} ${styles.viewButton}`}
                        onClick={() => {
                          if (contract.fileUrl) {
                            setPreviewContract({ id: contract.id, code: contract.contractCode, fileUrl: contract.fileUrl });
                          }
                        }}
                        aria-label={`Xem tài liệu ${contract.contractCode}`}
                      >
                        <Eye size={16} />
                      </button>
                      <span className={styles.tooltip}>Xem tài liệu</span>
                    </div>
                    <div className={styles.tooltipWrapper}>
                      <button
                        className={`${styles.actionButton} ${styles.editButton}`}
                        onClick={() => onEdit?.(contract)}
                        aria-label={`Chỉnh sửa ${contract.contractCode}`}
                      >
                        <Edit2OutlineIcon size={16} />
                      </button>
                      <span className={styles.tooltip}>Chỉnh sửa</span>
                    </div>
                    <div className={styles.tooltipWrapper}>
                      <button
                        className={`${styles.actionButton} ${styles.deleteButton}`}
                        onClick={() => onDelete?.(contract)}
                        aria-label={`Xóa ${contract.contractCode}`}
                      >
                        <Trash2OutlineIcon size={16} />
                      </button>
                      <span className={styles.tooltip}>Xóa</span>
                    </div>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {previewContract && (
        <ContractPreviewModal
          contract={previewContract}
          onClose={() => setPreviewContract(null)}
        />
      )}
    </div>
  );
}
