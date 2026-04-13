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
    return apiClient.post('/PaymentType/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  exportPaymentTypes: async (): Promise<void> => {
    const response = await apiClient.get('/PaymentType/export', { responseType: 'blob' });
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Loai_thanh_toan_${new Date().getTime()}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};

export default paymentTypeService;
