import type { Contract } from '@/types/contract';

import apiClient from './apiClient';

export interface StaffSchedule {
  id: string;
  roleId: number;
  roleName: string;
  memberTypeId: number;
  memberTypeName: string;
  fullName: string;
  email: string;
  phone: string;
  username: string;
  isActive: boolean;
  avatarUrl: string | null;
  isScheduled: boolean;
  scheduledAt: string | null;
  scheduledUntil: string | null;
}

export interface UpdateContractRequest {
  contractCode?: string;
  contractDate?: string;
  effectiveFrom?: string;
  effectiveTo?: string;
  signedDate?: string | null;
  checkinDate?: string;
  checkoutDate?: string;
  status?: string;
  fileUrl?: string | null;
}

const contractService = {
  getAllContracts: (): Promise<Contract[]> => {
    return apiClient.get('/Contract/all');
  },
  getNoScheduleContracts: (): Promise<Contract[]> => {
    return apiClient.get('/Contract/no-staff-schedule');
  },
  getStaffSchedules: (): Promise<StaffSchedule[]> => {
    return apiClient.get('/StaffSchedule/staffs');
  },
  updateContract: (id: number, data: UpdateContractRequest): Promise<Contract> => {
    return apiClient.put(`/Contract/${id}`, data);
  },
  exportPdf: (id: number): Promise<Blob> => {
    return apiClient.get(`/Contract/${id}/export-pdf`, {
      responseType: 'blob',
      headers: {
        Accept: '*/*',
      },
    });
  },
};

export default contractService;

