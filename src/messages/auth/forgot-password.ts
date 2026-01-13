import { AUTH_LOGIN_REGEX } from './login.regex';

export const AUTH_FORGOT_PASSWORD_REGEX = {
  email: AUTH_LOGIN_REGEX.email,
} as const;

export const AUTH_FORGOT_PASSWORD_MESSAGES = {
  requiredEmail: 'Vui lòng nhập email.',
  invalidEmailFormat: 'Email không đúng định dạng.',
  emailNotFound: 'Không tìm thấy tài khoản với email này.',
  sendOtpSuccess: 'Đã gửi OTP về email của bạn.',
  sendOtpFailed: 'Gửi OTP thất bại. Vui lòng thử lại.',
} as const;
