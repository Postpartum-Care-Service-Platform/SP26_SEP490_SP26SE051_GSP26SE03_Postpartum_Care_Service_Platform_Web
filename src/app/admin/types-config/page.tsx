'use client';

import { Bell, CalendarCheck, MessageSquare, Package, UserCircle2, Utensils } from 'lucide-react';
import React from 'react';

import AdminAppointmentTypePage from '../appointment-type/page';
import AdminFeedbackTypesPage from '../feedback-type/page';
import AdminMenuTypePage from '../menu-type/page';
import AdminNotificationPage from '../notification/page';
import AdminPackagePage from '../package/page';
import AdminRoomsPage from '../rooms/page';
import { WorkScheduleHeader } from '../work-schedule/components/WorkScheduleHeader';

import { TypesConfigControlPanel } from './TypesConfigControlPanel';

const tabs = [
  { key: 'overview', label: 'Tổng quan', icon: undefined },
  { key: 'appointment-types', label: 'Loại lịch hẹn', icon: <CalendarCheck size={16} /> },
  { key: 'menu-types', label: 'Loại thực đơn', icon: <Utensils size={16} /> },
  { key: 'feedback-types', label: 'Loại phản hồi', icon: <MessageSquare size={16} /> },
  { key: 'member-types', label: 'Loại thành viên', icon: <UserCircle2 size={16} /> },
  { key: 'notification-types', label: 'Loại thông báo', icon: <Bell size={16} /> },
  { key: 'package-types', label: 'Loại gói dịch vụ', icon: <Package size={16} /> },
  { key: 'room-types', label: 'Loại phòng', icon: <Package size={16} /> },
];

export default function AdminTypesConfigPage() {
  const [activeTab, setActiveTab] = React.useState<string>(tabs[0].key);

  return (
    <div>
      <WorkScheduleHeader
        title="Cấu hình danh mục"
        breadcrumbs={[{ label: 'Cấu hình danh mục' }]}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'overview' && <TypesConfigControlPanel />}
      {activeTab === 'appointment-types' && <AdminAppointmentTypePage />}
      {activeTab === 'menu-types' && <AdminMenuTypePage />}
      {activeTab === 'feedback-types' && <AdminFeedbackTypesPage />}
      {activeTab === 'notification-types' && <AdminNotificationPage />}
      {activeTab === 'package-types' && <AdminPackagePage />}
      {activeTab === 'room-types' && <AdminRoomsPage />}
      {activeTab === 'member-types' && (
        <div style={{ padding: 16 }}>
          Chức năng loại thành viên đang được phát triển.
        </div>
      )}
    </div>
  );
}

