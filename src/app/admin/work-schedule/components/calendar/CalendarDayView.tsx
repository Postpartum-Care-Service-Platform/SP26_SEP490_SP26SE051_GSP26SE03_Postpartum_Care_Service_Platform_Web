'use client';

import * as Tooltip from '@radix-ui/react-tooltip';
import { format, isSameDay, addDays } from 'date-fns';
import React from 'react';

import type { StaffSchedule } from '@/types/staff-schedule';

import styles from './calendar-day-view.module.css';
import { MiniCalendar } from './MiniCalendar';
import { ScheduleDetailPopover } from '../shared/ScheduleDetailPopover';
import { CalendarSidebarExtra } from './CalendarSidebarExtra';


// Generate hours from 12 AM to 11 PM
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const START_HOUR = 0;

const STATUS_COLORS: Record<string, string> = {
  Scheduled: '#DDEBFF',
  Done: '#CDEFE1',
  Missed: '#FBE2E4',
  Cancelled: '#FBE2E4',
};

function getStatusColor(status: string): string {
  return STATUS_COLORS[status] || '#E9EDF5';
}

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
  const [hours, minutes] = startTime.split(':').map(Number);
  return (hours - START_HOUR) + (minutes / 60);
}

function getEventHeight(startTime: string, endTime: string): number {
  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);
  const startTotal = startH + startM / 60;
  const endTotal = endH + endM / 60;
  const duration = Math.max(0.5, endTotal - startTotal); // Min 30 mins
  return duration * 96;
}

function getCurrentTimePosition(): number {
  const now = new Date();
  const hours = now.getHours(); // Local time
  const minutes = now.getMinutes();
  if (hours < START_HOUR) return -1;
  return (hours - START_HOUR) * 96 + (minutes / 60) * 96;
}

export function CalendarDayView({ 
  dayCursor, 
  schedules, 
  onDayChange, 
  monthCursor, 
  dayCount = 1,
  selectedStaffId,
  onStaffSelect,
}: {
  dayCursor: Date;
  schedules: StaffSchedule[];
  onDayChange?: (date: Date) => void;
  monthCursor: Date;
  dayCount?: number;
  selectedStaffId: string | null;
  onStaffSelect: (staffId: string | null) => void;
}) {
  const [selectedSchedule, setSelectedSchedule] = React.useState<StaffSchedule | null>(null);
  const [anchorRect, setAnchorRect] = React.useState<DOMRect | null>(null);
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

  // Support multi-day view
  const days = React.useMemo(() => {
    return Array.from({ length: dayCount }, (_, i) => addDays(dayCursor, i));
  }, [dayCursor, dayCount]);

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
  const today = new Date();
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
        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', width: '220px', overflowY: 'auto', overflowX: 'hidden' }}>
          <MiniCalendar
            selectedDate={dayCursor}
            onDateSelect={onDayChange}
            currentMonth={monthCursor}
            viewMode="Day"
          />
          <CalendarSidebarExtra 
            selectedDate={dayCursor}
            schedules={schedules}
          />
        </div>

        <div className={styles.wrap} style={{ flex: 1, overflow: 'auto' }}>
          {/* Header Row */}
          <div className={styles.header} style={{ 
            display: 'grid', 
            gridTemplateColumns: `50px repeat(${dayCount}, 1fr)`,
            padding: 0,
            height: 'auto',
            borderBottom: '1px solid rgba(9, 30, 66, 0.14)',
            backgroundColor: '#fff',
            position: 'sticky',
            top: 0,
            zIndex: 100
          }}>
            <div style={{ borderRight: '1px solid rgba(9, 30, 66, 0.14)' }} />
            {days.map((d) => {
              const isTodayDate = isSameDay(d, today);
              return (
                <div key={d.toISOString()} style={{ 
                  padding: '12px 0', 
                  textAlign: 'center', 
                  borderRight: '1px solid rgba(9, 30, 66, 0.14)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}>
                  <div className={styles.headerTop}>
                    <span className={styles.dayNumberLarge} style={{ color: isTodayDate ? '#ff7a00' : '#42526e', fontSize: '24px' }}>{format(d, 'd')}</span>
                    <span className={styles.dayNameLarge} style={{ fontSize: '14px' }}>{dayLabels[d.getDay()]}</span>
                  </div>
                  <div className={styles.monthYearSub} style={{ fontSize: '11px' }}>{format(d, 'MMM yyyy')}</div>
                </div>
              );
            })}
          </div>

          <div className={styles.content}>
            {/* Grid with Time column + Day columns */}
            <div className={styles.grid} style={{ display: 'grid', gridTemplateColumns: `50px repeat(${dayCount}, 1fr)` }}>
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

              {/* Day columns */}
              {days.map((d) => {
                const isTodayDate = isSameDay(d, today);
                const dayEvents = getEventsForDate(d, schedules);
                return (
                  <div key={d.toISOString()} className={`${styles.dayColumn} ${isTodayDate ? styles.today : ''}`} style={{ borderRight: '1px solid rgba(9, 30, 66, 0.14)', position: 'relative' }}>
                    {/* Hour grid lines */}
                    {HOURS.map(hour => (
                      <div key={hour} className={styles.hourSlot} />
                    ))}

                    {/* Current time line - only show on today */}
                    {isTodayDate && currentTimePosition >= 0 && (
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
                      const topPosition = getEventPosition(fs.startTime) * 96;
                      const height = getEventHeight(fs.startTime, fs.endTime);

                      return (
                        <Tooltip.Root key={schedule.id}>
                          <Tooltip.Trigger asChild>
                            <div
                              className={styles.eventChip}
                              style={{
                                position: 'absolute',
                                left: '4px',
                                right: '4px',
                                top: `${topPosition}px`,
                                height: `${height}px`,
                                cursor: 'pointer',
                                backgroundColor: getStatusColor(fs.status),
                              }}
                              onClick={(e) => handleEventClick(schedule, e)}
                            >
                              <div className={styles.eventContent}>
                                <span className={styles.eventTime} style={{ color: '#ff7a00' }}>
                                  {formatTime(fs.startTime)}
                                </span>
                                <span className={styles.eventTitle}>
                                  {fs.activity}
                                </span>
                              </div>
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
                              {fs.note && <div className={styles.tooltipNote}>{fs.note}</div>}
                              <Tooltip.Arrow className={styles.tooltipArrow} />
                            </Tooltip.Content>
                          </Tooltip.Portal>
                        </Tooltip.Root>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <ScheduleDetailPopover
          open={isPopoverOpen}
          onOpenChange={setIsPopoverOpen}
          schedule={selectedSchedule}
          anchorRect={anchorRect || undefined}
          sideOffset={-400}
        />
      </div>
    </Tooltip.Provider>
  );
}
