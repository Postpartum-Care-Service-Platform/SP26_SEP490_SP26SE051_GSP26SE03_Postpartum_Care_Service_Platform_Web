import type { Account } from '@/types/account';

import apiClient from './apiClient';

const userService = {


  getAllAccounts: (): Promise<Account[]> => {
    return apiClient.get('/Account/GetAll');
  },

  getAccountById: (id: string): Promise<Account> => {
    return apiClient.get(`/Account/GetById/${id}`);
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

  setAccountInactive: (id: string): Promise<Account> => {
    return apiClient.put(`/Account/SetAccountInactive/${id}`);
  },

  setAccountActive: (id: string): Promise<Account> => {
    return apiClient.put(`/Account/SetAccountActive/${id}`);
  },

  setRole: (id: string, roleId: number): Promise<Account> => {
    return apiClient.put(`/Account/SetRole/${id}/role/${roleId}`);
  },
};

export default userService;
