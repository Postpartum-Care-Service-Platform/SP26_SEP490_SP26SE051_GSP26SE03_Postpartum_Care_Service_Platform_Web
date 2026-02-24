'use client';

import React from 'react';
import { addDays, format, startOfWeek, isSameDay } from 'date-fns';
import { CalendarQuickCreate } from './CalendarQuickCreate';
import styles from './calendar-week-view.module.css';

export function CalendarWeekView({ monthCursor }: { monthCursor: Date }) {
  const [openDayKey, setOpenDayKey] = React.useState<string | null>(null);

  // Start from Monday of the week containing monthCursor
  const weekStart = React.useMemo(() => {
    return startOfWeek(monthCursor, { weekStartsOn: 1 });
  }, [monthCursor]);

  // Generate Mon-Fri (5 days) as per screenshot
  const days = React.useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => addDays(weekStart, i));
  }, [weekStart]);

  const today = new Date();

  return (
    <div className={styles.wrap}>
      <div className={styles.headerRow}>
        {days.map((d) => (
          <div key={d.toISOString()} className={styles.headerCell}>
            {format(d, 'eee d')}
          </div>
        ))}
      </div>

      <div className={styles.grid}>
        {days.map((d) => {
          const isToday = isSameDay(d, today);
          const dayKey = d.toISOString();
          
          return (
            <CalendarQuickCreate
              key={dayKey}
              open={openDayKey === dayKey}
              onOpenChange={(open) => setOpenDayKey(open ? dayKey : null)}
            >
              <div
                className={`${styles.dayColumn} ${isToday ? styles.today : ''}`}
                onClick={() => setOpenDayKey(dayKey)}
                role="button"
                tabIndex={0}
                aria-label={`Create task for ${format(d, 'PPPP')}`}
              >
                {/* Events will be rendered here later */}
              </div>
            </CalendarQuickCreate>
          );
        })}
      </div>
    </div>
  );
}
