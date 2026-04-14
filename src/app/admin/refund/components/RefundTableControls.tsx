'use client';

import { MagnifyingGlassIcon, MixerHorizontalIcon, ChevronDownIcon } from '@radix-ui/react-icons';
import { Download, Upload } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';

import styles from './refund-table-controls.module.css';

interface Props {
  onSearch: (q: string) => void;
  onSortChange: (sort: string) => void;
  onStatusChange: (status: string) => void;
  onImport: () => void;
  onExport: () => void;
}

const SORT_OPTIONS = [
  { value: 'date-desc', label: 'Ngày yêu cầu: mới nhất' },
  { value: 'date-asc', label: 'Ngày yêu cầu: cũ nhất' },
  { value: 'amount-desc', label: 'Số tiền: cao nhất' },
  { value: 'amount-asc', label: 'Số tiền: thấp nhất' },
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'Pending', label: 'Chờ duyệt' },
  { value: 'Approved', label: 'Đã duyệt' },
  { value: 'Rejected', label: 'Đã từ chối' },
  { value: 'Processed', label: 'Đã xử lý' },
];

export function RefundTableControls({ onSearch, onSortChange, onStatusChange, onImport, onExport }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState('date-desc');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  const handleSortSelect = (value: string) => {
    setSelectedSort(value);
    onSortChange(value);
  };

  const handleStatusSelect = (value: string) => {
    setSelectedStatus(value);
    onStatusChange(value);
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
            placeholder="Tìm kiếm yêu cầu hoàn tiền..."
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

        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className={styles.exportButton}>
              <Download size={16} className={styles.exportIcon} />
              Nhập/Xuất
              <ChevronDownIcon className={styles.chevronIcon} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className={styles.dropdownContent} align="end">
            <DropdownMenuItem className={styles.dropdownItem} onClick={onImport}>
              <Upload size={16} className={styles.itemIcon} />
              Nhập từ Excel
            </DropdownMenuItem>
            <DropdownMenuItem className={styles.dropdownItem} onClick={onExport}>
              <Download size={16} className={styles.itemIcon} />
              Xuất ra Excel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
