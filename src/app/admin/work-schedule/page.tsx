'use client';

import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  isSameDay, 
  isSameMonth, 
  addMonths, 
  subMonths 
} from 'date-fns';
import React from 'react';

import { BoardControlPanel } from './components/board/BoardControlPanel';
import { BoardView } from './components/board/BoardView';
import { CalendarControlPanel } from './components/calendar/CalendarControlPanel';
import { CalendarMonthView } from './components/calendar/CalendarMonthView';
import { CalendarWeekView } from './components/calendar/CalendarWeekView';
import { CalendarDayView } from './components/calendar/CalendarDayView';
import { WorkScheduleList } from './components/list/WorkScheduleList';
import { SummaryIcon, TimelineIcon, BoardIcon, CalendarIcon, ListIcon } from './components/TabIcons';
import { TASK_TYPES, type TaskType } from './components/TaskTypePicker';
import type { Assignee } from './components/shared/AssigneePicker';
import { TimelineControlPanel } from './components/timeline/TimelineControlPanel';
import { TimelineView } from './components/timeline/TimelineView';
import { WorkScheduleControlPanel } from './components/WorkScheduleControlPanel';
import { WorkScheduleDetailView } from './components/WorkScheduleDetailView';
import { WorkScheduleHeader } from './components/WorkScheduleHeader';
import { WorkScheduleOverview } from './components/WorkScheduleOverview';
import { WorkScheduleStatusOverview } from './components/WorkScheduleStatusOverview';
import { ScheduleModal } from './components/ScheduleModal';

import type { CalendarStatusType } from './components/calendar/CalendarStatusDropdown';
import type { CalendarViewMode } from './components/calendar/CalendarViewDropdown';
import contractService, { type StaffSchedule as StaffListMember } from '@/services/contract.service';
import staffScheduleService from '@/services/staff-schedule.service';
import type { StaffSchedule, StaffScheduleAllResponse } from '@/types/staff-schedule';


const tabs = [
  { key: 'summary', label: 'Tóm tắt', icon: <SummaryIcon /> },
  { key: 'timeline', label: 'Dòng thời gian', icon: <TimelineIcon /> },
  { key: 'calendar', label: 'Lịch', icon: <CalendarIcon /> },
];

const flattenSchedules = (res: StaffScheduleAllResponse[]): StaffSchedule[] => {
  const result: StaffSchedule[] = [];
  res.forEach(staff => {
    staff.bookings?.forEach(booking => {
      booking.activities?.forEach(activity => {
        result.push({
          id: activity.staffScheduleId,
          staffId: staff.staffId,
          staffName: staff.staffFullName,
          staffAvatar: staff.staffAvatar,
          roomId: booking.roomId,
          roomName: booking.roomName,
          managerId: activity.managerId,
          managerName: activity.managerName,
          familyScheduleId: activity.familyScheduleId,
          isChecked: activity.isChecked,
          checkedAt: activity.checkedAt,
          familyScheduleResponse: {
            id: activity.familyScheduleId,
            customerId: booking.customerId,
            customerName: booking.customerName,
            customerAvatar: booking.customerAvatar,
            packageId: booking.packageId,
            packageName: booking.packageName,
            workDate: activity.workDate,
            startTime: activity.startTime,
            endTime: activity.endTime,
            dayNo: activity.dayNo,
            activity: activity.activity,
            target: activity.target,
            status: activity.status,
            note: activity.note,
            contractId: null
          }
        });
      });
    });
  });
  return result;
};

