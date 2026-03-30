'use client';

import * as Tooltip from '@radix-ui/react-tooltip';
import { addDays, format, isSameDay, isSameMonth, startOfMonth, startOfWeek } from 'date-fns';
import React from 'react';

import type { StaffSchedule } from '@/types/staff-schedule';

import styles from './calendar-month-view.module.css';
import { CalendarQuickCreate } from './CalendarQuickCreate';
import { MiniCalendar } from './MiniCalendar';
import { ScheduleDetailPopover } from '../shared/ScheduleDetailPopover';
import { DaySchedulesPopover } from '../shared/DaySchedulesPopover';
import { CalendarSidebarExtra } from './CalendarSidebarExtra';


const WEEKDAYS = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'] as const;

const MONTHS_VI = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
  'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
] as const;

const STATUS_COLORS: Record<string, string> = {
  Scheduled: '#DDEBFF',
  Done: '#CDEFE1',
  Missed: '#FBE2E4',
  Cancelled: '#FBE2E4',
};

function getStatusColor(status: string): string {
  return STATUS_COLORS[status] || '#E9EDF5';
}

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

function formatEventTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const hour = hours % 12 || 12;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  return `${hour}:${minutes.toString().padStart(2, '0')} ${ampm}`;
}

function formatDateVN(dateStr: string): string {
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

function getUpcomingEventsForDate(date: Date, events: StaffSchedule[], maxEvents: number = 3): { 
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

export function CalendarMonthView({ 
  monthCursor, 
  selectedDate, 
  onSelectedDateChange, 
  schedules,
  selectedStaffId,
  onStaffSelect,
}: { 
  monthCursor: Date; 
  selectedDate?: Date;
  onSelectedDateChange?: (date: Date) => void;
  schedules: StaffSchedule[];
  selectedStaffId: string | null;
  onStaffSelect: (staffId: string | null) => void;
}) {
  const [internalSelectedDate, setInternalSelectedDate] = React.useState<Date>(new Date());
  const [openDayKey, setOpenDayKey] = React.useState<string | null>(null);
  const [selectedSchedule, setSelectedSchedule] = React.useState<StaffSchedule | null>(null);
  const [anchorRect, setAnchorRect] = React.useState<DOMRect | null>(null);
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

  // States for Day list popover (+N more)
  const [isDayPopoverOpen, setIsDayPopoverOpen] = React.useState(false);
  const [dayPopoverDate, setDayPopoverDate] = React.useState<Date | null>(null);
  const [dayPopoverAnchorRect, setDayPopoverAnchorRect] = React.useState<DOMRect | null>(null);
  
  const currentSelectedDate = selectedDate || internalSelectedDate;
  
  const handleDateSelect = (date: Date) => {
    if (onSelectedDateChange) {
      onSelectedDateChange(date);
    } else {
      setInternalSelectedDate(date);
    }
  };

  const handleEventClick = (schedule: StaffSchedule, event: React.MouseEvent<HTMLDivElement> | DOMRect) => {
    let rect: DOMRect;
    if ('currentTarget' in event) {
      rect = (event as React.MouseEvent<HTMLDivElement>).currentTarget.getBoundingClientRect();
    } else {
      rect = event as DOMRect;
    }
    setAnchorRect(rect);
    setSelectedSchedule(schedule);
    setIsPopoverOpen(true);
    // When opening detail, usually we close the list popover
    setIsDayPopoverOpen(false);
  };

  const handleMoreClick = (date: Date, event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setDayPopoverAnchorRect(rect);
    setDayPopoverDate(date);
    setIsDayPopoverOpen(true);
  };

  const handleDayClick = (date: Date, event: React.MouseEvent<HTMLDivElement>) => {
    // Select the date first
    handleDateSelect(date);

    // If we clicked on an event or the quick create button, don't show the day popover
    const target = event.target as HTMLElement;
    if (target.closest(`.${styles.eventChip}`) || target.closest(`.${styles.createBtn}`)) {
      return;
    }

    // Capture the cell's rect for popover positioning
    const rect = event.currentTarget.getBoundingClientRect();
    setDayPopoverAnchorRect(rect);
    setDayPopoverDate(date);
    setIsDayPopoverOpen(true);
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
      <div style={{ display: 'flex', gap: '16px', height: 'calc(100vh - 220px)', overflow: 'hidden' }}>
        <div style={{ 
          flexShrink: 0, 
          display: 'flex', 
          flexDirection: 'column', 
          width: '220px', 
          height: '100%',
          overflow: 'hidden' 
        }}>
          <div style={{ flexShrink: 0 }}>
            <MiniCalendar 
              selectedDate={currentSelectedDate} 
              onDateSelect={handleDateSelect}
              currentMonth={monthCursor}
            />
          </div>
          <div 
            className={styles.sidebarList}
            style={{ 
              flex: 1, 
              overflowY: 'auto',
              paddingTop: '8px'
            }}
          >
            <CalendarSidebarExtra 
              selectedDate={currentSelectedDate}
              schedules={schedules}
            />
          </div>
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
              const { displayEvents: dayEvents, remainingCount } = getUpcomingEventsForDate(d, schedules, 3);

              return (
                <div
                  key={d.toISOString()}
                  className={`${styles.dayCell} ${inMonth ? '' : styles.outside} ${isToday ? styles.today : ''} ${isSelected ? styles.selected : ''}`}
                  role="gridcell"
                  aria-label={format(d, 'yyyy-MM-dd')}
                  onClick={(e) => handleDayClick(d, e)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className={styles.dayHeader}>
                    <div className={styles.dayNumber}>{label}</div>
                    <div className={styles.headerActions}>
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
                  </div>
                  <div className={styles.dayBody}>
                    {dayEvents.map((schedule) => {
                      const { familyScheduleResponse: fs } = schedule;
                      const eventColor = getStatusColor(fs.status);
                      
                      return (
                        <Tooltip.Root key={schedule.id}>
                          <Tooltip.Trigger asChild>
                            <div
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
                          </Tooltip.Trigger>
                          <Tooltip.Portal>
                            <Tooltip.Content className={styles.tooltipContent} sideOffset={5}>
                              <div className={styles.tooltipHeader}>
                                <div className={styles.tooltipTitle}>{fs.activity}</div>
                                <div 
                                  className={styles.tooltipStatusBadge}
                                  style={{ 
                                    backgroundColor: 
                                      fs.status === 'Done' ? '#CDEFE1' : 
                                      fs.status === 'Missed' ? '#FBE2E4' : 
                                      fs.status === 'Cancelled' ? '#F4F5F7' : '#DDEBFF',
                                    color: 
                                      fs.status === 'Done' ? '#006644' : 
                                      fs.status === 'Missed' ? '#AE2E24' : 
                                      fs.status === 'Cancelled' ? '#42526E' : '#0052CC'
                                  }}
                                >
                                  {fs.status === 'Done' ? 'Đã hoàn thành' : 
                                   fs.status === 'Missed' ? 'Đã bỏ lỡ' : 
                                   fs.status === 'Cancelled' ? 'Đã hủy' : 'Đã lên lịch'}
                                </div>
                              </div>
                              <div className={styles.tooltipCode}>{fs.customerName}</div>
                              <div className={styles.tooltipTime}>
                                {formatDateVN(fs.workDate)} • {formatEventTime(fs.startTime)} - {formatEventTime(fs.endTime)}
                              </div>
                              <div className={styles.tooltipCode}>{fs.packageName}</div>
                              {schedule.staffName && <div className={styles.tooltipCode}>{schedule.staffName}</div>}
                              {fs.note && <div className={styles.tooltipCode}>{fs.note}</div>}
                              <Tooltip.Arrow className={styles.tooltipArrow} />
                            </Tooltip.Content>
                          </Tooltip.Portal>
                        </Tooltip.Root>
                      );
                    })}
                    {remainingCount > 0 && (
                      <div 
                        className={styles.moreIndicator}
                        onClick={(e) => handleMoreClick(d, e)}
                      >
                        Xem thêm ({remainingCount})
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <DaySchedulesPopover 
          open={isDayPopoverOpen}
          onOpenChange={setIsDayPopoverOpen}
          date={dayPopoverDate}
          anchorRect={dayPopoverAnchorRect || undefined}
          schedules={schedules.filter(s => dayPopoverDate && isSameDay(new Date(s.familyScheduleResponse.workDate), dayPopoverDate))}
          onScheduleClick={(s: StaffSchedule, rect: DOMRect) => handleEventClick(s, rect)}
        />

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
