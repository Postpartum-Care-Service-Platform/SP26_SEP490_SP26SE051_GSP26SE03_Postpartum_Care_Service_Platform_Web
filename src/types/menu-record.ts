export interface MenuRecord {
  id: number;
  accountId?: string | null;
  menuId: number;
  name: string | null;
  date: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMenuRecordRequest {
  accountId?: string | null;
  menuId: number;
  name?: string | null;
  date: string;
  isActive?: boolean;
}

export interface UpdateMenuRecordRequest {
  accountId?: string | null;
  menuId?: number;
  name?: string | null;
  date?: string;
  isActive?: boolean;
}
