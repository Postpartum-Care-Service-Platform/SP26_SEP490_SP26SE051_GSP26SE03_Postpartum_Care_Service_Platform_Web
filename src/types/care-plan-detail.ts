export type CarePlanDetail = {
  id: number;
  packageId: number;
  packageName: string;
  activityId: number;
  activityName: string;
  dayNo: number;
  startTime: string;
  endTime: string;
  instruction: string;
  sortOrder: number;
};

export type CreateCarePlanDetailRequest = {
  packageId: number;
  activityId: number;
  dayNo: number;
  startTime: string;
  endTime: string;
  instruction: string;
  sortOrder?: number;
};

export type UpdateCarePlanDetailRequest = {
  packageId?: number;
  activityId?: number;
  dayNo?: number;
  startTime?: string;
  endTime?: string;
  instruction?: string;
  sortOrder?: number;
};
