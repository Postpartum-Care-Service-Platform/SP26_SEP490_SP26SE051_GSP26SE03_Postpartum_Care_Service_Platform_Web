export interface PackageType {
  id: number;
  name: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePackageTypeRequest {
  typeName: string;
  isActive?: boolean;
}

export interface UpdatePackageTypeRequest {
  typeName?: string;
  isActive?: boolean;
}
