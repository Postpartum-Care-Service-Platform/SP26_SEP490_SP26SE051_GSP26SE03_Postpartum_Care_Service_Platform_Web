'use client';

import { useEffect, useState } from 'react';
import { Cross1Icon } from '@radix-ui/react-icons';

import medicalRecordService from '@/services/medical-record.service';
import type { MedicalRecord, UpdateMedicalRecordRequest } from '@/types/medical-record';

import styles from './medical-record-edit-modal.module.css';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record?: MedicalRecord | null;
  onSuccess: () => void;
  onError: (message: string) => void;
};

export function MedicalRecordEditModal({ open, onOpenChange, record, onSuccess, onError }: Props) {
  const [form, setForm] = useState<UpdateMedicalRecordRequest>({
    allergies: '',
    bloodType: '',
    medicalHistory: '',
    currentMedication: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (record) {
      setForm({
        allergies: record.allergies ?? '',
        bloodType: record.bloodType ?? '',
        medicalHistory: record.medicalHistory ?? '',
        currentMedication: record.currentMedication ?? '',
      });
    }
  }, [record]);

  if (!open || !record) return null;

  const handleChange = (field: keyof UpdateMedicalRecordRequest, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await medicalRecordService.updateMedicalRecord(record.id, form);
      onSuccess();
      onOpenChange(false);
    } catch (err: unknown) {
      const message =
        typeof err === 'object' && err !== null && 'message' in err
          ? String((err as { message?: unknown }).message)
          : 'Cập nhật hồ sơ y tế thất bại';
      onError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={() => onOpenChange(false)}>
      <div
        className={styles.modalContent}
        role="dialog"
        aria-modal="true"
        aria-labelledby="medical-record-edit-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h2 id="medical-record-edit-title" className={styles.modalTitle}>
            Chỉnh sửa hồ sơ y tế
          </h2>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className={styles.closeButton}
            aria-label="Đóng"
          >
            <Cross1Icon />
          </button>
        </div>

        <form onSubmit={(e) => void handleSubmit(e)}>
          <div className={styles.modalBody}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="mr-bloodType">Nhóm máu</label>
              <input
                id="mr-bloodType"
                className={styles.input}
                type="text"
                value={form.bloodType ?? ''}
                onChange={(e) => handleChange('bloodType', e.target.value)}
                placeholder="Ví dụ: A+, B-, O+..."
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="mr-allergies">Dị ứng</label>
              <textarea
                id="mr-allergies"
                className={styles.textarea}
                value={form.allergies ?? ''}
                onChange={(e) => handleChange('allergies', e.target.value)}
                placeholder="Mô tả các loại dị ứng..."
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="mr-medicalHistory">Tiền sử bệnh</label>
              <textarea
                id="mr-medicalHistory"
                className={styles.textarea}
                value={form.medicalHistory ?? ''}
                onChange={(e) => handleChange('medicalHistory', e.target.value)}
                placeholder="Mô tả tiền sử bệnh..."
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="mr-currentMedication">Thuốc đang dùng</label>
              <textarea
                id="mr-currentMedication"
                className={styles.textarea}
                value={form.currentMedication ?? ''}
                onChange={(e) => handleChange('currentMedication', e.target.value)}
                placeholder="Liệt kê thuốc đang dùng..."
              />
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button
              type="button"
              className={`${styles.button} ${styles.buttonOutline}`}
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Hủy
            </button>
            <button
              type="submit"
              className={`${styles.button} ${styles.buttonPrimary}`}
              disabled={saving}
            >
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
