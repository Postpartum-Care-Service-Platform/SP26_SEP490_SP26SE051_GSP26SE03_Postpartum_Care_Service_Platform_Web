'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AdminPageLayout } from '@/components/layout/admin/AdminPageLayout';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Button } from '@/components/ui/button';
import { PlusIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { useToast } from '@/components/ui/toast/use-toast';
import apiClient from '@/services/apiClient';

import { GenericTable } from './GenericTable';
import { GenericFormModal } from './GenericFormModal';
import { SchemaConfig, CustomHandlers } from './types';
import styles from './management.module.css';

interface ConfigDrivenManagerProps<T> {
  schema: SchemaConfig<T>;
  handlers?: CustomHandlers<T>;
}

export function ConfigDrivenManager<T extends { id: any }>({
  schema,
  handlers
}: ConfigDrivenManagerProps<T>) {
  const { toast } = useToast();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(schema.defaultPageSize || 10);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(schema.apiEndpoint);
      const items = Array.isArray(response) ? response : (response as any).items || [];
      setData(items);
    } catch (error: any) {
      toast({
        title: 'Lỗi tải dữ liệu',
        description: error.message,
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [schema.apiEndpoint, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredData = data.filter(item => 
    Object.values(item).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSubmit = async (formData: any) => {
    try {
      let payload = formData;
      if (handlers?.onBeforeSubmit) {
        payload = handlers.onBeforeSubmit(formData);
      }

      if (editingItem) {
        await apiClient.put(`${schema.apiEndpoint}/${editingItem.id}`, payload);
        toast({ title: 'Cập nhật thành công', variant: 'success' });
      } else {
        await apiClient.post(schema.apiEndpoint, payload);
        toast({ title: 'Thêm mới thành công', variant: 'success' });
      }

      await fetchData();
      handlers?.onAfterSubmit?.(payload);
    } catch (error: any) {
      toast({
        title: 'Lỗi khi lưu',
        description: error.message,
        variant: 'error',
      });
      throw error;
    }
  };

  const handleDelete = async (item: T) => {
    if (!confirm('Bạn có chắc chắn muốn xóa mục này?')) return;
    try {
      await apiClient.delete(`${schema.apiEndpoint}/${item.id}`);
      toast({ title: 'Xóa thành công', variant: 'success' });
      await fetchData();
      handlers?.onDeleteSuccess?.();
    } catch (error: any) {
      toast({ title: 'Lỗi khi xóa', description: error.message, variant: 'error' });
    }
  };

  const header = <Breadcrumbs items={schema.breadcrumbs} homeHref="/admin" />;

  const controlPanel = (
    <div className={styles.controls}>
      <div className={styles.searchWrapper}>
        <MagnifyingGlassIcon className={styles.searchIcon} />
        <input 
          type="text" 
          placeholder={schema.searchPlaceholder || 'Tìm kiếm...'} 
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Button variant="primary" onClick={() => { setEditingItem(null); setIsModalOpen(true); }}>
        <PlusIcon style={{ marginRight: '8px' }} /> Thêm mới
      </Button>
    </div>
  );

  return (
    <AdminPageLayout header={header} controlPanel={controlPanel}>
      <GenericTable 
        data={paginatedData}
        columns={schema.columns as any}
        loading={loading}
        onEdit={(item) => { setEditingItem(item); setIsModalOpen(true); }}
        onDelete={handleDelete}
        currentPage={currentPage}
        pageSize={pageSize}
      />

      <GenericFormModal 
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        fields={schema.fields}
        initialData={editingItem}
        title={editingItem ? `Sửa ${schema.title}` : `Thêm ${schema.title}`}
      />
    </AdminPageLayout>
  );
}
