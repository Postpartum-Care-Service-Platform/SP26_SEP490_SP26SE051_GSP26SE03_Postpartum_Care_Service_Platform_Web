import {
  Calendar,
  MessageCircle,
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
        key: 'appointment',
        label: 'Lịch hẹn',
        href: '/receptionist/appointment',
        icon: Calendar,
      },
      {
        key: 'chat',
        label: 'Trò chuyện',
        href: '/receptionist/chat',
        icon: MessageCircle,
      },
    ],
  },
];
