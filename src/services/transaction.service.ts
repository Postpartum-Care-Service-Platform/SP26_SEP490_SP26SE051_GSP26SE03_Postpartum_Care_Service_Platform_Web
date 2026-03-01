import type {
  Transaction,
  DepositRequest,
  CreatePaymentLinkRequest,
  PaymentLinkResponse,
} from '@/types/transaction';

import apiClient from './apiClient';

const transactionService = {
  getAllTransactions: (): Promise<Transaction[]> => {
    return apiClient.get('/Transaction/all');
  },

  getMyTransactions: (): Promise<Transaction[]> => {
    return apiClient.get('/Transaction');
  },

  getTransactionById: (id: string): Promise<Transaction> => {
    return apiClient.get(`/Transaction/${id}`);
  },

  deposit: (payload: DepositRequest): Promise<Transaction> => {
    return apiClient.post('/Transaction/deposit', payload);
  },

  createPaymentLink: (payload: CreatePaymentLinkRequest): Promise<PaymentLinkResponse> => {
    return apiClient.post('/Transaction/create-payment-link', payload);
  },

  checkPaymentStatus: (orderCode: string): Promise<{ status: string }> => {
    return apiClient.get(`/Transaction/check-status/${orderCode}`);
  },
};

export default transactionService;
