import type { CarePlanDetail, CreateCarePlanDetailRequest, UpdateCarePlanDetailRequest } from '@/types/care-plan-detail';

import apiClient from './apiClient';

const carePlanDetailService = {
  getAllCarePlanDetails: (): Promise<CarePlanDetail[]> => {
    return apiClient.get('/package-activities');
  },

  getCarePlanDetailById: (id: number): Promise<CarePlanDetail> => {
    return apiClient.get(`/package-activities/${id}`);
  },

  createCarePlanDetail: (payload: CreateCarePlanDetailRequest[]): Promise<CarePlanDetail[]> => {
    return apiClient.post('/package-activities', payload);
  },

  updateCarePlanDetail: (id: number, payload: UpdateCarePlanDetailRequest): Promise<CarePlanDetail> => {
    return apiClient.put(`/package-activities/${id}`, payload);
  },

  deleteCarePlanDetail: (id: number): Promise<void> => {
    return apiClient.delete(`/package-activities/${id}`);
  },

  importCarePlanDetails: (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/package-activities/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  exportCarePlanDetails: async (): Promise<void> => {
    const response = await apiClient.get('/package-activities/export', { responseType: 'blob' });
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Hoat_dong_goi_dich_vu_${new Date().getTime()}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};

export default carePlanDetailService;
