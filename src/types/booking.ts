export interface BookingCustomer {
  id: string;
  email: string;
  username: string;
  phone: string;
  avatarUrl: string | null;
}

export interface BookingPackage {
  id: number;
  packageName: string;
  durationDays: number;
  basePrice: number;
  roomTypeName: string;
}

export interface BookingContract {
  id: number;
  contractCode: string;
  status: string;
  fileUrl: string | null;
}

export interface TargetBooking {
  id: number;
  familyProfileId: number;
  fullName: string;
  relationship: string | null;
}

export interface Booking {
  id: number;
  startDate: string;
  endDate: string;
  totalPrice: number;
  discountAmount? : number;
  finalAmount? : number;
  paidAmount? : number;
  remainingAmount? : number;
  status: string;
  bookingDate: string;
  createdAt: string;
  customer: BookingCustomer;
  package: BookingPackage;
  contract: BookingContract;
  targetBookings: TargetBooking[];
}

export interface CreateBookingRequest {
  packageId: number;
  roomTypeId: number;
  startDate: string;
  endDate: string;
  notes?: string;
}
