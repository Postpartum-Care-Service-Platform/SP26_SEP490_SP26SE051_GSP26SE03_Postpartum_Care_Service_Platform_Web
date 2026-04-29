'use client';

import { MagnifyingGlassIcon, PlusIcon, MixerHorizontalIcon, ChevronDownIcon } from '@radix-ui/react-icons';
import { Download, Upload, FileIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';
import styles from './medical-record-table-controls.module.css';

type Props = {
  onSearch?: (query: string) => void;
  onNewRecord?: () => void;
};

export function MedicalRecordTableControls({ onSearch, onNewRecord }: Props) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  };

  return (
    <div className={styles.controls}>
      <div className={styles.left}>
        <div className={styles.searchWrapper}>
          <MagnifyingGlassIcon className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Tìm kiếm hồ sơ..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        <Button variant="outline" size="sm" className={styles.filterButton}>
          <MixerHorizontalIcon className={styles.filterIcon} />
          Sắp xếp: Mới nhất
          <ChevronDownIcon className={styles.chevronIcon} />
        </Button>
      </div>

      <div className={styles.right}>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className={styles.exportButton}>
              <Download size={16} className={styles.exportIcon} />
              Nhập/Xuất
              <ChevronDownIcon className={styles.chevronIcon} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className={styles.dropdownContent} align="end">
            <DropdownMenuItem className={styles.dropdownItem}>
              <Upload size={16} className={styles.itemIcon} />
              Nhập từ Excel
            </DropdownMenuItem>
            <DropdownMenuItem className={styles.dropdownItem}>
              <Download size={16} className={styles.itemIcon} />
              Xuất ra Excel
            </DropdownMenuItem>
            <DropdownMenuItem className={styles.dropdownItem}>
              <FileIcon size={16} className={styles.itemIcon} />
              Tải file mẫu
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="primary" size="sm" className={styles.newRecordButton} onClick={onNewRecord}>
          <PlusIcon className={styles.plusIcon} />
          Thêm hồ sơ mới
        </Button>
      </div>
    </div>
  );
}
