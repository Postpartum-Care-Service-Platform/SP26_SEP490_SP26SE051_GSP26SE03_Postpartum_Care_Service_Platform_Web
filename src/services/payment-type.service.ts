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

  importPaymentTypes: (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/MasterDataExport/import/payment-types', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  exportPaymentTypes: (): Promise<Blob> => {
    return apiClient.get('/MasterDataExport/export/payment-types', { responseType: 'blob' });
  },

  downloadTemplatePaymentTypes: (): Promise<Blob> => {
    return apiClient.get('/MasterDataExport/template/payment-types', { responseType: 'blob' });
  },
};

export default paymentTypeService;
