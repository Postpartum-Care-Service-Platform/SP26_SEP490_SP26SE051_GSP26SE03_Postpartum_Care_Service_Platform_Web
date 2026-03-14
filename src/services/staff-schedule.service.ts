import type { StaffSchedule, GetStaffScheduleParams } from '@/types/staff-schedule';

import apiClient from './apiClient';

export interface CreateFamilyScheduleRequest {
  customerId: string;
  packageId: number;
  workDate: string;
  startTime: string;
  endTime: string;
  dayNo: number;
  activity: string;
  target: 'Mom' | 'Baby' | 'Both';
  status: 'Pending' | 'Completed' | 'Missed' | 'InProgress';
  note?: string;
  contractId: number;
}

const staffScheduleService = {
  getStaffSchedule: (params: GetStaffScheduleParams): Promise<StaffSchedule[]> => {
    const { staffId, from, to } = params;
    return apiClient.get(`/StaffSchedule/${staffId}`, {
      params: { from, to },
    });
  },

  createFamilySchedule: (data: CreateFamilyScheduleRequest): Promise<StaffSchedule> => {
    return apiClient.post('/FamilySchedule', data);
  },
};

export default staffScheduleService;
