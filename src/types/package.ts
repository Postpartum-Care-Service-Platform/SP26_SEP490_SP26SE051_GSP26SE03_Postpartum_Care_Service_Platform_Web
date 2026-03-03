export type Package = {
  id: number;
  packageName: string;
  description: string;
  packageTypeId?: number;
  packageTypeName?: string | null;
  roomTypeId?: number | null;
  roomTypeName?: string | null;
  imageUrl?: string | null;
  durationDays: number;
  basePrice: number;
  isActive: boolean;
  createdBy?: string | null;
  createdByName?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreatePackageRequest = {
  packageName: string;
  description: string;
  durationDays: number;
  basePrice: number;
  packageTypeId?: number;
  isActive?: boolean;
};

export type UpdatePackageRequest = {
  packageName?: string;
  description?: string;
  durationDays?: number;
  basePrice?: number;
  packageTypeId?: number;
  isActive?: boolean;
};
