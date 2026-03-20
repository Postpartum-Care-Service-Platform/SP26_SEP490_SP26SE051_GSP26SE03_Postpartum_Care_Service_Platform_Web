'use client';

import { Activity, Bell, CalendarCheck, CreditCard, MessageSquare, Package, UserCircle2, Utensils } from 'lucide-react';
import React from 'react';

import AdminActivityTypePage from '../activity-type/page';
import AdminAppointmentTypePage from '../appointment-type/page';
import AdminFeedbackTypesPage from '../feedback-type/page';
import AdminMemberTypePage from '../member-type/page';
import AdminMenuTypePage from '../menu-type/page';
import AdminNotificationPage from '../notification/page';
import AdminNotificationTypePage from '../notification-type/page';
import AdminPackageTypePage from '../package-type/page';
import AdminPaymentTypePage from '../payment-type/page';
import AdminRoomsPage from '../rooms/page';
import { WorkScheduleHeader } from '../work-schedule/components/WorkScheduleHeader';

const tabs = [
  { key: 'appointment-types', label: 'Loại lịch hẹn', icon: <CalendarCheck size={16} /> },
  { key: 'activity-types', label: 'Loại hoạt động', icon: <Activity size={16} /> },
  { key: 'menu-types', label: 'Loại thực đơn', icon: <Utensils size={16} /> },
  { key: 'feedback-types', label: 'Loại phản hồi', icon: <MessageSquare size={16} /> },
  { key: 'member-types', label: 'Loại thành viên', icon: <UserCircle2 size={16} /> },
  { key: 'notification-types', label: 'Loại thông báo', icon: <Bell size={16} /> },
  { key: 'package-types', label: 'Loại gói dịch vụ', icon: <Package size={16} /> },
  { key: 'room-types', label: 'Loại phòng', icon: <Package size={16} /> },
  { key: 'payment-types', label: 'Loại thanh toán', icon: <CreditCard size={16} /> },
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

      {activeTab === 'appointment-types' && <AdminAppointmentTypePage />}
      {activeTab === 'activity-types' && <AdminActivityTypePage />}
      {activeTab === 'menu-types' && <AdminMenuTypePage />}
      {activeTab === 'feedback-types' && <AdminFeedbackTypesPage />}
      {activeTab === 'member-types' && <AdminMemberTypePage />}
      {activeTab === 'notification-types' && <AdminNotificationTypePage />}
      {activeTab === 'package-types' && <AdminPackageTypePage />}
      {activeTab === 'room-types' && <AdminRoomsPage />}
      {activeTab === 'payment-types' && <AdminPaymentTypePage />}
    </div>
  );
}
