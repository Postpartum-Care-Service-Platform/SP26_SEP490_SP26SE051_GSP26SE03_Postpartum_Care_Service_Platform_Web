'use client';

import { Cross1Icon, ChevronDownIcon } from '@radix-ui/react-icons';
import { useEffect, useState, useCallback } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';
import { useToast } from '@/components/ui/toast/use-toast';
import memberTypeService from '@/services/member-type.service';
import type { MemberType } from '@/services/member-type.service';
import roleService from '@/services/role.service';
import type { Role } from '@/types/role';

import styles from './member-type-modal.module.css';

const ROLE_LABELS: Record<string, string> = {
  manager:            'Quản lý',
  staff:              'Nhân viên',
  customer:           'Khách hàng',
  admin:              'Quản trị viên',
  doctor:             'Bác sĩ',
  nurse:              'Y tá',
  amenity:            'Tiện ích',
  'amenity manager':  'Quản lý tiện ích',
  amenity_manager:    'Quản lý tiện ích',
  'amenity-manager':  'Quản lý tiện ích',
};
const mapRoleName = (name: string) => ROLE_LABELS[name.toLowerCase()] ?? name;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  itemToEdit?: MemberType | null;
};

interface FormErrors {
  name?: string;
  roleId?: string;
}

export function MemberTypeModal({ open, onOpenChange, onSuccess, itemToEdit }: Props) {
  const { toast } = useToast();
  const [name, setName]                 = useState('');
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [errors, setErrors]             = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [roles, setRoles]             = useState<Role[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);

  const isEditMode = !!itemToEdit;

  const fetchRoles = useCallback(async () => {
    try {
      setLoadingRoles(true);
      const data = await roleService.getAllRoles();
      setRoles(data);
    } catch {
      toast({ title: 'Không thể tải danh sách vai trò', variant: 'error' });
    } finally {
      setLoadingRoles(false);
    }
  }, [toast]);

  useEffect(() => {
    if (open) {
      setName(itemToEdit?.name ?? '');
      setSelectedRoleId(itemToEdit?.roleId ?? null);
      setErrors({});
      void fetchRoles();
    }
  }, [open, itemToEdit, fetchRoles]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errs: FormErrors = {};
    if (!name.trim()) errs.name = 'Tên loại thành viên không được để trống.';
    if (selectedRoleId === null) errs.roleId = 'Vui lòng chọn vai trò.';
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    try {
      setIsSubmitting(true);
      if (isEditMode && itemToEdit) {
        await memberTypeService.update(itemToEdit.id, {
          name: name.trim(),
          roleId: selectedRoleId as number,
        });
        toast({ title: 'Cập nhật loại thành viên thành công', variant: 'success' });
      } else {
        await memberTypeService.create({
          name: name.trim(),
          isActive: false,
          roleId: selectedRoleId as number,
        });
        toast({ title: 'Thêm loại thành viên thành công', variant: 'success' });
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (err: unknown) {
      const fallback = isEditMode ? 'Cập nhật thất bại' : 'Thêm mới thất bại';
      const message =
        err instanceof Error
          ? err.message
          : typeof err === 'object' && err !== null && 'message' in err &&
            typeof (err as { message?: unknown }).message === 'string'
          ? (err as { message: string }).message
          : fallback;

      if (
        message.toLowerCase().includes('tồn tại') ||
        message.toLowerCase().includes('exists') ||
        message.toLowerCase().includes('duplicate')
      ) {
        setErrors({ name: 'Tên loại thành viên đã tồn tại.' });
      } else {
        toast({ title: message || fallback, variant: 'error' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  const selectedRole = roles.find((r) => r.id === selectedRoleId) ?? null;

  return (
    <div className={styles.modalOverlay} onClick={() => onOpenChange(false)}>
      <div
        className={styles.modalContent}
        role="dialog"
        aria-modal="true"
        aria-labelledby="member-type-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h2 id="member-type-modal-title" className={styles.modalTitle}>
            {isEditMode ? 'Chỉnh sửa loại thành viên' : 'Thêm loại thành viên mới'}
          </h2>
          <button type="button" onClick={() => onOpenChange(false)} className={styles.closeButton} aria-label="Đóng">
            <Cross1Icon />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            {/* Tên */}
            <div className={styles.formGroup}>
              <label htmlFor="memberTypeName">
                Tên loại thành viên <span className={styles.required}>*</span>
              </label>
              <input
                id="memberTypeName"
                className={`${styles.formControl} ${errors.name ? styles.invalid : ''}`}
                placeholder="Ví dụ: Thường, VIP, Premium..."
                value={name}
                onChange={(e) => { setName(e.target.value); if (errors.name) setErrors((p) => ({ ...p, name: undefined })); }}
                autoFocus
              />
              {errors.name && <p className={styles.errorMessage}>{errors.name}</p>}
            </div>

            {/* Vai trò */}
            <div className={styles.formGroup}>
              <label>Vai trò <span className={styles.required}>*</span></label>
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className={`${styles.dropdownTrigger} ${errors.roleId ? styles.invalid : ''}`}
                  >
                    <span className={selectedRole ? styles.dropdownValueSelected : styles.dropdownPlaceholder}>
                      {loadingRoles ? 'Đang tải...' : selectedRole ? mapRoleName(selectedRole.roleName) : 'Chọn vai trò'}
                    </span>
                    <ChevronDownIcon className={styles.dropdownChevron} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className={styles.dropdownContent} align="start">
                  {loadingRoles ? (
                    <div className={styles.dropdownLoading}>Đang tải...</div>
                  ) : roles.length === 0 ? (
                    <div className={styles.dropdownEmpty}>Không có vai trò nào</div>
                  ) : (
                    roles.map((role) => (
                      <DropdownMenuItem
                        key={role.id}
                        className={`${styles.dropdownItem} ${selectedRoleId === role.id ? styles.dropdownItemActive : ''}`}
                        onClick={() => { setSelectedRoleId(role.id); setErrors((p) => ({ ...p, roleId: undefined })); }}
                      >
                         {mapRoleName(role.roleName)}
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              {errors.roleId && <p className={styles.errorMessage}>{errors.roleId}</p>}
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
