export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  verifyEmail: '/verify-email',
  resetPassword: '/reset-password',
  profile: '/profile',
  admin: '/admin',
} as const;

export const buildVerifyEmailRoute = (email: string) =>
  `${ROUTES.verifyEmail}?email=${encodeURIComponent(email)}`;

