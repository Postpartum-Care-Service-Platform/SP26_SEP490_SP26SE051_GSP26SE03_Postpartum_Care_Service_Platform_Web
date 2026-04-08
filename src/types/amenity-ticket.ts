// Định nghĩa type cho AmenityTicket
export interface AmenityTicket {
  id: number;
  amenityServiceId: number;
  amenityServiceName?: string;
  customerId: string;
  customerName?: string;
  bookingId: number | null;
  startTime: string;
  endTime: string;
  date: string;
  status: string;
  amenityStaffId?: string | null;
  amenityStaffName?: string | null;
  staffId?: string; // Keep for compatibility if needed
}

