'use client';

import { useState, useEffect, useCallback } from "react";

import apiClient from "@/services/apiClient";

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
  const [filterType, setFilterType] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<PlaceholderItem | null>(null);
  const [formData, setFormData] = useState<PlaceholderFormData>(initialFormData);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredPlaceholders = placeholders.filter(p => {
    const matchesActive = p.isActive === true;
    const matchesType = filterType === null || p.templateType === filterType;
    const matchesSearch = !searchTerm ||
      p.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.table.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesActive && matchesType && matchesSearch;
  });

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
      setPlaceholders(prev => prev.filter(p => p.id !== id));
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

  const getTemplateTypeColor = (type: number) => {
    return type === 1 ? '#2a9d8f' : '#fa8314';
  };

  return (
    <div style={{ padding: '24px', background: '#f5f6fa', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#343A40', margin: 0 }}>Quản lý Placeholder</h1>
          <p style={{ color: '#8A92A4', margin: '4px 0 0' }}>Quản lý các trường dữ liệu cho template</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            background: '#fa8314',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          <span>+</span> Thêm placeholder
        </button>
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '20px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        {/* Search */}
        <input
          type="text"
          placeholder="Tìm kiếm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '10px 16px',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '14px',
            width: '280px',
            outline: 'none',
          }}
        />

        {/* Type Filter */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setFilterType(null)}
            style={{
              padding: '8px 16px',
              border: '1px solid #e0e0e0',
              borderRadius: '20px',
              background: filterType === null ? '#fa8314' : '#fff',
              color: filterType === null ? '#fff' : '#555',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500',
            }}
          >
            Tất cả
          </button>
          <button
            onClick={() => setFilterType(1)}
            style={{
              padding: '8px 16px',
              border: '1px solid #e0e0e0',
              borderRadius: '20px',
              background: filterType === 1 ? '#2a9d8f' : '#fff',
              color: filterType === 1 ? '#fff' : '#555',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500',
            }}
          >
            Hợp đồng
          </button>
          <button
            onClick={() => setFilterType(2)}
            style={{
              padding: '8px 16px',
              border: '1px solid #e0e0e0',
              borderRadius: '20px',
              background: filterType === 2 ? '#fa8314' : '#fff',
              color: filterType === 2 ? '#fff' : '#555',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500',
            }}
          >
            Email
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        border: '1px solid #e0e0e0',
        overflow: 'hidden',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8f9fa' }}>
              <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#8A92A4', textTransform: 'uppercase' }}>Key</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#8A92A4', textTransform: 'uppercase' }}>Label</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#8A92A4', textTransform: 'uppercase' }}>Bảng</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#8A92A4', textTransform: 'uppercase' }}>Loại</th>
              <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#8A92A4', textTransform: 'uppercase' }}>Thứ tự</th>
              <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#8A92A4', textTransform: 'uppercase' }}>Trạng thái</th>
              <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#8A92A4', textTransform: 'uppercase' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#8A92A4' }}>Đang tải...</td>
              </tr>
            ) : filteredPlaceholders.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#8A92A4' }}>Không có dữ liệu</td>
              </tr>
            ) : (
              filteredPlaceholders.map((item) => (
                <tr key={item.id} style={{ borderTop: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <code style={{
                      background: 'rgba(250, 131, 20, 0.1)',
                      color: '#fa8314',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontFamily: 'monospace',
                    }}>
                      {`{{${item.key}}}`}
                    </code>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '14px', color: '#343A40' }}>{item.label}</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#666' }}>{item.table}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: '600',
                      background: `${getTemplateTypeColor(item.templateType)}20`,
                      color: getTemplateTypeColor(item.templateType),
                    }}>
                      {getTemplateTypeLabel(item.templateType)}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'center', fontSize: '13px', color: '#666' }}>{item.displayOrder || '-'}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                    <button
                      onClick={() => handleToggleActive(item)}
                      style={{
                        padding: '4px 12px',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        background: item.isActive ? '#d4edda' : '#f8d7da',
                        color: item.isActive ? '#155724' : '#721c24',
                      }}
                    >
                      {item.isActive ? 'Hoạt động' : 'Không hoạt động'}
                    </button>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => handleOpenModal(item)}
                        style={{
                          padding: '6px 12px',
                          border: '1px solid #e0e0e0',
                          borderRadius: '6px',
                          background: '#fff',
                          color: '#555',
                          cursor: 'pointer',
                          fontSize: '12px',
                        }}
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        style={{
                          padding: '6px 12px',
                          border: '1px solid #f5c6cb',
                          borderRadius: '6px',
                          background: '#fff',
                          color: '#dc3545',
                          cursor: 'pointer',
                          fontSize: '12px',
                        }}
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }} onClick={handleCloseModal}>
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '24px',
            width: '500px',
            maxWidth: '95vw',
          }} onClick={e => e.stopPropagation()}>
            <h2 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: '600' }}>
              {editingItem ? 'Sửa placeholder' : 'Thêm placeholder mới'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#8A92A4', marginBottom: '6px' }}>KEY</label>
                <input
                  type="text"
                  value={formData.key}
                  onChange={(e) => setFormData({ ...formData, key: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })}
                  required
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '14px' }}
                  placeholder="ví dụ: ho_ten"
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#8A92A4', marginBottom: '6px' }}>LABEL</label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '14px' }}
                  placeholder="ví dụ: Họ tên"
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#8A92A4', marginBottom: '6px' }}>BẢNG</label>
                <input
                  type="text"
                  value={formData.table}
                  onChange={(e) => setFormData({ ...formData, table: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '14px' }}
                  placeholder="ví dụ: Account"
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#8A92A4', marginBottom: '6px' }}>MÔ TẢ</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '14px' }}
                  placeholder="Mô tả cho placeholder"
                />
              </div>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#8A92A4', marginBottom: '6px' }}>LOẠI</label>
                  <select
                    value={formData.templateType}
                    onChange={(e) => setFormData({ ...formData, templateType: parseInt(e.target.value) })}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '14px' }}
                  >
                    <option value={1}>Hợp đồng</option>
                    <option value={2}>Email</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#8A92A4', marginBottom: '6px' }}>THỨ TỰ</label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '14px' }}
                  />
                </div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <span style={{ fontSize: '14px' }}>Hoạt động</span>
                </label>
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  style={{
                    padding: '10px 20px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    background: '#fff',
                    color: '#555',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                  }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '8px',
                    background: '#fa8314',
                    color: '#fff',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    opacity: saving ? 0.7 : 1,
                  }}
                >
                  {saving ? 'Đang lưu...' : (editingItem ? 'Cập nhật' : 'Thêm mới')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
