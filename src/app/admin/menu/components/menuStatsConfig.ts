import type React from 'react';
import {
  ArchiveIcon,
  CheckCircledIcon,
  CrossCircledIcon,
} from '@radix-ui/react-icons';
import { type StaticImageData } from 'next/image';

import type { MenuStats } from './types';

import patientCard1 from '@/assets/images/patient-card-1.png';
import patientCard2 from '@/assets/images/patient-card-2.png';
import patientCard3 from '@/assets/images/patient-card-3.png';

export type StatCardConfig = {
  image: StaticImageData;
  label: string;
  icon: React.ComponentType<any>;
  iconColor: string;
  backgroundColor: string;
  key: keyof MenuStats;
  format?: (value: number) => number;
};

export const menuStatsConfig: StatCardConfig[] = [
  {
    image: patientCard1,
    label: 'Tổng số thực đơn',
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
];
