'use client';

import { vi } from 'date-fns/locale';
import * as React from 'react';
import { DayPicker, type DayPickerProps } from 'react-day-picker';

import { cn } from '@/lib/utils';
import styles from './calendar.module.css';

export type CalendarProps = DayPickerProps;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(styles.calendar, className)}
      classNames={{
        months: styles.months,
        month: styles.month,
        month_caption: styles.caption,
        caption_label: styles.caption_label,
        nav: styles.nav,
        button_previous: cn(styles.nav_button, styles.nav_button_previous),
        button_next: cn(styles.nav_button, styles.nav_button_next),
        month_grid: styles.table,
        weekdays: styles.head_row,
        weekday: styles.head_cell,
        week: styles.row,
        day: styles.cell,
        day_button: styles.day,
        selected: styles.day_selected,
        today: styles.day_today,
        outside: styles.day_outside,
        disabled: styles.day_disabled,
        range_middle: styles.day_range_middle,
        hidden: styles.day_hidden,
        ...classNames,
      }}
      components={{
        Chevron: ({ ...props }) => {
          if (props.orientation === 'left') {
            return (
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn(styles.chevron, props.className)}>
                <path d="M8.81809 4.18179C8.99383 4.35753 8.99383 4.64245 8.81809 4.81819L6.13629 7.49999L8.81809 10.1818C8.99383 10.3575 8.99383 10.6424 8.81809 10.8182C8.64236 10.9939 8.35743 10.9939 8.1817 10.8182L5.1817 7.81819C5.09731 7.73379 5.0499 7.61933 5.0499 7.49999C5.0499 7.38064 5.09731 7.26618 5.1817 7.18179L8.1817 4.18179C8.35743 4.00605 8.64236 4.00605 8.81809 4.18179Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
              </svg>
            );
          }
          return (
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn(styles.chevron, props.className)}>
              <path d="M6.18194 4.18185C6.35767 4.00611 6.6426 4.00611 6.81833 4.18185L9.81833 7.18185C9.90272 7.26624 9.95013 7.3807 9.95013 7.50005C9.95013 7.6194 9.90272 7.73386 9.81833 7.81825L6.81833 10.8182C6.6426 10.994 6.35767 10.994 6.18194 10.8182C6.0062 10.6425 6.0062 10.3576 6.18194 10.1819L8.86374 7.50005L6.18194 4.81825C6.0062 4.64251 6.0062 4.35759 6.18194 4.18185Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
            </svg>
          );
        },
      }}
      locale={vi}
      labels={{
        labelPrevious: () => 'Tháng trước',
        labelNext: () => 'Tháng sau',
      }}
      {...props}
    />
  );
}

Calendar.displayName = 'Calendar';

export { Calendar };
