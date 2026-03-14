'use client';

import * as Tooltip from '@radix-ui/react-tooltip';
import { format, isSameDay, getHours } from 'date-fns';
import React from 'react';

import type { StaffSchedule } from '@/types/staff-schedule';

import styles from './calendar-day-view.module.css';
import { CalendarQuickCreate } from './CalendarQuickCreate';
import { MiniCalendar } from './MiniCalendar';
import { ScheduleDetailPopover } from '../shared/ScheduleDetailPopover';

// Generate hours from 6 AM to 8 PM (like Outlook)
const HOURS = Array.from({ length: 15 }, (_, i) => i + 6);

// Color mapping for target
const TARGET_COLORS = {
  Mom: '#FFB6C1',
  Baby: '#87CEEB',
  Both: '#DDA0DD',
} as const;

function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  return `${hours}:${minutes}`;
}

function getEventsForDate(date: Date, events: StaffSchedule[]): StaffSchedule[] {
  const dateStr = format(date, 'yyyy-MM-dd');
  return events.filter(event => 
    event.familyScheduleResponse.workDate === dateStr
  ).sort((a, b) => 
    a.familyScheduleResponse.startTime.localeCompare(b.familyScheduleResponse.startTime)
  );
}

function getEventPosition(startTime: string): number {
  const [hours] = startTime.split(':').map(Number);
  return hours - 6; // Offset from 6 AM
}

function getCurrentTimePosition(): number {
  const now = new Date();
  const hours = now.getHours(); // Local time
  const minutes = now.getMinutes();
  if (hours < 6) return -1;
  return (hours - 6) * 48 + (minutes / 60) * 48;
}

export function CalendarDayView({ monthCursor, schedules }: { 
  monthCursor: Date; 
  schedules: StaffSchedule[];
}) {
  const [openDayKey, setOpenDayKey] = React.useState<string | null>(null);
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
  const [selectedSchedule, setSelectedSchedule] = React.useState<StaffSchedule | null>(null);
  const [anchorRect, setAnchorRect] = React.useState<DOMRect | null>(null);
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

  // Use monthCursor as the day to display
  const day = monthCursor;

  const dayLabels = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'] as const;
  const dayOfWeek = day.getDay();
  const dayLabel = dayLabels[dayOfWeek];

  const monthNames = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
  const monthYear = `${monthNames[day.getMonth()]} ${day.getFullYear()}`;

  const today = new Date();
  const isToday = isSameDay(day, today);
  const dayEvents = getEventsForDate(day, schedules);
  const currentTimePosition = getCurrentTimePosition();

  const handleEventClick = (schedule: StaffSchedule, event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setAnchorRect(rect);
    setSelectedSchedule(schedule);
    setIsPopoverOpen(true);
  };

  return (
    <Tooltip.Provider delayDuration={350}>
      <div style={{ display: 'flex', gap: '16px' }}>
        <div style={{ flexShrink: 0 }}>
          <MiniCalendar 
            selectedDate={selectedDate} 
            onDateSelect={setSelectedDate}
            currentMonth={monthCursor}
          />
        </div>

        <div className={styles.wrap} style={{ flex: 1, overflow: 'auto' }}>
      <div className={styles.header}>
        <div className={styles.dayLabel}>{dayLabel}</div>
        <div className={styles.dateNumber}>
              <span className={`${styles.dayOfMonth} ${isToday ? styles.todayNumber : ''}`}>{format(day, 'd')}</span>
          <span className={styles.monthYear}>{monthYear}</span>
        </div>
      </div>

      <div className={styles.content}>
            {/* Time column + Day column */}
            <div className={styles.grid}>
              {/* Time column */}
              <div className={styles.timeColumn}>
                {HOURS.map(hour => (
                  <div key={hour} className={styles.timeSlot}>
                    {hour}:00
                  </div>
                ))}
                {/* Current time dot in time column */}
                {isToday && currentTimePosition >= 0 && (
                  <div 
                    className={styles.currentTimeDot}
                    style={{ 
                      top: `${currentTimePosition}px`,
                      backgroundColor: '#FF6B00'
                    }}
                  />
                )}
              </div>

              {/* Day column */}
              <div className={`${styles.dayColumn} ${isToday ? styles.today : ''}`}>
                {/* Hour grid lines */}
                {HOURS.map(hour => (
                  <div key={hour} className={styles.hourSlot} />
                ))}
                
                {/* Current time line */}
                {isToday && currentTimePosition >= 0 && (
                  <>
                  <div 
                    className={styles.currentTimeLine}
                      style={{ 
                        top: `${currentTimePosition}px`,
                        backgroundColor: '#FF6B00'
                      }}
                    />
                    {/* Dot at start of line (in day column) */}
                    <div 
                      style={{
                        position: 'absolute',
                        top: `${currentTimePosition - 4}px`,
                        left: '-4px',
                        width: '8px',
                        height: '8px',
                        backgroundColor: '#FF6B00',
                        borderRadius: '50%',
                        zIndex: 11
                      }}
                  />
                  </>
                )}
                
                {/* Events */}
                {dayEvents.map((schedule) => {
                  const { familyScheduleResponse: fs } = schedule;
                  const eventColor = TARGET_COLORS[fs.target] || TARGET_COLORS.Baby;
                  const topPosition = getEventPosition(fs.startTime) * 48;
                  
                  return (
                    <Tooltip.Root key={schedule.id}>
                      <Tooltip.Trigger asChild>
                        <div
                          className={styles.eventChip}
                          style={{ 
                            backgroundColor: eventColor,
                            top: `${topPosition}px`,
                          }}
                          onClick={(e) => handleEventClick(schedule, e)}
                          role="button"
                          tabIndex={0}
                        >
                          <span className={styles.eventTime}>
                            {formatTime(fs.startTime)} - {formatTime(fs.endTime)}
                          </span>
                          <span className={styles.eventTitle}>
                            {fs.activity}
                          </span>
                          <span className={styles.eventCustomer}>
                            {fs.customerName}
                          </span>
                        </div>
                      </Tooltip.Trigger>
                      <Tooltip.Portal>
                        <Tooltip.Content className={styles.tooltipContent} sideOffset={5}>
                          <div className={styles.tooltipTitle}>{fs.activity}</div>
                          <div className={styles.tooltipCode}>{fs.customerName}</div>
                          <div className={styles.tooltipTime}>
                            {formatTime(fs.startTime)} - {formatTime(fs.endTime)}
                          </div>
                          <div className={styles.tooltipCode}>{fs.packageName}</div>
                          <Tooltip.Arrow className={styles.tooltipArrow} />
                        </Tooltip.Content>
                      </Tooltip.Portal>
                    </Tooltip.Root>
                  );
                })}
              </div>
            </div>
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
