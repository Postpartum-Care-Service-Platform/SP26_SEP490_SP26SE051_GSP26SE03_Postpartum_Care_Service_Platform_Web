export type RefundStatus = 'Pending' | 'Approved' | 'Rejected' | 'Processed';

export interface RefundRequest {
  id: number;
  bookingId: number;
  customerId: string;
  requestedAmount: number;
  approvedAmount: number | null;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  reason: string;
  status: RefundStatus;
  adminNote: string | null;
  approvedBy: string | null;
  createdAt: string;
  approvedAt: string | null;
  processedAt: string | null;
}

export interface ApproveRefundRequest {
  approvedAmount: number;
  adminNote?: string;
}

export interface RejectRefundRequest {
  adminNote: string;
}
