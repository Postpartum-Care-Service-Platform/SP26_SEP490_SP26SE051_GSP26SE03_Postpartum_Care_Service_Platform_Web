'use client';

import * as Popover from '@radix-ui/react-popover';
import * as Tooltip from '@radix-ui/react-tooltip';
import { addDays, format, startOfWeek, isSameDay, isBefore, startOfDay } from 'date-fns';
import React from 'react';

import staffScheduleService from '@/services/staff-schedule.service';
import type { StaffSchedule } from '@/types/staff-schedule';

import styles from './calendar-week-view.module.css';
import { MiniCalendar } from './MiniCalendar';

// Generate hours - each slot represents 2 hours (e.g., "12 AM" = 12 AM - 2 AM)
const HOURS = Array.from({ length: 8 }, (_, i) => i); // 8 slots: 6 AM - 10 PM
const START_HOUR = 6; // Schedule starts at 6 AM
const TIME_SLOT_STEP = 2; // Each slot represents 2 hours

// Color mapping for target
const TARGET_COLORS = {
  Mom: '#FFB6C1',
  Baby: '#87CEEB',
  Both: '#DDA0DD',
} as const;

function formatTimeSlot(slotIndex: number): string {
  const hour = START_HOUR + slotIndex * TIME_SLOT_STEP;
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
  const totalHours = hours + minutes / 60;
  return (totalHours - START_HOUR) * 48; // Each hour is 48px
}

function getCurrentTimePosition(): number {
  const now = new Date();
  const hours = now.getHours(); // Local time - no offset needed
  const minutes = now.getMinutes();
  // Each hour = 48px, starting from 6 AM
  if (hours < START_HOUR) return -1;
  return (hours - START_HOUR) * 48 + (minutes / 60) * 48;
}

