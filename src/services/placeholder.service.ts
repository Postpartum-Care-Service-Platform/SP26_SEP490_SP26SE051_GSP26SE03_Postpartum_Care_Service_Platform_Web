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
    return response || [];
  },

  getByType: async (type: 'contract' | 'email'): Promise<PlaceholderItem[]> => {
    const response = await apiClient.get<PlaceholderItem[]>(`/template-placeholders/by-type/${type}`);
    return response || [];
  },

  // Standardized Master Data Export/Import
  exportPlaceholders: (): Promise<Blob> => {
    return apiClient.get('/MasterDataExport/export/placeholders', {
      responseType: 'blob',
    });
  },

  importPlaceholders: (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/MasterDataExport/import/placeholders', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  downloadTemplatePlaceholders: (): Promise<Blob> => {
    return apiClient.get('/MasterDataExport/template/placeholders', {
      responseType: 'blob',
    });
  },
};

export default placeholderService;
