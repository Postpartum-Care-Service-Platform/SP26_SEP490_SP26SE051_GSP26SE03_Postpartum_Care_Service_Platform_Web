import {
  Calendar,
  CalendarDays,
  LayoutDashboard,
  MessageCircle,
  Bell,
  BedDouble,
  FileText,
  MessageSquare,
} from 'lucide-react';

export type ReceptionistNavItem = {
  key: string;
  label: string;
  href?: string;
  icon?: React.ComponentType<{ size?: number | string; className?: string }>;
  children?: Array<{ 
    key: string; 
    label: string; 
    href: string;
    icon?: React.ComponentType<{ size?: number | string; className?: string }>;
  }>;
};

export type ReceptionistNavSection = {
  key: string;
  label?: string;
  items: ReceptionistNavItem[];
};

export const receptionistNav: ReceptionistNavSection[] = [
  {
    key: 'main',
    label: 'Chính',
    items: [
      {
        key: 'dashboard',
        label: 'Bảng điều khiển',
        href: '/receptionist',
        icon: LayoutDashboard,
      },
      {
        key: 'chat',
        label: 'Trò chuyện',
        href: '/receptionist/chat',
        icon: MessageCircle,
      },
      {
        key: 'notification',
        label: 'Thông báo',
        href: '/receptionist/notification',
        icon: Bell,
      },
    ],
  },
  {
    key: 'operation',
    label: 'Nghiệp vụ',
    items: [
      {
        key: 'appointment',
        label: 'Lịch hẹn',
        href: '/receptionist/appointment',
        icon: Calendar,
      },
      {
        key: 'room-allotment',
        label: 'Tất cả phòng',
        href: '/receptionist/rooms/allotment',
        icon: BedDouble,
      },
      {
        key: 'booking',
        label: 'Đặt phòng',
        href: '/receptionist/booking',
        icon: CalendarDays,
      },
      {
        key: 'contract',
        label: 'Hợp đồng',
        href: '/receptionist/contract',
        icon: FileText,
      },
      {
        key: 'feedback',
        label: 'Phản hồi',
        href: '/receptionist/feedback',
        icon: MessageSquare,
      },
    ],
  },
];
