// Định nghĩa type cho AmenityService (Tiện ích)
export interface AmenityService {
  id: number;
  managerId?: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
