'use client';

import { MagnifyingGlassIcon, PlusIcon, MixerHorizontalIcon, ChevronDownIcon } from '@radix-ui/react-icons';
import { Download, Upload, FileIcon } from 'lucide-react';
import { useState, useMemo } from 'react';
import { HealthConditionCategory } from '@/types/health-record';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';

import styles from './health-condition-table-controls.module.css';

type Props = {
  onSearch?: (query: string) => void;
  onSortChange?: (sort: string) => void;
  onCategoryChange?: (category: string) => void;
  onAppliesToChange: (appliesTo: string) => void;
  onNew: () => void;
  onImport: () => void;
  onExport: () => void;
  onDownloadTemplate: () => void;
  categories: HealthConditionCategory[];
};

const SORT_OPTIONS = [
  { value: 'name-asc', label: 'Tên: A-Z' },
  { value: 'name-desc', label: 'Tên: Z-A' },
  { value: 'createdAt-desc', label: 'Ngày tạo: mới nhất' },
  { value: 'createdAt-asc', label: 'Ngày tạo: cũ nhất' },
];


const APPLIES_TO_OPTIONS = [
  { value: 'all', label: 'Tất cả đối tượng' },
  { value: 'MOM', label: 'Mẹ' },
  { value: 'BABY', label: 'Bé' },
  { value: 'BOTH', label: 'Cả hai' },
];

export function HealthConditionTableControls({ 
  onSearch, 
  onSortChange, 
  onCategoryChange, 
  onAppliesToChange, 
  onNew, 
  onImport, 
  onExport, 
  onDownloadTemplate,
  categories
}: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState<string>('name-asc');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAppliesTo, setSelectedAppliesTo] = useState<string>('all');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  };

  const categoryOptions = useMemo(() => [
    { value: 'all', label: 'Tất cả phân loại' },
    ...categories.map((c: HealthConditionCategory) => ({ value: c.name, label: c.name }))
  ], [categories]);

  const selectedSortLabel = SORT_OPTIONS.find((opt) => opt.value === selectedSort)?.label || 'Sắp xếp';
  const selectedCategoryLabel = categoryOptions.find((opt) => opt.value === selectedCategory)?.label || 'Phân loại';
  const selectedAppliesToLabel = APPLIES_TO_OPTIONS.find((opt) => opt.value === selectedAppliesTo)?.label || 'Đối tượng';

  return (
    <div className={styles.controls}>
      <div className={styles.left}>
        <div className={styles.searchWrapper}>
          <MagnifyingGlassIcon className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Tìm kiếm tình trạng sức khỏe..."
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
                onClick={() => { setSelectedSort(option.value); onSortChange?.(option.value); }}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className={styles.filterButton}>
              {selectedCategoryLabel}
              <ChevronDownIcon className={styles.chevronIcon} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className={styles.dropdownContent}>
            {categoryOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                className={`${styles.dropdownItem} ${selectedCategory === option.value ? styles.dropdownItemActive : ''}`}
                onClick={() => { setSelectedCategory(option.value); onCategoryChange?.(option.value); }}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className={styles.filterButton}>
              {selectedAppliesToLabel}
              <ChevronDownIcon className={styles.chevronIcon} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className={styles.dropdownContent}>
            {APPLIES_TO_OPTIONS.map((option) => (
              <DropdownMenuItem
                key={option.value}
                className={`${styles.dropdownItem} ${selectedAppliesTo === option.value ? styles.dropdownItemActive : ''}`}
                onClick={() => { setSelectedAppliesTo(option.value); onAppliesToChange?.(option.value); }}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className={styles.right}>
        <div className={styles.actionGroup}>
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
              <DropdownMenuItem className={styles.dropdownItem} onClick={onDownloadTemplate}>
                <FileIcon size={16} className={styles.itemIcon} />
                Tải file mẫu
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="primary" size="sm" className={styles.newButton} onClick={onNew}>
            <PlusIcon className={styles.plusIcon} />
            Thêm mới
          </Button>
        </div>
      </div>
    </div>
  );
}
