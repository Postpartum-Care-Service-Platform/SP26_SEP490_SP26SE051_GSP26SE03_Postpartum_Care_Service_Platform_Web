export type Package = {
  id: number;
  packageName: string;
  description: string;
  durationDays: number;
  basePrice: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreatePackageRequest = {
  packageName: string;
  description: string;
  durationDays: number;
  basePrice: number;
  isActive?: boolean;
};

export type UpdatePackageRequest = {
  packageName?: string;
  description?: string;
  durationDays?: number;
  basePrice?: number;
  isActive?: boolean;
};
