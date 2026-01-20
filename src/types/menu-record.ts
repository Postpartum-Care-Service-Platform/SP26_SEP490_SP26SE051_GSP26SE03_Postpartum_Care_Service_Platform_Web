export interface MenuRecord {
  id: number;
  accountId: string;
  menuId: number;
  name: string;
  date: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMenuRecordRequest {
  accountId: string;
  menuId: number;
  name: string;
  date: string;
  isActive?: boolean;
}

export interface UpdateMenuRecordRequest {
  accountId?: string;
  menuId?: number;
  name?: string;
  date?: string;
  isActive?: boolean;
}
