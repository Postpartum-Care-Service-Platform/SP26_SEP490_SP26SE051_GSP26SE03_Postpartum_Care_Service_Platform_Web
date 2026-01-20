export interface Customer {
  id: string;
  email: string;
  username: string;
}

export interface Transaction {
  id: string;
  bookingId: number;
  amount: number;
  type: string;
  paymentMethod: string;
  transactionDate: string;
  status: string;
  note: string | null;
  customer: Customer;
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
