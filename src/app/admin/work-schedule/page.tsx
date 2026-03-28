'use client';

import { format, startOfWeek, endOfWeek } from 'date-fns';
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

import type { CalendarStatusType } from './components/calendar/CalendarStatusDropdown';
import type { CalendarViewMode } from './components/calendar/CalendarViewDropdown';
import staffScheduleService from '@/services/staff-schedule.service';
import type { StaffSchedule } from '@/types/staff-schedule';


const tabs = [
  { key: 'summary', label: 'Tổng quan', icon: <SummaryIcon /> },
  { key: 'timeline', label: 'Dòng thời gian', icon: <TimelineIcon /> },
  { key: 'board', label: 'Bảng', icon: <BoardIcon /> },
  { key: 'calendar', label: 'Lịch', icon: <CalendarIcon /> },
  { key: 'list', label: 'Danh sách', icon: <ListIcon /> },
];

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
      
      const data = await staffScheduleService.getStaffSchedule({ 
        staffId: selectedStaffId || undefined, 
        from, 
        to 
      });
      setSchedules(data);
    } catch (error) {
      console.error('Failed to fetch schedules:', error);
    }
  }, [calendarMonth, calendarSelectedDate, calendarViewMode, calendarDayCount, selectedStaffId]);

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
              taskType={calendarTaskType}
              onTaskTypeChange={setCalendarTaskType}
              onTodayClick={handleTodayClick}
              selectedDate={calendarSelectedDate}
              onSelectedDateChange={handleSelectedDateChange}
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
    </div>
  );
}
