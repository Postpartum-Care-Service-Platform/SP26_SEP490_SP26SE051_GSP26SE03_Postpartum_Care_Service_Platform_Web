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
};

export default userService;
