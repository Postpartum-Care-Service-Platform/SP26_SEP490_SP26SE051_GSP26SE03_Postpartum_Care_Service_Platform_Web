import apiClient from './apiClient';

// Định nghĩa interface cho dữ liệu đặt lịch
export interface CreateAppointmentRequest {
  date: string; // Format: YYYY-MM-DD
  time: string; // Format: HH:mm
  appointmentTypeId: number;
  name: string;
}

// Định nghĩa interface cho response
export interface AppointmentResponse {
  id?: number;
  date: string;
  time: string;
  appointmentTypeId: number;
  name: string;
  message?: string;
}

/**
 * Service để xử lý các API liên quan đến đặt lịch
 */
export const appointmentService = {
  /**
   * Tạo một cuộc hẹn mới
   * @param data - Dữ liệu đặt lịch
   * @returns Promise với response từ API
   */
  createAppointment: async (data: CreateAppointmentRequest): Promise<AppointmentResponse> => {
    try {
      const response = await apiClient.post<AppointmentResponse>('/api/Appointment', data);
      return response;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  },
};
