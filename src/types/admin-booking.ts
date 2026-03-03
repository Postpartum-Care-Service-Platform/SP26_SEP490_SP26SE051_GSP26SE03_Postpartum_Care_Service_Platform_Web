export interface AdminBookingCustomer {
  id: string;
  email: string;
  username: string;
  phone: string;
}

export interface AdminBookingPackage {
  id: number;
  packageName: string;
  durationDays: number;
  basePrice: number;
  roomTypeName: string;
}

export interface AdminBookingRoom {
  id: number;
  name: string;
  floor: number;
  roomTypeName: string;
}

export interface AdminBookingContract {
  id: number;
  contractCode: string;
  status: string;
  fileUrl: string | null;
}

export interface AdminBookingTransaction {
  id: string;
  amount: number;
  type: string;
  status: string;
  paymentMethod: string;
  transactionDate: string;
}

export interface AdminBooking {
  id: number;
  startDate: string;
  endDate: string;
  totalPrice: number;
  discountAmount: number;
  finalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: string;
  bookingDate: string;
  createdAt: string;
  customer: AdminBookingCustomer;
  package: AdminBookingPackage | null;
  room: AdminBookingRoom | null;
  contract: AdminBookingContract | null;
  transactions: AdminBookingTransaction[];
}

