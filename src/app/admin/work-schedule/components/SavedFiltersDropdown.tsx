'use client';

import { Search } from 'lucide-react';
import React from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown/Dropdown';

import styles from './saved-filters-dropdown.module.css';
import { ChevronDownSmallIcon } from './WorkScheduleControlPanelIcons';

const DEFAULT_FILTERS = [
  { id: 'assigned-to-me', label: 'Assigned to me' },
  { id: 'my-open-items', label: 'My open work items' },
  { id: 'reported-by-me', label: 'Reported by me' },
  { id: 'open-items', label: 'Open work items' },
  { id: 'done-items', label: 'Done work items' },
  { id: 'viewed-recently', label: 'Viewed recently' },
];

export function SavedFiltersDropdown() {
  const [search, setSearch] = React.useState('');

  const filteredItems = DEFAULT_FILTERS.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button type="button" className={styles.trigger}>
          <span>Saved filters</span>
          <span className={styles.chevron}>
            <ChevronDownSmallIcon />
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={styles.content} align="start" sideOffset={4}>
        <div className={styles.searchWrapper}>
          <Search size={14} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search filters"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
        </div>

        <div className={styles.scrollArea}>
          {!search && <div className={styles.sectionLabel}>Default filters</div>}
          
          <div className={styles.list}>
            {filteredItems.map((item) => (
              <button key={item.id} type="button" className={styles.item}>
                {item.label}
              </button>
            ))}
            {filteredItems.length === 0 && (
              <div className={styles.noResults}>No filters found</div>
            )}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
