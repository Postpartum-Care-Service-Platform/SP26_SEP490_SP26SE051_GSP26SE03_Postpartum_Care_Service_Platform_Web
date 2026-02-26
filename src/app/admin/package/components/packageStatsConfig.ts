import {
  ArchiveIcon,
  CheckCircledIcon,
  CrossCircledIcon,
  TimerIcon,
  BarChartIcon,
  RocketIcon,
} from '@radix-ui/react-icons';
import { type StaticImageData } from 'next/image';


import patientCard1 from '@/assets/images/patient-card-1.png';
import patientCard2 from '@/assets/images/patient-card-2.png';
import patientCard3 from '@/assets/images/patient-card-3.png';
import patientCard4 from '@/assets/images/patient-card-4.png';
import patientCard5 from '@/assets/images/patient-card-5.png';
import patientCard6 from '@/assets/images/patient-card-6.png';

import type { PackageStats } from './types';
import type React from 'react';

export type StatCardConfig = {
  image: StaticImageData;
  label: string;
  icon: React.ComponentType;
  iconColor: string;
  backgroundColor: string;
  key: keyof PackageStats;
  format?: (value: number) => number;
};

export const packageStatsConfig: StatCardConfig[] = [
  {
    image: patientCard1,
    label: 'Tổng số gói',
    icon: ArchiveIcon,
    iconColor: '#7588DE',
    backgroundColor: 'rgba(117, 136, 222, 0.15)',
    key: 'total',
  },
  {
    image: patientCard2,
    label: 'Đang hoạt động',
    icon: CheckCircledIcon,
    iconColor: '#4EC5AD',
    backgroundColor: 'rgba(78, 197, 173, 0.15)',
    key: 'active',
  },
  {
    image: patientCard3,
    label: 'Tạm dừng',
    icon: CrossCircledIcon,
    iconColor: '#DD71A2',
    backgroundColor: 'rgba(221, 113, 162, 0.15)',
    key: 'inactive',
  },
  {
    image: patientCard4,
    label: 'Số ngày TB',
    icon: TimerIcon,
    iconColor: '#F4D078',
    backgroundColor: 'rgba(244, 208, 120, 0.15)',
    key: 'avgDuration',
  },
  {
    image: patientCard5,
    label: 'Giá TB',
    icon: BarChartIcon,
    iconColor: '#FD6161',
    backgroundColor: 'rgba(253, 97, 97, 0.15)',
    key: 'avgPrice',
  },
  {
    image: patientCard6,
    label: 'Giá cao nhất',
    icon: RocketIcon,
    iconColor: '#5288AF',
    backgroundColor: 'rgba(82, 136, 175, 0.15)',
    key: 'highestPrice',
  },
];
