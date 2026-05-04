'use client';

import { MagnifyingGlassIcon, ChevronDownIcon, MixerHorizontalIcon } from '@radix-ui/react-icons';
import { Download } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown';

import styles from './transaction-table-controls.module.css';

type Props = {
  searchQuery: string;
  statusFilter: string;
  typeFilter: string;
  sortKey: string;
  onSearchChange: (query: string) => void;
  onStatusChange: (status: any) => void;
  onTypeChange: (type: any) => void;
  onSortChange: (sort: string) => void;
};

const STATUS_OPTIONS: Array<{ value: 'all' | 'Paid' | 'Pending' | 'Failed'; label: string }> = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'Paid', label: 'Đã thanh toán' },
  { value: 'Pending', label: 'Đang chờ' },
  { value: 'Failed', label: 'Thất bại' },
];

const TYPE_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'all', label: 'Tất cả loại' },
  { value: 'Deposit', label: 'Tiền đặt cọc' },
  { value: 'Remaining', label: 'Tiền còn lại' },
  { value: 'Full', label: 'Thanh toán toàn bộ' },
  { value: 'PlatformCommission', label: 'Phí hệ thống' },
  { value: 'Payment', label: 'Thanh toán' },
  { value: 'Refund', label: 'Hoàn tiền' },
];

const SORT_OPTIONS = [
  { value: 'date-desc', label: 'Mới nhất' },
  { value: 'date-asc', label: 'Cũ nhất' },
  { value: 'amount-desc', label: 'Số tiền cao nhất' },
  { value: 'amount-asc', label: 'Số tiền thấp nhất' },
];

export function TransactionTableControls({
  searchQuery,
  statusFilter,
  typeFilter,
  sortKey,
  onSearchChange,
  onStatusChange,
  onTypeChange,
  onSortChange,
}: Props) {
  const selectedStatusLabel = STATUS_OPTIONS.find((opt) => opt.value === statusFilter)?.label || 'Tất cả trạng thái';
  const selectedTypeLabel = TYPE_OPTIONS.find((opt) => opt.value === typeFilter)?.label || 'Tất cả loại';
  const selectedSortLabel = SORT_OPTIONS.find((opt) => opt.value === sortKey)?.label || 'Mới nhất';

  const getFilterLabel = () => {
    const parts = [];
    if (statusFilter !== 'all') parts.push(selectedStatusLabel);
    if (typeFilter !== 'all') parts.push(selectedTypeLabel);
    if (sortKey !== 'date-desc') parts.push(selectedSortLabel);
    return parts.length > 0 ? parts.join(', ') : 'Bộ lọc';
  };

  return (
    <div className={styles.controls}>
      <div className={styles.searchWrapper}>
        <MagnifyingGlassIcon className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Tìm kiếm giao dịch..."
          className={styles.searchInput}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className={styles.controlsRight}>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className={styles.filterButton}>
              <MixerHorizontalIcon className={styles.filterIcon} />
              {getFilterLabel()}
              <ChevronDownIcon className={styles.chevronIcon} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className={styles.dropdownContent} align="end">
            <DropdownMenuLabel className={styles.dropdownLabel}>Trạng thái</DropdownMenuLabel>
            {STATUS_OPTIONS.map((option) => (
              <DropdownMenuItem
                key={option.value}
                className={`${styles.dropdownItem} ${statusFilter === option.value ? styles.dropdownItemActive : ''}`}
                onClick={() => onStatusChange(option.value)}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator className={styles.separator} />
            <DropdownMenuLabel className={styles.dropdownLabel}>Loại</DropdownMenuLabel>
            {TYPE_OPTIONS.map((option) => (
              <DropdownMenuItem
                key={option.value}
                className={`${styles.dropdownItem} ${typeFilter === option.value ? styles.dropdownItemActive : ''}`}
                onClick={() => onTypeChange(option.value)}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator className={styles.separator} />
            <DropdownMenuLabel className={styles.dropdownLabel}>Sắp xếp</DropdownMenuLabel>
            {SORT_OPTIONS.map((option) => (
              <DropdownMenuItem
                key={option.value}
                className={`${styles.dropdownItem} ${sortKey === option.value ? styles.dropdownItemActive : ''}`}
                onClick={() => onSortChange(option.value)}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="outline"
          size="sm"
          className={styles.exportButton}
          onClick={() => console.log('Export Transaction')}
        >
          <Download size={16} className={styles.exportIcon} />
          Xuất file
        </Button>
      </div>
    </div>
  );
}
