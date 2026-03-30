// Định nghĩa type cho AmenityTicket
export interface AmenityTicket {
  id: number;
  amenityServiceId: number;
  customerId: string;
  bookingId: number | null;
  startTime: string;
  endTime: string;
  date: string;
  status: string;
}
