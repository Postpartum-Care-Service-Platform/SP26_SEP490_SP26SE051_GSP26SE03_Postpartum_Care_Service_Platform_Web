'use client';

import { Cross1Icon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { useToast } from '@/components/ui/toast/use-toast';
import familyProfileService from '@/services/family-profile.service';
import type { CreateFamilyProfileRequest, FamilyProfile } from '@/types/family-profile';

import styles from './new-account-modal.module.css';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: FamilyProfile | null;
  onSuccess?: (profile: FamilyProfile) => void;
};

type FormErrors = {
  fullName?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  phoneNumber?: string;
};

type ApiClientError = {
  status?: number;
  message?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
};

function getApiErrorMessage(err: unknown, fallback: string) {
  if (err && typeof err === 'object' && 'message' in err && typeof (err as ApiClientError).message === 'string') {
    return (err as ApiClientError).message as string;
  }

  if (err instanceof Error && err.message) return err.message;

  return fallback;
}

export function EditFamilyProfileModal({ open, onOpenChange, profile, onSuccess }: Props) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<CreateFamilyProfileRequest | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (open && profile) {
      setFormData({
        memberTypeId: profile.memberTypeId,
        fullName: profile.fullName,
        dateOfBirth: profile.dateOfBirth,
        gender: profile.gender,
        address: profile.address,
        phoneNumber: profile.phoneNumber,
        avatar: null,
      });
      setErrors({});
    }
  }, [open, profile]);

  if (!open || !profile || !formData) return null;

  const handleFieldChange = (field: keyof CreateFamilyProfileRequest, value: string) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : prev));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Họ và tên không được để trống.';
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Ngày sinh không được để trống.';
    }

    if (!formData.gender) {
      newErrors.gender = 'Giới tính không được để trống.';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Số điện thoại không được để trống.';
    } else if (!/^[0-9+\-\s]{8,20}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Số điện thoại không hợp lệ.';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Địa chỉ không được để trống.';
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      setErrors({});

      const payload: CreateFamilyProfileRequest = {
        ...formData,
        // Không cho admin đổi memberType từ modal này
        memberTypeId: profile.memberTypeId,
      };

      const updated = await familyProfileService.updateFamilyProfile(profile.id, payload);

      toast({ title: 'Cập nhật hồ sơ thành công', variant: 'success' });
      onSuccess?.(updated);
      onOpenChange(false);
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err, 'Cập nhật hồ sơ thất bại');
      setErrors((prev) => ({
        ...prev,
        fullName: prev.fullName ?? (msg.toLowerCase().includes('tên') ? msg : undefined),
      }));
      toast({ title: msg, variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} role="dialog" aria-modal="true">
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Chỉnh sửa hồ sơ gia đình</h2>
          <button onClick={() => onOpenChange(false)} className={styles.closeButton} aria-label="Close">
            <Cross1Icon />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            <div className={styles.formGroup}>
              <label>Vai trò thành viên</label>
              <input value={profile.memberTypeName} readOnly className={styles.formControl} />
            </div>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="fullName">
                  Họ và tên <span className={styles.required}>*</span>
                </label>
                <input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleFieldChange('fullName', e.target.value)}
                  className={`${styles.formControl} ${errors.fullName ? styles.invalid : ''}`}
                />
                {errors.fullName && <p className={styles.errorMessage}>{errors.fullName}</p>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="dateOfBirth">
                  Ngày sinh <span className={styles.required}>*</span>
                </label>
                <input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleFieldChange('dateOfBirth', e.target.value)}
                  className={`${styles.formControl} ${errors.dateOfBirth ? styles.invalid : ''}`}
                />
                {errors.dateOfBirth && <p className={styles.errorMessage}>{errors.dateOfBirth}</p>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="gender">
                  Giới tính <span className={styles.required}>*</span>
                </label>
                <Select
                  value={formData.gender}
                  onValueChange={(val) => handleFieldChange('gender', val)}
                >
                  <SelectTrigger className={`${styles.formControl} ${errors.gender ? styles.invalid : ''}`}>
                    <SelectValue placeholder="Chọn giới tính" />
                  </SelectTrigger>
                  <SelectContent className="z-[1100]">
                    <SelectItem value="Male">Nam</SelectItem>
                    <SelectItem value="Female">Nữ</SelectItem>
                    <SelectItem value="Other">Khác</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && <p className={styles.errorMessage}>{errors.gender}</p>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="phoneNumber">
                  Số điện thoại <span className={styles.required}>*</span>
                </label>
                <input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => handleFieldChange('phoneNumber', e.target.value)}
                  className={`${styles.formControl} ${errors.phoneNumber ? styles.invalid : ''}`}
                />
                {errors.phoneNumber && <p className={styles.errorMessage}>{errors.phoneNumber}</p>}
              </div>

              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label htmlFor="address">
                  Địa chỉ <span className={styles.required}>*</span>
                </label>
                <input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleFieldChange('address', e.target.value)}
                  className={`${styles.formControl} ${errors.address ? styles.invalid : ''}`}
                />
                {errors.address && <p className={styles.errorMessage}>{errors.address}</p>}
              </div>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button
              type="button"
              className={`${styles.button} ${styles.buttonOutline}`}
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button type="submit" className={`${styles.button} ${styles.buttonPrimary}`} disabled={isSubmitting}>
              {isSubmitting ? <Spinner size="sm" /> : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

