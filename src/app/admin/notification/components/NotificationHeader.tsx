'use client';

import { ArrowUpDown, Search } from 'lucide-react';
import { useState } from 'react';

import styles from './notification-header.module.css';

type Props = {
  onSearchChange?: (value: string) => void;
  onSortClick?: () => void;
};

export function NotificationHeader({ onSearchChange, onSortClick }: Props) {
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearchChange?.(value);
  };

  return (
    <div className={styles.header}>
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
        <button
          type="button"
          className={styles.sortButton}
          onClick={onSortClick}
          aria-label="Sắp xếp"
        >
          <ArrowUpDown size={16} />
          <span>Sắp xếp</span>
        </button>
      </div>
    </div>
  );
}
