import apiClient from './apiClient';
import type { Appointment, CreateAppointmentRequest, UpdateAppointmentRequest } from '@/types/appointment';

const appointmentService = {
  getAllAppointments: (): Promise<Appointment[]> => {
    return apiClient.get('/Appointment/all');
  },

  getAppointmentById: (id: number): Promise<Appointment> => {
    return apiClient.get(`/Appointment/${id}`);
  },

  createAppointment: (payload: CreateAppointmentRequest): Promise<Appointment> => {
    return apiClient.post('/Appointment', payload);
  },

  updateAppointment: (id: number, payload: UpdateAppointmentRequest): Promise<Appointment> => {
    return apiClient.put(`/Appointment/${id}`, payload);
  },
};

export default appointmentService;



