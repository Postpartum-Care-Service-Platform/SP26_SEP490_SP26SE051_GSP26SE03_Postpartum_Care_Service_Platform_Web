'use client';

import { format, startOfWeek, endOfWeek } from 'date-fns';
import React from 'react';

import { CalendarControlPanel } from '@/app/admin/work-schedule/components/calendar/CalendarControlPanel';
import { CalendarDayView } from '@/app/admin/work-schedule/components/calendar/CalendarDayView';
import { CalendarMonthView } from '@/app/admin/work-schedule/components/calendar/CalendarMonthView';
import { CalendarWeekView } from '@/app/admin/work-schedule/components/calendar/CalendarWeekView';
import { TASK_TYPES } from '@/app/admin/work-schedule/components/TaskTypePicker';

import amenityTicketService from '@/services/amenity-ticket.service';
import familyScheduleService from '@/services/family-schedule.service';

import type { TaskType } from '@/app/admin/work-schedule/components/TaskTypePicker';
import type { CalendarStatusType } from '@/app/admin/work-schedule/components/calendar/CalendarStatusDropdown';
import type { CalendarViewMode } from '@/app/admin/work-schedule/components/calendar/CalendarViewDropdown';
import type { AmenityTicket } from '@/types/amenity-ticket';
import type { FamilyScheduleItem } from '@/types/family-schedule';
import type { StaffSchedule } from '@/types/staff-schedule';

interface AccountScheduleTabProps {
  accountId: string;
}

export const AccountScheduleTab: React.FC<AccountScheduleTabProps> = ({ accountId }) => {
  // Calendar State
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
  const [selectedStaffId, setSelectedStaffId] = React.useState<string | null>(null);

  const fetchSchedules = React.useCallback(async () => {
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

      // CALL NEW API
      const data = await familyScheduleService.getAdminSchedulesByDateRange({
        customerId: accountId,
        dateFrom: from,
        dateTo: to
      }).catch(err => {
        console.warn('API 404 or Error (Expected for new accounts):', err);
        return [] as FamilyScheduleItem[];
      });

      // Map FamilyScheduleItem[] to StaffSchedule[] to stay compatible with existing calendar views
      const mappedSchedules: StaffSchedule[] = Array.isArray(data) ? data.map(item => ({
        id: item.id,
        staffId: item.staffSchedules?.[0]?.staffId || '',
        staffName: item.staffSchedules?.[0]?.staffName || '',
        staffAvatar: item.staffSchedules?.[0]?.staffAvatar || null,
        roomId: item.roomId,
        roomName: item.roomName,
        managerId: '',
        managerName: '',
        familyScheduleId: item.id,
        isChecked: item.staffSchedules?.[0]?.isChecked || false,
        checkedAt: item.staffSchedules?.[0]?.checkedAt || null,
        familyScheduleResponse: {
          id: item.id,
          customerId: item.customerId,
          customerName: item.customerName,
          customerAvatar: item.customerAvatar,
          packageId: item.packageId,
          packageName: item.packageName,
          workDate: item.workDate,
          startTime: item.startTime,
          endTime: item.endTime,
          dayNo: item.dayNo,
          activity: item.activity,
          target: item.target,
          status: item.status,
          note: item.note,
          contractId: null
        }
      })) : [];

      // FETCH AMENITY TICKETS (TIỆN ÍCH)
      const amenityData = await amenityTicketService.getAmenityTicketsByCustomerId(accountId).catch(err => {
        console.warn('Failed to fetch amenity tickets:', err);
        return [] as AmenityTicket[];
      });

      // Map AmenityTicket[] to StaffSchedule[]
      const mappedAmenities: StaffSchedule[] = amenityData
        .filter(ticket => ticket.date >= from && ticket.date <= to)
        .map(ticket => ({
          id: -ticket.id, // Negative to avoid collision
          staffId: '',
          staffName: 'Tiện ích',
          staffAvatar: null,
          roomId: null,
          roomName: null,
          managerId: '',
          managerName: '',
          familyScheduleId: -ticket.id,
          isChecked: ticket.status === 'Completed',
          checkedAt: null,
          familyScheduleResponse: {
            id: -ticket.id,
            customerId: ticket.customerId,
            customerName: '',
            customerAvatar: null,
            packageId: 0,
            packageName: 'Dịch vụ tiện ích',
            workDate: ticket.date,
            startTime: ticket.startTime,
            endTime: ticket.endTime,
            dayNo: 0,
            activity: `Sử dụng tiện ích (${ticket.status})`,
            target: 'Customer',
            status: ticket.status === 'Booked' ? 'Scheduled' : ticket.status,
            note: null,
            contractId: null
          }
        }));

      setSchedules([...mappedSchedules, ...mappedAmenities]);
    } catch (error) {
      console.error('Failed to fetch schedules:', error);
      setSchedules([]);
    }
  }, [calendarMonth, calendarSelectedDate, calendarViewMode, calendarDayCount, accountId]);

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
              selectedStaffId={selectedStaffId}
              onStaffSelect={setSelectedStaffId}
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
            selectedStaffId={selectedStaffId}
            onStaffSelect={setSelectedStaffId}
          />
        ) : (
          <CalendarDayView
            dayCursor={calendarSelectedDate}
            dayCount={calendarDayCount}
            onDayChange={handleSelectedDateChange}
            monthCursor={calendarMonth}
            schedules={displaySchedules}
            selectedStaffId={selectedStaffId}
            onStaffSelect={setSelectedStaffId}
          />
        )}
      </div>
    </div>
  );
};
