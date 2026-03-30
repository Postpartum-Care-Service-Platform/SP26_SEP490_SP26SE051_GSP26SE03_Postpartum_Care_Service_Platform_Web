import type { BookingProgress } from '@/types/booking-progress';

import apiClient from './apiClient';

const bookingProgressService = {
  /**
   * Lấy tiến độ đặt phòng và danh sách hoạt động chi tiết của tài khoản
   */
  getBookingProgressByAccountId: (accountId: string): Promise<BookingProgress> => {
    return apiClient.get(`/booking-progress/account/${accountId}`);
  },
};

export default bookingProgressService;
