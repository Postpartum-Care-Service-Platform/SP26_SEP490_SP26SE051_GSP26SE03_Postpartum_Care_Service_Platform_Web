'use client';

import { ChevronDownIcon, PlusIcon } from '@radix-ui/react-icons';
import { Download, Search, Upload } from 'lucide-react';
import { useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';

import styles from './appointment-table-controls.module.css';

import type { AppointmentStatus } from './types';

type Props = {
  onStatusChange?: (status: AppointmentStatus | 'all') => void;
  onAddClick?: () => void;
};

const STATUS_OPTIONS: Array<{ value: AppointmentStatus | 'all'; label: string }> = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'Upcoming', label: 'Sắp diễn ra' },
  { value: 'Pending', label: 'Đang chờ' },
  { value: 'Completed', label: 'Hoàn thành' },
  { value: 'Cancelled', label: 'Đã hủy' },
];

export function AppointmentTableControls({ onStatusChange, onAddClick }: Props) {
  const [selectedStatus, setSelectedStatus] = useState<AppointmentStatus | 'all'>('all');

  const handleStatusSelect = (value: AppointmentStatus | 'all') => {
    setSelectedStatus(value);
    onStatusChange?.(value);
  };

  const selectedStatusLabel =
    STATUS_OPTIONS.find((opt) => opt.value === selectedStatus)?.label || 'Tất cả trạng thái';

  return (
    <div className={styles.wrapper}>
      <div className={styles.controls}>
        <div className={styles.left}>
          <div className={styles.searchWrapper}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Tìm kiếm lịch hẹn (Tên, SĐT, Mã...)"
              className={styles.searchInput}
            />
          </div>
        </div>

        <div className={styles.right}>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <button className={styles.statusButton}>
                {selectedStatusLabel}
                <ChevronDownIcon className={styles.chevronIcon} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={styles.dropdownContent}>
              {STATUS_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  className={`${styles.dropdownItem} ${selectedStatus === option.value ? styles.dropdownItemActive : ''}`}
                  onClick={() => handleStatusSelect(option.value)}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <button className={styles.exportButton}>
                <Download className={styles.exportIcon} />
                Nhập/Xuất
                <ChevronDownIcon className={styles.chevronIcon} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={styles.dropdownContent} align="end">
              <DropdownMenuItem className={styles.dropdownItem} onClick={() => console.log('Import')}>
                <Upload size={16} className={styles.itemIcon} />
                Nhập từ Excel
              </DropdownMenuItem>
              <DropdownMenuItem className={styles.dropdownItem} onClick={() => console.log('Export')}>
                <Download size={16} className={styles.itemIcon} />
                Xuất ra Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <button type="button" onClick={onAddClick} className={styles.addButton}>
            <PlusIcon className={styles.plusIcon} />
            Thêm lịch hẹn
          </button>
        </div>
      </div>
    </div>
  );
}

