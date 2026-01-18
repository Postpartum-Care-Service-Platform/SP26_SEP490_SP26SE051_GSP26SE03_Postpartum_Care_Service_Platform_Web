import apiClient from './apiClient';
import type {
  Transaction,
  DepositRequest,
  CreatePaymentLinkRequest,
  PaymentLinkResponse,
} from '@/types/transaction';

const transactionService = {
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
