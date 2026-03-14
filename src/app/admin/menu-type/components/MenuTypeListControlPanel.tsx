'use client';

import React from 'react';

import { MixerHorizontalIcon, ChevronDownIcon, PlusIcon } from '@radix-ui/react-icons';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';
import styles from '../../work-schedule/components/work-schedule-control-panel.module.css';
import { SearchIcon } from '../../work-schedule/components/WorkScheduleControlPanelIcons';

type StatusFilter = 'all' | 'active' | 'inactive';

type Props = {
  searchValue: string;
  onSearchChange: (value: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (value: StatusFilter) => void;
  onCreateClick: () => void;
};

export function MenuTypeListControlPanel({
  searchValue,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onCreateClick,
}: Props) {
  const getFilterLabel = () => {
    switch (statusFilter) {
      case 'active':
        return 'Hoạt động';
      case 'inactive':
        return 'Tạm dừng';
      default:
        return 'Tất cả';
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.left}>
        <div className={styles.search}>
          <span className={styles.searchIcon}>
            <SearchIcon />
          </span>
          <input
            className={styles.searchInput}
            placeholder="Tìm kiếm loại thực đơn..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className={styles.filterButton}>
              <MixerHorizontalIcon className={styles.filterIcon} />
              <span>Lọc</span>
              <span className={styles.chevronIcon}>
                <ChevronDownIcon />
              </span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className={styles.dropdownContent} align="start" sideOffset={6}>
            <DropdownMenuItem
              className={`${styles.dropdownItem} ${
                statusFilter === 'all' ? styles.dropdownItemActive : ''
              }`}
              onClick={() => onStatusFilterChange('all')}
            >
              Tất cả
            </DropdownMenuItem>
            <DropdownMenuItem
              className={`${styles.dropdownItem} ${
                statusFilter === 'active' ? styles.dropdownItemActive : ''
              }`}
              onClick={() => onStatusFilterChange('active')}
            >
              Hoạt động
            </DropdownMenuItem>
            <DropdownMenuItem
              className={`${styles.dropdownItem} ${
                statusFilter === 'inactive' ? styles.dropdownItemActive : ''
              }`}
              onClick={() => onStatusFilterChange('inactive')}
            >
              Tạm dừng
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className={styles.right}>
        <Button
          variant="primary"
          size="sm"
          className={styles.createButton}
          onClick={onCreateClick}
        >
          <PlusIcon className={styles.plusIcon} />
          <span>Tạo loại thực đơn</span>
        </Button>
      </div>
    </div>
  );
}

