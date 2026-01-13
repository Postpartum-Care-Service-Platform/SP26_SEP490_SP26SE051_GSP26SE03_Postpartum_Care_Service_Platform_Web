export const AUTH_REGISTER_REGEX = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?\d{9,15}$/,
} as const;
