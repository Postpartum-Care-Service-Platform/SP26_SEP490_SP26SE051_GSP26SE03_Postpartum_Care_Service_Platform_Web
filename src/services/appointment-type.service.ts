import type {
  AppointmentTypeDetail,
  CreateAppointmentTypeRequest,
  UpdateAppointmentTypeRequest,
} from '@/types/appointment-type';

import apiClient from './apiClient';

const appointmentTypeService = {
  getAllAppointmentTypes: (): Promise<AppointmentTypeDetail[]> => {
    return apiClient.get('/AppointmentType');
  },
  getAppointmentTypeById: (id: number): Promise<AppointmentTypeDetail> => {
    return apiClient.get(`/AppointmentType/${id}`);
  },
  createAppointmentType: (data: CreateAppointmentTypeRequest): Promise<AppointmentTypeDetail> => {
    return apiClient.post('/AppointmentType', data);
  },
  updateAppointmentType: (id: number, data: UpdateAppointmentTypeRequest): Promise<AppointmentTypeDetail> => {
    return apiClient.put(`/AppointmentType/${id}`, data);
  },
  deleteAppointmentType: (id: number): Promise<void> => {
    return apiClient.delete(`/AppointmentType/${id}`);
  },

  importAppointmentTypes: (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/AppointmentType/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  exportAppointmentTypes: async (): Promise<void> => {
    const response = await apiClient.get('/AppointmentType/export', { responseType: 'blob' });
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Loai_lich_hen_${new Date().getTime()}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};

export default appointmentTypeService;


