import { ReactNode } from 'react';

export type FieldType = 'text' | 'number' | 'select' | 'checkbox' | 'textarea' | 'email' | 'date';

export interface ColumnConfig<T> {
  key: keyof T | string;
  header: string;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, item: T) => ReactNode;
  sortable?: boolean;
  filterable?: boolean;
}

export interface FormFieldConfig {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  options?: { value: string | number; label: string }[];
  defaultValue?: any;
  validation?: (value: any) => string | undefined;
  gridCols?: number;
}

export interface SchemaConfig<T> {
  idField: keyof T | string;
  apiEndpoint: string;
  title: string;
  description?: string;
  breadcrumbs: { label: string; href?: string }[];
  columns: ColumnConfig<T>[];
  fields: FormFieldConfig[];
  searchPlaceholder?: string;
  defaultPageSize?: number;
}

export interface CustomHandlers<T> {
  onBeforeSubmit?: (data: any) => any;
  onAfterSubmit?: (result: any) => void;
  onDeleteSuccess?: () => void;
  renderCustomActions?: (item: T) => ReactNode;
}
