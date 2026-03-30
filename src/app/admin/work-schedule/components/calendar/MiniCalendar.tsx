'use client';

import { addMonths, format, isSameDay, isSameMonth, startOfMonth, startOfWeek, endOfMonth, endOfWeek, eachDayOfInterval, subMonths, addDays, isWithinInterval } from 'date-fns';
import React from 'react';

import styles from './mini-calendar.module.css';

const WEEKDAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'] as const;

interface MiniCalendarProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  currentMonth?: Date;
  viewMode?: 'Month' | 'Week' | 'Day';
}

export function MiniCalendar({ 
  selectedDate = new Date(), 
  onDateSelect, 
  currentMonth: externalMonth,
  viewMode = 'Month'
}: MiniCalendarProps) {
  const [internalMonth, setInternalMonth] = React.useState(() => startOfMonth(selectedDate));
  const [selected, setSelected] = React.useState<Date>(selectedDate);
  const [hoveredDate, setHoveredDate] = React.useState<Date | null>(null);

  // Use external month if provided, otherwise use internal state
  const currentMonth = externalMonth || internalMonth;

  React.useEffect(() => {
    setSelected(selectedDate);
    if (externalMonth) {
      setInternalMonth(startOfMonth(externalMonth));
    } else {
      setInternalMonth(startOfMonth(selectedDate));
    }
  }, [selectedDate, externalMonth]);

  const weeks = React.useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    // Use Sunday as start of week to match day labels
    const calStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
    const allDays = eachDayOfInterval({ start: calStart, end: calEnd });
    
    const weekGroups = [];
    for (let i = 0; i < allDays.length; i += 7) {
      weekGroups.push(allDays.slice(i, i + 7));
    }
    return weekGroups;
  }, [currentMonth]);

  const handleDateClick = (date: Date) => {
    setSelected(date);
    onDateSelect?.(date);
  };

  const handlePrevMonth = () => {
    const newMonth = subMonths(currentMonth, 1);
    if (!externalMonth) {
      setInternalMonth(newMonth);
    }
  };

  const handleNextMonth = () => {
    const newMonth = addMonths(currentMonth, 1);
    if (!externalMonth) {
      setInternalMonth(newMonth);
    }
  };

  const monthLabel = React.useMemo(() => {
    const month = currentMonth.getMonth();
    const year = currentMonth.getFullYear();
    const monthNames = [
      'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 
      'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];
    return `${monthNames[month]} ${year}`;
  }, [currentMonth]);

  const isHighlighted = (day: Date) => {
    if (!hoveredDate) return false;

    if (viewMode === 'Week' || viewMode === 'Day') {
      const weekStart = startOfWeek(hoveredDate, { weekStartsOn: 0 });
      const weekEnd = endOfWeek(hoveredDate, { weekStartsOn: 0 });
      return isWithinInterval(day, { start: weekStart, end: weekEnd });
    }

    return isSameDay(day, hoveredDate);
  };

  const getDayRangeClasses = (day: Date) => {
    if (!hoveredDate || !isHighlighted(day)) return '';

    let isStart = false;
    let isEnd = false;

    if (viewMode === 'Week' || viewMode === 'Day') {
      const weekStart = startOfWeek(hoveredDate, { weekStartsOn: 0 });
      const weekEnd = endOfWeek(hoveredDate, { weekStartsOn: 0 });
      isStart = isSameDay(day, weekStart);
      isEnd = isSameDay(day, weekEnd);
    } else {
      isStart = true;
      isEnd = true;
    }

    return `${styles.hovered} ${isStart ? styles.rangeStart : ''} ${isEnd ? styles.rangeEnd : ''}`;
  };

  const getDaySelectedRangeClasses = (day: Date) => {
    let isStart = false;
    let isEnd = false;

    if (viewMode === 'Week' || viewMode === 'Day') {
      const weekStart = startOfWeek(selected, { weekStartsOn: 0 });
      const weekEnd = endOfWeek(selected, { weekStartsOn: 0 });
      if (!isWithinInterval(day, { start: weekStart, end: weekEnd })) return '';
      isStart = isSameDay(day, weekStart);
      isEnd = isSameDay(day, weekEnd);
    } else {
      if (!isSameDay(day, selected)) return '';
      isStart = true;
      isEnd = true;
    }

    return `${styles.selectedRange} ${isStart ? styles.rangeStart : ''} ${isEnd ? styles.rangeEnd : ''}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>
          {monthLabel}
        </span>
        <div className={styles.navButtons}>
          <button type="button" className={styles.navButton} onClick={handlePrevMonth} aria-label="Previous month">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M7.5 2C7.77614 2 8 2.22386 8 2.5L8 11.2929L11.1464 8.14645C11.3417 7.95118 11.6583 7.95118 11.8536 8.14645C12.0488 8.34171 12.0488 8.65829 11.8536 8.85355L7.85355 12.8536C7.75979 12.9473 7.63261 13 7.5 13C7.36739 13 7.24021 12.9473 7.14645 12.8536L3.14645 8.85355C2.95118 8.65829 2.95118 8.34171 3.14645 8.14645C3.34171 7.95118 3.65829 7.95118 3.85355 8.14645L7 11.2929L7 2.5C7 2.22386 7.22386 2 7.5 2Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
            </svg>
          </button>
          <button type="button" className={styles.navButton} onClick={handleNextMonth} aria-label="Next month">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M7.14645 2.14645C7.34171 1.95118 7.65829 1.95118 7.85355 2.14645L11.8536 6.14645C12.0488 6.34171 12.0488 6.65829 11.8536 6.85355C11.6583 7.04882 11.3417 7.04882 11.1464 6.85355L8 3.70711L8 12.5C8 12.7761 7.77614 13 7.5 13C7.22386 13 7 12.7761 7 12.5L7 3.70711L3.85355 6.85355C3.65829 7.04882 3.34171 7.04882 3.14645 6.85355C2.95118 6.65829 2.95118 6.34171 3.14645 6.14645L7.14645 2.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
            </svg>
          </button>
        </div>
      </div>

      <div className={styles.weekdays}>
        {WEEKDAYS.map((day) => (
          <div key={day} className={styles.weekday}>{day}</div>
        ))}
      </div>

      <div className={styles.daysGrid}>
        {weeks.map((week, weekIdx) => (
          <div key={weekIdx} className={styles.weekRow}>
            {week.map((day) => {
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isToday = isSameDay(day, new Date());
              const isSelected = isSameDay(day, selected);

              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  className={`${styles.dayCell} ${!isCurrentMonth ? styles.outside : ''} ${isToday ? styles.today : ''} ${getDaySelectedRangeClasses(day)} ${getDayRangeClasses(day)}`}
                  onClick={() => handleDateClick(day)}
                  onMouseEnter={() => setHoveredDate(day)}
                  onMouseLeave={() => setHoveredDate(null)}
                >
                  <span className={`${styles.dayNumber} ${isSelected ? styles.selected : ''}`}>
                    {format(day, 'd')}
                  </span>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
