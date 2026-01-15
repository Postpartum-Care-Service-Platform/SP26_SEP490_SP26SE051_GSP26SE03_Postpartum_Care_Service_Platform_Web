export interface AppointmentType {
  id: number;
  name: string;
}

export interface AppointmentCustomer {
  id: string;
  email: string;
  username: string;
  phone: string;
}

export interface AppointmentStaff {
  id: string;
  email: string;
  username: string;
}

export type AppointmentStatus = 'Pending' | 'Rescheduled' | 'Cancelled' | 'Completed' | string;

export interface Appointment {
  id: number;
  appointmentDate: string;
  name: string;
  status: AppointmentStatus;
  createdAt: string;
  appointmentType: AppointmentType;
  customer: AppointmentCustomer;
  staff: AppointmentStaff | null;
}

export interface UpdateAppointmentRequest {
  date: string;
  time: string;
  name?: string;
  appointmentTypeId?: number | null;
}



