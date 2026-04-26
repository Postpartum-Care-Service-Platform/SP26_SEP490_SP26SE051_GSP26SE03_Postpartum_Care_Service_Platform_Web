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
  Sparkles,
  Ticket,
  SquarePen,
  Hash,
  Soup,
  BookOpen,
  History,
  Utensils,
  CreditCard,
  Settings,
  Shield,
  Undo2,
  Award
} from 'lucide-react';

export type AdminNavItem = {
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

export type AdminNavSection = {
  key: string;
  label?: string;
  items: AdminNavItem[];
};

export const adminNav: AdminNavSection[] = [
  {
    key: 'main',
    label: 'Chính',
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
        key: 'notification',
        label: 'Thông báo',
        href: '/admin/notification',
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
        key: 'booking',
        label: 'Đặt phòng',
        href: '/admin/booking',
        icon: CalendarDays,
      },
      {
        key: 'contract',
        label: 'Hợp đồng',
        href: '/admin/contract',
        icon: FileText,
      },

      {
        key: 'feedback',
        label: 'Phản hồi',
        href: '/admin/feedback',
        icon: MessageSquare,
      },
      {
        key: 'refund',
        label: 'Hoàn tiền',
        href: '/admin/refund',
        icon: Undo2,
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
            key: 'food',
            label: 'Món ăn',
            href: '/admin/food',
            icon: Soup,
          },
          {
            key: 'menu',
            label: 'Thực đơn',
            href: '/admin/menu',
            icon: BookOpen,
          },
          {
            key: 'menu-record',
            label: 'Bản ghi thực đơn',
            href: '/admin/menu-record',
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
            href: '/admin/package',
            icon: Package,
          },
          {
            key: 'package-activities',
            label: 'Hoạt động gói',
            href: '/admin/package-activities',
            icon: ClipboardCheck,
          },
        ],
      },
      {
        key: 'amenity-service',
        label: 'Tiện ích',
        href: '/admin/amenity-service',
        icon: Sparkles,
      },
      {
        key: 'amenity-ticket',
        label: 'Vé tiện ích',
        href: '/admin/amenity-ticket',
        icon: Ticket,
      },
      {
        key: 'activity',
        label: 'Hoạt động',
        href: '/admin/activity',
        icon: Activity,
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
        key: 'staff-skill',
        label: 'Kỹ năng nhân viên',
        href: '/admin/staff-skill',
        icon: Award,
      },
      {
        key: 'medical-record',
        label: 'Hồ sơ y tế',
        href: '/admin/medical-record',
        icon: FileHeart,
      },
      {
        key: 'page-builder',
        label: 'Page Builder (Meta)',
        href: '/admin/page-builder',
        icon: LayoutTemplate,
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
            icon: SquarePen,
          },
          {
            key: 'placeholder-manager',
            label: 'Quản lý placeholder',
            href: '/admin/placeholder-manager',
            icon: Hash,
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
        key: 'types-config',
        label: 'Cấu hình danh mục',
        href: '/admin/types-config',
        icon: Settings2,
      },
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
    ],
  },
];


