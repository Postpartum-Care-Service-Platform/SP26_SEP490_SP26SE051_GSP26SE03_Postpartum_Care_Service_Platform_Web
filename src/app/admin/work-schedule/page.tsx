'use client';

import React from 'react';

import { WorkScheduleHeader } from './components/WorkScheduleHeader';
import { SummaryIcon, TimelineIcon, BoardIcon, CalendarIcon, ListIcon, FormsIcon } from './components/TabIcons';
import { WorkScheduleControlPanel } from './components/WorkScheduleControlPanel';
import { WorkScheduleList } from './components/list/WorkScheduleList';
import { WorkScheduleDetailView } from './components/WorkScheduleDetailView';
import { CalendarControlPanel } from './components/calendar/CalendarControlPanel';
import { CalendarMonthView } from './components/calendar/CalendarMonthView';
import { CalendarWeekView } from './components/calendar/CalendarWeekView';
import { BoardControlPanel } from './components/board/BoardControlPanel';
import { BoardView } from './components/board/BoardView';
import { TimelineControlPanel } from './components/timeline/TimelineControlPanel';
import { TimelineView } from './components/timeline/TimelineView';
import type { CalendarViewMode } from './components/calendar/CalendarViewDropdown';
import type { CalendarStatusType } from './components/calendar/CalendarStatusDropdown';
import { TASK_TYPES, type TaskType } from './components/TaskTypePicker';

const tabs = [
  { key: 'summary', label: 'Tổng quan', icon: <SummaryIcon /> },
  { key: 'timeline', label: 'Dòng thời gian', icon: <TimelineIcon /> },
  { key: 'board', label: 'Bảng', icon: <BoardIcon /> },
  { key: 'calendar', label: 'Lịch', icon: <CalendarIcon /> },
  { key: 'list', label: 'Danh sách', icon: <ListIcon /> },
  { key: 'forms', label: 'Biểu mẫu', icon: <FormsIcon /> },
];

export default function WorkSchedulePage() {
  const [activeTab, setActiveTab] = React.useState(tabs[4].key); // Default to 'list'
  const [searchQuery, setSearchQuery] = React.useState('');
  const [viewMode, setViewMode] = React.useState<'list' | 'table'>('table');
  const [assigneeOnly, setAssigneeOnly] = React.useState(false);
  const [timelineAssigneeOnly, setTimelineAssigneeOnly] = React.useState(false);

  // Calendar State
  const [calendarMonth, setCalendarMonth] = React.useState(() => {
    const d = new Date();
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [calendarViewMode, setCalendarViewMode] = React.useState<CalendarViewMode>('Month');
  const [calendarStatus, setCalendarStatus] = React.useState<CalendarStatusType>('TO DO');
  const [calendarTaskType, setCalendarTaskType] = React.useState<TaskType | null>(TASK_TYPES[TASK_TYPES.length - 1]);

  return (
    <div>
      <WorkScheduleHeader
        title="Lịch làm việc"
        breadcrumbs={[
          { label: 'Quản trị', href: '/admin' },
          { label: 'Lịch làm việc' },
        ]}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

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
          {viewMode === 'list' ? <WorkScheduleList assigneeOnly={assigneeOnly} /> : <WorkScheduleDetailView />}
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
          />
          {calendarViewMode === 'Month' ? (
            <CalendarMonthView monthCursor={calendarMonth} />
          ) : (
            <CalendarWeekView monthCursor={calendarMonth} />
          )}
        </>
      )}

    </div>
  );
}
