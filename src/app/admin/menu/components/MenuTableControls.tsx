'use client';

import { ChevronDownIcon, MagnifyingGlassIcon, MixerHorizontalIcon, PlusIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';

import styles from './menu-table-controls.module.css';

type Props = {
  onSearch?: (query: string) => void;
  onSortChange?: (sort: string) => void;
  onStatusChange?: (status: 'all' | 'active' | 'inactive') => void;
  onNewMenu?: () => void;
};

const SORT_OPTIONS = [
  { value: 'createdAt-desc', label: 'Ngày tạo: mới nhất' },
  { value: 'createdAt-asc', label: 'Ngày tạo: cũ nhất' },
  { value: 'name-asc', label: 'Tên thực đơn A-Z' },
  { value: 'name-desc', label: 'Tên thực đơn Z-A' },
  { value: 'type-asc', label: 'Loại thực đơn A-Z' },
  { value: 'type-desc', label: 'Loại thực đơn Z-A' },
];

const STATUS_OPTIONS: Array<{ value: 'all' | 'active' | 'inactive'; label: string }> = [
  { value: 'all', label: 'Tất cả' },
  { value: 'active', label: 'Hoạt động' },
  { value: 'inactive', label: 'Tạm dừng' },
];

export function MenuTableControls({ onSearch, onSortChange, onStatusChange, onNewMenu }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState<string>('createdAt-desc');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'inactive'>('all');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  };

  const handleSortSelect = (value: string) => {
    setSelectedSort(value);
    onSortChange?.(value);
  };

  const handleStatusSelect = (value: 'all' | 'active' | 'inactive') => {
    setSelectedStatus(value);
    onStatusChange?.(value);
  };

  const selectedSortLabel = SORT_OPTIONS.find((opt) => opt.value === selectedSort)?.label || 'Sắp xếp';
  const selectedStatusLabel = STATUS_OPTIONS.find((opt) => opt.value === selectedStatus)?.label || 'Tất cả';

  return (
    <div className={styles.controls}>
      <div className={styles.left}>
        <div className={styles.searchWrapper}>
          <MagnifyingGlassIcon className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Tìm kiếm thực đơn..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className={styles.filterButton}>
              <MixerHorizontalIcon className={styles.filterIcon} />
              {selectedSortLabel}
              <ChevronDownIcon className={styles.chevronIcon} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className={styles.dropdownContent}>
            {SORT_OPTIONS.map((option) => (
              <DropdownMenuItem
                key={option.value}
                className={`${styles.dropdownItem} ${selectedSort === option.value ? styles.dropdownItemActive : ''}`}
                onClick={() => handleSortSelect(option.value)}
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

        <Button variant="primary" size="sm" className={styles.newMenuButton} onClick={onNewMenu}>
          <PlusIcon className={styles.plusIcon} />
          Thực đơn mới
        </Button>
      </div>
    </div>
  );
}