import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

import { appConfig } from '@/configs/app';

const apiClient: AxiosInstance = axios.create({
  baseURL: appConfig.api.baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: appConfig.api.timeout,
});

apiClient.interceptors.request.use(
  (config) => {
    // Attach Bearer token if present
    if (typeof window !== 'undefined') {
      const token = window.localStorage.getItem('token');
      if (token) {
        config.headers = config.headers ?? {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (config.headers as any).Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

type ApiErrorBody = {
  message?: string;
  error?: string;
};

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error: AxiosError<ApiErrorBody>) => {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      console.error('API Error:', status, data);
      const message = data?.message || data?.error || 'Có lỗi xảy ra';

      return Promise.reject({
        status,
        message,
        data,
      });
    }

    if (error.request) {
      console.error('No response received:', error.request);
      return Promise.reject({
        status: 0,
        message: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng của bạn.',
      });
    }

    console.error('Request setup error:', error.message);
    return Promise.reject({
      status: 0,
      message: 'Lỗi khi thiết lập yêu cầu',
    });
  }
);

export default apiClient;
