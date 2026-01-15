import { CalendarDays, Clock3, CheckCircle2, XCircle, RefreshCcw } from 'lucide-react';

import pillsImage from '@/assets/images/pills/pills.png';

type AppointmentStatKey = 'today' | 'upcoming' | 'completed' | 'cancelled' | 'rescheduled';

export const appointmentStatsConfig: Array<{
  key: AppointmentStatKey;
  label: string;
  value: number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  backgroundColor: string;
  iconColor: string;
  iconTextColor: string;
  valueColor: string;
  labelColor: string;
  image: typeof pillsImage;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}> = [
  {
    key: 'today',
    label: 'Today Appointment',
    value: 3075,
    icon: CalendarDays,
    backgroundColor: '#fff',
    iconColor: 'rgba(164, 123, 200, 0.2)',
    iconTextColor: 'rgba(164, 123, 200, 0.6)',
    valueColor: '#343A40',
    labelColor: 'rgba(52, 58, 64, 0.6)',
    image: pillsImage,
    trend: {
      value: '12.3%',
      isPositive: true,
    },
  },
  {
    key: 'upcoming',
    label: 'Upcoming',
    value: 1240,
    icon: Clock3,
    backgroundColor: '#fff',
    iconColor: 'rgba(82, 136, 175, 0.2)',
    iconTextColor: 'rgba(82, 136, 175, 0.6)',
    valueColor: '#343A40',
    labelColor: 'rgba(52, 58, 64, 0.6)',
    image: pillsImage,
    trend: {
      value: '8.5%',
      isPositive: true,
    },
  },
  {
    key: 'completed',
    label: 'Completed',
    value: 980,
    icon: CheckCircle2,
    backgroundColor: '#fff',
    iconColor: 'rgba(244, 208, 120, 0.2)',
    iconTextColor: 'rgba(244, 208, 120, 0.6)',
    valueColor: '#343A40',
    labelColor: 'rgba(52, 58, 64, 0.6)',
    image: pillsImage,
    trend: {
      value: '5.2%',
      isPositive: true,
    },
  },
  {
    key: 'cancelled',
    label: 'Cancelled',
    value: 120,
    icon: XCircle,
    backgroundColor: '#fff',
    iconColor: 'rgba(253, 97, 97, 0.2)',
    iconTextColor: 'rgba(253, 97, 97, 0.6)',
    valueColor: '#343A40',
    labelColor: 'rgba(52, 58, 64, 0.6)',
    image: pillsImage,
    trend: {
      value: '3.8%',
      isPositive: false,
    },
  },
  {
    key: 'rescheduled',
    label: 'Rescheduled',
    value: 210,
    icon: RefreshCcw,
    backgroundColor: '#fff',
    iconColor: 'rgba(117, 136, 222, 0.2)',
    iconTextColor: 'rgba(117, 136, 222, 0.6)',
    valueColor: '#343A40',
    labelColor: 'rgba(52, 58, 64, 0.6)',
    image: pillsImage,
    trend: {
      value: '2.1%',
      isPositive: true,
    },
  },
];

