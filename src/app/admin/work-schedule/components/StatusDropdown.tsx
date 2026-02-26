'use client';

import React from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown/Dropdown';

import styles from './status-dropdown.module.css';

export type StatusType = 'TO DO' | 'IN PROGRESS' | 'DONE';

type Props = {
  value: StatusType;
  onChange?: (value: StatusType) => void;
};

function StatusArrow() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4.18179 6.18181C4.35753 6.00608 4.64245 6.00608 4.81819 6.18181L7.49999 8.86362L10.1818 6.18181C10.3575 6.00608 10.6424 6.00608 10.8182 6.18181C10.9939 6.35755 10.9939 6.64247 10.8182 6.81821L7.81819 9.81821C7.73379 9.9026 7.61934 9.95001 7.49999 9.95001C7.38064 9.95001 7.26618 9.9026 7.18179 9.81821L4.18179 6.81821C4.00605 6.64247 4.00605 6.35755 4.18179 6.18181Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
    </svg>
  );
}

export function StatusDropdown({ value, onChange }: Props) {
  const getTriggerClass = (val: StatusType) => {
    switch (val) {
      case 'IN PROGRESS': return styles.triggerBlue;
      case 'DONE': return styles.triggerGreen;
      default: return styles.triggerGray;
    }
  };

  const getPillClass = (val: StatusType) => {
    switch (val) {
      case 'IN PROGRESS': return styles.pillBlue;
      case 'DONE': return styles.pillGreen;
      default: return styles.pillGray;
    }
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button type="button" className={`${styles.trigger} ${getTriggerClass(value)}`}>
          <span>{value}</span>
          <span className={styles.caret}>
            <StatusArrow />
          </span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className={styles.menu} align="start" sideOffset={4}>
        <DropdownMenuItem className={styles.item} onClick={() => onChange?.('TO DO')}>
          <span className={`${styles.pill} ${styles.pillGray}`}>TO DO</span>
        </DropdownMenuItem>
        <DropdownMenuItem className={styles.item} onClick={() => onChange?.('IN PROGRESS')}>
          <span className={`${styles.pill} ${styles.pillBlue}`}>IN PROGRESS</span>
        </DropdownMenuItem>
        <DropdownMenuItem className={styles.item} onClick={() => onChange?.('DONE')}>
          <span className={`${styles.pill} ${styles.pillGreen}`}>DONE</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
