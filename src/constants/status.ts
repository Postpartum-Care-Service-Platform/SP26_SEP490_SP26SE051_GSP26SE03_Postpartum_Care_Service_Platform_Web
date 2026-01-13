export const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
} as const;

export type Status = (typeof STATUS)[keyof typeof STATUS];

