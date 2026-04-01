import React from 'react';
import {
  Activity,
  BedDouble,
  BookOpen,
  Calendar,
  CalendarDays,
  ClipboardCheck,
  CreditCard,
  FileText,
  History,
  LayoutDashboard,
  MessageCircle,
  MessageSquare,
  Package,
  Settings,
  Settings2,
  ShieldCheck,
  Sparkles,
  Ticket,
  UserCircle,
  Users,
  Utensils
} from 'lucide-react';

export type ManagerNavItem = {
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

export type ManagerNavSection = {
  key: string;
  label?: string;
  items: ManagerNavItem[];
};

export const managerNav: ManagerNavSection[] = [
  {
    key: 'main',
    label: 'Chính',
    items: [
      {
        key: 'dashboard',
        label: 'Bảng điều khiển',
        href: '/manager',
        icon: LayoutDashboard,
      },
      {
        key: 'patients',
        label: 'Khách hàng',
        href: '/manager/customers',
        icon: Users,
      },
      {
        key: 'chat',
        label: 'Trò chuyện',
        href: '/manager/chat',
        icon: MessageCircle,
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
        href: '/manager/appointment',
        icon: Calendar,
      },
      {
        key: 'room-allotment',
        label: 'Tất cả phòng',
        href: '/manager/rooms/allotment',
        icon: BedDouble,
      },
      {
        key: 'booking',
        label: 'Đặt phòng',
        href: '/manager/booking',
        icon: CalendarDays,
      },
      {
        key: 'contract',
        label: 'Hợp đồng',
        href: '/manager/contract',
        icon: FileText,
      },
      {
        key: 'feedback',
        label: 'Phản hồi',
        href: '/manager/feedback',
        icon: MessageSquare,
      },
    ],
  },
  {
    key: 'finance',
    label: 'Tài chính',
    items: [
      {
        key: 'transaction',
        label: 'Giao dịch',
        href: '/manager/transaction',
        icon: CreditCard,
      },
    ],
  },
  {
    key: 'management',
    label: 'Quản lý',
    items: [
      {
        key: 'menu-management',
        label: 'Quản lý thực đơn',
        icon: Utensils,
        children: [
          {
            key: 'menu',
            label: 'Thực đơn',
            href: '/manager/menu',
            icon: BookOpen,
          },
          {
            key: 'menu-record',
            label: 'Bản ghi thực đơn',
            href: '/manager/menu-record',
            icon: History,
          },
        ],
      },
      {
        key: 'package-management',
        label: 'Quản lý gói dịch vụ',
        icon: Package,
        children: [
          {
            key: 'package',
            label: 'Danh sách gói',
            href: '/manager/package',
            icon: Package,
          },
          {
            key: 'package-activities',
            label: 'Hoạt động gói',
            href: '/manager/package-activities',
            icon: ClipboardCheck,
          },
        ],
      },
      {
        key: 'amenity-service',
        label: 'Tiện ích',
        href: '/manager/amenity-service',
        icon: Sparkles,
      },
      {
        key: 'amenity-ticket',
        label: 'Vé tiện ích',
        href: '/manager/amenity-ticket',
        icon: Ticket,
      },
      {
        key: 'activity',
        label: 'Hoạt động',
        href: '/manager/activity',
        icon: Activity,
      },
      {
        key: 'work-schedule',
        label: 'Lịch làm việc',
        href: '/manager/work-schedule',
        icon: CalendarDays,
      },
    ],
  },
  {
    key: 'settings',
    label: 'Cài đặt',
    items: [
      {
        key: 'types-config',
        label: 'Cấu hình danh mục',
        href: '/manager/types-config',
        icon: Settings2,
      },
      {
        key: 'system-settings',
        label: 'Cài đặt hệ thống',
        href: '/manager/settings/system',
        icon: Settings,
      },
      {
        key: 'roles-privileges',
        label: 'Vai trò & Quyền',
        href: '/manager/settings/roles',
        icon: ShieldCheck,
      },
    ],
  },
];
