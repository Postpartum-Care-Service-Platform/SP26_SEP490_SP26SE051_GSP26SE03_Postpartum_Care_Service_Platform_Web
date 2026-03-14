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
  dateTime: string; // Giữ lại để tương thích
  date: string; // Ngày định dạng dd/MM/yyyy
  time: string; // Thời gian định dạng HH:mm
  status: AppointmentStatus;
};

export type TodayTimelineStatus = AppointmentStatus | 'In Progress' | 'Rescheduled' | 'Scheduled';

