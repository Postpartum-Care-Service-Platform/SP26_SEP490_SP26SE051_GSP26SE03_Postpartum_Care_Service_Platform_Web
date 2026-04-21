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
    return apiClient.post('/MasterDataExport/import/appointment-types', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  exportAppointmentTypes: (): Promise<Blob> => {
    return apiClient.get('/MasterDataExport/export/appointment-types', { responseType: 'blob' });
  },

  downloadTemplateAppointmentTypes: (): Promise<Blob> => {
    return apiClient.get('/MasterDataExport/template/appointment-types', { responseType: 'blob' });
  },
};

export default appointmentTypeService;


