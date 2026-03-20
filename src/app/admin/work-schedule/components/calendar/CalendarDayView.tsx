'use client';

import * as Tooltip from '@radix-ui/react-tooltip';
import { format, isSameDay, getHours } from 'date-fns';
import React from 'react';

import type { StaffSchedule } from '@/types/staff-schedule';

import styles from './calendar-day-view.module.css';
import { CalendarQuickCreate } from './CalendarQuickCreate';
import { MiniCalendar } from './MiniCalendar';
import { ScheduleDetailPopover } from '../shared/ScheduleDetailPopover';

// Generate hours from 12 AM to 11 PM
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const START_HOUR = 0;

// Color mapping for target
const TARGET_COLORS = {
  Mom: '#FFB6C1',
  Baby: '#87CEEB',
  Both: '#DDA0DD',
} as const;

function formatTimeSlot(slotIndex: number): number | string {
  const hour = START_HOUR + slotIndex;
  if (hour === 0) return '12 AM';
  if (hour === 12) return '12 PM';
  if (hour < 12) return `${hour} AM`;
  return `${hour - 12} PM`;
}

function formatEventTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const hour = hours % 12 || 12;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  return `${hour}:${minutes.toString().padStart(2, '0')} ${ampm}`;
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
  const [hours, minutes] = startTime.split(':').map(Number);
  return (hours - START_HOUR) + (minutes / 60);
}

function getCurrentTimePosition(): number {
  const now = new Date();
  const hours = now.getHours(); // Local time
  const minutes = now.getMinutes();
  if (hours < START_HOUR) return -1;
  return (hours - START_HOUR) * 96 + (minutes / 60) * 96;
}

export function CalendarDayView({ dayCursor, schedules, onDayChange, monthCursor }: { 
  dayCursor: Date; 
  schedules: StaffSchedule[];
  onDayChange?: (date: Date) => void;
  monthCursor: Date;
}) {
  const [openDayKey, setOpenDayKey] = React.useState<string | null>(null);
  const [selectedSchedule, setSelectedSchedule] = React.useState<StaffSchedule | null>(null);
  const [anchorRect, setAnchorRect] = React.useState<DOMRect | null>(null);
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

  // Use dayCursor as the day to display
  const day = dayCursor;

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
            selectedDate={dayCursor} 
            onDateSelect={onDayChange}
            currentMonth={monthCursor}
          />
        </div>

        <div className={styles.wrap} style={{ flex: 1, overflow: 'auto' }}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <span className={styles.dayNumberLarge}>{format(day, 'd')}</span>
          <span className={styles.dayNameLarge}>{dayLabel}</span>
        </div>
        <div className={styles.monthYearSub}>{monthYear}</div>
      </div>

      <div className={styles.content}>
            {/* Time column + Day column */}
            <div className={styles.grid}>
              {/* Time column */}
              <div className={styles.timeColumn}>
                {HOURS.map(hour => (
                  <div key={hour} className={styles.timeSlot}>
                    {formatTimeSlot(hour)}
                  </div>
                ))}
                {/* Current time indicator - dot with tooltip */}
                {currentTimePosition >= 0 && (
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <div 
                        className={styles.currentTimeDot}
                        style={{ 
                          top: `${currentTimePosition}px`,
                          backgroundColor: '#FF6B00',
                          cursor: 'help'
                        }}
                      />
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content className={styles.tooltipContent} side="right" sideOffset={10}>
                        {format(new Date(), 'HH:mm')}
                        <Tooltip.Arrow className={styles.tooltipArrow} />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                )}
              </div>

              {/* Day column */}
              <div className={`${styles.dayColumn} ${isToday ? styles.today : ''}`}>
                {/* Hour grid lines */}
                {HOURS.map(hour => (
                  <div key={hour} className={styles.hourSlot} />
                ))}
                
                {/* Current time line - only show on today */}
                {isToday && currentTimePosition >= 0 && (
                  <div 
                    className={styles.currentTimeLine}
                    style={{ 
                      top: `${currentTimePosition}px`
                    }}
                  />
                )}
                
                {/* Events */}
                {dayEvents.map((schedule) => {
                  const { familyScheduleResponse: fs } = schedule;
                  const eventColor = TARGET_COLORS[fs.target] || TARGET_COLORS.Baby;
                  const topPosition = getEventPosition(fs.startTime) * 96;
                  
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
                            {formatEventTime(fs.startTime)} - {formatEventTime(fs.endTime)}
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
                            {formatEventTime(fs.startTime)} - {formatEventTime(fs.endTime)}
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
