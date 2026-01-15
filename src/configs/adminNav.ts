import { LayoutDashboard, Users, MessageCircle, Calendar, BedDouble, PlusCircle, MessageSquare } from 'lucide-react';

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
        href: '/admin/feedback',
        icon: MessageSquare,
      },
    ],
  },
];

