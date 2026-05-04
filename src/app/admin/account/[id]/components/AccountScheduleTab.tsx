'use client';

import { format, startOfWeek, endOfWeek } from 'date-fns';
import React from 'react';

import { CalendarControlPanel } from '@/app/admin/work-schedule/components/calendar/CalendarControlPanel';
import { CalendarDayView } from '@/app/admin/work-schedule/components/calendar/CalendarDayView';
import { CalendarMonthView } from '@/app/admin/work-schedule/components/calendar/CalendarMonthView';
import { CalendarWeekView } from '@/app/admin/work-schedule/components/calendar/CalendarWeekView';
import { TASK_TYPES } from '@/app/admin/work-schedule/components/TaskTypePicker';

import amenityTicketService from '@/services/amenity-ticket.service';
import contractService, { type StaffSchedule as StaffListMember } from '@/services/contract.service';
import familyScheduleService from '@/services/family-schedule.service';
import { getStaffsByFamilyScheduleId } from '@/services/staffScheduleService';
import userService from '@/services/user.service';
import type { Account } from '@/types/account';
import type { TaskType } from '@/app/admin/work-schedule/components/TaskTypePicker';
import type { CalendarStatusType } from '@/app/admin/work-schedule/components/calendar/CalendarStatusDropdown';
import type { CalendarViewMode } from '@/app/admin/work-schedule/components/calendar/CalendarViewDropdown';
import type { AmenityTicket } from '@/types/amenity-ticket';
import type { FamilyScheduleItem } from '@/types/family-schedule';
import type { StaffSchedule } from '@/types/staff-schedule';
import type { Assignee } from '@/app/admin/work-schedule/components/shared/AssigneePicker';
import type { AmenityService } from '@/types/amenity-service';
import type { Activity } from '@/types/activity';

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
  const [selectedAmenity, setSelectedAmenity] = React.useState<AmenityService | null>(null);
  const [selectedActivity, setSelectedActivity] = React.useState<Activity | null>(null);
  const [familyStaff, setFamilyStaff] = React.useState<Assignee[]>([]);
  const [accounts, setAccounts] = React.useState<Account[]>([]);
  const [amenityStaff, setAmenityStaff] = React.useState<{ id: string; fullName: string }[]>([]);
  const [staffList, setStaffList] = React.useState<StaffListMember[]>([]);

  // Fetch all accounts to resolve IDs to names (for tooltips)
  React.useEffect(() => {
    userService.getAllAccounts().then(data => setAccounts(Array.isArray(data) ? data : []));
    amenityTicketService.getAllStaff().then(data => setAmenityStaff(Array.isArray(data) ? data : []));
    contractService.getStaffSchedules().then(data => setStaffList(Array.isArray(data) ? data : []));
  }, []);

  // Fetch-related state update: Filter and collect all unique staff from current schedules
  React.useEffect(() => {
    if (schedules.length > 0) {
      const allStaff = new Map<string, Assignee>();
      schedules.forEach((s) => {
        if (s.staffId && s.staffName && s.staffName !== 'Chưa phân công' && s.staffName !== 'Tiện ích') {
          allStaff.set(s.staffId, {
            id: s.staffId,
            name: s.staffName,
            avatarUrl: s.staffAvatar,
            type: 'user',
          });
        }
      });
      const staffArray = Array.from(allStaff.values()).filter((s) => s.name && s.name.trim().length > 0);
      setFamilyStaff(staffArray);
    }
  }, [schedules]);

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
      const mappedSchedules: StaffSchedule[] = Array.isArray(data) ? data.map(item => {
        // Initial values from staffSchedules
        let staffName = item.staffSchedules?.[0]?.staffName || '';
        let staffId = item.staffSchedules?.[0]?.staffId || '';
        let staffAvatar = item.staffSchedules?.[0]?.staffAvatar || null;

        // Extract REAL staff name from note if it was completed via Amenity Flow
        // This takes precedence for completed amenity tasks
        if (item.note && (item.note.includes('hoàn thành bởi nhân viên') || item.note.includes('bởi nhân viên'))) {
          const match = item.note.match(/(?:hoàn thành bởi nhân viên|bởi nhân viên)\s*([a-f0-9-]+)/i);
          if (match && match[1]) {
            const realStaffId = match[1];
            const realStaff = accounts.find(a => a.id === realStaffId);
            if (realStaff) {
              staffName = realStaff.ownerProfile?.fullName || realStaff.username || realStaff.email || 'Nhân viên';
              staffId = realStaffId;
              staffAvatar = realStaff.avatarUrl || null;
            } else {
              // Try searching in amenity staff list
              const amStaff = amenityStaff.find(s => s.id === realStaffId);
              if (amStaff) {
                staffName = amStaff.fullName;
                staffId = realStaffId;
              }
            }
          }
        }

        // If still no staffName but we have a staffId from the object or schedules, try lookups
        if ((!staffName || staffName === 'Tiện ích' || staffName === 'Chưa phân công') && staffId) {
          // 1. Try staffList (most reliable for staff)
          const sInfo = staffList.find(s => s.id === staffId);
          if (sInfo) {
            staffName = sInfo.fullName;
          } else {
            // 2. Try accounts
            const acc = accounts.find(a => a.id === staffId);
            if (acc) {
              staffName = acc.ownerProfile?.fullName || acc.username || acc.email;
              staffAvatar = acc.avatarUrl || null;
            } else {
              // 3. Try amenityStaff
              const amStaff = amenityStaff.find(s => s.id === staffId);
              if (amStaff) {
                staffName = amStaff.fullName;
              }
            }
          }
        }

        return {
          id: item.id,
          staffId,
          staffName: staffName || 'Chưa phân công',
          staffFullName: staffName || 'Chưa phân công',
          staffAvatar,
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
            contractId: null,
            amenityServiceId: item.amenityServiceId,
            title: item.title
          }
        };
      }) : [];

      // FETCH AMENITY TICKETS (TIỆN ÍCH)
      const amenityData = await amenityTicketService.getAmenityTicketsByCustomerId(accountId).catch(err => {
        console.warn('Failed to fetch amenity tickets:', err);
        return [] as AmenityTicket[];
      });

      // Map AmenityTicket[] to StaffSchedule[]
      const mappedAmenities: StaffSchedule[] = amenityData
        .filter(ticket => ticket.date >= from && ticket.date <= to)
        .map(ticket => {
          const ticketStaff = ticket.staffId ? (accounts.find(a => a.id === ticket.staffId) || amenityStaff.find(s => s.id === ticket.staffId)) : null;
          let staffName = 'Tiện ích';
          let staffAvatar = null;

          if (ticketStaff) {
            if ('fullName' in ticketStaff) {
              staffName = ticketStaff.fullName;
            } else {
              staffName = ticketStaff.ownerProfile?.fullName || ticketStaff.username || ticketStaff.email;
              staffAvatar = ticketStaff.avatarUrl || null;
            }
          }

          return {
            id: -ticket.id, // Negative to avoid collision
            staffId: ticket.staffId || '',
            staffName: staffName,
            staffFullName: staffName,
            staffAvatar: staffAvatar,
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
              contractId: null,
              amenityServiceId: ticket.amenityServiceId || null,
              title: `Dịch vụ tiện ích (${ticket.status})`
            }
          };
        });

      setSchedules([...mappedSchedules, ...mappedAmenities]);
    } catch (error) {
      console.error('Failed to fetch schedules:', error);
      setSchedules([]);
    }
  }, [calendarMonth, calendarSelectedDate, calendarViewMode, calendarDayCount, accountId, accounts, amenityStaff]);

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
    let filtered = schedules;

    if (calendarStatus) {
      const targetStatus = calendarStatus.toLowerCase();
      filtered = filtered.filter((s) => {
        const status = s.familyScheduleResponse?.status?.toLowerCase();
        return status === targetStatus;
      });
    }

    if (selectedStaffId) {
      filtered = filtered.filter((s) => s.staffId === selectedStaffId);
    }

    if (selectedAmenity) {
      filtered = filtered.filter((s) => s.familyScheduleResponse?.amenityServiceId === selectedAmenity.id);
    }

    if (selectedActivity) {
      const q = selectedActivity.name.trim().toLowerCase();
      filtered = filtered.filter((s) => {
        const act = s.familyScheduleResponse?.activity?.trim().toLowerCase() || '';
        const title = s.familyScheduleResponse?.title?.trim().toLowerCase() || '';
        return act.includes(q) || title.includes(q);
      });
    }

    return filtered;
  }, [schedules, calendarStatus, selectedStaffId, selectedAmenity, selectedActivity]);

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
        customStaffList={familyStaff}
        assigneeValue={familyStaff.find(s => s.id === selectedStaffId) || null}
        onAssigneeChange={(a) => setSelectedStaffId(a?.id || null)}
        amenityValue={selectedAmenity}
        onAmenityChange={(a) => setSelectedAmenity(a)}
        activityValue={selectedActivity}
        onActivityChange={(a) => setSelectedActivity(a)}
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
