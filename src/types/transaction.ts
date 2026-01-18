export interface Transaction {
  id: string;
  customerId: string;
  bookingId?: number;
  amount: number;
  type: string; // 'deposit' | 'payment' | 'refund'
  status: string; // 'pending' | 'completed' | 'failed' | 'cancelled'
  paymentMethod?: string;
  orderCode?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DepositRequest {
  bookingId: number;
  amount: number;
}

export interface CreatePaymentLinkRequest {
  bookingId: number;
  amount: number;
  description?: string;
}

export interface PaymentLinkResponse {
  bin: string;
  accountNumber: string;
  accountName: string;
  amount: number;
  description: string;
  orderCode: number;
  qrCode: string;
}
