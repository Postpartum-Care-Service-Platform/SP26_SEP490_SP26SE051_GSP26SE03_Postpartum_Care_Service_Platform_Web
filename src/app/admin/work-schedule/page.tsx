'use client';

import { format } from 'date-fns';
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
  const [calendarStatus, setCalendarStatus] = React.useState<CalendarStatusType>('TO DO');
  const [calendarTaskType, setCalendarTaskType] = React.useState<TaskType | null>(TASK_TYPES[TASK_TYPES.length - 1]);
  const [schedules, setSchedules] = React.useState<StaffSchedule[]>([]);

  // Fetch schedules when calendarMonth changes
  React.useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const year = calendarMonth.getFullYear();
        const month = calendarMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        const from = format(firstDay, 'yyyy-MM-dd');
        const to = format(lastDay, 'yyyy-MM-dd');
        
        // TODO: Replace with actual staffId
        const staffId = '40bbcefe-8a22-47c0-aa3e-9147db0e5a01';
        
        const data = await staffScheduleService.getStaffSchedule({ staffId, from, to });
        setSchedules(data);
      } catch (error) {
        console.error('Failed to fetch schedules:', error);
      }
    };
    
    if (activeTab === 'calendar') {
      fetchSchedules();
    }
  }, [calendarMonth, activeTab]);

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

  return (
    <div>
      <WorkScheduleHeader
        title="Lịch làm việc"
        breadcrumbs={[
          { label: 'Lịch làm việc' },
        ]}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'summary' && (
        <>
          <WorkScheduleOverview />
          <WorkScheduleStatusOverview />
        </>
      )}

      {activeTab === 'list' && (
        <>
          <WorkScheduleControlPanel 
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            assigneeOnly={assigneeOnly}
            onAssigneeOnlyChange={setAssigneeOnly}
          />
          {viewMode === 'table' ? <WorkScheduleList /> : <WorkScheduleDetailView />}
        </>
      )}

      {activeTab === 'timeline' && (
        <>
          <TimelineControlPanel 
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            assigneeOnly={timelineAssigneeOnly}
            onAssigneeOnlyChange={setTimelineAssigneeOnly}
          />
          <TimelineView />
        </>
      )}

      {activeTab === 'board' && (
        <>
          <BoardControlPanel 
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
          />
          <BoardView />
        </>
      )}

      {activeTab === 'calendar' && (
        <>
          <CalendarControlPanel 
            monthCursor={calendarMonth}
            onMonthCursorChange={setCalendarMonth}
            viewMode={calendarViewMode}
            onViewModeChange={setCalendarViewMode}
            statusValue={calendarStatus}
            onStatusChange={setCalendarStatus}
            taskType={calendarTaskType}
            onTaskTypeChange={setCalendarTaskType}
            onTodayClick={handleTodayClick}
          />
          {calendarViewMode === 'Month' ? (
            <CalendarMonthView 
              monthCursor={calendarMonth} 
              selectedDate={calendarSelectedDate}
              onSelectedDateChange={handleSelectedDateChange}
              schedules={schedules}
            />
          ) : calendarViewMode === 'Week' ? (
            <CalendarWeekView 
              monthCursor={calendarMonth} 
              schedules={schedules}
              onEventCreated={() => {
                // Refresh schedules after creating new event
                const fetchSchedules = async () => {
                  const year = calendarMonth.getFullYear();
                  const month = calendarMonth.getMonth();
                  const firstDay = new Date(year, month, 1);
                  const lastDay = new Date(year, month + 1, 0);
                  
                  const from = format(firstDay, 'yyyy-MM-dd');
                  const to = format(lastDay, 'yyyy-MM-dd');
                  
                  const staffId = '40bbcefe-8a22-47c0-aa3e-9147db0e5a01';
                  
                  const data = await staffScheduleService.getStaffSchedule({ staffId, from, to });
                  setSchedules(data);
                };
                fetchSchedules();
              }}
            />
          ) : (
            <CalendarDayView 
              dayCursor={calendarSelectedDate}
              onDayChange={handleSelectedDateChange}
              monthCursor={calendarMonth} 
              schedules={schedules}
            />
          )}
        </>
      )}

    </div>
  );
}
