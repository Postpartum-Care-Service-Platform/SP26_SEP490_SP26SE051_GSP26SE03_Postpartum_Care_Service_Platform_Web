export interface AppointmentTypeDetail {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateAppointmentTypeRequest {
  name: string;
  isActive?: boolean;
}

export interface UpdateAppointmentTypeRequest {
  name?: string;
  isActive?: boolean;
}


