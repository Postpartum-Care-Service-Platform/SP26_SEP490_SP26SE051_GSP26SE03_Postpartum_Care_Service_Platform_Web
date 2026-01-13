import { LayoutDashboard, Users, MessageCircle, Calendar } from 'lucide-react';

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
        label: 'Dashboard',
        href: '/admin',
        icon: LayoutDashboard,
      },
      {
        key: 'patients',
        label: 'Patient',
        href: '/admin/patients',
        icon: Users,
      },
      {
        key: 'chat',
        label: 'Chat',
        href: '/admin/chat',
        icon: MessageCircle,
      },
      {
        key: 'appointment',
        label: 'Appointment',
        href: '/admin/appointment',
        icon: Calendar,
      },
      {
        key: 'appointment-overview',
        label: 'Appointment Overview',
        href: '/admin/appointment/overview',
        icon: Calendar,
      },
    ],
  },
];

