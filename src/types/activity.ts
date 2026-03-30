export interface Activity {
  id: number;
  name: string;
  description: string;
  price: number | null;
  target: number | string;
  activityTypeId: number;
  activityTypeName: string | null;
  duration: number;
  status: number | string;
}

export type CreateActivityRequest = {
  name: string;
  description?: string;
  price?: number | null;
  target?: number;
  activityTypeId?: number;
  duration?: number;
  status?: number;
};

export type UpdateActivityRequest = Partial<CreateActivityRequest>;
