import {
  ArchiveIcon,
  CubeIcon,
  MixerHorizontalIcon,
} from '@radix-ui/react-icons';

import patientCard1 from '@/assets/images/patient-card-1.png';
import patientCard2 from '@/assets/images/patient-card-2.png';
import patientCard3 from '@/assets/images/patient-card-3.png';

import type { CarePlanDetailStats } from './types';
import type { StaticImageData } from 'next/image';
import type React from 'react';

export type StatCardConfig = {
  image: StaticImageData;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  backgroundColor: string;
  key: keyof CarePlanDetailStats;
  format?: (value: number) => number;
};

export const carePlanDetailStatsConfig: StatCardConfig[] = [
  {
    image: patientCard1,
    label: 'Tổng số chi tiết',
    icon: ArchiveIcon,
    iconColor: '#7588DE',
    backgroundColor: 'rgba(117, 136, 222, 0.15)',
    key: 'total',
  },
  {
    image: patientCard2,
    label: 'Số gói dịch vụ',
    icon: CubeIcon,
    iconColor: '#4EC5AD',
    backgroundColor: 'rgba(78, 197, 173, 0.15)',
    key: 'uniquePackages',
  },
  {
    image: patientCard3,
    label: 'Số hoạt động',
    icon: MixerHorizontalIcon,
    iconColor: '#DD71A2',
    backgroundColor: 'rgba(221, 113, 162, 0.15)',
    key: 'uniqueActivities',
  },
];
