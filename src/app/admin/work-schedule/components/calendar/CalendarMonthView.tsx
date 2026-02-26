'use client';

import * as Tooltip from '@radix-ui/react-tooltip';
import { addDays, format, isSameMonth, startOfMonth, startOfWeek } from 'date-fns';
import React from 'react';


import styles from './calendar-month-view.module.css';
import { CalendarQuickCreate } from './CalendarQuickCreate';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

export function CalendarMonthView({ monthCursor }: { monthCursor: Date }) {
  const [openDayKey, setOpenDayKey] = React.useState<string | null>(null);
  const monthStart = React.useMemo(() => {
    const d = startOfMonth(monthCursor);
    return d;
  }, [monthCursor]);

  const gridStart = React.useMemo(() => {
    return startOfWeek(monthStart, { weekStartsOn: 1 });
  }, [monthStart]);

  const days = React.useMemo(() => {
    return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
  }, [gridStart]);


  return (
    <Tooltip.Provider delayDuration={350}>
      <div className={styles.wrap}>
        <div className={styles.headerRow}>
        {WEEKDAYS.map((d) => (
          <div key={d} className={styles.headerCell}>
            {d}
          </div>
        ))}
      </div>

      <div className={styles.grid} role="grid" aria-label="Calendar month">
        {days.map((d) => {
          const inMonth = isSameMonth(d, monthStart);
          const label = inMonth ? format(d, 'd') : format(d, 'MMM d');
          const isToday = format(d, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

          return (
            <div
              key={d.toISOString()}
              className={`${styles.dayCell} ${inMonth ? '' : styles.outside} ${isToday ? styles.today : ''}`}
              role="gridcell"
              aria-label={format(d, 'yyyy-MM-dd')}
            >
              <div className={styles.dayHeader}>
                <div className={styles.dayNumber}>{label}</div>
                <CalendarQuickCreate
                  open={openDayKey === d.toISOString()}
                  onOpenChange={(open) => setOpenDayKey(open ? d.toISOString() : null)}
                >
                  <button type="button" className={styles.createBtn} aria-label="Create work item">
                    <svg fill="none" viewBox="0 0 16 16" role="presentation" width="16" height="16" aria-hidden="true">
                      <path
                        fill="currentColor"
                        fillRule="evenodd"
                        d="M7.25 8.75V15h1.5V8.75H15v-1.5H8.75V1h-1.5v6.25H1v1.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </CalendarQuickCreate>
              </div>
              <div className={styles.dayBody} />
            </div>
          );
        })}
      </div>
    </div>
    </Tooltip.Provider>
  );
}
