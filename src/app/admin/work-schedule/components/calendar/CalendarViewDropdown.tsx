'use client';

import * as Popover from '@radix-ui/react-popover';
import React from 'react';

import styles from './calendar-view-dropdown.module.css';

export type CalendarViewMode = 'Month' | 'Week' | 'Day';

interface Props {
  value: CalendarViewMode;
  dayCount?: number;
  onChange: (view: CalendarViewMode, days?: number) => void;
}

function DayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
      <path d="M8 14h.01"></path>
      <path d="M12 14h.01"></path>
      <path d="M16 14h.01"></path>
      <path d="M8 18h.01"></path>
      <path d="M12 18h.01"></path>
      <path d="M16 18h.01"></path>
    </svg>
  );
}

function WorkWeekIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  );
}

function WeekIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3h18v18H3zM21 9H3M21 15H3M9 3v18M15 3v18"></path>
    </svg>
  );
}

function MonthIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
      <path d="M10 14h.01"></path>
      <path d="M14 14h.01"></path>
      <path d="M18 14h.01"></path>
      <path d="M10 18h.01"></path>
      <path d="M14 18h.01"></path>
      <path d="M18 18h.01"></path>
    </svg>
  );
}

export function CalendarViewDropdown({ value, dayCount = 1, onChange }: Props) {
  const [dayDropdownOpen, setDayDropdownOpen] = React.useState(false);

  return (
    <div className={styles.group}>
      {/* Day Dropdown */}
      <Popover.Root open={dayDropdownOpen} onOpenChange={setDayDropdownOpen}>
        <Popover.Trigger asChild>
          <button 
            type="button" 
            className={`${styles.viewBtn} ${value === 'Day' ? styles.active : ''}`}
            onClick={(e) => {
              if (value === 'Day') {
                // Keep open to choose days
              } else {
                onChange('Day', dayCount);
              }
            }}
          >
            <DayIcon />
            <span>Ngày</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6"></path>
            </svg>
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content className={styles.menu} sideOffset={4} align="start">
            {[1, 2, 3, 4, 5, 6, 7].map(n => (
              <button
                key={n}
                type="button"
                className={`${styles.menuItem} ${value === 'Day' && dayCount === n ? styles.itemActive : ''}`}
                onClick={() => {
                  onChange('Day', n);
                  setDayDropdownOpen(false);
                }}
              >
                {n} {n === 1 ? 'ngày' : 'ngày'}
              </button>
            ))}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      <button
        type="button"
        className={`${styles.viewBtn} ${value === 'Week' ? styles.active : ''}`}
        onClick={() => onChange('Week')}
      >
        <WeekIcon />
        <span>Tuần</span>
      </button>

      <button
        type="button"
        className={`${styles.viewBtn} ${value === 'Month' ? styles.active : ''}`}
        onClick={() => onChange('Month')}
      >
        <MonthIcon />
        <span>Tháng</span>
      </button>
    </div>
  );
}


