import type {
  CreateMedicalRecordRequest,
  MedicalRecord,
  UpdateMedicalRecordRequest,
} from '@/types/medical-record';

import apiClient from './apiClient';

const medicalRecordService = {
  /** GET /api/MedicalRecord/all */
  getAllMedicalRecords: (): Promise<MedicalRecord[]> => {
    return apiClient.get('/MedicalRecord/all');
  },

  /** GET /api/MedicalRecord/{id} */
  getMedicalRecordById: (id: number): Promise<MedicalRecord> => {
    return apiClient.get(`/MedicalRecord/${id}`);
  },

  /** GET /api/MedicalRecord/customer/{customerId} */
  getMedicalRecordByCustomer: (customerId: string): Promise<MedicalRecord> => {
    return apiClient.get(`/MedicalRecord/customer/${customerId}`);
  },

  /** POST /api/MedicalRecord */
  createMedicalRecord: (data: CreateMedicalRecordRequest): Promise<MedicalRecord> => {
    return apiClient.post('/MedicalRecord', data);
  },

  /** PUT /api/MedicalRecord/{id} */
  updateMedicalRecord: (id: number, data: UpdateMedicalRecordRequest): Promise<MedicalRecord> => {
    return apiClient.put(`/MedicalRecord/${id}`, data);
  },

  /** DELETE /api/MedicalRecord/{id} */
  deleteMedicalRecord: (id: number): Promise<void> => {
    return apiClient.delete(`/MedicalRecord/${id}`);
  },
};

export default medicalRecordService;
