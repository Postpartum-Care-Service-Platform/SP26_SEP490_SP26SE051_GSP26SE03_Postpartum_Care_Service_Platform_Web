'use client';

import * as Popover from '@radix-ui/react-popover';
import * as Tooltip from '@radix-ui/react-tooltip';
import React from 'react';

import styles from './month-year-picker.module.css';

type Props = {
  value: Date;
  onChange: (date: Date) => void;
};

const MONTHS = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4',
  'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8',
  'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
];

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

export function MonthYearPicker({ value, onChange }: Props) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [view, setView] = React.useState<'month' | 'year'>('month');
  const [yearRange, setYearRange] = React.useState(() => {
    const currentYear = value.getFullYear();
    const start = Math.floor(currentYear / 12) * 12;
    return { start, end: start + 11 };
  });

  const currentMonth = value.getMonth();
  const currentYear = value.getFullYear();

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(value);
    newDate.setMonth(monthIndex);
    onChange(newDate);
    setIsOpen(false);
    setView('month');
  };

  const handleYearSelect = (year: number) => {
    const newDate = new Date(value);
    newDate.setFullYear(year);
    onChange(newDate);
    setView('month');
  };

  const handlePrevYearRange = () => {
    setYearRange(prev => ({ start: prev.start - 12, end: prev.end - 12 }));
  };

  const handleNextYearRange = () => {
    setYearRange(prev => ({ start: prev.start + 12, end: prev.end + 12 }));
  };

  const displayText = `Tháng ${currentMonth + 1} ${currentYear}`;

  const years = React.useMemo(() => {
    const arr: number[] = [];
    for (let i = yearRange.start; i <= yearRange.end; i++) {
      arr.push(i);
    }
    return arr;
  }, [yearRange]);

  return (
    <Tooltip.Provider delayDuration={350}>
    <Popover.Root open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) {
        setView('month');
        const start = Math.floor(currentYear / 12) * 12;
        setYearRange({ start, end: start + 11 });
      }
    }}>
      <Popover.Trigger asChild>
        <button type="button" className={styles.trigger}>
          {displayText}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className={styles.content} sideOffset={4} align="center">
          {view === 'month' ? (
            <div className={styles.monthView}>
              <div className={styles.monthHeader}>
                <span className={styles.yearText} onClick={() => setView('year')}>
                  {currentYear}
                </span>
                <div className={styles.arrows}>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <button 
                        type="button" 
                        className={styles.arrowBtn} 
                        onClick={() => {
                          const newDate = new Date(value);
                          newDate.setFullYear(currentYear - 1);
                          onChange(newDate);
                        }}
                      >
                        <ChevronUpIcon />
                      </button>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content className={styles.tooltip} sideOffset={5}>
                        Năm trước
                        <Tooltip.Arrow className={styles.tooltipArrow} />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <button 
                        type="button" 
                        className={styles.arrowBtn} 
                        onClick={() => {
                          const newDate = new Date(value);
                          newDate.setFullYear(currentYear + 1);
                          onChange(newDate);
                        }}
                      >
                        <ChevronDownIcon />
                      </button>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content className={styles.tooltip} sideOffset={5}>
                        Năm sau
                        <Tooltip.Arrow className={styles.tooltipArrow} />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                </div>
              </div>
              <div className={styles.monthGrid}>
                {MONTHS.map((month, index) => (
                  <button
                    key={month}
                    type="button"
                    className={`${styles.monthCell} ${index === currentMonth ? styles.selected : ''}`}
                    onClick={() => handleMonthSelect(index)}
                  >
                    {month}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className={styles.yearView}>
              <div className={styles.yearHeader}>
                <span className={styles.rangeText}>{yearRange.start} - {yearRange.end}</span>
                <div className={styles.arrows}>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <button type="button" className={styles.arrowBtn} onClick={handlePrevYearRange}>
                        <ChevronUpIcon />
                      </button>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content className={styles.tooltip} sideOffset={5}>
                        12 năm trước
                        <Tooltip.Arrow className={styles.tooltipArrow} />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <button type="button" className={styles.arrowBtn} onClick={handleNextYearRange}>
                        <ChevronDownIcon />
                      </button>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content className={styles.tooltip} sideOffset={5}>
                        12 năm sau
                        <Tooltip.Arrow className={styles.tooltipArrow} />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                </div>
              </div>
              <div className={styles.yearGrid}>
                {years.map((year) => (
                  <button
                    key={year}
                    type="button"
                    className={`${styles.yearCell} ${year === currentYear ? styles.selected : ''}`}
                    onClick={() => handleYearSelect(year)}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
          )}
          <Popover.Arrow className={styles.arrow} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
    </Tooltip.Provider>
  );
}
