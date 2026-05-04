import { useState } from 'react';
import { FileText } from 'lucide-react';
import type { Contract } from '@/types/contract';
import { ContractPreviewModal } from '../../booking/components/ContractPreviewModal';
import styles from './contract-list.module.css';
type Props = {
  contracts: Contract[];
  selectedContractId: number | null;
  onSelectContract?: (contract: Contract) => void;
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

export function ContractList({ contracts, selectedContractId, onSelectContract }: Props) {
  const [previewContract, setPreviewContract] = useState<{ id: number; code: string; fileUrl: string | null } | null>(null);

  const handleRowClick = (contract: Contract) => {
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
            <th className={styles.dateCol}>Ngày tạo hợp đồng</th>
            <th className={styles.dateCol}>Hiệu lực từ</th>
            <th className={styles.dateCol}>Hiệu lực đến</th>
            <th className={styles.dateCol}>Ngày ký</th>
            <th className={styles.dateCol}>Ngày check-in</th>
            <th className={styles.dateCol}>Ngày check-out</th>
            <th className={styles.fileCol}>File hợp đồng</th>
            <th className={styles.statusCol}>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {contracts.length === 0 ? (
            <tr>
              <td colSpan={12}>
                <div className={styles.emptyState}>
                  <div className={styles.emptyIconWrapper}>
                    <FileText size={64} className={styles.emptyIcon} />
                  </div>
                  <h3 className={styles.emptyTitle}>Chưa có hợp đồng</h3>
                  <p className={styles.emptyText}>Danh sách hợp đồng đang trống. Hãy thêm mới hoặc nhập dữ liệu.</p>
                </div>
              </td>
            </tr>
          ) : (
            contracts.map((contract, index) => (
              <tr
                key={contract.id}
                className={`${styles.tableRow} ${selectedContractId === contract.id ? styles.tableRowActive : ''}`}
                onClick={() => handleRowClick(contract)}
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
                  {(() => {
                    const firstUrl = contract.fileUrl?.split(',')[0] || null;
                    if (!firstUrl) return <span className={styles.noFile}>—</span>;

                    const isImage = /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(firstUrl);

                    return (
                      <button
                        type="button"
                        className={styles.fileLink}
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewContract({ id: contract.id, code: contract.contractCode, fileUrl: contract.fileUrl });
                        }}
                        title="Xem file hợp đồng"
                      >
                        {isImage ? (
                          <div className={styles.imageThumbnail}>
                            <img src={firstUrl} alt={contract.contractCode} className={styles.thumbImg} />
                          </div>
                        ) : (
                          <img
                            src="https://res.public.onecdn.static.microsoft/assets/fluentui-resources/1.1.0/app-min/assets/item-types/20/docx.svg"
                            alt="Word"
                            className={styles.fileIcon}
                          />
                        )}
                        <div className={styles.fileInfo}>
                          <span className={styles.fileName}>{contract.contractCode}</span>
                        </div>
                      </button>
                    );
                  })()}
                </td>
                <td className={styles.statusCol}>
                  <span className={`${styles.statusBadge} ${getStatusClass(contract.status)}`}>
                    {getStatusLabel(contract.status)}
                  </span>
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
