import apiClient from './apiClient';

export type SystemSettingUpdateRequest = {
  key: string;
  value: string;
};

export type SystemSettingUpdateResponse = {
  key: string;
  value: string;
  message?: string;
};

const systemSettingService = {
  /**
   * Update a single system setting by key
   * PUT /api/SystemSetting/{key}
   */
  updateSetting: (key: string, value: string): Promise<SystemSettingUpdateResponse> => {
    return apiClient.put(`/SystemSetting/${key}`, { value });
  },

  /**
   * Update multiple system settings at once
   * PUT /api/SystemSetting/batch
   */
  updateSettingsBatch: (settings: SystemSettingUpdateRequest[]): Promise<SystemSettingUpdateResponse[]> => {
    return apiClient.put('/SystemSetting/batch', settings);
  },
};

export default systemSettingService;
