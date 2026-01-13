import { TodayTimelineStatus } from './types';

export interface TimelineAppointment {
  id: string;
  time: string;
  patientName: string;
  patientAvatar: string;
  doctorName: string;
  department: string;
  description: string;
  status: TodayTimelineStatus;
}

export const mockTimelineAppointments: TimelineAppointment[] = [
  {
    id: '1',
    time: '09:00',
    patientName: 'Olivia Smith',
    patientAvatar: 'https://i.pravatar.cc/150?img=1',
    doctorName: 'Dr. Sarah Lee',
    department: 'Cardiology',
    description: 'Routine checkup and consultation',
    status: 'In Progress',
  },
  {
    id: '2',
    time: '10:30',
    patientName: 'James Wilson',
    patientAvatar: 'https://i.pravatar.cc/150?img=2',
    doctorName: 'Dr. Emily Clark',
    department: 'Neurology',
    description: 'Follow-up appointment',
    status: 'Upcoming',
  },
  {
    id: '3',
    time: '11:00',
    patientName: 'Sophia Johnson',
    patientAvatar: 'https://i.pravatar.cc/150?img=3',
    doctorName: 'Dr. Michael Brown',
    department: 'Pediatrics',
    description: 'Vaccination',
    status: 'Scheduled',
  },
  {
    id: '4',
    time: '13:00',
    patientName: 'Liam Martinez',
    patientAvatar: 'https://i.pravatar.cc/150?img=4',
    doctorName: 'Dr. Olivia Davis',
    department: 'Dermatology',
    description: 'Skin examination',
    status: 'Cancelled',
  },
  {
    id: '5',
    time: '14:30',
    patientName: 'Emma Thompson',
    patientAvatar: 'https://i.pravatar.cc/150?img=5',
    doctorName: 'Dr. Daniel Wilson',
    department: 'Orthopedics',
    description: 'Post-surgery checkup',
    status: 'Rescheduled',
  },
];
