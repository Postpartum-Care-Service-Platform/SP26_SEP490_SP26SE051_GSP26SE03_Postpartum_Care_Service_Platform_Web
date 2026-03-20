// Định nghĩa type cho AmenityTicket
export interface AmenityTicket {
  id: number;
  amenityServiceId: number;
  customerId: string;
  startTime: string;
  endTime: string;
  status: string;
}
