'use client';

import Link from 'next/link';
import { PlusIcon, ChevronDownIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';

import type { AppointmentStatus } from './types';

import styles from './appointment-table-controls.module.css';

type Props = {
  onStatusChange?: (status: AppointmentStatus | 'all') => void;
};

const STATUS_OPTIONS: Array<{ value: AppointmentStatus | 'all'; label: string }> = [
  { value: 'all', label: 'All Status' },
  { value: 'Upcoming', label: 'Upcoming' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Cancelled', label: 'Cancelled' },
];

export function AppointmentTableControls({ onStatusChange }: Props) {
  const [selectedStatus, setSelectedStatus] = useState<AppointmentStatus | 'all'>('all');

  const handleStatusSelect = (value: AppointmentStatus | 'all') => {
    setSelectedStatus(value);
    onStatusChange?.(value);
  };

  const selectedStatusLabel = STATUS_OPTIONS.find((opt) => opt.value === selectedStatus)?.label || 'All Status';

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h4 className={styles.title}>All Appointments</h4>
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
            Add Appointment
          </Link>
        </div>
      </div>
    </div>
  );
}

