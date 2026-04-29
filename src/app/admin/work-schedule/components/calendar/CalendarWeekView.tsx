'use client';

import * as Popover from '@radix-ui/react-popover';
import * as Tooltip from '@radix-ui/react-tooltip';
import { addDays, format, startOfWeek, isSameDay, isBefore, startOfDay, isToday } from 'date-fns';
import { vi } from 'date-fns/locale';
import React from 'react';

import staffScheduleService from '@/services/staff-schedule.service';
import type { StaffSchedule } from '@/types/staff-schedule';

import styles from './calendar-week-view.module.css';
import { MiniCalendar } from './MiniCalendar';
import { ScheduleDetailPopover } from '../shared/ScheduleDetailPopover';
import { CalendarSidebarExtra } from './CalendarSidebarExtra';
import { getDaySummary } from './CalendarMonthView';


// Generate hours - each slot represents 1 hour
const HOURS = Array.from({ length: 24 }, (_, i) => i); // 24 slots: 12 AM - 11 PM
const START_HOUR = 0; // Schedule starts at 12 AM
const TIME_SLOT_STEP = 1; // Each slot represents 1 hour

const STATUS_COLORS: Record<string, string> = {
  Scheduled: '#EBF2FA',
  Done: '#CDEFE1',
  Missed: '#FBE2E4',
  Cancelled: '#F4F5F7',
};

const STATUS_TEXT_COLORS: Record<string, string> = {
  Scheduled: '#0052CC',
  Done: '#006644',
  Missed: '#AE2E24',
  Cancelled: '#42526E',
};

function getStatusColor(status: string): string {
  return STATUS_COLORS[status] || '#E9EDF5';
}

function formatTimeSlot(slotIndex: number): string {
  const hour = START_HOUR + slotIndex * TIME_SLOT_STEP;
  if (hour === 0) return '12 SA';
  if (hour === 12) return '12 CH';
  if (hour < 12) return `${hour} SA`;
  return `${hour - 12} CH`;
}

function formatEventTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const hour = hours % 12 || 12;
  const ampm = hours >= 12 ? 'CH' : 'SA';
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
  const totalHours = hours + minutes / 60;
  return (totalHours - START_HOUR) * 96; // Each hour is 96px
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
  const hours = now.getHours(); // Local time - no offset needed
  const minutes = now.getMinutes();
  // Each hour = 48px, starting from 6 AM
  if (hours < START_HOUR) return -1;
  return (hours - START_HOUR) * 96 + (minutes / 60) * 96;
}

