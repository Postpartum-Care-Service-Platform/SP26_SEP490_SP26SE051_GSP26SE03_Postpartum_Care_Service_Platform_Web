import apiClient from './apiClient';

export interface PlaceholderItem {
  id: number;
  key: string;
  label: string;
  table: string;
  description?: string;
  templateType: number;
  displayOrder?: number;
  isActive: boolean;
}

const placeholderService = {
  getAll: async (): Promise<PlaceholderItem[]> => {
    const response = await apiClient.get<PlaceholderItem[]>('/template-placeholders');
    return response.data ?? [];
  },

  getByType: async (type: 'contract' | 'email'): Promise<PlaceholderItem[]> => {
    const response = await apiClient.get<PlaceholderItem[]>(`/template-placeholders/by-type/${type}`);
    return response.data ?? [];
  },
};

export default placeholderService;
