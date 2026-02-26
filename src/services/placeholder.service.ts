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
  getAll: (): Promise<any> =>
    apiClient.get('/template-placeholders'),

  getByType: (type: 'contract' | 'email'): Promise<PlaceholderItem[]> =>
    apiClient.get(`/template-placeholders/by-type/${type}`),
};

export default placeholderService;
