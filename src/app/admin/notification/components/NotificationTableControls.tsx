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
import styles from './notification-table-controls.module.css';

type Props = {
  onCreateClick: () => void;
  onSearch?: (query: string) => void;
  onStatusChange?: (status: 'all' | 'unread' | 'read') => void;
  onSortChange?: (sort: 'createdAt-desc' | 'createdAt-asc') => void;
};

const STATUS_OPTIONS: Array<{ value: 'all' | 'unread' | 'read'; label: string }> = [
  { value: 'all', label: 'Tất cả' },
  { value: 'unread', label: 'Chưa đọc' },
  { value: 'read', label: 'Đã đọc' },
];

const SORT_OPTIONS: Array<{ value: 'createdAt-desc' | 'createdAt-asc'; label: string }> = [
  { value: 'createdAt-desc', label: 'Mới nhất' },
  { value: 'createdAt-asc', label: 'Cũ nhất' },
];

export function NotificationTableControls({ onCreateClick, onSearch, onStatusChange, onSortChange }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'unread' | 'read'>('all');
  const [selectedSort, setSelectedSort] = useState<'createdAt-desc' | 'createdAt-asc'>('createdAt-desc');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  };

  const handleStatusSelect = (value: 'all' | 'unread' | 'read') => {
    setSelectedStatus(value);
    onStatusChange?.(value);
  };

  const handleSortSelect = (value: 'createdAt-desc' | 'createdAt-asc') => {
    setSelectedSort(value);
    onSortChange?.(value);
  };

  const selectedStatusLabel = STATUS_OPTIONS.find((opt) => opt.value === selectedStatus)?.label || 'Tất cả';
  const selectedSortLabel = SORT_OPTIONS.find((opt) => opt.value === selectedSort)?.label || 'Sắp xếp';

  return (
    <div className={styles.controls}>
      <div className={styles.left}>
        <div className={styles.searchWrapper}>
          <MagnifyingGlassIcon className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Tìm kiếm thông báo..."
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

        <Button variant="primary" size="sm" className={styles.newNotificationButton} onClick={onCreateClick}>
          <PlusIcon className={styles.plusIcon} />
          Thông báo mới
        </Button>
      </div>
    </div>
  );
}

