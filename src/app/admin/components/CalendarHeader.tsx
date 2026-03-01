'use client';

import { useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';

import styles from './calendar-header.module.css';

type DateOption = 'today' | 'tomorrow' | 'yesterday';

export function CalendarHeader() {
  const [selectedOption, setSelectedOption] = useState<DateOption>('today');

  const options: { value: DateOption; label: string }[] = [
    { value: 'today', label: 'Today' },
    { value: 'tomorrow', label: 'Tomorrow' },
    { value: 'yesterday', label: 'Yesterday' },
  ];

  const selectedLabel =
    options.find((opt) => opt.value === selectedOption)?.label || 'Today';

  return (
    <div className={styles.header}>
      <h2 className={styles.title}>Schedule</h2>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className={styles.dateButton} aria-label="Select date">
            <span>{selectedLabel}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className={styles.chevron}
            >
              <path
                d="M4 6L8 10L12 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className={styles.dropdownContent} align="end">
          {options.map((option) => (
            <DropdownMenuItem
              key={option.value}
              className={`${styles.dropdownItem} ${
                selectedOption === option.value ? styles.dropdownItemActive : ''
              }`}
              onClick={() => setSelectedOption(option.value)}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
