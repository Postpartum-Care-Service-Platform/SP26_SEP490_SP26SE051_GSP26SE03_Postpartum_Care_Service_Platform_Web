'use client';

import { PlusIcon, ChevronDownIcon } from '@radix-ui/react-icons';

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
};

export function ContractTableControls({ sortBy = 'date-newest', onSortChange, onAddContract }: Props) {
  const selectedSortLabel = SORT_OPTIONS.find((opt) => opt.value === sortBy)?.label || 'Sắp xếp';

  const handleSortSelect = (value: string) => {
    onSortChange?.(value);
  };

  return (
    <div className={styles.controls}>
      <h5 className={styles.listTitle}>Danh sách hợp đồng</h5>
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
        <Button variant="primary" size="sm" className={styles.addButton} onClick={onAddContract}>
          <PlusIcon className={styles.plusIcon} />
          Thêm hợp đồng
        </Button>
      </div>
    </div>
  );
}

