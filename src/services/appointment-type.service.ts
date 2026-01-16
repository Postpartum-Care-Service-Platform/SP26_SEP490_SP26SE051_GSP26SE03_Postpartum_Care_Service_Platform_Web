import apiClient from './apiClient';
import type {
  AppointmentTypeDetail,
  CreateAppointmentTypeRequest,
  UpdateAppointmentTypeRequest,
} from '@/types/appointment-type';

const appointmentTypeService = {
  getAllAppointmentTypes: (): Promise<AppointmentTypeDetail[]> => {
    return apiClient.get('/AppointmentType');
  },
  getAppointmentTypeById: (id: number): Promise<AppointmentTypeDetail> => {
    return apiClient.get(`/AppointmentType/${id}`);
  },
  createAppointmentType: (data: CreateAppointmentTypeRequest): Promise<AppointmentTypeDetail> => {
    return apiClient.post('/AppointmentType', data);
  },
  updateAppointmentType: (id: number, data: UpdateAppointmentTypeRequest): Promise<AppointmentTypeDetail> => {
    return apiClient.put(`/AppointmentType/${id}`, data);
  },
  deleteAppointmentType: (id: number): Promise<void> => {
    return apiClient.delete(`/AppointmentType/${id}`);
  },
};

export default appointmentTypeService;


