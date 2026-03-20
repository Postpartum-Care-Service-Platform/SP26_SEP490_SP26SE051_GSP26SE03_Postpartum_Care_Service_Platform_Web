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
};

export default amenityTicketService;
