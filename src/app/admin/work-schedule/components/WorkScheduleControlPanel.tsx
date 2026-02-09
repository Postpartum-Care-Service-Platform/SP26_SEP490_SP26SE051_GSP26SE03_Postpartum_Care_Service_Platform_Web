'use client';

import React from 'react';

import { SearchIcon, FilterIcon, ShareIcon, LightningIcon, ViewListIcon, ViewColumnsIcon, MoreIcon, ChevronDownSmallIcon } from './WorkScheduleControlPanelIcons';
import { SavedFiltersDropdown } from './SavedFiltersDropdown';

import styles from './work-schedule-control-panel.module.css';

type Props = {
  searchValue: string;
  onSearchChange: (value: string) => void;
};

export function WorkScheduleControlPanel({ searchValue, onSearchChange }: Props) {
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

        <div className={styles.assigneeFilter}>
          <button type="button" className={styles.assigneeBtn} aria-label="Unassigned">
            <svg fill="none" viewBox="-4 -4 24 24" width="24" height="24">
              <circle cx="8" cy="8" r="11.5" fill="#EBECF0" />
              <path fill="#42526E" fillRule="evenodd" d="M8 1.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4 4a4 4 0 1 1 8 0 4 4 0 0 1-8 0m-2 9a3.75 3.75 0 0 1 3.75-3.75h4.5A3.75 3.75 0 0 1 14 13v2h-1.5v-2a2.25 2.25 0 0 0-2.25-2.25h-4.5A2.25 2.25 0 0 0 3.5 13v2H2z" clipRule="evenodd"></path>
            </svg>
          </button>
          <button type="button" className={styles.avatarBtn}>
            <div className={styles.avatarCircle} style={{ background: '#DE350B' }}>VT</div>
          </button>
        </div>

        <button type="button" className={styles.ghostBtn}>
          <span className={styles.btnIcon}><FilterIcon /></span>
          <span>Filter</span>
        </button>
      </div>

      <div className={styles.right}>
        <SavedFiltersDropdown />
        <button type="button" className={styles.ghostBtn}>
          <span>Nhóm</span>
          <span className={styles.chevron}><ChevronDownSmallIcon /></span>
        </button>

        <button type="button" className={styles.iconBtn} aria-label="Chia sẻ">
          <ShareIcon />
        </button>
        <button type="button" className={styles.iconBtn} aria-label="Tự động hóa">
          <LightningIcon />
        </button>

        <div className={styles.viewSwitch} role="group" aria-label="Chế độ hiển thị">
          <button type="button" className={`${styles.viewBtn} ${styles.viewBtnActive}`} aria-label="Danh sách">
            <ViewListIcon />
          </button>
          <button type="button" className={styles.viewBtn} aria-label="Bảng">
            <ViewColumnsIcon />
          </button>
        </div>

        <button type="button" className={styles.iconBtn} aria-label="Thêm">
          <MoreIcon />
        </button>
      </div>
    </div>
  );
}
