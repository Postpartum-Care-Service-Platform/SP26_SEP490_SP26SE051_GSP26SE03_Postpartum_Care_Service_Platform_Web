import apiClient from './apiClient';

export type StaffSchedule = {
  id: string;
  roleId: number;
  roleName: string;
  memberTypeId: number;
  memberTypeName: string;
  email: string;
  phone: string;
  username: string;
  isActive: boolean;
  avatarUrl: string | null;
  isScheduled: boolean;
  scheduledAt: string;
  scheduledUntil: string;
};

export async function fetchStaffSchedules(): Promise<StaffSchedule[]> {
  return apiClient.get('/StaffSchedule/staffs');
}

