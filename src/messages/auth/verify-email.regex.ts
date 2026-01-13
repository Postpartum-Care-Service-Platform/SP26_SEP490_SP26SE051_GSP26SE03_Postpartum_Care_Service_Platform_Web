export const AUTH_VERIFY_EMAIL_REGEX = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  otp: /^\d{4,8}$/,
} as const;

