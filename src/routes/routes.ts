export const ROUTES = {
  home: '/',
  main: '/main',
  aiChat: '/ai-chat',
  login: '/auth/login',
  register: '/auth/register',
  verifyEmail: '/auth/verify-email',
  resetPassword: '/auth/reset-password',
  profile: '/dashboard/profile',
  admin: '/admin',
  adminProfile: '/admin/profile',
  adminChat: '/admin/chat',
  adminAppointment: '/admin/appointment',
  adminActivity: '/admin/activity',
  adminWorkSchedule: '/admin/work-schedule',
  adminContract: '/admin/contract',
  adminTransaction: '/admin/transaction',
  manager: '/manager',
  managerProfile: '/manager/profile',
  managerChat: '/manager/chat',
  managerAppointment: '/manager/appointment',
  managerActivity: '/manager/activity',
  managerWorkSchedule: '/manager/work-schedule',
  managerContract: '/manager/contract',
  managerTransaction: '/manager/transaction',
} as const;

export const buildVerifyEmailRoute = (email: string) =>
  `${ROUTES.verifyEmail}?email=${encodeURIComponent(email)}`;

