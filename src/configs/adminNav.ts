import { LayoutDashboard, Users, MessageCircle, Calendar, BedDouble, PlusCircle, MessageSquare, FileText, Utensils, ClipboardList, Package, Bell, Activity, ClipboardCheck } from 'lucide-react';

export type AdminNavItem = {
  key: string;
  label: string;
  href?: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  children?: Array<{ key: string; label: string; href: string }>;
};

export type AdminNavSection = {
  key: string;
  label?: string;
  items: AdminNavItem[];
};

export const adminNav: AdminNavSection[] = [
  {
    key: 'main',
    items: [
      {
        key: 'dashboard',
        label: 'Bảng điều khiển',
        href: '/admin',
        icon: LayoutDashboard,
      },
      {
        key: 'patients',
        label: 'Tài khoản',
        href: '/admin/account',
        icon: Users,
      },
      {
        key: 'chat',
        label: 'Trò chuyện',
        href: '/admin/chat',
        icon: MessageCircle,
      },
      {
        key: 'appointment',
        label: 'Lịch hẹn',
        href: '/admin/appointment',
        icon: Calendar,
      },
      {
        key: 'appointment-overview',
        label: 'Tổng quan lịch hẹn',
        href: '/admin/appointment/overview',
        icon: Calendar,
      },
      {
        key: 'rooms-all',
        label: 'Tất cả phòng',
        href: '/admin/rooms',
        icon: BedDouble,
      },
      {
        key: 'room-allotment',
        label: 'Thêm phân bổ phòng',
        href: '/admin/rooms/allotment',
        icon: PlusCircle,
      },
      {
        key: 'feedback',
        label: 'Phản hồi',
        icon: MessageSquare,
        children: [
          {
            key: 'feedback-list',
            label: 'Danh sách phản hồi',
            href: '/admin/feedback',
          },
          {
            key: 'feedback-types',
            label: 'Loại phản hồi',
            href: '/admin/feedback-type',
          },
        ],
      },
      {
        key: 'contract',
        label: 'Hợp đồng',
        href: '/admin/contract',
        icon: FileText,
      },
      {
        key: 'food',
        label: 'Món ăn',
        href: '/admin/food',
        icon: Utensils,
      },
      {
        key: 'menu',
        label: 'Thực đơn',
        href: '/admin/menu',
        icon: ClipboardList,
      },
      {
        key: 'package',
        label: 'Gói dịch vụ',
        href: '/admin/package',
        icon: Package,
      },
      {
        key: 'activity',
        label: 'Hoạt động',
        href: '/admin/activity',
        icon: Activity,
      },
      {
        key: 'care-plan-detail',
        label: 'Chi tiết kế hoạch chăm sóc',
        href: '/admin/care-plan-detail',
        icon: ClipboardCheck,
      },
      {
        key: 'notification',
        label: 'Thông báo',
        href: '/admin/notification',
        icon: Bell,
      },
    ],
  },
];

