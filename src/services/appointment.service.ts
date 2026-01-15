import apiClient from './apiClient';
import type { Appointment, UpdateAppointmentRequest } from '@/types/appointment';

const appointmentService = {
  getAllAppointments: (): Promise<Appointment[]> => {
    return apiClient.get('/Appointment/all');
  },

  getAppointmentById: (id: number): Promise<Appointment> => {
    return apiClient.get(`/Appointment/${id}`);
  },

  updateAppointment: (id: number, payload: UpdateAppointmentRequest): Promise<Appointment> => {
    return apiClient.put(`/Appointment/${id}`, payload);
  },
};

export default appointmentService;



