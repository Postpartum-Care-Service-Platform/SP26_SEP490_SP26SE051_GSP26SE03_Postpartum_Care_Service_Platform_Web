'use client';

import React from 'react';

import styles from './date-picker.module.css';

type Props = {
  value?: Date | null;
  onChange: (value: Date | null) => void;
  /** Hiển thị thêm cột chọn giờ bên phải (MM:HH) */
  withTime?: boolean;
  /** Giá trị giờ hiện tại theo định dạng HH:mm (ví dụ '05:00') */
  timeValue?: string;
  /** Callback khi chọn giờ mới */
  onTimeChange?: (time: string) => void;
};

const DAY_LABELS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

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
  // Sử dụng locale tiếng Việt để hiển thị tháng
  const month = d.toLocaleString('vi-VN', { month: 'long' });
  const capitalized = month.charAt(0).toUpperCase() + month.slice(1);
  return `${capitalized} ${d.getFullYear()}`;
}

export function DatePicker({ value = null, onChange, withTime = false, timeValue, onTimeChange }: Props) {
  const today = React.useMemo(() => new Date(), []);
  const [viewDate, setViewDate] = React.useState<Date>(() => (value ? startOfMonth(value) : startOfMonth(today)));
  const [inputValue, setInputValue] = React.useState<string>(() => (value ? formatMMDDYYYY(value) : ''));

  const timeOptions = React.useMemo(() => {
    const options: string[] = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const h = String(hour).padStart(2, '0');
        const m = String(minute).padStart(2, '0');
        options.push(`${h}:${m}`);
      }
    }
    return options;
  }, []);

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
      className={`${styles.datePickerPopup} ${withTime ? styles.withTime : ''}`} 
      role="dialog" 
      aria-label="Chọn ngày"
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <div className={styles.title}>Ngày đến hạn</div>

      <div className={styles.inputWrapper}>
        <input
          className={styles.dateInput}
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="N/N/NNNN"
        />
        {!!value && (
          <div className={styles.clearIcon} onClick={() => onChange(null)} role="button" aria-label="Xóa ngày" tabIndex={0}>
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

      <div className={withTime ? styles.dateTimeLayout : undefined}>
        <div className={withTime ? styles.calendarSection : undefined}>
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

        {withTime && (
          <div className={styles.timeColumn} aria-label="Chọn giờ">
            <div className={styles.timeHeader}>Giờ</div>
            <div className={styles.timeList}>
              {timeOptions.map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`${styles.timeOption} ${timeValue === t ? styles.timeOptionSelected : ''}`}
                  onClick={() => onTimeChange?.(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
