'use client';

import { Calendar as CalendarIcon } from 'lucide-react';
import { format, parseISO, isValid } from 'date-fns';
import { vi } from 'date-fns/locale';
import * as React from 'react';

import { DatePicker } from '@/app/admin/work-schedule/components/DatePicker';
import { cn } from '@/lib/utils';

import styles from './add-contract-modal.module.css';

interface DatePickerProps {
  date?: string; // Expecting yyyy-MM-dd
  setDate: (date: string) => void;
  placeholder?: string;
}

export function CustomDatePicker({ date, setDate, placeholder = 'Chọn ngày' }: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Convert string to Date for internal usage
  const selectedDate = React.useMemo(() => {
    if (!date || date.trim() === '') return null;
    const parsed = parseISO(date);
    return isValid(parsed) ? parsed : null;
  }, [date]);

  // Handle outside click to close
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div className={styles.datePickerContainer} ref={containerRef}>
      <button
        type="button"
        className={cn(styles.formControl, styles.datePickerTrigger, open && styles.datePickerTriggerOpen)}
        onClick={() => setOpen(!open)}
      >
        <CalendarIcon className={styles.calendarIconLeft} size={16} />
        <span className={date ? styles.dateValue : styles.datePlaceholder}>
          {selectedDate ? format(selectedDate, 'dd/MM/yyyy', { locale: vi }) : placeholder}
        </span>
      </button>

      {open && (
        <div className={styles.customPickerWrapper}>
          <DatePicker
            value={selectedDate}
            onChange={(d) => {
              if (d) {
                setDate(format(d, 'yyyy-MM-dd'));
              } else {
                setDate('');
              }
              setOpen(false);
            }}
            side="bottom"
            title=""
            onClose={() => setOpen(false)}
          />
        </div>
      )}


    </div>
  );
}
