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
  deleteContract: (id: number): Promise<void> => {
    return apiClient.delete(`/Contract/${id}`);
  },

  importContracts: (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/Contract/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  exportContracts: async (): Promise<void> => {
    const response = await apiClient.get('/Contract/export', { responseType: 'blob' });
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Danh_sach_hop_dong_${new Date().getTime()}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};

export default contractService;

