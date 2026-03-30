'use client';

import { Cross1Icon, ImageIcon, ChevronDownIcon } from '@radix-ui/react-icons';
import { Upload } from 'lucide-react';
import React, { useEffect, useState, useCallback } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';
import { useToast } from '@/components/ui/toast/use-toast';
import amenityServiceService from '@/services/amenity-service.service';
import userService from '@/services/user.service';
import type { AmenityService } from '@/types/amenity-service';
import type { Account } from '@/types/account';

import styles from './amenity-service-modal.module.css';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  itemToEdit?: AmenityService | null;
};

interface FormErrors {
  name?: string;
  managerId?: string;
  duration?: string;
}

export function AmenityServiceModal({ open, onOpenChange, onSuccess, itemToEdit }: Props) {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [managerId, setManagerId] = useState('3fa85f64-5717-4562-b3fc-2c963f66afa6');
  const [duration, setDuration] = useState('0');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [managers, setManagers] = useState<Account[]>([]);
  const [loadingManagers, setLoadingManagers] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = !!itemToEdit;

  const fetchManagers = useCallback(async () => {
    try {
      setLoadingManagers(true);
      const allAccounts = await userService.getAllAccounts();
      const managerAccounts = allAccounts.filter(acc => 
        acc.roleName.toLowerCase().includes('manager')
      );
      setManagers(managerAccounts);
    } catch {
      toast({ title: 'Không thể tải danh sách quản lý', variant: 'error' });
    } finally {
      setLoadingManagers(false);
    }
  }, [toast]);

  useEffect(() => {
    if (open) {
      if (itemToEdit) {
        setName(itemToEdit.name ?? '');
        setDescription(itemToEdit.description ?? '');
        setManagerId(itemToEdit.managerId ?? '3fa85f64-5717-4562-b3fc-2c963f66afa6');
        setDuration(itemToEdit.duration?.toString() ?? '0');
        setImagePreview(itemToEdit.imageUrl ?? null);
        setImageFile(null);
      } else {
        setName('');
        setDescription('');
        setManagerId('3fa85f64-5717-4562-b3fc-2c963f66afa6');
        setDuration('0');
        setImagePreview(null);
        setImageFile(null);
      }
      setErrors({});
      void fetchManagers();
    }
  }, [open, itemToEdit, fetchManagers]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errs: FormErrors = {};
    if (!name.trim()) errs.name = 'Tên tiện ích không được để trống.';
    if (!managerId.trim()) errs.managerId = 'ManagerId không được để trống.';
    if (isNaN(Number(duration)) || Number(duration) < 0) errs.duration = 'Thời lượng phải là số dương.';
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    try {
      setIsSubmitting(true);
      
      const formData = new FormData();
      formData.append('ManagerId', managerId);
      formData.append('Name', name.trim());
      formData.append('Description', description.trim());
      formData.append('Duration', duration);
      if (imageFile) {
        formData.append('Image', imageFile);
      }

      if (isEditMode && itemToEdit) {
        await amenityServiceService.updateAmenityService(itemToEdit.id, formData);
        toast({ title: 'Cập nhật tiện ích thành công', variant: 'success' });
      } else {
        await amenityServiceService.createAmenityService(formData);
        toast({ title: 'Thêm tiện ích thành công', variant: 'success' });
      }

      onOpenChange(false);
      onSuccess?.();
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : typeof err === 'object' && err !== null && 'message' in err &&
            typeof (err as { message?: unknown }).message === 'string'
          ? (err as { message: string }).message
          : 'Thao tác thất bại. Vui lòng thử lại.';
      
      toast({ title: message, variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className={styles.modalOverlay} onClick={() => onOpenChange(false)}>
      <div
        className={styles.modalContent}
        role="dialog"
        aria-modal="true"
        aria-labelledby="amenity-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h2 id="amenity-modal-title" className={styles.modalTitle}>
            {isEditMode ? 'Chỉnh sửa tiện ích' : 'Thêm tiện ích mới'}
          </h2>
          <button type="button" onClick={() => onOpenChange(false)} className={styles.closeButton} aria-label="Đóng">
            <Cross1Icon />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            {/* Row 1: Manager & Name */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                <label>
                  Người quản lý (Manager) <span className={styles.required}>*</span>
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className={styles.formControl}
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        textAlign: 'left'
                      }}
                    >
                      <span style={{ color: managerId ? 'inherit' : '#9ca3af' }}>
                        {loadingManagers ? 'Đang tải...' : 
                          managers.find(m => m.id === managerId)?.email || 
                          managers.find(m => m.id === managerId)?.username || 
                          'Chọn người quản lý'}
                      </span>
                      <ChevronDownIcon style={{ opacity: 0.5 }} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className={styles.dropdownContent} align="start" side="bottom" sideOffset={5} style={{ width: '315px' }}>
                    {loadingManagers ? (
                      <div style={{ padding: '8px', textAlign: 'center', fontSize: '13px', color: '#666' }}>Đang tải danh sách...</div>
                    ) : managers.length === 0 ? (
                      <div style={{ padding: '8px', textAlign: 'center', fontSize: '13px', color: '#666' }}>Không tìm thấy quản lý nào</div>
                    ) : (
                      managers.map((m) => (
                        <DropdownMenuItem
                          key={m.id}
                          className={`${styles.dropdownItem} ${managerId === m.id ? styles.dropdownItemActive : ''}`}
                          onClick={() => { setManagerId(m.id); setErrors(p => ({ ...p, managerId: undefined })); }}
                        >
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 600 }}>{m.email}</span>
                            <span style={{ fontSize: '12px', opacity: 0.7 }}>{m.roleName} - {m.username}</span>
                          </div>
                        </DropdownMenuItem>
                      ))
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                <label htmlFor="amenityName">
                  Tên tiện ích <span className={styles.required}>*</span>
                </label>
                <input
                  id="amenityName"
                  className={`${styles.formControl} ${errors.name ? styles.invalid : ''}`}
                  placeholder="Ví dụ: Massage sau sinh, Spa..."
                  value={name}
                  onChange={(e) => { setName(e.target.value); if (errors.name) setErrors(p => ({ ...p, name: undefined })); }}
                />
              </div>
            </div>

            {/* Row 2: Description & Duration */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                <label htmlFor="amenityDesc">Mô tả</label>
                <textarea
                  id="amenityDesc"
                  className={styles.formControl}
                  placeholder="Nhập mô tả..."
                  rows={1}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ resize: 'none', height: '45px', lineHeight: '24px', paddingTop: '10px' }}
                />
              </div>

              <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                <label htmlFor="amenityDuration">Thời lượng (phút)</label>
                <input
                  id="amenityDuration"
                  type="number"
                  className={`${styles.formControl} ${errors.duration ? styles.invalid : ''}`}
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  style={{ height: '45px' }}
                />
              </div>
            </div>

            {/* Row 3: Image (Full Width) */}
            <div className={styles.formGroup}>
              <label>Hình ảnh tiện ích</label>
              <div className={styles.imageUploadWrapper}>
                <div className={styles.imagePreview} style={{ height: '200px' }}>
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className={styles.previewImg} />
                  ) : (
                    <div className={styles.uploadPlaceholder}>
                      <ImageIcon style={{ width: 32, height: 32 }} />
                      <span style={{ fontSize: '14px' }}>Chưa có hình ảnh. Vui lòng chọn ảnh đại diện cho tiện ích.</span>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  id="imageFile"
                  className={styles.fileInput}
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <label htmlFor="imageFile" className={styles.uploadLabel} style={{ marginTop: '8px' }}>
                  <Upload size={16} />
                  <span>Chọn ảnh từ máy tính</span>
                </label>
              </div>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button type="button" className={`${styles.button} ${styles.buttonOutline}`} onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Hủy
            </button>
            <button type="submit" className={`${styles.button} ${styles.buttonPrimary}`} disabled={isSubmitting}>
              {isSubmitting ? 'Đang xử lý...' : isEditMode ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
