'use client';

import { MagnifyingGlassIcon, MixerHorizontalIcon, ChevronDownIcon } from '@radix-ui/react-icons';
import { Download } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';

import styles from './booking-table-controls.module.css';

type Props = {
  onSearch?: (query: string) => void;
  onStatusChange?: (status: string) => void;
  onSortChange?: (sort: string) => void;
};

const STATUS_OPTIONS = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'Pending', label: 'Đang chờ' },
  { value: 'Confirmed', label: 'Đã xác nhận' },
  { value: 'CheckedIn', label: 'Đã nhận phòng' },
  { value: 'CheckedOut', label: 'Đã trả phòng' },
  { value: 'Completed', label: 'Hoàn thành' },
  { value: 'Cancelled', label: 'Đã hủy' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Ngày đặt: Mới nhất' },
  { value: 'oldest', label: 'Ngày đặt: Cũ nhất' },
  { value: 'startDate-asc', label: 'Ngày bắt đầu: Gần nhất' },
  { value: 'price-desc', label: 'Giá: Cao nhất' },
  { value: 'price-asc', label: 'Giá: Thấp nhất' },
];

export function BookingTableControls({ onSearch, onStatusChange, onSortChange }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSort, setSelectedSort] = useState('newest');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  };

  const handleStatusSelect = (status: string) => {
    setSelectedStatus(status);
    onStatusChange?.(status);
  };

  const handleSortSelect = (sort: string) => {
    setSelectedSort(sort);
    onSortChange?.(sort);
  };

  const selectedStatusLabel = STATUS_OPTIONS.find((opt) => opt.value === selectedStatus)?.label || 'Trạng thái';
  const selectedSortLabel = SORT_OPTIONS.find((opt) => opt.value === selectedSort)?.label || 'Sắp xếp';

  return (
    <div className={styles.controls}>
      <div className={styles.left}>
        <div className={styles.searchWrapper}>
          <MagnifyingGlassIcon className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Tìm kiếm khách hàng, SĐT, mã booking..."
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
        <Button
          variant="outline"
          size="sm"
          className={styles.exportButton}
          onClick={() => console.log('Export Booking')}
        >
          <Download size={16} className={styles.exportIcon} />
          Xuất file
        </Button>

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
      </div>
    </div>
  );
}
