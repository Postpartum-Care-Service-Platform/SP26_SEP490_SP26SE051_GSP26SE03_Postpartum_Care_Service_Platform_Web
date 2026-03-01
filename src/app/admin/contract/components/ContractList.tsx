'use client';

import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';

import { Button } from '@/components/ui/button';
import type { Contract } from '@/types/contract';

import styles from './contract-list.module.css';

type Props = {
  contracts: Contract[];
  selectedContractId: number | null;
  onSelectContract?: (contract: Contract) => void;
  onEdit?: (contract: Contract) => void;
  onDelete?: (contract: Contract) => void;
};

const getStatusClass = (status: string) => {
  switch (status) {
    case 'Draft':
      return styles.statusDraft;
    case 'Sent':
      return styles.statusSent;
    case 'Signed':
      return styles.statusSigned;
    case 'Cancelled':
      return styles.statusCancelled;
    case 'Expired':
      return styles.statusExpired;
    default:
      return '';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'Draft':
      return 'Bản nháp';
    case 'Sent':
      return 'Đã gửi';
    case 'Signed':
      return 'Đã ký';
    case 'Cancelled':
      return 'Đã hủy';
    case 'Expired':
      return 'Hết hạn';
    default:
      return status;
  }
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

export function ContractList({ contracts, selectedContractId, onSelectContract, onEdit, onDelete }: Props) {
  const handleRowClick = (contract: Contract, e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.actions')) {
      return;
    }
    onSelectContract?.(contract);
  };

  return (
    <div className={styles.listContainer}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Mã hợp đồng</th>
              <th>Ngày hợp đồng</th>
              <th>Hiệu lực từ</th>
              <th>Hiệu lực đến</th>
              <th>Ngày check-in</th>
              <th>Ngày check-out</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {contracts.length === 0 ? (
              <tr>
                <td colSpan={9} className={styles.emptyState}>
                  Chưa có hợp đồng nào
                </td>
              </tr>
            ) : (
              contracts.map((contract) => (
                <tr
                  key={contract.id}
                  className={`${styles.tableRow} ${selectedContractId === contract.id ? styles.tableRowActive : ''}`}
                  onClick={(e) => handleRowClick(contract, e)}
                >
                  <td>{contract.id}</td>
                  <td className={styles.contractCode}>{contract.contractCode}</td>
                  <td>{formatDate(contract.contractDate)}</td>
                  <td>{formatDate(contract.effectiveFrom)}</td>
                  <td>{formatDate(contract.effectiveTo)}</td>
                  <td>{formatDate(contract.checkinDate)}</td>
                  <td>{formatDate(contract.checkoutDate)}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${getStatusClass(contract.status)}`}>
                      {getStatusLabel(contract.status)}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="outline"
                        size="sm"
                        className={styles.editButton}
                        onClick={() => onEdit?.(contract)}
                        aria-label={`Chỉnh sửa ${contract.contractCode}`}
                      >
                        <Pencil1Icon />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={styles.deleteButton}
                        onClick={() => onDelete?.(contract)}
                        aria-label={`Xóa ${contract.contractCode}`}
                      >
                        <TrashIcon />
                      </Button>
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
