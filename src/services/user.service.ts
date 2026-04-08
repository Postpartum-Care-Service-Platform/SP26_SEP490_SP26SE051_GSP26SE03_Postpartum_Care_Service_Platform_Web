import type { Account, CustomerDetail } from '@/types/account';

import apiClient from './apiClient';

const userService = {


  getAllAccounts: (): Promise<Account[]> => {
    return apiClient.get('/Account/GetAll');
  },

  getAccountById: (id: string): Promise<Account> => {
    return apiClient.get(`/Account/GetById/${id}`);
  },

  getCustomerDetail: (customerId: string): Promise<CustomerDetail> => {
    return apiClient.get(`/Account/customer/${customerId}/detail`);
  },

  getAccountByEmail: (email: string): Promise<Account> => {
    const encodedEmail = encodeURIComponent(email);
    return apiClient.get(`/Account/GetByEmail/${encodedEmail}`);
  },

  getAccountByPhone: (phone: string): Promise<Account> => {
    return apiClient.get(`/Account/GetByPhone/${phone}`);
  },

  getCurrentAccount: (): Promise<Account> => {
    return apiClient.get('/Account/GetCurrentAccount');
  },

  // Toggle trạng thái active/inactive của tài khoản
  toggleAccountStatus: (id: string): Promise<Account> => {
    return apiClient.patch(`/Account/SetAccountStatus/${id}`);
  },

  setRole: (id: string, roleId: number): Promise<Account> => {
    return apiClient.patch(`/Account/SetRole/${id}/role/${roleId}`);
  },

  // Import/Export Excel
  exportAccounts: (): Promise<Blob> => {
    return apiClient.get('/Account/export', {
      responseType: 'blob',
    });
  },

  importAccounts: (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/Account/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default userService;
