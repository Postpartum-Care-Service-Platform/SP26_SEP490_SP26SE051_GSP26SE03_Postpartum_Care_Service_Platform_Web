'use client';

import { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday, isPast, addMonths, subMonths, isWithinInterval } from 'date-fns';
import { vi } from 'date-fns/locale';
import styles from './admin-calendar.module.css';

type DateRange = {
  from: Date | null;
  to: Date | null;
};

type CalendarEvent = {
  date: Date;
  count?: number;
};

type AdminCalendarProps = {
  events?: CalendarEvent[];
  onDateSelect?: (date: Date) => void;
  onRangeSelect?: (range: DateRange) => void;
};

export function AdminCalendar({ events = [], onDateSelect, onRangeSelect }: AdminCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedRange, setSelectedRange] = useState<DateRange>({ from: null, to: null });

  const weekDays = ['CN', 'Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7'];

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentMonth]);

  const monthLabel = format(currentMonth, 'MMMM yyyy', { locale: vi });

  const getEventCount = (date: Date): number => {
    return events.filter((event) => isSameDay(event.date, date)).length;
  };

  const hasEvent = (date: Date): boolean => {
    return getEventCount(date) > 0;
  };

  const isDateDisabled = (date: Date): boolean => {
    return isPast(date) && !isToday(date);
  };

  const isDateInRange = (date: Date): boolean => {
    if (!selectedRange.from || !selectedRange.to) return false;
    return isWithinInterval(date, { start: selectedRange.from, end: selectedRange.to });
  };

  const isDateSelected = (date: Date): boolean => {
    if (selectedRange.from && isSameDay(date, selectedRange.from)) return true;
    if (selectedRange.to && isSameDay(date, selectedRange.to)) return true;
    return false;
  };

  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return;

    if (!selectedRange.from || (selectedRange.from && selectedRange.to)) {
      setSelectedRange({ from: date, to: null });
      onDateSelect?.(date);
    } else if (selectedRange.from && !selectedRange.to) {
      if (date < selectedRange.from) {
        const newRange = { from: date, to: selectedRange.from };
        setSelectedRange(newRange);
        onRangeSelect?.(newRange);
      } else {
        const newRange = { from: selectedRange.from, to: date };
        setSelectedRange(newRange);
        onRangeSelect?.(newRange);
      }
    }
  };

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleToday = () => {
    setCurrentMonth(new Date());
  };

  return (
    <div className={styles.calendarBody}>
      <div className={styles.caption}>
        <button className={styles.navButton} onClick={handlePrevMonth} aria-label="Previous month">
          «
        </button>
        <span className={styles.captionLabel}>{monthLabel}</span>
        <button className={styles.navButton} onClick={handleNextMonth} aria-label="Next month">
          »
        </button>
      </div>

      <table className={styles.calendarGrid}>
        <thead>
          <tr className={styles.weekDaysRow}>
            {weekDays.map((day, index) => (
              <th key={index} className={styles.weekDay}>
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: Math.ceil(calendarDays.length / 7) }).map((_, weekIndex) => (
            <tr key={weekIndex} className={styles.weekRow}>
              {calendarDays.slice(weekIndex * 7, (weekIndex + 1) * 7).map((date, dayIndex) => {
                const dayNumber = format(date, 'd');
                const isCurrentMonthDay = isSameMonth(date, currentMonth);
                const isTodayDate = isToday(date);
                const isSelected = isDateSelected(date);
                const isInRange = isDateInRange(date);
                const isDisabled = isDateDisabled(date);
                const eventCount = getEventCount(date);
                const hasEventMarker = hasEvent(date);

                return (
                  <td key={dayIndex} className={styles.dayCell}>
                    <button
                      className={`
                        ${styles.dayButton}
                        ${!isCurrentMonthDay ? styles.dayOutside : ''}
                        ${isTodayDate ? styles.dayToday : ''}
                        ${isSelected ? styles.daySelected : ''}
                        ${isInRange ? styles.dayInRange : ''}
                        ${isDisabled ? styles.dayDisabled : ''}
                      `}
                      onClick={() => handleDateClick(date)}
                      disabled={isDisabled}
                      aria-label={format(date, 'EEEE, MMMM d, yyyy', { locale: vi })}
                    >
                      <span className={styles.dayNumber}>{dayNumber}</span>
                      {hasEventMarker && (
                        <span className={styles.eventMarker} aria-label={`${eventCount} events`}>
                          {eventCount > 1 && <span className={styles.eventCount}>{eventCount}</span>}
                        </span>
                      )}
                      {isSelected && <span className={styles.selectedTriangle} />}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
