import type { AppointmentStatus } from './types';

export type TodayAppointment = {
  time: string;
  patientName: string;
  doctor: string;
  department: string;
  description: string;
  status: AppointmentStatus | 'In Progress' | 'Rescheduled' | 'Scheduled';
  patientAvatar: string | null;
};

export const mockTodayAppointments: TodayAppointment[] = [
  {
    time: '09:15',
    patientName: 'Olivia Smith',
    doctor: 'Dr. Thompson',
    department: 'Cardiology',
    description: 'Heart checkup with ECG review. Blood pressure and cholesterol levels checked.',
    status: 'Upcoming',
    patientAvatar: 'https://i.pravatar.cc/150?img=11',
  },
  {
    time: '10:30',
    patientName: 'Michael Scott',
    doctor: 'Dr. Patel',
    department: 'Neurology',
    description: 'Migraine consultation and medication review. Sleep and stress factors discussed.',
    status: 'Completed',
    patientAvatar: 'https://i.pravatar.cc/150?img=12',
  },
  {
    time: '12:00',
    patientName: 'Sophia Martinez',
    doctor: 'Dr. Johnson',
    department: 'Pediatrics',
    description: 'Routine child vaccination and growth check. Nutrition and daily routine advised.',
    status: 'In Progress',
    patientAvatar: 'https://i.pravatar.cc/150?img=13',
  },
  {
    time: '01:15',
    patientName: 'David Lee',
    doctor: 'Dr. Brown',
    department: 'Orthopedics',
    description: 'Knee injury consultation. Physical exam and X-ray analysis performed.',
    status: 'Cancelled',
    patientAvatar: 'https://i.pravatar.cc/150?img=14',
  },
  {
    time: '02:00',
    patientName: 'Emma Wilson',
    doctor: 'Dr. Green',
    department: 'Dermatology',
    description: 'Skin allergy checkup. Rash examined and treatment plan suggested.',
    status: 'Rescheduled',
    patientAvatar: 'https://i.pravatar.cc/150?img=15',
  },
  {
    time: '02:43',
    patientName: 'John Doe',
    doctor: 'Dr. Williams',
    department: 'Neurology',
    description: 'Consultation for migraine and dizziness. MRI results discussed and treatment plan outlined.',
    status: 'Scheduled',
    patientAvatar: 'https://i.pravatar.cc/150?img=16',
  },
];

