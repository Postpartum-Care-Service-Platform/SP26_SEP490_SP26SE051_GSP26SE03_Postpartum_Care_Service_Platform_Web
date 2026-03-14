export interface PackageType {
  id: number;
  name: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePackageTypeRequest {
  name: string;
  isActive?: boolean;
}

export interface UpdatePackageTypeRequest {
  name?: string;
  isActive?: boolean;
}
