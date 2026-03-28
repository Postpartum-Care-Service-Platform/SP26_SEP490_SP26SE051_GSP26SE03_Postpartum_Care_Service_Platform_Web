'use client';

import * as Popover from '@radix-ui/react-popover';
import * as Tooltip from '@radix-ui/react-tooltip';
import React from 'react';

import styles from './month-year-picker.module.css';

type Props = {
  value: Date;
  onChange: (date: Date) => void;
  viewMode?: 'Month' | 'Week' | 'Day';
};

const MONTHS = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4',
  'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8',
  'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
];

const WEEKDAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

import { 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameDay, 
  isSameMonth,
  addDays,
  isWithinInterval
} from 'date-fns';

function ChevronUpIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M7.5 2C7.77614 2 8 2.22386 8 2.5L8 11.2929L11.1464 8.14645C11.3417 7.95118 11.6583 7.95118 11.8536 8.14645C12.0488 8.34171 12.0488 8.65829 11.8536 8.85355L7.85355 12.8536C7.75979 12.9473 7.63261 13 7.5 13C7.36739 13 7.24021 12.9473 7.14645 12.8536L3.14645 8.85355C2.95118 8.65829 2.95118 8.34171 3.14645 8.14645C3.34171 7.95118 3.65829 7.95118 3.85355 8.14645L7 11.2929L7 2.5C7 2.22386 7.22386 2 7.5 2Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M7.14645 2.14645C7.34171 1.95118 7.65829 1.95118 7.85355 2.14645L11.8536 6.14645C12.0488 6.34171 12.0488 6.65829 11.8536 6.85355C11.6583 7.04882 11.3417 7.04882 11.1464 6.85355L8 3.70711L8 12.5C8 12.7761 7.77614 13 7.5 13C7.22386 13 7 12.7761 7 12.5L7 3.70711L3.85355 6.85355C3.65829 7.04882 3.34171 7.04882 3.14645 6.85355C2.95118 6.65829 2.95118 6.34171 3.14645 6.14645L7.14645 2.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
    </svg>
  );
}

