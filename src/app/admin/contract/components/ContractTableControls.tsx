'use client';

import { PlusIcon, ChevronDownIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { Download } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';

import styles from './contract-table-controls.module.css';

const SORT_OPTIONS = [
  { value: 'date-newest', label: 'Ngày tạo: mới nhất' },
  { value: 'date-oldest', label: 'Ngày tạo: cũ nhất' },
  { value: 'code-asc', label: 'Mã hợp đồng A-Z' },
  { value: 'code-desc', label: 'Mã hợp đồng Z-A' },
  { value: 'status', label: 'Theo trạng thái' },
];

type Props = {
  sortBy?: string;
  onSortChange?: (value: string) => void;
  onAddContract?: () => void;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  onImportClick?: () => void;
  onExportClick?: () => void;
};

export function ContractTableControls({ sortBy = 'date-newest', onSortChange, onAddContract, searchQuery = '', onSearchChange, onImportClick, onExportClick }: Props) {
  const selectedSortLabel = SORT_OPTIONS.find((opt) => opt.value === sortBy)?.label || 'Sắp xếp';

  const handleSortSelect = (value: string) => {
    onSortChange?.(value);
  };

  return (
    <div className={styles.controls}>
      <div className={styles.searchWrapper}>
        <MagnifyingGlassIcon className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Tìm kiếm hợp đồng, khách hàng..."
          className={styles.searchInput}
          value={searchQuery}
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
      </div>
      <div className={styles.right}>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className={styles.sortButton}>
              {selectedSortLabel}
              <ChevronDownIcon className={styles.chevronIcon} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className={styles.dropdownContent}>
            {SORT_OPTIONS.map((option) => (
              <DropdownMenuItem
                key={option.value}
                className={`${styles.dropdownItem} ${sortBy === option.value ? styles.dropdownItemActive : ''}`}
                onClick={() => handleSortSelect(option.value)}
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
            <DropdownMenuItem className={styles.dropdownItem} onClick={onImportClick}>
              <img src="https://res.public.onecdn.static.microsoft/assets/fluentui-resources/1.1.0/app-min/assets/item-types/20/xlsx.svg" alt="Import" className={styles.itemIcon} style={{ width: 16, height: 16, marginRight: 8 }} />
              Nhập từ Excel
            </DropdownMenuItem>
            <DropdownMenuItem className={styles.dropdownItem} onClick={onExportClick}>
              <Download size={16} className={styles.itemIcon} style={{ marginRight: 8 }} />
              Xuất ra Excel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="primary" size="sm" className={styles.addButton} onClick={onAddContract}>
          <PlusIcon className={styles.plusIcon} />
          Thêm hợp đồng
        </Button>
      </div>
    </div>
  );
}

