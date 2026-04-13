'use client';

import { MagnifyingGlassIcon, PlusIcon, MixerHorizontalIcon, ChevronDownIcon, DownloadIcon, UploadIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';

import styles from './care-plan-detail-table-controls.module.css';

type Props = {
  onSearch?: (query: string) => void;
  onSortChange?: (sort: string) => void;
  onNewCarePlanDetail?: () => void;
  onImport?: () => void;
  onExport?: () => void;
};

const SORT_OPTIONS = [
  { value: 'createdAt-desc', label: 'Mới nhất' },
  { value: 'createdAt-asc', label: 'Cũ nhất' },
  { value: 'dayNo-asc', label: 'Ngày: tăng dần' },
  { value: 'dayNo-desc', label: 'Ngày: giảm dần' },
  { value: 'packageName-asc', label: 'Tên gói A-Z' },
  { value: 'packageName-desc', label: 'Tên gói Z-A' },
];

export function CarePlanDetailTableControls({ onSearch, onSortChange, onNewCarePlanDetail, onImport, onExport }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState<string>('createdAt-desc');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  };

  const handleSortSelect = (value: string) => {
    setSelectedSort(value);
    onSortChange?.(value);
  };

  const selectedSortLabel = SORT_OPTIONS.find((opt) => opt.value === selectedSort)?.label || 'Sắp xếp';

  return (
    <div className={styles.controls}>
      <div className={styles.left}>
        <div className={styles.searchWrapper}>
          <MagnifyingGlassIcon className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Tìm kiếm hoạt động..."
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
            <Button variant="outline" size="sm" className={styles.exportButton}>
              <DownloadIcon className={styles.exportIcon} />
              Nhập/Xuất
              <ChevronDownIcon className={styles.chevronIcon} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className={styles.dropdownContent} align="end">
            <DropdownMenuItem className={styles.dropdownItem} onClick={onImport}>
              <UploadIcon className={styles.itemIcon} />
              Nhập từ Excel
            </DropdownMenuItem>
            <DropdownMenuItem className={styles.dropdownItem} onClick={onExport}>
              <DownloadIcon className={styles.itemIcon} />
              Xuất ra Excel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="primary" size="sm" className={styles.newCarePlanDetailButton} onClick={onNewCarePlanDetail}>
          <PlusIcon className={styles.plusIcon} />
          Hoạt động mới
        </Button>
      </div>
    </div>
  );
}
