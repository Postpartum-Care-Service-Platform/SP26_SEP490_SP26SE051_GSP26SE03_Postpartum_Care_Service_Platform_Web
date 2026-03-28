'use client';

import { useState, useEffect, useCallback } from 'react';
import { MagnifyingGlassIcon, PlusIcon, ChevronDownIcon } from '@radix-ui/react-icons';

import { Pagination } from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';
import apiClient from '@/services/apiClient';
import { AdminPageLayout } from '@/components/layout/admin/AdminPageLayout';

import styles from './placeholder-manager.module.css';

export interface PlaceholderItem {
  id: number;
  key: string;
  label: string;
  table: string;
  description?: string;
  templateType: number; // 1 = Contract, 2 = Email
  displayOrder?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PlaceholderFormData {
  key: string;
  label: string;
  table: string;
  description: string;
  templateType: number;
  displayOrder: number;
  isActive: boolean;
}

const Edit2OutlineIcon = ({ fill = '#A47BC8', size = 16 }: { fill?: string; size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill={fill}>
    <g data-name="Layer 2">
      <g data-name="edit-2">
        <rect width="24" height="24" opacity="0" />
        <path d="M19 20H5a1 1 0 0 0 0 2h14a1 1 0 0 0 0-2z" />
        <path d="M5 18h.09l4.17-.38a2 2 0 0 0 1.21-.57l9-9a1.92 1.92 0 0 0-.07-2.71L16.66 2.6A2 2 0 0 0 14 2.53l-9 9a2 2 0 0 0-.57 1.21L4 16.91a1 1 0 0 0 .29.8A1 1 0 0 0 5 18z" />
      </g>
    </g>
  </svg>
);

const Trash2OutlineIcon = ({ fill = '#FD6161', size = 16 }: { fill?: string; size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill={fill}>
    <g data-name="Layer 2">
      <g data-name="trash-2">
        <rect width="24" height="24" opacity="0" />
        <path d="M21 6h-5V4.33A2.42 2.42 0 0 0 13.5 2h-3A2.42 2.42 0 0 0 8 4.33V6H3a1 1 0 0 0 0 2h1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8h1a1 1 0 0 0 0-2zM10 4.33c0-.16.21-.33.5-.33h3c.29 0 .5.17.5.33V6h-4zM18 19a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V8h12z" />
        <path d="M9 17a1 1 0 0 0 1-1v-4a1 1 0 0 0-2 0v4a1 1 0 0 0 1 1z" />
        <path d="M15 17a1 1 0 0 0 1-1v-4a1 1 0 0 0-2 0v4a1 1 0 0 0 1 1z" />
      </g>
    </g>
  </svg>
);

const initialFormData: PlaceholderFormData = {
  key: '',
  label: '',
  table: '',
  description: '',
  templateType: 1,
  displayOrder: 0,
  isActive: true,
};

export default function PlaceholderManagerPage() {
  const [placeholders, setPlaceholders] = useState<PlaceholderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<PlaceholderItem | null>(null);
  const [formData, setFormData] = useState<PlaceholderFormData>(initialFormData);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const PAGE_SIZE_OPTIONS = [10, 20, 50];

  const filterTypeOptions = [
    { value: 'all', label: 'Tất cả' },
    { value: '1', label: 'Hợp đồng' },
    { value: '2', label: 'Email' },
  ];

  const fetchPlaceholders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<PlaceholderItem[]>('/template-placeholders');
      setPlaceholders(Array.isArray(res) ? res : []);
    } catch (error) {
      console.error('Error fetching placeholders:', error);
      setPlaceholders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlaceholders();
  }, [fetchPlaceholders]);

  const filteredPlaceholders = placeholders.filter((p) => {
    const matchesType = filterType === 'all' || p.templateType === parseInt(filterType, 10);
    const matchesSearch =
      !searchTerm ||
      p.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.table.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType]);

  const paginatedPlaceholders = filteredPlaceholders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const totalPages = Math.ceil(filteredPlaceholders.length / pageSize) || 1;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenModal = (item?: PlaceholderItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        key: item.key,
        label: item.label,
        table: item.table,
        description: item.description || '',
        templateType: item.templateType,
        displayOrder: item.displayOrder || 0,
        isActive: item.isActive,
      });
    } else {
      setEditingItem(null);
      setFormData(initialFormData);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData(initialFormData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingItem) {
        await apiClient.put(`/template-placeholders/${editingItem.id}`, formData);
      } else {
        await apiClient.post('/template-placeholders', formData);
      }
      await fetchPlaceholders();
      handleCloseModal();
    } catch (error: unknown) {
      const message =
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
          ? (error as { response: { data: { message: string } } }).response.data.message
          : 'Có lỗi xảy ra';
      alert(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa placeholder này?')) return;

    try {
      await apiClient.delete(`/template-placeholders/${id}`);
      setPlaceholders((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Error deleting placeholder:', error);
      alert('Có lỗi xảy ra khi xóa');
    }
  };

  const handleToggleActive = async (item: PlaceholderItem) => {
    try {
      await apiClient.put(`/template-placeholders/${item.id}`, { isActive: !item.isActive });
      await fetchPlaceholders();
    } catch (error) {
      console.error('Error toggling placeholder:', error);
    }
  };

  const getTemplateTypeLabel = (type: number) => {
    return type === 1 ? 'Hợp đồng' : 'Email';
  };

  const header = <Breadcrumbs items={[{ label: 'Placeholder' }]} homeHref="/admin" />;

  const controlPanel = (
    <div className={styles.controls}>
      <div className={styles.left}>
        <div className={styles.searchWrapper}>
          <MagnifyingGlassIcon className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Tìm kiếm placeholder..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.typeFilters}>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className={styles.filterButton}>
                {filterTypeOptions.find((opt) => opt.value === filterType)?.label || 'Tất cả'}
                <ChevronDownIcon className={styles.chevronIcon} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={styles.dropdownContent}>
              {filterTypeOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  className={`${styles.dropdownItem} ${filterType === option.value ? styles.dropdownItemActive : ''}`}
                  onClick={() => setFilterType(option.value)}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className={styles.right}>
        <Button variant="primary" size="sm" className={styles.addButton} onClick={() => handleOpenModal()}>
          <PlusIcon className={styles.plusIcon} />
          Placeholder mới
        </Button>
      </div>
    </div>
  );

  const pagination = (
    <div className={styles.paginationWrapper}>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={filteredPlaceholders.length}
        onPageChange={handlePageChange}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
        showResultCount={true}
      />
    </div>
  );

  return (
    <AdminPageLayout header={header} controlPanel={controlPanel} pagination={pagination}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.sttCol} style={{ width: '60px' }}>STT</th>
              <th style={{ width: '200px' }}>Key</th>
              <th>Label</th>
              <th>Bảng</th>
              <th style={{ width: '120px' }}>Loại</th>
              <th style={{ textAlign: 'center', width: '80px' }}>Thứ tự</th>
              <th style={{ textAlign: 'center', width: '150px' }}>Trạng thái</th>
              <th className={styles.stickyActionsCol} style={{ width: '120px' }}>
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className={styles.emptyState}>
                  Đang tải...
                </td>
              </tr>
            ) : filteredPlaceholders.length === 0 ? (
              <tr>
                <td colSpan={7} className={styles.emptyState}>
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              paginatedPlaceholders.map((item, index) => (
                <tr key={item.id}>
                  <td className={styles.sttCol}>
                    <span className={styles.sttCell}>
                      {(currentPage - 1) * pageSize + index + 1}
                    </span>
                  </td>
                  <td>
                    <code className={styles.codeTag}>{`{{${item.key}}}`}</code>
                  </td>
                  <td>{item.label}</td>
                  <td>{item.table}</td>
                  <td>
                    <span
                      className={`${styles.typeBadge} ${item.templateType === 1 ? styles.typeContract : styles.typeEmail}`}
                    >
                      {getTemplateTypeLabel(item.templateType)}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>{item.displayOrder || '-'}</td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      type="button"
                      onClick={() => handleToggleActive(item)}
                      className={`${styles.statusButton} ${item.isActive ? styles.statusActive : styles.statusInactive}`}
                    >
                      {item.isActive ? 'Hoạt động' : 'Không hoạt động'}
                    </button>
                  </td>
                  <td className={styles.stickyActionsCol}>
                    <div className={styles.actions}>
                      <div className={styles.tooltipWrapper}>
                        <Button
                          variant="outline"
                          size="sm"
                          className={styles.editButton}
                          onClick={() => handleOpenModal(item)}
                          aria-label={`Chỉnh sửa ${item.key}`}
                        >
                          <Edit2OutlineIcon fill="#A47BC8" size={16} />
                        </Button>
                        <span className={styles.tooltip}>Chỉnh sửa</span>
                      </div>
                      <div className={styles.tooltipWrapper}>
                        <Button
                          variant="outline"
                          size="sm"
                          className={styles.deleteButton}
                          onClick={() => handleDelete(item.id)}
                          aria-label={`Xóa ${item.key}`}
                        >
                          <Trash2OutlineIcon fill="#FD6161" size={16} />
                        </Button>
                        <span className={styles.tooltip}>Xóa</span>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>{editingItem ? 'Sửa placeholder' : 'Thêm placeholder mới'}</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Key</label>
                <input
                  type="text"
                  value={formData.key}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      key: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''),
                    })
                  }
                  required
                  className={styles.formInput}
                  placeholder="ví dụ: ho_ten"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Label</label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  required
                  className={styles.formInput}
                  placeholder="ví dụ: Họ tên"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Bảng</label>
                <input
                  type="text"
                  value={formData.table}
                  onChange={(e) => setFormData({ ...formData, table: e.target.value })}
                  required
                  className={styles.formInput}
                  placeholder="ví dụ: Account"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Mô tả</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={styles.formInput}
                  placeholder="Mô tả cho placeholder"
                />
              </div>
              <div className={styles.formRow}>
                <div style={{ flex: 1 }}>
                  <label className={styles.formLabel}>Loại</label>
                  <select
                    value={formData.templateType}
                    onChange={(e) => setFormData({ ...formData, templateType: parseInt(e.target.value, 10) })}
                    className={styles.formSelect}
                  >
                    <option value={1}>Hợp đồng</option>
                    <option value={2}>Email</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label className={styles.formLabel}>Thứ tự</label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        displayOrder: parseInt(e.target.value, 10) || 0,
                      })
                    }
                    className={styles.formInput}
                  />
                </div>
              </div>
              <div className={styles.checkboxRow}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <span>Hoạt động</span>
                </label>
              </div>
              <div className={styles.modalActions}>
                <button type="button" onClick={handleCloseModal} className={styles.cancelButton}>
                  Hủy
                </button>
                <button type="submit" disabled={saving} className={styles.submitButton}>
                  {saving ? 'Đang lưu...' : editingItem ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminPageLayout>
  );
}
