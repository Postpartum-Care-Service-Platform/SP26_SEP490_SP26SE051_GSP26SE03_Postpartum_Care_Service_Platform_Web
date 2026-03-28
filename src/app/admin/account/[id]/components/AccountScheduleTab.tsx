'use client';

import { format, startOfWeek, endOfWeek } from 'date-fns';
import React from 'react';

import { CalendarControlPanel } from '@/app/admin/work-schedule/components/calendar/CalendarControlPanel';
import { CalendarMonthView } from '@/app/admin/work-schedule/components/calendar/CalendarMonthView';
import { CalendarWeekView } from '@/app/admin/work-schedule/components/calendar/CalendarWeekView';
import { CalendarDayView } from '@/app/admin/work-schedule/components/calendar/CalendarDayView';
import { TASK_TYPES, type TaskType } from '@/app/admin/work-schedule/components/TaskTypePicker';

import type { CalendarStatusType } from '@/app/admin/work-schedule/components/calendar/CalendarStatusDropdown';
import type { CalendarViewMode } from '@/app/admin/work-schedule/components/calendar/CalendarViewDropdown';
import staffScheduleService from '@/services/staff-schedule.service';
import type { StaffSchedule } from '@/types/staff-schedule';

interface AccountScheduleTabProps {
  accountId: string;
  staffId?: string; // Potential staff ID assigned to this account
}

export const AccountScheduleTab: React.FC<AccountScheduleTabProps> = ({ accountId, staffId }) => {
  // Calendar State (copied from WorkSchedulePage logic)
  const [calendarMonth, setCalendarMonth] = React.useState(() => {
    const d = new Date();
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [calendarSelectedDate, setCalendarSelectedDate] = React.useState<Date>(new Date());
  const [calendarViewMode, setCalendarViewMode] = React.useState<CalendarViewMode>('Month');
  const [calendarDayCount, setCalendarDayCount] = React.useState(1);
  const [calendarStatus, setCalendarStatus] = React.useState<CalendarStatusType | null>(null);
  const [calendarTaskType, setCalendarTaskType] = React.useState<TaskType | null>(TASK_TYPES[TASK_TYPES.length - 1]);
  const [schedules, setSchedules] = React.useState<StaffSchedule[]>([]);

  const fetchSchedules = React.useCallback(async () => {
    // If no staffId provided, we can't filter correctly yet, but for now we'll demo
    // In real app, we might filter by both staffId AND customerId
    const targetStaffId = staffId || 'maria-kelly-id'; // Fallback for demo

    try {
      let from, to;
      if (calendarViewMode === 'Month') {
        const year = calendarMonth.getFullYear();
        const month = calendarMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        from = format(firstDay, 'yyyy-MM-dd');
        to = format(lastDay, 'yyyy-MM-dd');
      } else if (calendarViewMode === 'Week') {
        const weekStart = startOfWeek(calendarSelectedDate, { weekStartsOn: 0 });
        const weekEnd = endOfWeek(calendarSelectedDate, { weekStartsOn: 0 });
        from = format(weekStart, 'yyyy-MM-dd');
        to = format(weekEnd, 'yyyy-MM-dd');
      } else {
        from = format(calendarSelectedDate, 'yyyy-MM-dd');
        const toDate = new Date(calendarSelectedDate);
        if (calendarDayCount > 1) {
          toDate.setDate(toDate.getDate() + calendarDayCount - 1);
        }
        to = format(toDate, 'yyyy-MM-dd');
      }

      const data = await staffScheduleService.getStaffSchedule({
        staffId: targetStaffId,
        from,
        to
      }).catch(err => {
        console.warn('API 404 or Error (Expected for new accounts):', err);
        return []; // Return empty array so UI still renders
      });

      // Filter schedules to only show those belonging to THIS account
      const filteredData = Array.isArray(data) ? data.filter(s =>
        s.familyScheduleResponse && s.familyScheduleResponse.customerId === accountId
      ) : [];

      setSchedules(filteredData);
    } catch (error) {
      console.error('Failed to fetch schedules:', error);
      setSchedules([]); // Fallback to empty on any crash
    }
  }, [calendarMonth, calendarSelectedDate, calendarViewMode, calendarDayCount, staffId, accountId]);

  React.useEffect(() => {
    fetchSchedules();
  }, [calendarViewMode, calendarDayCount, calendarSelectedDate, calendarMonth, fetchSchedules]);

  const handleTodayClick = React.useCallback(() => {
    const today = new Date();
    const month = new Date(today);
    month.setDate(1);
    month.setHours(0, 0, 0, 0);
    setCalendarMonth(month);
    setCalendarSelectedDate(today);
  }, []);

  const handleSelectedDateChange = React.useCallback((date: Date) => {
    setCalendarSelectedDate(date);
    const month = new Date(date);
    month.setDate(1);
    month.setHours(0, 0, 0, 0);
    setCalendarMonth(month);
  }, []);

  const displaySchedules = React.useMemo(() => {
    if (!calendarStatus) return schedules;
    const targetStatus = calendarStatus.toLowerCase();
    return schedules.filter(s => {
      const status = s.familyScheduleResponse?.status?.toLowerCase();
      return status === targetStatus;
    });
  }, [schedules, calendarStatus]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <CalendarControlPanel
        monthCursor={calendarMonth}
        onMonthCursorChange={setCalendarMonth}
        viewMode={calendarViewMode}
        dayCount={calendarDayCount}
        onViewModeChange={(mode, days) => {
          setCalendarViewMode(mode);
          if (days) setCalendarDayCount(days);
        }}
        statusValue={calendarStatus}
        onStatusChange={setCalendarStatus}
        taskType={calendarTaskType}
        onTaskTypeChange={setCalendarTaskType}
        onTodayClick={handleTodayClick}
        selectedDate={calendarSelectedDate}
        onSelectedDateChange={handleSelectedDateChange}
      />

      <div style={{ flex: 1, position: 'relative', minHeight: '500px' }}>
        {calendarViewMode === 'Month' ? (
          <div style={{ height: '100%', overflow: 'auto' }}>
            <CalendarMonthView
              monthCursor={calendarMonth}
              selectedDate={calendarSelectedDate}
              onSelectedDateChange={handleSelectedDateChange}
              schedules={displaySchedules}
            />
          </div>
        ) : calendarViewMode === 'Week' ? (
          <CalendarWeekView
            weekCursor={calendarSelectedDate}
            schedules={displaySchedules}
            onDateChange={handleSelectedDateChange}
            onEventCreated={() => {
              void fetchSchedules();
            }}
          />
        ) : (
          <CalendarDayView
            dayCursor={calendarSelectedDate}
            dayCount={calendarDayCount}
            onDayChange={handleSelectedDateChange}
            monthCursor={calendarMonth}
            schedules={displaySchedules}
          />
        )}
      </div>
    </div>
  );
};