export function MonthYearPicker({ value, onChange, viewMode = 'Month' }: Props) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [rightView, setRightView] = React.useState<'month' | 'year'>('month');
  const [hoveredDate, setHoveredDate] = React.useState<Date | null>(null);
  
  // We use a internal cursor for what's being SHOWN in the picker, 
  // while `value` is what's actually selected.
  const [cursor, setCursor] = React.useState(() => startOfMonth(value));
  
  const [yearRange, setYearRange] = React.useState(() => {
    const currentYear = value.getFullYear();
    const start = Math.floor(currentYear / 12) * 12;
    return { start, end: start + 11 };
  });

  const currentMonth = cursor.getMonth();
  const currentYear = cursor.getFullYear();

  const handleDateSelect = (date: Date) => {
    onChange(date);
    setIsOpen(false);
  };

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(cursor);
    newDate.setMonth(monthIndex);
    setCursor(newDate);
    // If we want it to close on month select, we could. But usually we want to see the days update.
  };

  const handleYearSelect = (year: number) => {
    const newDate = new Date(cursor);
    newDate.setFullYear(year);
    setCursor(newDate);
    setRightView('month');
  };

  const handlePrevYearRange = () => {
    setYearRange(prev => ({ start: prev.start - 12, end: prev.end - 12 }));
  };

  const handleNextYearRange = () => {
    setYearRange(prev => ({ start: prev.start + 12, end: prev.end + 12 }));
  };

  const monthNamesVi = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
  const leftHeaderText = `${monthNamesVi[currentMonth]} ${currentYear}`;

  const weeks = React.useMemo(() => {
    const monthStart = startOfMonth(cursor);
    const monthEnd = endOfMonth(monthStart);
    const calStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
    const days = eachDayOfInterval({ start: calStart, end: calEnd });
    
    const weekGroups = [];
    for (let i = 0; i < days.length; i += 7) {
      weekGroups.push(days.slice(i, i + 7));
    }
    return weekGroups;
  }, [cursor]);

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
      const weekStart = startOfWeek(value, { weekStartsOn: 0 });
      const weekEnd = endOfWeek(value, { weekStartsOn: 0 });
      if (!isWithinInterval(day, { start: weekStart, end: weekEnd })) return '';
      isStart = isSameDay(day, weekStart);
      isEnd = isSameDay(day, weekEnd);
    } else {
      if (!isSameDay(day, value)) return '';
      isStart = true;
      isEnd = true;
    }

    return `${styles.selectedRange} ${isStart ? styles.rangeStart : ''} ${isEnd ? styles.rangeEnd : ''}`;
  };

  const years = React.useMemo(() => {
    const arr: number[] = [];
    for (let i = yearRange.start; i <= yearRange.end; i++) {
      arr.push(i);
    }
    return arr;
  }, [yearRange]);

  const handleTodayClick = () => {
    const today = new Date();
    onChange(today);
    setCursor(startOfMonth(today));
    setIsOpen(false);
  };

  return (
    <Tooltip.Provider delayDuration={350}>
    <Popover.Root open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (open) {
        setCursor(startOfMonth(value));
        const start = Math.floor(value.getFullYear() / 12) * 12;
        setYearRange({ start, end: start + 11 });
      } else {
        setRightView('month');
      }
    }}>
      <Popover.Trigger asChild>
        <button type="button" className={styles.trigger}>
          Tháng {value.getMonth() + 1} {value.getFullYear()}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className={styles.content} sideOffset={4} align="center">
          <div className={styles.dualPane}>
            {/* Left Pane: Days */}
            <div className={styles.leftPane}>
              <div className={styles.paneHeader}>
                <span className={styles.headerTitle}>{leftHeaderText}</span>
                <div className={styles.arrows}>
                  <button type="button" className={styles.arrowBtn} onClick={() => setCursor(subMonths(cursor, 1))}>
                    <ChevronUpIcon />
                  </button>
                  <button type="button" className={styles.arrowBtn} onClick={() => setCursor(addMonths(cursor, 1))}>
                    <ChevronDownIcon />
                  </button>
                </div>
              </div>
              <div className={styles.daysGrid}>
                {WEEKDAYS.map(d => <div key={d} className={styles.weekday}>{d}</div>)}
                {weeks.map((week, widx) => (
                  <React.Fragment key={widx}>
                    {week.map(day => {
                      const isCurrent = isSameMonth(day, cursor);
                      const isSelected = isSameDay(day, value);
                      return (
                        <button
                          key={day.toISOString()}
                          type="button"
                          className={`${styles.dayCell} ${!isCurrent ? styles.outside : ''} ${getDaySelectedRangeClasses(day)} ${getDayRangeClasses(day)}`}
                          onClick={() => handleDateSelect(day)}
                          onMouseEnter={() => setHoveredDate(day)}
                          onMouseLeave={() => setHoveredDate(null)}
                        >
                          <span className={`${styles.dayNumber} ${isSelected ? styles.selected : ''}`}>
                            {day.getDate()}
                          </span>
                        </button>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className={styles.divider} />

            {/* Right Pane: Month/Year */}
            <div className={styles.rightPane}>
              {rightView === 'month' ? (
                <>
                  <div className={styles.paneHeader}>
                    <span className={styles.headerTitle} style={{ cursor: 'pointer' }} onClick={() => setRightView('year')}>
                      {currentYear}
                    </span>
                    <div className={styles.arrows}>
                      <button type="button" className={styles.arrowBtn} onClick={() => setCursor(new Date(currentYear - 1, currentMonth, 1))}>
                        <ChevronUpIcon />
                      </button>
                      <button type="button" className={styles.arrowBtn} onClick={() => setCursor(new Date(currentYear + 1, currentMonth, 1))}>
                        <ChevronDownIcon />
                      </button>
                    </div>
                  </div>
                  <div className={styles.monthGrid}>
                    {MONTHS.map((m, i) => (
                      <button
                        key={m}
                        type="button"
                        className={`${styles.monthCell} ${i === currentMonth ? styles.selected : ''}`}
                        onClick={() => handleMonthSelect(i)}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.paneHeader}>
                    <span className={styles.headerTitle}>{yearRange.start} - {yearRange.end}</span>
                    <div className={styles.arrows}>
                      <button type="button" className={styles.arrowBtn} onClick={handlePrevYearRange}>
                        <ChevronUpIcon />
                      </button>
                      <button type="button" className={styles.arrowBtn} onClick={handleNextYearRange}>
                        <ChevronDownIcon />
                      </button>
                    </div>
                  </div>
                  <div className={styles.yearGrid}>
                    {years.map(y => (
                      <button
                        key={y}
                        type="button"
                        className={`${styles.yearCell} ${y === currentYear ? styles.selected : ''}`}
                        onClick={() => handleYearSelect(y)}
                      >
                        {y}
                      </button>
                    ))}
                  </div>
                </>
              )}
              <div className={styles.paneFooter}>
                <button type="button" className={styles.todayBtn} onClick={handleTodayClick}>
                  Hôm nay
                </button>
              </div>
            </div>
          </div>
          <Popover.Arrow className={styles.arrow} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
    </Tooltip.Provider>
  );
}
