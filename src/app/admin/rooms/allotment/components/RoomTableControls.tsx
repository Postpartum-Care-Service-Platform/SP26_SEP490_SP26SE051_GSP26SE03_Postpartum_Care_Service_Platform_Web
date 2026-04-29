'use client';

import { ChevronDownIcon, MixerHorizontalIcon, PlusIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { Download, Upload, FileIcon } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';

import styles from './room-table-controls.module.css';

type SortKey = 'id-asc' | 'id-desc' | 'name-asc' | 'name-desc' | 'floor-asc' | 'floor-desc';

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'id-desc',    label: 'STT: giảm dần' },
  { value: 'id-asc',     label: 'STT: tăng dần' },
  { value: 'name-asc',   label: 'Tên A → Z' },
  { value: 'name-desc',  label: 'Tên Z → A' },
  { value: 'floor-asc',  label: 'Tầng thấp → cao' },
  { value: 'floor-desc', label: 'Tầng cao → thấp' },
];

const ACTIVE_OPTIONS: { value: 'all' | 'active' | 'inactive'; label: string }[] = [
  { value: 'all',      label: 'Tất cả' },
  { value: 'active',   label: 'Hoạt động' },
  { value: 'inactive', label: 'Không hoạt động' },
];

interface RoomTableControlsProps {
  onSearch: (query: string) => void;
  onSortChange: (key: SortKey) => void;
  onActiveFilterChange: (filter: 'all' | 'active' | 'inactive') => void;
  onNewRoom: () => void;
  onImportClick: () => void;
  onExportClick: () => void;
  onDownloadTemplate?: () => void;
  activeSortKey: SortKey;
  activeFilter: 'all' | 'active' | 'inactive';
}

export function RoomTableControls({
  onSearch,
  onSortChange,
  onActiveFilterChange,
  onNewRoom,
  onImportClick,
  onExportClick,
  onDownloadTemplate,
  activeSortKey,
  activeFilter,
}: RoomTableControlsProps) {
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    onSearch(val);
  };

  const selectedSortLabel = SORT_OPTIONS.find((o) => o.value === activeSortKey)?.label ?? 'Sắp xếp';
  const selectedActiveLabel = ACTIVE_OPTIONS.find((o) => o.value === activeFilter)?.label ?? 'Tất cả';

  return (
    <div className={styles.controls}>
      <div className={styles.controlsLeft}>
        <div className={styles.searchWrapper}>
          <MagnifyingGlassIcon className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Tìm kiếm tên phòng, loại phòng..."
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
            {SORT_OPTIONS.map((opt) => (
              <DropdownMenuItem
                key={opt.value}
                className={`${styles.dropdownItem} ${activeSortKey === opt.value ? styles.dropdownItemActive : ''}`}
                onClick={() => onSortChange(opt.value)}
              >
                {opt.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className={styles.controlsRight}>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className={styles.statusButton}>
              {selectedActiveLabel}
              <ChevronDownIcon className={styles.chevronIcon} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className={styles.dropdownContent}>
            {ACTIVE_OPTIONS.map((opt) => (
              <DropdownMenuItem
                key={opt.value}
                className={`${styles.dropdownItem} ${activeFilter === opt.value ? styles.dropdownItemActive : ''}`}
                onClick={() => onActiveFilterChange(opt.value)}
              >
                {opt.label}
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
              <Upload size={16} className={styles.itemIcon} />
              Nhập từ Excel
            </DropdownMenuItem>
            <DropdownMenuItem className={styles.dropdownItem} onClick={onExportClick}>
              <Download size={16} className={styles.itemIcon} />
              Xuất ra Excel
            </DropdownMenuItem>
            {onDownloadTemplate && (
              <DropdownMenuItem className={styles.dropdownItem} onClick={onDownloadTemplate}>
                <FileIcon size={16} className={styles.itemIcon} />
                Tải file mẫu
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="primary" size="sm" className={styles.createButton} onClick={onNewRoom}>
          <PlusIcon className={styles.plusIcon} />
          Thêm phòng mới
        </Button>
      </div>
    </div>
  );
}
