import type { AmenityTicket } from '@/types/amenity-ticket';

import apiClient from './apiClient';

const amenityTicketService = {
  // Lấy tất cả các ticket tiện ích
  getAllAmenityTickets: (): Promise<AmenityTicket[]> => {
    return apiClient.get('/AmenityTicket');
  },

  // Lấy chi tiết một ticket theo ID
  getAmenityTicketById: (id: number): Promise<AmenityTicket> => {
    return apiClient.get(`/AmenityTicket/${id}`);
  },

  // Lấy ticket theo customerId
  getAmenityTicketsByCustomerId: (customerId: string): Promise<AmenityTicket[]> => {
    return apiClient.get(`/AmenityTicket/customer/${customerId}`);
  },

  // Lấy ticket theo amenityServiceId
  getAmenityTicketsByServiceId: (serviceId: number): Promise<AmenityTicket[]> => {
    return apiClient.get(`/AmenityTicket/service/${serviceId}`);
  },

  getAmenityTicketsByUserId: (userId: string): Promise<AmenityTicket[]> => {
    return apiClient.get(`/AmenityTicket/user/${userId}`);
  },

  // Chấp nhận ticket
  acceptAmenityTicket: (id: number): Promise<void> => {
    return apiClient.patch(`/AmenityTicket/accept/${id}`);
  },

  // Hủy ticket
  cancelAmenityTicket: (id: number): Promise<void> => {
    return apiClient.patch(`/AmenityTicket/cancel/${id}`);
  },

  // Hoàn thành ticket
  completeAmenityTicket: (id: number, staffId?: string): Promise<void> => {
    return apiClient.patch(`/AmenityTicket/complete/${id}`, null, {
      params: staffId ? { staffId } : undefined
    });
  },

  // Lọc ticket theo ngày hoặc trạng thái
  filterByDateOrStatus: (params: { date?: string; status?: string }): Promise<AmenityTicket[]> => {
    return apiClient.get('/AmenityTicket/filter-by-date-or-status', { params });
  },

  // Lấy danh sách nhân viên để gán hoàn thành ticket
  getAllStaff: (): Promise<{ id: string; fullName: string }[]> => {
    return apiClient.get('/AmenityTicket/all-staff');
  },
};

export default amenityTicketService;
