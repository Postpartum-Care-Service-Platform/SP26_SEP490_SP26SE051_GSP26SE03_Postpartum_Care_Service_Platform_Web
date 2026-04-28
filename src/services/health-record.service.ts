import apiClient from './apiClient';
import { HealthRecord } from '@/types/health-record';

export const healthRecordService = {
  getLatest: (familyProfileId: number): Promise<HealthRecord> => {
    return apiClient.get(`/HealthRecord/GetLatest/${familyProfileId}`);
  },
};
