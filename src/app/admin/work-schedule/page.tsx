'use client';

import React from 'react';

import { WorkScheduleHeader } from './components/WorkScheduleHeader';
import { SummaryIcon, TimelineIcon, BoardIcon, CalendarIcon, ListIcon, FormsIcon } from './components/TabIcons';
import { WorkScheduleControlPanel } from './components/WorkScheduleControlPanel';
import { WorkScheduleList } from './components/WorkScheduleList';

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
          />
          <WorkScheduleList />
        </>
      )}


    </div>
  );
}
