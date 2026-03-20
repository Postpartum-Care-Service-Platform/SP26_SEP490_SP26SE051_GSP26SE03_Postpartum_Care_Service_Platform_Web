import { 
  LayoutDashboard, 
  CalendarDays, 
  Calendar, 
  Users, 
  FileText, 
  Activity,
  MessageCircle,
  BedDouble,
  MessageSquare,
  ClipboardCheck,
  Utensils,
  Package,
  Sparkles,
  Ticket,
  CreditCard,
  UserCircle
} from 'lucide-react';

export type ManagerNavItem = {
  key: string;
  label: string;
  href?: string;
  icon?: React.ComponentType<{ size?: number | string; className?: string }>;
  children?: Array<{ key: string; label: string; href: string }>;
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
        key: 'account-overview',
        label: 'Tổng quan tài khoản',
        href: '/manager/account-overview',
        icon: UserCircle,
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
        key: 'care-plan-detail',
        label: 'Chi tiết kế hoạch chăm sóc',
        href: '/manager/care-plan-detail',
        icon: ClipboardCheck,
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
          },
          {
            key: 'menu-record',
            label: 'Bản ghi thực đơn',
            href: '/manager/menu-record',
          },
        ],
      },
      {
        key: 'package',
        label: 'Gói dịch vụ',
        href: '/manager/package',
        icon: Package,
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
];
