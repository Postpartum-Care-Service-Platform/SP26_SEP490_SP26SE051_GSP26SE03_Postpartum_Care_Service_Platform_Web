'use client';

import { MagnifyingGlassIcon, PlusIcon, MixerHorizontalIcon, ChevronDownIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';
import { Button } from '@/components/ui/button';

import styles from './patient-table-controls.module.css';

type Props = {
  onSearch?: (query: string) => void;
  onFilter?: (filter: string) => void;
  onStatusChange?: (status: string) => void;
  onNewPatient?: () => void;
};

const FILTER_OPTIONS = [
  { value: 'date-newest', label: 'Ngày tạo: mới nhất' },
  { value: 'date-oldest', label: 'Ngày tạo: cũ nhất' },
  { value: 'name-asc', label: 'Tên khách hàng A-Z' },
  { value: 'name-desc', label: 'Tên khách hàng Z-A' },
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'true', label: 'Đã xác thực email' },
  { value: 'false', label: 'Chưa xác thực email' },
];

export function PatientTableControls({
  onSearch,
  onFilter,
  onStatusChange,
  onNewPatient,
}: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('date-newest');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  };

  const handleFilterSelect = (value: string) => {
    setSelectedFilter(value);
    onFilter?.(value);
  };

  const handleStatusSelect = (value: string) => {
    setSelectedStatus(value);
    onStatusChange?.(value);
  };

  const selectedStatusLabel = STATUS_OPTIONS.find((opt) => opt.value === selectedStatus)?.label || 'Tất cả';

  return (
    <div className={styles.controls}>
      <div className={styles.left}>
        <div className={styles.searchWrapper}>
          <MagnifyingGlassIcon className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Tìm kiếm tài khoản..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className={styles.filterButton}>
              <MixerHorizontalIcon className={styles.filterIcon} />
              Lọc
              <ChevronDownIcon className={styles.chevronIcon} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className={styles.dropdownContent}>
            {FILTER_OPTIONS.map((option) => (
              <DropdownMenuItem
                key={option.value}
                className={`${styles.dropdownItem} ${selectedFilter === option.value ? styles.dropdownItemActive : ''}`}
                onClick={() => handleFilterSelect(option.value)}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className={styles.right}>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className={styles.statusButton}>
              {selectedStatusLabel}
              <ChevronDownIcon className={styles.chevronIcon} />
            </Button>
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
        <Button variant="primary" size="sm" className={styles.newPatientButton} onClick={onNewPatient}>
          <PlusIcon className={styles.plusIcon} />
          Tài khoản mới
        </Button>
      </div>
    </div>
  );
}

