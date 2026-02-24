'use client';

import React from 'react';

import styles from './timeline-control-panel.module.css';

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 2.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9ZM1 7a6 6 0 1 1 10.244 4.244l2.256 2.256a.75.75 0 1 1-1.06 1.06l-2.256-2.256A6 6 0 0 1 1 7Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M4.18179 6.18181C4.35753 6.00608 4.64245 6.00608 4.81819 6.18181L7.99999 9.36362L11.1818 6.18181C11.3575 6.00608 11.6424 6.00608 11.8182 6.18181C11.9939 6.35755 11.9939 6.64247 11.8182 6.81821L8.35355 10.2828C8.15829 10.4781 7.84171 10.4781 7.64645 10.2828L4.18179 6.81821C4.00605 6.64247 4.00605 6.35755 4.18179 6.18181Z"
        fill="currentColor"
      />
    </svg>
  );
}

function SlidersIcon() {
  return (
    <svg fill="none" viewBox="-4 -4 24 24" role="presentation" width="16" height="16" aria-hidden="true">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M3 2.375C3 1.615 3.616 1 4.375 1h1.75c.76 0 1.375.616 1.375 1.375v4.25C7.5 7.385 6.884 8 6.125 8h-1.75C3.615 8 3 7.384 3 6.625V5.25H0v-1.5h3zm1.5.125v4H6v-4zM16 5.25H8.5v-1.5H16zM8.5 9.375C8.5 8.615 9.116 8 9.875 8h1.75C12.385 8 13 8.616 13 9.375v1.375h3v1.5h-3v1.375c0 .76-.616 1.375-1.375 1.375h-1.75c-.76 0-1.375-.616-1.375-1.375zM10 9.5v4h1.5v-4zM0 12.25v-1.5h7.5v1.5z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg fill="none" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path fill="currentColor" d="M3.5 9a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm4.5 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm4.5 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
    </svg>
  );
}

type Props = {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  epicLabel?: string;
  typeLabel?: string;
  statusCategoryLabel?: string;
  assigneeOnly?: boolean;
  onAssigneeOnlyChange?: (value: boolean) => void;
};

export function TimelineControlPanel({
  searchValue = '',
  onSearchChange,
  epicLabel = 'Epic',
  typeLabel = 'Type',
  statusCategoryLabel = 'Status category',
  assigneeOnly = false,
  onAssigneeOnlyChange,
}: Props) {
  return (
    <div className={styles.wrap}>
      <div className={styles.left}>
        <div className={styles.search}>
          <span className={styles.searchIcon}>
            <SearchIcon />
          </span>
          <input
            className={styles.searchInput}
            placeholder="Search timeline"
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
        </div>

        <div className={styles.avatars} aria-label="Assignees">
          <button type="button" className={styles.avatar} aria-label="VT">
            VT
          </button>
          <button
            type="button"
            className={`${styles.avatar} ${styles.avatarVT} ${assigneeOnly ? styles.avatarActive : ''}`}
            aria-label="VT"
            onClick={() => onAssigneeOnlyChange?.(!assigneeOnly)}
          >
            VT
          </button>
        </div>

        <button type="button" className={styles.filterBtn}>
          <span>{epicLabel}</span>
          <ChevronDownIcon />
        </button>

        <button type="button" className={styles.filterBtn}>
          <span>{typeLabel}</span>
          <ChevronDownIcon />
        </button>

        <button type="button" className={styles.filterBtn}>
          <span>{statusCategoryLabel}</span>
          <ChevronDownIcon />
        </button>
      </div>

      <div className={styles.right}>
        <button type="button" className={styles.iconBtn} aria-label="Controls">
          <SlidersIcon />
        </button>
        <button type="button" className={styles.iconBtn} aria-label="More">
          <MoreIcon />
        </button>
      </div>
    </div>
  );
}
