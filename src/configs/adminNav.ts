import {
  Activity,
  BedDouble,
  Bell,
  Calendar,
  CalendarDays,
  ClipboardCheck,
  FileHeart,
  FileText,
  LayoutDashboard,
  LayoutTemplate,
  MessageCircle,
  MessageSquare,
  Package,
  PlusCircle,
  Settings2,
  UserCircle,
  Users,
  Utensils,
  CreditCard,
  Settings,
  Shield,
  Palette,
} from 'lucide-react';

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
        key: 'account-overview',
        label: 'Tổng quan tài khoản',
        href: '/admin/account-overview',
        icon: UserCircle,
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
        key: 'room-allotment',
        label: 'Tất cả phòng',
        href: '/admin/rooms/allotment',
        icon: BedDouble,
      },
      {
        key: 'feedback',
        label: 'Phản hồi',
        href: '/admin/feedback',
        icon: MessageSquare,
      },
      {
        key: 'medical-record',
        label: 'Hồ sơ y tế',
        href: '/admin/medical-record',
        icon: FileHeart,
      },
      {
        key: 'contract',
        label: 'Hợp đồng',
        href: '/admin/contract',
        icon: FileText,
      },
      {
        key: 'types-config',
        label: 'Cấu hình danh mục',
        href: '/admin/types-config',
        icon: Settings2,
      },
      {
        key: 'booking',
        label: 'Đặt phòng',
        href: '/admin/booking',
        icon: CalendarDays,
      },
      {
        key: 'menu-management',
        label: 'Quản lý thực đơn',
        icon: Utensils,
        children: [
          {
            key: 'food',
            label: 'Món ăn',
            href: '/admin/food',
          },
          {
            key: 'menu',
            label: 'Thực đơn',
            href: '/admin/menu',
          },
          {
            key: 'menu-record',
            label: 'Bản ghi thực đơn',
            href: '/admin/menu-record',
          },
        ],
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
      {
        key: 'work-schedule',
        label: 'Lịch làm việc',
        href: '/admin/work-schedule',
        icon: CalendarDays,
      },
      {
        key: 'transaction',
        label: 'Giao dịch',
        href: '/admin/transaction',
        icon: CreditCard,
      },
      {
        key: 'templates',
        label: 'Mẫu',
        icon: LayoutTemplate,
        children: [
          {
            key: 'templates-editor',
            label: 'Soạn thảo mẫu',
            href: '/admin/templates',
          },
          {
            key: 'placeholder-manager',
            label: 'Quản lý placeholder',
            href: '/admin/placeholder-manager',
          },
        ],
      },
    ],
  },
  {
    key: 'settings',
    label: 'Cài đặt',
    items: [
      {
        key: 'system-settings',
        label: 'Cài đặt hệ thống',
        href: '/admin/settings/system',
        icon: Settings,
      },
      {
        key: 'roles-permissions',
        label: 'Vai trò & Quyền',
        href: '/admin/settings/roles',
        icon: Shield,
      },
      {
        key: 'appearance',
        label: 'Giao diện',
        href: '/admin/settings/appearance',
        icon: Palette,
      },
    ],
  },
];

