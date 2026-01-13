import { Calendar, Check, X, Clock } from 'lucide-react';

import type { OverviewStatCardProps } from './OverviewStatCard';

export const overviewStatsConfig: OverviewStatCardProps[] = [
  {
    icon: Calendar,
    iconBgColor: '#e7d5ff',
    iconColor: '#A47BC8',
    trendType: 'up',
    trendValue: '12%',
    value: '1,256',
    valueColor: '#343a40',
    mainLabel: 'Total Appointments Today',
    description: 'Highest booking peak between',
    descriptionBold: '10 AM – 12 PM.',
  },
  {
    icon: Check,
    iconBgColor: '#d0e7ff',
    iconColor: '#5288AF',
    trendType: 'check',
    trendValue: '74%',
    value: '420',
    valueColor: '#343a40',
    mainLabel: 'Completed Appointments',
    description: 'Avg. consultation time',
    descriptionBold: '18 minutes.',
  },
  {
    icon: X,
    iconBgColor: '#ffe0e0',
    iconColor: '#FD6161',
    trendType: 'down',
    trendValue: '3.9%',
    value: '12',
    valueColor: '#ef4444',
    mainLabel: 'Cancelled / No-shows',
    description: 'Mostly happening in',
    descriptionBold: 'evening slots.',
  },
  {
    icon: Clock,
    iconBgColor: '#fff4d0',
    iconColor: '#F4D078',
    trendType: 'up',
    trendValue: '22%',
    value: '120',
    valueColor: '#343a40',
    mainLabel: 'Upcoming Appointments',
    description: 'Next slot at',
    descriptionBold: '3:30 PM (Dr. Sharma).',
  },
];

