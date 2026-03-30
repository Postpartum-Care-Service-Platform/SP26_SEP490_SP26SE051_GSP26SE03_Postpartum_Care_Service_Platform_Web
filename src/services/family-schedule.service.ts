import type { FamilyScheduleItem, FamilyScheduleDateRangeParams } from '@/types/family-schedule';

import apiClient from './apiClient';

const familyScheduleService = {
  /**
   * Lấy lịch trình gia đình theo khoảng thời gian dành cho admin
   */
  getAdminSchedulesByDateRange: (params: FamilyScheduleDateRangeParams): Promise<FamilyScheduleItem[]> => {
    return apiClient.get('/FamilySchedule/admin/date-range', { params });
  },

  /**
   * Lấy lịch trình gia đình cho khách hàng/nhân viên
   */
  getSchedulesByDateRange: (params: FamilyScheduleDateRangeParams): Promise<FamilyScheduleItem[]> => {
    return apiClient.get('/FamilySchedule/date-range', { params });
  },

  /**
   * Cập nhật trạng thái check-in cho một hoạt động trong lịch trình
   */
  checkInActivity: (id: number): Promise<void> => {
    return apiClient.post(`/FamilySchedule/check-in/${id}`);
  },
};

export default familyScheduleService;
