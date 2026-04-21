'use client';

import * as React from 'react';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import { DateRange, DayPicker } from 'react-day-picker';
import { vi } from 'date-fns/locale';

import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import styles from './date-range-picker.module.css';

interface DatePickerWithRangeProps {
  className?: string;
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
  displayValue?: string;
}

export function DatePickerWithRange({
  className,
  date,
  setDate,
  displayValue,
}: DatePickerWithRangeProps) {
  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <button id="date" className={styles.triggerButton}>
            <CalendarIcon className={styles.calendarIcon} />
            <span className={styles.dateText}>
              {displayValue ? displayValue : (date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, 'dd/MM/yyyy')} - {format(date.to, 'dd/MM/yyyy')}
                  </>
                ) : (
                  format(date.from, 'dd/MM/yyyy')
                )
              ) : (
                <span>Chọn khoảng ngày</span>
              ))}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent className={styles.popoverContent} align="end">
          <div className={styles.calendarWrapper}>
            <DayPicker
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
              locale={vi}
              classNames={{
                months: styles.months,
                month: styles.month,
                month_caption: styles.month_caption,
                caption_label: styles.caption_label,
                nav: styles.nav,
                button_previous: styles.button_previous,
                button_next: styles.button_next,
                month_grid: styles.month_grid,
                weekdays: styles.weekdays,
                weekday: styles.weekday,
                week: styles.week,
                day: styles.day,
                day_button: styles.day_button,
                range_start: styles.range_start,
                range_end: styles.range_end,
                range_middle: styles.range_middle,
                today: styles.today,
                outside: styles.outside,
                disabled: styles.disabled,
                hidden: styles.hidden,
              }}
              components={{
                Chevron: ({ orientation }) => orientation === 'left' ? 
                  <ChevronLeftIcon className="h-4 w-4" /> : 
                  <ChevronRightIcon className="h-4 w-4" />,
              }}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