export default function WorkSchedulePage() {
  const [activeTab, setActiveTab] = React.useState(tabs[0].key); // Default to 'summary'
  const [searchQuery, setSearchQuery] = React.useState('');
  const [viewMode, setViewMode] = React.useState<'list' | 'table'>('table');
  const [assigneeOnly, setAssigneeOnly] = React.useState(false);
  const [timelineAssigneeOnly, setTimelineAssigneeOnly] = React.useState(false);
  const [selectedStaffId, setSelectedStaffId] = React.useState<string | null>(null);
  const [selectedAssignee, setSelectedAssignee] = React.useState<Assignee | null>(null);

  const handleSelectStaff = React.useCallback((staffId: string | null) => {
    setSelectedStaffId(staffId);
    setSelectedAssignee(null);
    setActiveTab('calendar');
  }, []);


  const handleAssigneeChange = React.useCallback((assignee: Assignee | null) => {
    setSelectedAssignee(assignee);
    setSelectedStaffId(assignee?.id ?? null);
  }, []);

  React.useEffect(() => {
    if (activeTab === 'list') {
      setViewMode('table');
    }
  }, [activeTab]);

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
  const [calendarStatus, setCalendarStatus] = React.useState<CalendarStatusType>(null);
  const [calendarTaskType, setCalendarTaskType] = React.useState<TaskType | null>(TASK_TYPES[TASK_TYPES.length - 1]);
  const [schedules, setSchedules] = React.useState<StaffSchedule[]>([]);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = React.useState(false);
  const [staffList, setStaffList] = React.useState<StaffListMember[]>([]);

  React.useEffect(() => {
    const loadStaff = async () => {
      try {
        const list = await contractService.getStaffSchedules();
        setStaffList(list);
      } catch (e) {
        console.error('Failed to load staff list:', e);
      }
    };
    loadStaff();
  }, []);

  const fetchSchedules = React.useCallback(async () => {
    try {
      let from: string, to: string;
      if (activeTab === 'calendar') {
        const start = startOfMonth(calendarMonth);
        const end = addDays(start, 45); // Approximate buffer
        from = format(start, 'yyyy-MM-dd');
        to = format(end, 'yyyy-MM-dd');
      } else {
        const start = startOfWeek(new Date(), { weekStartsOn: 1 });
        const end = addDays(start, 30);
        from = format(start, 'yyyy-MM-dd');
        to = format(end, 'yyyy-MM-dd');
      }

      // If a specific staff is selected, we might still want to filter on the frontend 
      // or use the specific API if available. For now, let's use the all-schedules for everything.
      const rawData = await staffScheduleService.getAllSchedules(from, to);
      let flattened = flattenSchedules(rawData);
      
      // Frontend filter by staff if selected
      if (selectedStaffId) {
        flattened = flattened.filter((s: StaffSchedule) => s.staffId === selectedStaffId);
      }

      setSchedules(flattened);
    } catch (e) {
      console.error('Failed to fetch schedules:', e);
    }
  }, [activeTab, calendarMonth, selectedStaffId]);

  // Fetch schedules when relevant state changes
  React.useEffect(() => {
    if (activeTab === 'calendar') {
      fetchSchedules();
    }
  }, [activeTab, selectedStaffId, calendarViewMode, calendarDayCount, calendarSelectedDate, calendarMonth, fetchSchedules]);

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
    // Chuyển calendar lớn đến tháng của ngày được chọn
    const month = new Date(date);
    month.setDate(1);
    month.setHours(0, 0, 0, 0);
    setCalendarMonth(month);
  }, []);

  const filteredSchedules = React.useMemo(() => {
    if (!calendarStatus) return schedules;
    return schedules.filter(
      (schedule) => schedule.familyScheduleResponse.status === calendarStatus
    );
  }, [schedules, calendarStatus]);

  return (
    <div className="flex flex-col flex-1 h-full min-h-0">
      <div className="flex-shrink-0">
        <WorkScheduleHeader
          breadcrumbs={[
            { label: 'Lịch làm việc' },
          ]}
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {activeTab === 'summary' && (
          <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
            <WorkScheduleOverview />
            <WorkScheduleStatusOverview />
          </div>
        )}

        {activeTab === 'list' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <WorkScheduleControlPanel 
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              assigneeOnly={assigneeOnly}
              onAssigneeOnlyChange={setAssigneeOnly}
            />
            <div style={{ flex: 1, overflow: 'auto' }}>
              {viewMode === 'table' ? (
                <WorkScheduleList onSelectStaff={handleSelectStaff} />
              ) : (
                <WorkScheduleDetailView />
              )}
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <TimelineControlPanel 
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              assigneeOnly={timelineAssigneeOnly}
              onAssigneeOnlyChange={setTimelineAssigneeOnly}
              staffList={staffList}
              assigneeValue={selectedAssignee}
              onAssigneeChange={handleAssigneeChange}
            />
            <div style={{ flex: 1, overflow: 'auto' }}>
              <TimelineView />
            </div>
          </div>
        )}

        {activeTab === 'board' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <BoardControlPanel 
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
            />
            <div style={{ flex: 1, overflow: 'auto' }}>
              <BoardView />
            </div>
          </div>
        )}

        {activeTab === 'calendar' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
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
              assigneeValue={selectedAssignee}
              onAssigneeChange={handleAssigneeChange}
              staffList={staffList}
              taskType={calendarTaskType}
              onTaskTypeChange={setCalendarTaskType}
              onTodayClick={handleTodayClick}
              selectedDate={calendarSelectedDate}
              onSelectedDateChange={handleSelectedDateChange}
              onSchedule={() => setIsScheduleModalOpen(true)}
            />
            <div style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
              {calendarViewMode === 'Month' ? (
                <div style={{ height: '100%', overflow: 'auto' }}>
                  <CalendarMonthView 
                    monthCursor={calendarMonth} 
                    selectedDate={calendarSelectedDate}
                    onSelectedDateChange={handleSelectedDateChange}
                    schedules={filteredSchedules}
                    selectedStaffId={selectedStaffId}
                    onStaffSelect={handleSelectStaff}
                  />
                </div>
              ) : calendarViewMode === 'Week' ? (
                <CalendarWeekView 
                  weekCursor={calendarSelectedDate} 
                  schedules={filteredSchedules}
                  onDateChange={handleSelectedDateChange}
                  onEventCreated={() => {
                    void fetchSchedules();
                  }}
                  selectedStaffId={selectedStaffId}
                  onStaffSelect={handleSelectStaff}
                />
              ) : (
                <CalendarDayView 
                  dayCursor={calendarSelectedDate}
                  dayCount={calendarDayCount}
                  onDayChange={handleSelectedDateChange}
                  monthCursor={calendarMonth} 
                  schedules={filteredSchedules}
                  selectedStaffId={selectedStaffId}
                  onStaffSelect={handleSelectStaff}
                />
              )}
            </div>
          </div>
        )}
      </div>
      <ScheduleModal 
        open={isScheduleModalOpen}
        onOpenChange={setIsScheduleModalOpen}
      />
    </div>
  );
}
