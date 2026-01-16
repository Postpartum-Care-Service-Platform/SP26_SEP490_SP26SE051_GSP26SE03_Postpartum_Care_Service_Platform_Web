import apiClient from './apiClient';
import type {
  LoginRequest,
  RegisterRequest,
  GoogleLoginRequest,
  ForgotPasswordRequest,
  AuthResponse,
  LogoutRequest,
  ChangePasswordRequest,
  ResendVerificationRequest,
} from '@/types/auth';

const authService = {
  login: (credentials: LoginRequest): Promise<AuthResponse> => {
    return apiClient.post('/Auth/login', credentials);
  },

  loginWithGoogle: (payload: { idToken: string }): Promise<AuthResponse> => {
    return apiClient.post('/Auth/google', payload);
  },

  register: (payload: RegisterRequest): Promise<{ message?: string }> => {
    return apiClient.post('/Auth/register', payload);
  },

  verifyEmail: (payload: { email: string; otp: string }): Promise<{ message?: string }> => {
    return apiClient.post('/Auth/verify-email', payload);
  },

  forgotPassword: (payload: ForgotPasswordRequest): Promise<{ message?: string }> => {
    return apiClient.post('/Auth/forgot-password', payload);
  },

  verifyResetOtp: (payload: { email: string; otp: string }): Promise<{ message?: string; resetToken?: string }> => {
    return apiClient.post('/Auth/verify-reset-otp', payload);
  },

  resendOtp: (payload: { email: string }): Promise<{ message?: string }> => {
    return apiClient.post('/Auth/resend-otp', payload);
  },

  resetPassword: (payload: { resetToken: string; newPassword: string; confirmNewPassword: string }): Promise<{ message?: string }> => {
    return apiClient.post('/Auth/reset-password', payload);
  },

  logout: (payload: LogoutRequest): Promise<{ message?: string }> => {
    return apiClient.post('/Auth/logout', payload);
  },

  changePassword: (payload: ChangePasswordRequest): Promise<{ message?: string }> => {
    return apiClient.post('/Auth/change-password', payload);
  },

  resendVerification: (payload: ResendVerificationRequest): Promise<{ message?: string }> => {
    return apiClient.post('/Auth/resend-verification', payload);
  },
};

export default authService;
