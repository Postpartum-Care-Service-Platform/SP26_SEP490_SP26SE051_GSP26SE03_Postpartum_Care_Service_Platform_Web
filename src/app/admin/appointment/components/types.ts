export type AppointmentStatus = 'Upcoming' | 'Pending' | 'Completed' | 'Cancelled' | 'Rescheduled';

export type Appointment = {
  id: number;
  patientName: string;
  patientAvatar: string | null;
  doctor: string;
  department: string;
  dateTime: string;
  status: AppointmentStatus;
};

export type TodayTimelineStatus = AppointmentStatus | 'In Progress' | 'Rescheduled' | 'Scheduled';

