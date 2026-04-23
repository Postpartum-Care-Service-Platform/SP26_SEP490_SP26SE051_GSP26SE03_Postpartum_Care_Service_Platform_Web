import { SchemaConfig } from '../components/shared/management/types';

const STORAGE_KEY = 'joyful_nest_dynamic_pages';

export interface DynamicPage {
  id: string;
  schema: SchemaConfig<any>;
  createdAt: string;
}

export const dynamicPageService = {
  getPages: (): DynamicPage[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  savePage: (page: DynamicPage) => {
    const pages = dynamicPageService.getPages();
    const index = pages.findIndex(p => p.id === page.id);
    if (index >= 0) {
      pages[index] = page;
    } else {
      pages.push(page);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pages));
  },

  deletePage: (id: string) => {
    const pages = dynamicPageService.getPages().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pages));
  },

  getPage: (id: string): DynamicPage | undefined => {
    return dynamicPageService.getPages().find(p => p.id === id);
  }
};
