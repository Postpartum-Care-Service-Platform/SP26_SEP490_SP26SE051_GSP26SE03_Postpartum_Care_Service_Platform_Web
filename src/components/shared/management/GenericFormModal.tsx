'use client';

import React, { useState, useEffect } from 'react';
import styles from './management.module.css';
import { FormFieldConfig } from './types';

interface GenericFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  fields: FormFieldConfig[];
  initialData?: any;
  title: string;
}

export function GenericFormModal({
  open,
  onClose,
  onSubmit,
  fields,
  initialData,
  title
}: GenericFormModalProps) {
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      const defaultData: any = {};
      fields.forEach(f => {
        if (f.type === 'checkbox') defaultData[f.name] = f.defaultValue ?? false;
        else if (f.type === 'number') defaultData[f.name] = f.defaultValue ?? 0;
        else defaultData[f.name] = f.defaultValue ?? '';
      });
      setFormData(defaultData);
    }
  }, [initialData, fields, open]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (name: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>{title}</h2>
        <form onSubmit={handleSubmit}>
          {fields.map((field, index) => (
            <div key={index} className={styles.formGroup}>
              <label className={styles.label}>{field.label}</label>
              
              {field.type === 'select' ? (
                <select 
                  className={styles.select}
                  value={formData[field.name] || ''}
                  onChange={e => handleChange(field.name, e.target.value)}
                  required={field.required}
                >
                  <option value="">Chọn một giá trị...</option>
                  {field.options?.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              ) : field.type === 'textarea' ? (
                <textarea 
                  className={styles.textarea}
                  value={formData[field.name] || ''}
                  onChange={e => handleChange(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  required={field.required}
                  rows={4}
                />
              ) : field.type === 'checkbox' ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input 
                    type="checkbox"
                    checked={formData[field.name] || false}
                    onChange={e => handleChange(field.name, e.target.checked)}
                  />
                  <span style={{ fontSize: '14px' }}>Hoạt động</span>
                </div>
              ) : (
                <input 
                  type={field.type}
                  className={styles.input}
                  value={formData[field.name] || ''}
                  onChange={e => handleChange(field.name, field.type === 'number' ? Number(e.target.value) : e.target.value)}
                  placeholder={field.placeholder}
                  required={field.required}
                />
              )}
            </div>
          ))}

          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Đang lưu...' : 'Xác nhận'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
