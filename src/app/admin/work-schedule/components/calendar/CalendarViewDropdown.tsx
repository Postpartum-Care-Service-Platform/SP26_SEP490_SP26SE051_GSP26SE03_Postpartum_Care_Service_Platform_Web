'use client';

import React from 'react';
import * as Popover from '@radix-ui/react-popover';

import styles from './calendar-view-dropdown.module.css';

type ViewMode = 'Month' | 'Week';

function ChevronDownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4.18179 6.18181C4.35753 6.00608 4.64245 6.00608 4.81819 6.18181L7.99999 9.36362L11.1818 6.18181C11.3575 6.00608 11.6424 6.00608 11.8182 6.18181C11.9939 6.35755 11.9939 6.64247 11.8182 6.81821L8.35355 10.2828C8.15829 10.4781 7.84171 10.4781 7.64645 10.2828L4.18179 6.81821C4.00605 6.64247 4.00605 6.35755 4.18179 6.18181Z" fill="currentColor" />
    </svg>
  );
}

const OPTIONS: ViewMode[] = ['Month', 'Week'];

export function CalendarViewDropdown({
  value,
  onChange,
}: {
  value: ViewMode;
  onChange?: (value: ViewMode) => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button type="button" className={styles.trigger}>
          <span>{value}</span>
          <span className={styles.caret} aria-hidden="true">
            <ChevronDownIcon />
          </span>
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className={styles.menu}
          align="start"
          side="bottom"
          sideOffset={6}
          collisionPadding={12}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          {OPTIONS.map((opt) => {
            const selected = opt === value;
            return (
              <button
                key={opt}
                type="button"
                className={`${styles.item} ${selected ? styles.itemSelected : ''}`}
                onClick={() => {
                  onChange?.(opt);
                  setOpen(false);
                }}
              >
                {opt}
              </button>
            );
          })}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export type { ViewMode as CalendarViewMode };
