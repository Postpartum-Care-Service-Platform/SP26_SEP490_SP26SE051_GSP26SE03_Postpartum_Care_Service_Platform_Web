export type AppointmentStatus = 'Upcoming' | 'Pending' | 'Completed' | 'Cancelled' | 'Rescheduled';

export type Appointment = {
  id: number;
  name: string;
  rawDateTime: string | null;
  patientName: string;
  patientAvatar: string | null;
  doctor: string;
  department: string;
  appointmentTypeId: number | null;
  dateTime: string;
  status: AppointmentStatus;
};

export type TodayTimelineStatus = AppointmentStatus | 'In Progress' | 'Rescheduled' | 'Scheduled';

