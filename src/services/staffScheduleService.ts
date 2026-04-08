import apiClient from './apiClient';

export type StaffSchedule = {
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
  scheduledAt: string;
  scheduledUntil: string;
};

export async function fetchStaffSchedules(): Promise<StaffSchedule[]> {
  return apiClient.get('/StaffSchedule/staffs');
}

export interface CreateStaffScheduleRangeRequest {
  staffIds: string[];
  contractId: number;
}

export async function createStaffScheduleRange(data: CreateStaffScheduleRangeRequest): Promise<void> {
  return apiClient.post('/StaffSchedule/create-range', data);
}
export async function getStaffsByFamilyScheduleId(familyScheduleId: number): Promise<StaffSchedule[]> {
  return apiClient.get(`/StaffSchedule/family-schedule/${familyScheduleId}/staffs`);
}
