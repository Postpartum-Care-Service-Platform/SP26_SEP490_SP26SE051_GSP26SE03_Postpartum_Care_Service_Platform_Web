import type { CarePlanDetail, CreateCarePlanDetailRequest, UpdateCarePlanDetailRequest } from '@/types/care-plan-detail';

import apiClient from './apiClient';

const carePlanDetailService = {
  getAllCarePlanDetails: (): Promise<CarePlanDetail[]> => {
    return apiClient.get('/care-plan-details');
  },

  getCarePlanDetailById: (id: number): Promise<CarePlanDetail> => {
    return apiClient.get(`/care-plan-details/${id}`);
  },

  createCarePlanDetail: (payload: CreateCarePlanDetailRequest): Promise<CarePlanDetail> => {
    return apiClient.post('/care-plan-details', payload);
  },

  updateCarePlanDetail: (id: number, payload: UpdateCarePlanDetailRequest): Promise<CarePlanDetail> => {
    return apiClient.put(`/care-plan-details/${id}`, payload);
  },

  deleteCarePlanDetail: (id: number): Promise<void> => {
    return apiClient.delete(`/care-plan-details/${id}`);
  },
};

export default carePlanDetailService;
