export type AppointmentStatus = 'Upcoming' | 'Pending' | 'Completed' | 'Cancelled';

export type Appointment = {
  id: string;
  patientName: string;
  patientAvatar: string | null;
  doctor: string;
  department: string;
  dateTime: string;
  status: AppointmentStatus;
};

export type TodayTimelineStatus = AppointmentStatus | 'In Progress' | 'Rescheduled' | 'Scheduled';

