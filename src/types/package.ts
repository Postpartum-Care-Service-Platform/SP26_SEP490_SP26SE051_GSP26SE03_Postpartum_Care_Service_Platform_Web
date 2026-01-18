// Định nghĩa type cho API response từ backend
export interface PackageResponse {
  id: number;
  packageName: string;
  description?: string;
  durationDays: number;
  basePrice: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Định nghĩa type cho Package dịch vụ chăm sóc mẹ sau sinh (frontend format)
export interface Package {
  id: string;
  name: string;
  description?: string;
  price?: number;
  duration?: number; // Số ngày
  imageUrl?: string;
  features?: string[]; // Danh sách tính năng/dịch vụ bao gồm
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
