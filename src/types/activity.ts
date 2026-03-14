export interface Activity {
  id: number;
  name: string;
  description: string;
  price: number | null;
  target: 'Mom' | 'Baby' | string;
  activityTypeId: number;
  activityTypeName: string;
  duration: number;
  status: 'Active' | 'Inactive' | string;
}

export type CreateActivityRequest = {
  name: string;
  description?: string;
  price?: number | null;
  target?: string;
  activityTypeId?: number;
  duration?: number;
  status?: string;
};

export type UpdateActivityRequest = Partial<CreateActivityRequest>;
