export interface AppointmentTypeDetail {
  id: number;
  name: string;
  description?: string;
}

export interface CreateAppointmentTypeRequest {
  name: string;
  description?: string;
}

export interface UpdateAppointmentTypeRequest {
  name: string;
  description?: string;
}


