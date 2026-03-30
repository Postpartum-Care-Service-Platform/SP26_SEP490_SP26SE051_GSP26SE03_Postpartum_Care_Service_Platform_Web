export interface PaymentType {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreatePaymentTypeRequest {
  name: string;
  description: string;
}

export interface UpdatePaymentTypeRequest {
  name: string;
  description: string;
  isActive: boolean;
}
