import type {
  Appointment,
  CreateAppointmentRequest,
  CreateCustomerAppointmentRequest,
  UpdateAppointmentRequest,
} from '@/types/appointment';

import apiClient from './apiClient';

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

  createAppointmentForCustomer: (payload: CreateCustomerAppointmentRequest): Promise<Appointment> => {
    return apiClient.post('/Appointment/create-for-customer', payload);
  },

  updateAppointment: (id: number, payload: UpdateAppointmentRequest): Promise<Appointment> => {
    return apiClient.put(`/Appointment/${id}`, payload);
  },

  deleteAppointment: (id: number): Promise<void> => {
    return apiClient.delete(`/Appointment/${id}`);
  },

  importAppointments: (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/Appointment/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  exportAppointments: async (): Promise<void> => {
    const response = await apiClient.get('/Appointment/export', { responseType: 'blob' });
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Lich_hen_${new Date().getTime()}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};

export default appointmentService;



