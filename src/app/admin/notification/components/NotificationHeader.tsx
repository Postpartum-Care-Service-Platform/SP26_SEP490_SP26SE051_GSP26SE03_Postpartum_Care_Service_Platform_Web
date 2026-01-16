'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Search, ArrowUpDown } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import styles from './notification-header.module.css';

type Props = {
  onSearchChange?: (value: string) => void;
  onSortClick?: () => void;
};

export function NotificationHeader({ onSearchChange, onSortClick }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchValue, setSearchValue] = useState('');

  const handlePrevMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearchChange?.(value);
  };

  const formattedDate = format(currentDate, 'MMMM, yyyy', { locale: vi });

  return (
    <div className={styles.header}>
      <div className={styles.headerLeft}>
        <h2 className={styles.title}>Thông báo</h2>
        <div className={styles.dateSelector}>
          <button type="button" className={styles.dateArrow} onClick={handlePrevMonth} aria-label="Tháng trước">
            <ChevronLeft size={16} />
          </button>
          <span className={styles.dateText}>{formattedDate}</span>
          <button type="button" className={styles.dateArrow} onClick={handleNextMonth} aria-label="Tháng sau">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      <div className={styles.headerRight}>
        <div className={styles.searchContainer}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Tìm kiếm"
            value={searchValue}
            onChange={handleSearchChange}
          />
        </div>
        <button type="button" className={styles.sortButton} onClick={onSortClick} aria-label="Sắp xếp">
          <ArrowUpDown size={16} />
          <span>Sắp xếp</span>
        </button>
      </div>
    </div>
  );
}

