import type { Booking, CreateBookingRequest } from '@/types/booking';
import type { AdminBooking } from '@/types/admin-booking';

import apiClient from './apiClient';

const bookingService = {
  getAllBookings: (): Promise<AdminBooking[]> => {
    return apiClient.get('/Booking/all');
  },

  getMyBookings: (): Promise<Booking[]> => {
    return apiClient.get('/Booking');
  },

  getBookingById: (id: number): Promise<Booking> => {
    return apiClient.get(`/Booking/${id}`);
  },

  createBooking: (payload: CreateBookingRequest): Promise<Booking> => {
    return apiClient.post('/Booking', payload);
  },

  cancelBooking: (id: number): Promise<{ message: string }> => {
    return apiClient.put(`/Booking/${id}/cancel`);
  },

  deleteBooking: (id: number): Promise<void> => {
    return apiClient.delete(`/Booking/${id}`);
  },

  exportBookings: async (): Promise<void> => {
    const response = await apiClient.get('/Booking/export', { responseType: 'blob' });
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Danh_sach_dat_phong_${new Date().getTime()}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};

export default bookingService;
