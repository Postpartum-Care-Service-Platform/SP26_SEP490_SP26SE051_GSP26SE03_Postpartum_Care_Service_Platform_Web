'use client';

import { CalendarIcon } from '@radix-ui/react-icons';
import { format, parseISO, isValid } from 'date-fns';
import { vi } from 'date-fns/locale';
import * as React from 'react';

import { Calendar } from '@/components/ui/calendar/Calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import styles from './add-contract-modal.module.css';

interface DatePickerProps {
  date?: string; // Expecting yyyy-MM-dd
  setDate: (date: string) => void;
  placeholder?: string;
}

export function CustomDatePicker({ date, setDate, placeholder = 'Chọn ngày' }: DatePickerProps) {
  // Convert string to Date for internal usage
  const selectedDate = React.useMemo(() => {
    if (!date || date.trim() === '') return undefined;
    const parsed = parseISO(date);
    return isValid(parsed) ? parsed : undefined;
  }, [date]);

  return (
    <Popover modal={true}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={`${styles.formControl} ${styles.datePickerTrigger}`}
        >
          <span className={date ? styles.dateValue : styles.datePlaceholder}>
            {selectedDate ? format(selectedDate, 'dd/MM/yyyy', { locale: vi }) : placeholder}
          </span>
          <CalendarIcon className={styles.calendarIcon} />
        </button>
      </PopoverTrigger>
      <PopoverContent className={styles.calendarPopoverContent} align="start" side="bottom" sideOffset={8}>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(d) => setDate(d ? format(d, 'yyyy-MM-dd') : '')}
          initialFocus
          locale={vi}
        />
      </PopoverContent>
    </Popover>
  );
}
