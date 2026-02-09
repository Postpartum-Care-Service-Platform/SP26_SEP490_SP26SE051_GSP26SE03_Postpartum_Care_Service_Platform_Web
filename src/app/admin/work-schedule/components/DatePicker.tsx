'use client';

import React from 'react';

import styles from './date-picker.module.css';

type Props = {
  value?: Date | null;
  onChange: (value: Date | null) => void;
};

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function pad2(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

function formatMMDDYYYY(d: Date) {
  const mm = d.getMonth() + 1;
  const dd = d.getDate();
  const yyyy = d.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

function parseMMDDYYYY(value: string): Date | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const match = /^\s*(\d{1,2})\/(\d{1,2})\/(\d{4})\s*$/.exec(trimmed);
  if (!match) return null;

  const mm = Number(match[1]);
  const dd = Number(match[2]);
  const yyyy = Number(match[3]);

  if (mm < 1 || mm > 12) return null;
  if (dd < 1 || dd > 31) return null;

  const d = new Date(yyyy, mm - 1, dd);
  if (d.getFullYear() !== yyyy || d.getMonth() !== mm - 1 || d.getDate() !== dd) return null;
  return d;
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function daysInMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}

function monthLabel(d: Date) {
  const month = d.toLocaleString(undefined, { month: 'long' });
  return `${month} ${d.getFullYear()}`;
}

export function DatePicker({ value = null, onChange }: Props) {
  const today = React.useMemo(() => new Date(), []);
  const [viewDate, setViewDate] = React.useState<Date>(() => (value ? startOfMonth(value) : startOfMonth(today)));
  const [inputValue, setInputValue] = React.useState<string>(() => (value ? formatMMDDYYYY(value) : ''));

  React.useEffect(() => {
    if (!value) {
      setInputValue('');
      return;
    }

    setInputValue(formatMMDDYYYY(value));
    setViewDate(startOfMonth(value));
  }, [value]);

  const grid = React.useMemo(() => {
    const first = startOfMonth(viewDate);
    const firstDow = first.getDay();
    const dim = daysInMonth(viewDate);

    const cells: Array<{ date: Date | null; key: string }> = [];

    for (let i = 0; i < firstDow; i++) {
      cells.push({ date: null, key: `e-${i}` });
    }

    for (let day = 1; day <= dim; day++) {
      const d = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
      cells.push({ date: d, key: `d-${day}` });
    }

    const remainder = cells.length % 7;
    if (remainder !== 0) {
      const extra = 7 - remainder;
      for (let i = 0; i < extra; i++) {
        cells.push({ date: null, key: `t-${i}` });
      }
    }

    return cells;
  }, [viewDate]);

  function changeMonth(delta: number) {
    setViewDate((prev) => startOfMonth(new Date(prev.getFullYear(), prev.getMonth() + delta, 1)));
  }

  function changeYear(delta: number) {
    setViewDate((prev) => startOfMonth(new Date(prev.getFullYear() + delta, prev.getMonth(), 1)));
  }

  function handleInputChange(v: string) {
    setInputValue(v);
    const parsed = parseMMDDYYYY(v);
    if (parsed) {
      onChange(parsed);
    }
  }

  return (
    <div 
      className={styles.datePickerPopup} 
      role="dialog" 
      aria-label="Due date picker"
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <div className={styles.title}>Due date</div>

      <div className={styles.inputWrapper}>
        <input
          className={styles.dateInput}
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="M/D/YYYY"
        />
        {!!value && (
          <div className={styles.clearIcon} onClick={() => onChange(null)} role="button" aria-label="Clear date" tabIndex={0}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path
                d="M8 1.33334C4.32 1.33334 1.33333 4.32 1.33333 8C1.33333 11.68 4.32 14.6667 8 14.6667C11.68 14.6667 14.6667 11.68 14.6667 8C14.6667 4.32 11.68 1.33334 8 1.33334ZM10.6667 10.6667L5.33333 5.33334M10.6667 5.33334L5.33333 10.6667"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        )}
      </div>

      <div className={styles.calendarHeader}>
        <div className={styles.navButtons}>
          <button type="button" className={styles.navBtn} onClick={() => changeYear(-1)} aria-label="Previous year">
            <span aria-hidden="true">«</span>
          </button>
          <button type="button" className={styles.navBtn} onClick={() => changeMonth(-1)} aria-label="Previous month">
            <span aria-hidden="true">‹</span>
          </button>
        </div>

        <div className={styles.monthYear}>{monthLabel(viewDate)}</div>

        <div className={styles.navButtons}>
          <button type="button" className={styles.navBtn} onClick={() => changeMonth(1)} aria-label="Next month">
            <span aria-hidden="true">›</span>
          </button>
          <button type="button" className={styles.navBtn} onClick={() => changeYear(1)} aria-label="Next year">
            <span aria-hidden="true">»</span>
          </button>
        </div>
      </div>

      <div className={styles.calendarGrid}>
        {DAY_LABELS.map((d) => (
          <div key={d} className={styles.dayLabel}>
            {d}
          </div>
        ))}

        {grid.map((cell) => {
          if (!cell.date) {
            return <div key={cell.key} className={`${styles.dayCell} ${styles.empty}`} />;
          }

          const selected = value ? isSameDay(cell.date, value) : false;
          const isToday = isSameDay(cell.date, today);

          return (
            <div
              key={cell.key}
              className={`${styles.dayCell} ${selected ? styles.selected : ''} ${isToday ? styles.today : ''}`}
              onClick={() => onChange(cell.date!)}
              role="button"
              tabIndex={0}
            >
              {cell.date.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
}
