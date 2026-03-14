'use client';

import * as Tooltip from '@radix-ui/react-tooltip';
import { addDays, format, isSameDay, isSameMonth, startOfMonth, startOfWeek } from 'date-fns';
import React from 'react';

import type { StaffSchedule } from '@/types/staff-schedule';

import styles from './calendar-month-view.module.css';
import { CalendarQuickCreate } from './CalendarQuickCreate';
import { MiniCalendar } from './MiniCalendar';
import { ScheduleDetailPopover } from '../shared/ScheduleDetailPopover';

const WEEKDAYS = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'] as const;

const MONTHS_VI = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
  'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
] as const;

// Color mapping for target
const TARGET_COLORS = {
  Mom: '#FFB6C1',
  Baby: '#87CEEB',
  Both: '#DDA0DD',
} as const;

function formatDateVietnamese(date: Date, inMonth: boolean): string {
  if (inMonth) {
    return date.getDate().toString();
  }
  const month = date.getMonth();
  return `${MONTHS_VI[month]} ${date.getDate()}`;
}

function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  return `${hours}:${minutes}`;
}

function formatDateVN(dateStr: string): string {
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

function getUpcomingEventsForDate(date: Date, events: StaffSchedule[], maxEvents: number = 2): { 
  displayEvents: StaffSchedule[]; 
  remainingCount: number;
} {
  const dateStr = format(date, 'yyyy-MM-dd');
  
  const dayEvents = events.filter(event => 
    event.familyScheduleResponse.workDate === dateStr
  );
  
  const sortedEvents = [...dayEvents].sort((a, b) => 
    a.familyScheduleResponse.startTime.localeCompare(b.familyScheduleResponse.startTime)
  );
  
  const displayEvents = sortedEvents.slice(0, maxEvents);
  const remainingCount = sortedEvents.length - maxEvents;
  
  return { displayEvents, remainingCount: Math.max(0, remainingCount) };
}

export function CalendarMonthView({ monthCursor, selectedDate, onSelectedDateChange, schedules }: { 
  monthCursor: Date; 
  selectedDate?: Date;
  onSelectedDateChange?: (date: Date) => void;
  schedules: StaffSchedule[];
}) {
  const [internalSelectedDate, setInternalSelectedDate] = React.useState<Date>(new Date());
  const [openDayKey, setOpenDayKey] = React.useState<string | null>(null);
  const [selectedSchedule, setSelectedSchedule] = React.useState<StaffSchedule | null>(null);
  const [anchorRect, setAnchorRect] = React.useState<DOMRect | null>(null);
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  
  const currentSelectedDate = selectedDate || internalSelectedDate;
  
  const handleDateSelect = (date: Date) => {
    if (onSelectedDateChange) {
      onSelectedDateChange(date);
    } else {
      setInternalSelectedDate(date);
    }
  };

  const handleEventClick = (schedule: StaffSchedule, event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setAnchorRect(rect);
    setSelectedSchedule(schedule);
    setIsPopoverOpen(true);
  };

  const monthStart = React.useMemo(() => {
    return startOfMonth(monthCursor);
  }, [monthCursor]);

  const gridStart = React.useMemo(() => {
    return startOfWeek(monthStart, { weekStartsOn: 1 });
  }, [monthStart]);

  const days = React.useMemo(() => {
    return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
  }, [gridStart]);

  React.useEffect(() => {
    if (selectedDate) {
      setInternalSelectedDate(selectedDate);
    }
  }, [selectedDate]);

  return (
    <Tooltip.Provider delayDuration={350}>
      <div style={{ display: 'flex', gap: '16px', height: 'calc(100vh - 180px)' }}>
        <div style={{ flexShrink: 0 }}>
          <MiniCalendar 
            selectedDate={currentSelectedDate} 
            onDateSelect={handleDateSelect}
            currentMonth={monthCursor}
          />
        </div>

        <div className={styles.wrap} style={{ flex: 1 }}>
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
              const label = inMonth ? format(d, 'd') : formatDateVietnamese(d, inMonth);
              const isToday = format(d, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
              const isSelected = isSameDay(d, currentSelectedDate);
              const { displayEvents: dayEvents, remainingCount } = getUpcomingEventsForDate(d, schedules, 2);

              return (
                <div
                  key={d.toISOString()}
                  className={`${styles.dayCell} ${inMonth ? '' : styles.outside} ${isToday ? styles.today : ''} ${isSelected ? styles.selected : ''}`}
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
                  <div className={styles.dayBody}>
                    {dayEvents.map((schedule) => {
                      const { familyScheduleResponse: fs } = schedule;
                      const eventColor = TARGET_COLORS[fs.target] || TARGET_COLORS.Baby;
                      
                      return (
                            <div 
                          key={schedule.id}
                              className={styles.eventChip}
                              style={{ backgroundColor: eventColor, height: '24px' }}
                          onClick={(e) => handleEventClick(schedule, e)}
                          role="button"
                          tabIndex={0}
                            >
                              <span className={styles.eventTime}>
                                {formatTime(fs.startTime)}
                              </span>
                              <span className={styles.eventTitle}>
                                {fs.activity}
                              </span>
                            </div>
                      );
                    })}
                    {remainingCount > 0 && (
                      <div className={styles.moreIndicator} style={{ height: '24px' }}>
                        +{remainingCount}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <ScheduleDetailPopover
          open={isPopoverOpen}
          onOpenChange={setIsPopoverOpen}
          schedule={selectedSchedule}
          anchorRect={anchorRect || undefined}
        />
      </div>
    </Tooltip.Provider>
  );
}
