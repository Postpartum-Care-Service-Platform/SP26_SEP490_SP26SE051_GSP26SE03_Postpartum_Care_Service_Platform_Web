'use client';

import React from 'react';
import * as Popover from '@radix-ui/react-popover';

import styles from './calendar-status-dropdown.module.css';

type Status = {
  id: CalendarStatusType;
  label: string;
  pillClass: string;
};

export type CalendarStatusType = 'TO DO' | 'IN PROGRESS' | 'DONE';

const STATUSES: Status[] = [
  { id: 'DONE', label: 'DONE', pillClass: styles.pillDone },
  { id: 'IN PROGRESS', label: 'IN PROGRESS', pillClass: styles.pillInProgress },
  { id: 'TO DO', label: 'TO DO', pillClass: styles.pillTodo },
];

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

function CheckboxIcon({ checked }: { checked: boolean }) {
  return (
    <span className={`${styles.checkbox} ${checked ? styles.checkboxChecked : ''}`} aria-hidden="true">
      {checked && (
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
          <path
            d="M13.5 4.5L6.5 11.5L3 8"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </span>
  );
}

export function CalendarStatusDropdown({
  value,
  onChange,
  children,
}: {
  value: CalendarStatusType;
  onChange?: (value: CalendarStatusType) => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  const items = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return STATUSES;
    return STATUSES.filter((s) => s.label.toLowerCase().includes(q));
  }, [query]);

  React.useEffect(() => {
    if (open) {
      setQuery('');
      window.setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>{children}</Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className={styles.menu}
          align="start"
          side="bottom"
          sideOffset={6}
          collisionPadding={12}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className={styles.searchWrap}>
            <span className={styles.searchIcon} aria-hidden="true">
              <SearchIcon />
            </span>
            <input
              ref={inputRef}
              className={styles.searchInput}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Status"
            />
          </div>

          <div className={styles.list} role="listbox" aria-label="Status">
            {items.map((s) => {
              const checked = s.id === value;
              return (
                <div
                  key={s.id}
                  className={styles.option}
                  role="option"
                  aria-selected={checked}
                  tabIndex={0}
                  onClick={() => {
                    onChange?.(s.id);
                    setOpen(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onChange?.(s.id);
                      setOpen(false);
                    }
                  }}
                >
                  <CheckboxIcon checked={checked} />
                  <span className={`${styles.pill} ${s.pillClass}`}>{s.label}</span>
                </div>
              );
            })}
          </div>

          <div className={styles.footer}>
            {items.length} of {STATUSES.length}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