export function CalendarWeekView({ monthCursor, schedules, onEventCreated }: { 
  monthCursor: Date; 
  schedules: StaffSchedule[];
  onEventCreated?: () => void;
}) {
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
  const [selectedDateTime, setSelectedDateTime] = React.useState<{
    date: Date;
    hour: number;
    anchorRect: DOMRect;
  } | null>(null);

  // Start from Monday of the week containing monthCursor
  const weekStart = React.useMemo(() => {
    return startOfWeek(monthCursor, { weekStartsOn: 1 });
  }, [monthCursor]);

  // Generate Mon-Sun (7 days)
  const days = React.useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  }, [weekStart]);

  const dayLabels = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'] as const;

  const today = new Date();
  const currentTimePosition = getCurrentTimePosition();

  const handleCellClick = (date: Date, slotIndex: number, event: React.MouseEvent<HTMLDivElement>) => {
    const hour = START_HOUR + slotIndex * TIME_SLOT_STEP;
    setSelectedDateTime({
      date,
      hour,
      anchorRect: event.currentTarget.getBoundingClientRect(),
    });
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
          <div className={styles.headerRow}>
            <div className={styles.headerCell} /> {/* Empty cell for time column */}
            {days.map((d, i) => {
              const isToday = isSameDay(d, today);
              return (
                <div key={d.toISOString()} className={`${styles.headerCell} ${isToday ? styles.todayHeader : ''}`}>
                  <span className={styles.dayName}>{dayLabels[i]}</span>
                  <span className={`${styles.dayNumber} ${isToday ? styles.todayNumber : ''}`}>{format(d, 'd')}</span>
                </div>
              );
            })}
          </div>

          <div className={styles.grid}>
            {/* Time column */}
            <div className={styles.timeColumn}>
              {/* Each hour slot = 2 hours (96px) */}
              {HOURS.map((slotIndex) => (
                <div key={slotIndex} className={`${styles.timeSlot} ${styles.timeSlotDouble}`}>
                  {formatTimeSlot(slotIndex)}
                </div>
              ))}
              {/* Current time indicator - dot only */}
              <div 
                className={styles.currentTimeDot}
                style={{ 
                  top: `${currentTimePosition}px`,
                  backgroundColor: '#FF6B00'
                }}
              />
            </div>

            {/* Day columns */}
            {days.map((d) => {
              const isToday = isSameDay(d, today);
              const isPast = isBefore(d, startOfDay(today));
              const dayEvents = getEventsForDate(d, schedules);
              const dayKey = d.toISOString();
              
              return (
                <div key={dayKey} className={`${styles.dayColumn} ${isToday ? styles.today : ''}`}>
                  {/* Hour grid lines - each slot = 2 hours (96px) */}
                  {HOURS.map((slotIndex) => (
                    <div 
                      key={slotIndex} 
                      className={`${styles.hourSlot} ${styles.hourSlotDouble}`}
                      onClick={(event) => handleCellClick(d, slotIndex, event)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className={styles.hourSlotTop} />
                      <div className={styles.hourSlotBottom} />
                    </div>
                  ))}
                  
                  {/* Current time line - only show dot on time column */}
                  
                  {/* Past time line - dashed, lighter color */}
                  {isPast && (
                    <div 
                      className={styles.pastTimeLine}
                      style={{ top: `${currentTimePosition}px` }}
                    />
                  )}
                  {/* Events */}
                  {dayEvents.map((schedule) => {
                    const { familyScheduleResponse: fs } = schedule;
                    const eventColor = TARGET_COLORS[fs.target] || TARGET_COLORS.Baby;
                    const topPosition = getEventPosition(fs.startTime);
                    
                    return (
                      <Tooltip.Root key={schedule.id}>
                        <Tooltip.Trigger asChild>
                          <div
                            className={styles.eventChip}
                            style={{ 
                              backgroundColor: eventColor,
                              top: `${topPosition}px`,
                            }}
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
              );
            })}
          </div>
        </div>

        {/* Quick Create Popover */}
        {selectedDateTime && (
          <CalendarQuickCreateWrapper
            date={selectedDateTime.date}
            hour={selectedDateTime.hour}
            anchorRect={selectedDateTime.anchorRect}
            onClose={() => setSelectedDateTime(null)}
            onSuccess={() => {
              setSelectedDateTime(null);
              onEventCreated?.();
            }}
          />
        )}
      </div>
    </Tooltip.Provider>
  );
}

// Wrapper component for quick create with date/time
function CalendarQuickCreateWrapper({ 
  date, 
  hour, 
  anchorRect,
  onClose, 
  onSuccess 
}: { 
  date: Date; 
  hour: number; 
  anchorRect: DOMRect;
  onClose: () => void; 
  onSuccess: () => void;
}) {
  const [open, setOpen] = React.useState(true);
  const [summary, setSummary] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  const handleCreate = async () => {
    if (!summary.trim()) return;
    
    setLoading(true);
    try {
      const startTime = `${hour.toString().padStart(2, '0')}:00:00`;
      const endTime = `${(hour + TIME_SLOT_STEP).toString().padStart(2, '0')}:00:00`;
      const workDate = format(date, 'yyyy-MM-dd');
      
      await staffScheduleService.createFamilySchedule({
        customerId: '',
        packageId: 0,
        workDate,
        startTime,
        endTime,
        dayNo: 1,
        activity: summary,
        target: 'Baby',
        status: 'Pending',
        contractId: 0,
      });
      
      handleClose();
      onSuccess();
    } catch (error) {
      console.error('Failed to create schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Popover.Root open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <Popover.Portal>
        <Popover.Content 
          className={styles.quickCreatePopover}
          style={{
            position: 'fixed',
            top: `${anchorRect.top + window.scrollY + 8}px`,
            left: `${anchorRect.left + window.scrollX + 8}px`,
          }}
          side="top" 
          align="start"
          sideOffset={8}
          collisionPadding={12}
        >
          <div style={{ padding: '12px' }}>
            <div style={{ marginBottom: '8px', fontSize: '12px', color: '#666' }}>
              {format(date, 'dd/MM/yyyy')} - {hour}:00 - {hour + TIME_SLOT_STEP}:00
            </div>
            <textarea
              autoFocus
              className={styles.quickCreateInput}
              placeholder="Nhập tên công việc..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleCreate();
                }
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px', gap: '8px' }}>
              <button 
                type="button" 
                onClick={handleClose}
                style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer' }}
              >
                Hủy
              </button>
              <button 
                type="button" 
                onClick={handleCreate}
                disabled={!summary.trim() || loading}
                style={{ padding: '6px 12px', borderRadius: '4px', border: 'none', background: '#0052cc', color: '#fff', cursor: summary.trim() && !loading ? 'pointer' : 'not-allowed', opacity: summary.trim() && !loading ? 1 : 0.5 }}
              >
                {loading ? 'Đang tạo...' : 'Tạo'}
              </button>
            </div>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
