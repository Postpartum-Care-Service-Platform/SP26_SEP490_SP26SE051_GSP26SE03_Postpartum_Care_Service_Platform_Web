import apiClient from './apiClient';
import { RefundRequest, ApproveRefundRequest } from '@/types/refund-request';

const refundRequestService = {
  getAll: async (): Promise<RefundRequest[]> => {
    return apiClient.get<RefundRequest[]>('/RefundRequest/all') as any;
  },

  approve: async (id: number, data: ApproveRefundRequest): Promise<void> => {
    await apiClient.patch(`/RefundRequest/approve/${id}`, data);
  },

  reject: async (id: number, data: { adminNote: string }): Promise<void> => {
    await apiClient.patch(`/RefundRequest/reject/${id}`, data.adminNote, {
      headers: { 'Content-Type': 'application/json' }
    });
  },

  importRefundRequests: (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/RefundRequest/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  exportRefundRequests: async (): Promise<void> => {
    const response = await apiClient.get('/RefundRequest/export', { responseType: 'blob' });
    const blob = new Blob([response as any], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Yeu_cau_hoan_tien_${new Date().getTime()}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }
};

export default refundRequestService;
