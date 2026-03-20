import type { PaymentType, CreatePaymentTypeRequest, UpdatePaymentTypeRequest } from '@/types/payment-type';
import apiClient from './apiClient';

const paymentTypeService = {
  getAll: (): Promise<PaymentType[]> => {
    return apiClient.get('/PaymentType');
  },
  getById: (id: number): Promise<PaymentType> => {
    return apiClient.get(`/PaymentType/${id}`);
  },
  create: (data: CreatePaymentTypeRequest): Promise<PaymentType> => {
    return apiClient.post('/PaymentType', data);
  },
  update: (id: number, data: UpdatePaymentTypeRequest): Promise<PaymentType> => {
    return apiClient.put(`/PaymentType/${id}`, data);
  },
  delete: (id: number): Promise<void> => {
    return apiClient.delete(`/PaymentType/${id}`);
  },
};

export default paymentTypeService;
