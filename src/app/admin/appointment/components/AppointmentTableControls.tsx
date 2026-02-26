'use client';

import { ChevronDownIcon, PlusIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
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
};

const STATUS_OPTIONS: Array<{ value: AppointmentStatus | 'all'; label: string }> = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'Upcoming', label: 'Sắp diễn ra' },
  { value: 'Pending', label: 'Đang chờ' },
  { value: 'Completed', label: 'Hoàn thành' },
  { value: 'Cancelled', label: 'Đã hủy' },
];

export function AppointmentTableControls({ onStatusChange }: Props) {
  const [selectedStatus, setSelectedStatus] = useState<AppointmentStatus | 'all'>('all');

  const handleStatusSelect = (value: AppointmentStatus | 'all') => {
    setSelectedStatus(value);
    onStatusChange?.(value);
  };

  const selectedStatusLabel =
    STATUS_OPTIONS.find((opt) => opt.value === selectedStatus)?.label || 'Tất cả trạng thái';

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h4 className={styles.title}>Tất cả lịch hẹn</h4>
        <div className={styles.controls}>
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
          <Link href="/admin/appointment/add" className={styles.addButton}>
            <PlusIcon className={styles.plusIcon} />
            Thêm lịch hẹn
          </Link>
        </div>
      </div>
    </div>
  );
}

