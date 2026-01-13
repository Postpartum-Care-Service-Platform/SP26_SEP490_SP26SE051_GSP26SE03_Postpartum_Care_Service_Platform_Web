import type React from 'react';
import {
  AvatarIcon,
  ActivityLogIcon,
  CheckCircledIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
} from '@radix-ui/react-icons';
import { type StaticImageData } from 'next/image';

import patientCard1 from '@/assets/images/patient-card-1.png';
import patientCard2 from '@/assets/images/patient-card-2.png';
import patientCard3 from '@/assets/images/patient-card-3.png';
import patientCard4 from '@/assets/images/patient-card-4.png';
import patientCard5 from '@/assets/images/patient-card-5.png';
import patientCard6 from '@/assets/images/patient-card-6.png';

export type StatCardConfig = {
  image: StaticImageData;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  iconColor: string;
  backgroundColor: string;
  key: keyof {
    total: number;
    admitted: number;
    discharged: number;
    pending: number;
    critical: number;
    appointmentsToday: number;
  };
};

export const patientStatsConfig: StatCardConfig[] = [
  {
    image: patientCard1,
    label: 'Total Patients',
    icon: AvatarIcon,
    iconColor: '#7588DE',
    backgroundColor: 'rgba(117, 136, 222, 0.15)',
    key: 'total',
  },
  {
    image: patientCard2,
    label: 'Admitted',
    icon: ActivityLogIcon,
    iconColor: '#4EC5AD',
    backgroundColor: 'rgba(78, 197, 173, 0.15)',
    key: 'admitted',
  },
  {
    image: patientCard3,
    label: 'Discharged',
    icon: CheckCircledIcon,
    iconColor: '#DD71A2',
    backgroundColor: 'rgba(221, 113, 162, 0.15)',
    key: 'discharged',
  },
  {
    image: patientCard4,
    label: 'Pending',
    icon: ClockIcon,
    iconColor: '#F4D078',
    backgroundColor: 'rgba(244, 208, 120, 0.15)',
    key: 'pending',
  },
  {
    image: patientCard5,
    label: 'Critical',
    icon: ExclamationTriangleIcon,
    iconColor: '#FD6161',
    backgroundColor: 'rgba(253, 97, 97, 0.15)',
    key: 'critical',
  },
  {
    image: patientCard6,
    label: 'Appointments Today',
    icon: CalendarIcon,
    iconColor: '#5288AF',
    backgroundColor: 'rgba(82, 136, 175, 0.15)',
    key: 'appointmentsToday',
  },
];

