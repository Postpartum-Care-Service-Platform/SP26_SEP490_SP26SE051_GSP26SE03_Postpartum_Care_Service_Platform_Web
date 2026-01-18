import apiClient from './apiClient';
import type { Booking, CreateBookingRequest } from '@/types/booking';

const bookingService = {
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
};

export default bookingService;
