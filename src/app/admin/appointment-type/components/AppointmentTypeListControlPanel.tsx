'use client';

import React from 'react';

import styles from '../../work-schedule/components/work-schedule-control-panel.module.css';
import { SearchIcon, FilterIcon } from '../../work-schedule/components/WorkScheduleControlPanelIcons';

type Props = {
  searchValue: string;
  onSearchChange: (value: string) => void;
};

export function AppointmentTypeListControlPanel({ searchValue, onSearchChange }: Props) {
  return (
    <div className={styles.wrap}>
      <div className={styles.left}>
        <div className={styles.search}>
          <span className={styles.searchIcon}>
            <SearchIcon />
          </span>
          <input
            className={styles.searchInput}
            placeholder="Search work"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <button type="button" className={styles.ghostBtn}>
          <span className={styles.btnIcon}>
            <FilterIcon />
          </span>
          <span>Filter</span>
        </button>
      </div>

      <div className={styles.right}>
        {/* Phần phải tạm thời để trống, có thể bổ sung Saved filters, Group, view mode sau này */}
      </div>
    </div>
  );
}

