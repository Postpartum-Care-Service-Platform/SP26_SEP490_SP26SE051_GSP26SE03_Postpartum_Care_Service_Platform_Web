export interface Booking {
  id: number;
  customerId: string;
  packageId: number;
  packageName?: string;
  roomTypeId: number;
  roomTypeName?: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  depositAmount: number;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingRequest {
  packageId: number;
  roomTypeId: number;
  startDate: string;
  endDate: string;
  notes?: string;
}
