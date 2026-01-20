export const ROUTES = {
  home: '/',
  main: '/main',
  login: '/auth/login',
  register: '/auth/register',
  verifyEmail: '/auth/verify-email',
  resetPassword: '/auth/reset-password',
  profile: '/dashboard/profile',
  admin: '/admin',
  adminProfile: '/admin/profile',
} as const;

export const buildVerifyEmailRoute = (email: string) =>
  `${ROUTES.verifyEmail}?email=${encodeURIComponent(email)}`;

