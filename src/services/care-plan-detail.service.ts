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
};

export default carePlanDetailService;