export function CalendarWeekView({
  weekCursor,
  schedules,
  onEventCreated,
  onDateChange,
  selectedStaffId,
  onStaffSelect,
  onRefresh,
}: {
  weekCursor: Date;
  schedules: StaffSchedule[];
  onEventCreated?: () => void;
  onDateChange?: (date: Date) => void;
  selectedStaffId: string | null;
  onStaffSelect: (staffId: string | null) => void;
  onRefresh?: () => void;
}) {
  const [selectedDateTime, setSelectedDateTime] = React.useState<{
    date: Date;
    hour: number;
    anchorRect: DOMRect;
  } | null>(null);
  const [selectedSchedule, setSelectedSchedule] = React.useState<StaffSchedule | null>(null);
  const [scheduleAnchorRect, setScheduleAnchorRect] = React.useState<DOMRect | null>(null);
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

  // Start from Sunday of the week containing weekCursor
  const weekStart = React.useMemo(() => {
    return startOfWeek(weekCursor, { weekStartsOn: 0 });
  }, [weekCursor]);

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

  const handleEventClick = (schedule: StaffSchedule, event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    setScheduleAnchorRect(rect);
    setSelectedSchedule(schedule);
    setIsPopoverOpen(true);
  };

  return (
    <Tooltip.Provider delayDuration={350}>
      <div style={{ display: 'flex', gap: '16px', height: 'calc(100vh - 196px)', overflow: 'hidden', paddingBottom: '8px' }}>
        <div className="no-scrollbar" style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', width: '220px', overflowY: 'auto', overflowX: 'hidden' }}>
          <MiniCalendar
            selectedDate={weekCursor}
            onDateSelect={onDateChange}
            currentMonth={weekCursor}
            viewMode="Week"
          />
          <CalendarSidebarExtra
            selectedDate={weekCursor}
            schedules={schedules}
          />
        </div>

        <div className={`${styles.wrap} no-scrollbar`} style={{ flex: 1, overflow: 'auto' }}>
          <div className={styles.headerRow}>
            <div className={styles.headerCell} /> {/* Empty cell for time column */}
            {days.map((d, i) => {
              const isToday = isSameDay(d, today);
              const summary = getDaySummary(d, schedules);
              return (
                <Tooltip.Root key={d.toISOString()}>
                  <Tooltip.Trigger asChild>
                    <div className={`${styles.headerCell} ${isToday ? styles.todayHeader : ''} ${isBefore(startOfDay(d), startOfDay(today)) ? styles.past : ''}`} style={{ cursor: 'help' }}>
                      <span className={styles.dayName}>{dayLabels[i]}</span>
                      <span className={`${styles.dayNumber} ${isToday ? styles.todayNumber : ''}`}>{format(d, 'd')}</span>
                    </div>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content className={styles.dayTooltipContent} side="bottom" sideOffset={10}>
                      <div className={styles.dayTooltipHeader}>
                        {format(d, "EEEE, 'Ngày' d 'Tháng' M, yyyy", { locale: vi })}
                      </div>
                      <div className={styles.dayTooltipStats}>
                        <div className={styles.dayTooltipStatItem}>
                          <span className={styles.dayTooltipLabel}>Tổng số công việc</span>
                          <span className={styles.dayTooltipValue}>{summary.total}</span>
                        </div>
                        <div className={styles.dayTooltipStatItem}>
                          <span className={styles.dayTooltipLabel}>Hoàn thành</span>
                          <span className={`${styles.dayTooltipValue} text-emerald-600`}>{summary.done}</span>
                        </div>
                        <div className={styles.dayTooltipStatItem}>
                          <span className={styles.dayTooltipLabel}>Bỏ lỡ / Hủy</span>
                          <span className={`${styles.dayTooltipValue} text-red-600`}>{summary.missed + summary.cancelled}</span>
                        </div>
                        <div className={styles.dayTooltipStatItem}>
                          <span className={styles.dayTooltipLabel}>Chờ thực hiện</span>
                          <span className={`${styles.dayTooltipValue} text-blue-600`}>{summary.scheduled}</span>
                        </div>
                      </div>
                      <Tooltip.Arrow className={styles.dayTooltipArrow} />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              );
            })}
          </div>

          <div className={styles.grid}>
            {/* Time column */}
            <div className={styles.timeColumn}>
              {/* Each hour slot = 1 hour (48px) */}
              {HOURS.map((slotIndex) => (
                <div key={slotIndex} className={styles.timeSlot}>
                  {formatTimeSlot(slotIndex)}
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
              const isTodayDate = isToday(d);
              const dayEvents = getEventsForDate(d, schedules);
              const dayKey = d.toISOString();

              return (
                <div key={dayKey} className={`${styles.dayColumn} ${isTodayDate ? styles.today : ''} ${isBefore(startOfDay(d), startOfDay(today)) ? styles.past : ''}`}>
                  {/* Hour grid lines - each slot = 1 hour (48px) */}
                  {HOURS.map((slotIndex) => (
                    <div
                      key={slotIndex}
                      className={styles.hourSlot}
                      onClick={(event) => handleCellClick(d, slotIndex, event)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className={styles.hourSlotTop} />
                      <div className={styles.hourSlotBottom} />
                    </div>
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
                  {/* Dashed current time line for other days */}
                  {!isTodayDate && currentTimePosition >= 0 && (
                    <div
                      className={styles.currentTimeLineDashed}
                      style={{ top: `${currentTimePosition}px` }}
                    />
                  )}
                  {/* Events */}
                  {dayEvents.map((schedule) => {
                    const { familyScheduleResponse: fs } = schedule;
                    const topPosition = getEventPosition(fs.startTime);
                    const height = getEventHeight(fs.startTime, fs.endTime);

                    return (
                      <Tooltip.Root key={schedule.id}>
                        <Tooltip.Trigger asChild>
                          <div
                            className={styles.eventChip}
                            onClick={(e) => handleEventClick(schedule, e)}
                            style={{
                              top: `${topPosition}px`,
                              height: `${height}px`,
                              cursor: 'pointer',
                              backgroundColor: getStatusColor(fs.status),
                              '--status-accent-color': STATUS_TEXT_COLORS[fs.status] || '#0052CC'
                            } as React.CSSProperties}
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
                              {formatEventTime(fs.startTime)} - {formatEventTime(fs.endTime)}
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

        {/* Schedule Detail Popover */}
        <ScheduleDetailPopover
          open={isPopoverOpen}
          onOpenChange={setIsPopoverOpen}
          schedule={selectedSchedule}
          anchorRect={scheduleAnchorRect || undefined}
          onRefresh={onRefresh}
        />
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
      <Popover.Anchor
        style={{
          position: 'fixed',
          top: anchorRect.top,
          left: anchorRect.left,
          width: anchorRect.width,
          height: anchorRect.height,
          pointerEvents: 'none',
        }}
      />
      <Popover.Portal>
        <Popover.Content
          className={styles.quickCreatePopover}
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
                style={{
                  padding: '6px 12px',
                  borderRadius: '4px',
                  border: 'none',
                  background: '#ff7a00',
                  color: '#fff',
                  cursor: summary.trim() && !loading ? 'pointer' : 'not-allowed',
                  opacity: summary.trim() && !loading ? 1 : 0.5
                }}
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
