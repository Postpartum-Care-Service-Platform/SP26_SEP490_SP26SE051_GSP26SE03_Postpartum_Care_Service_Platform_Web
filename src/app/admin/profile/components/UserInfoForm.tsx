'use client';

import {
  CalendarIcon,
  ChevronDownIcon,
  HomeIcon,
  MobileIcon,
  PersonIcon,
} from '@radix-ui/react-icons';
import { useEffect, useRef, useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';
import { useToast } from '@/components/ui/toast/use-toast';
import familyProfileService from '@/services/family-profile.service';
import userService from '@/services/user.service';
import type { CreateFamilyProfileRequest } from '@/types/family-profile';

import styles from './change-password-form.module.css';
import { DatePicker } from '../../work-schedule/components/DatePicker';

type FieldErrors = Partial<Record<keyof CreateFamilyProfileRequest, string>>;

const emptyForm: CreateFamilyProfileRequest = {
  memberTypeId: 1,
  fullName: '',
  dateOfBirth: '',
  gender: '',
  address: '',
  phoneNumber: '',
  avatar: null,
};

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error) return error.message || fallback;
  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message?: unknown }).message === 'string'
  ) {
    return (error as { message: string }).message;
  }
  return fallback;
};

const getGenderLabel = (gender: string) => {
  if (gender === 'Male') return 'Nam';
  if (gender === 'Female') return 'Nữ';
  if (gender === 'Other') return 'Khác';
  return 'Chọn giới tính';
};

const parseDateFromApi = (value: string): Date | null => {
  if (!value) return null;
  const [yyyy, mm, dd] = value.split('-').map(Number);
  if (!yyyy || !mm || !dd) return null;
  const date = new Date(yyyy, mm - 1, dd);
  if (Number.isNaN(date.getTime())) return null;
  return date;
};

const formatDateToApi = (date: Date | null): string => {
  if (!date) return '';
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const formatDateDisplay = (value: string): string => {
  const date = parseDateFromApi(value);
  if (!date) return '';
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
};

export function UserInfoForm() {
  const [formData, setFormData] = useState<CreateFamilyProfileRequest>(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isLoading, setIsLoading] = useState(true);
  const [profileId, setProfileId] = useState<number | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        const account = await userService.getCurrentAccount();

        console.log('[UserInfoForm] account:', account);

        const ownerProfile = account.ownerProfile;

        if (!ownerProfile) {
          console.warn('[UserInfoForm] ownerProfile is null');
          toast({ title: 'Không tìm thấy hồ sơ để cập nhật', variant: 'error' });
          return;
        }

        console.log('[UserInfoForm] ownerProfile:', ownerProfile);
        setProfileId(ownerProfile.id);

        setFormData({
          memberTypeId: ownerProfile.memberTypeId ?? 1,
          fullName: ownerProfile.fullName ?? '',
          dateOfBirth: ownerProfile.dateOfBirth ? ownerProfile.dateOfBirth.slice(0, 10) : '',
          gender: ownerProfile.gender ?? '',
          address: ownerProfile.address ?? '',
          // Fallback: nếu profile chưa có SĐT thì dùng SĐT tài khoản
          phoneNumber: ownerProfile.phoneNumber ?? account.phone ?? '',
          avatar: null,
        });
      } catch (error) {
        console.error('[UserInfoForm] fetch error:', error);
        toast({
          title: getErrorMessage(error, 'Không thể tải thông tin người dùng'),
          variant: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    };

    void loadProfile();
  }, [toast]);

  useEffect(() => {
    if (!showDatePicker) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDatePicker]);

  const validate = () => {
    const errors: FieldErrors = {};

    if (!formData.fullName.trim()) errors.fullName = 'Vui lòng nhập họ và tên';
    if (!formData.dateOfBirth) errors.dateOfBirth = 'Vui lòng chọn ngày sinh';
    if (!formData.gender.trim()) errors.gender = 'Vui lòng chọn giới tính';
    if (!formData.address.trim()) errors.address = 'Vui lòng nhập địa chỉ';

    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = 'Vui lòng nhập số điện thoại';
    } else if (!/^\d{9,11}$/.test(formData.phoneNumber.trim())) {
      errors.phoneNumber = 'Số điện thoại không hợp lệ';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (field: keyof CreateFamilyProfileRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileId) {
      toast({ title: 'Không tìm thấy ID hồ sơ để cập nhật', variant: 'error' });
      return;
    }
    if (!validate()) return;

    try {
      setIsLoading(true);
      await familyProfileService.updateFamilyProfile(profileId, {
        ...formData,
        fullName: formData.fullName.trim(),
        address: formData.address.trim(),
        phoneNumber: formData.phoneNumber.trim(),
      });

      toast({ title: 'Cập nhật thông tin thành công', variant: 'success' });
    } catch (error) {
      toast({
        title: getErrorMessage(error, 'Cập nhật thông tin thất bại'),
        variant: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h5 className={styles.formTitle}>Thông tin người dùng</h5>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="fullName">
            Họ và tên
          </label>
          <div className={styles.inputWithIcon}>
            <PersonIcon className={styles.inputIcon} />
            <input
              id="fullName"
              placeholder="Nhập họ và tên"
              className={`${styles.input} ${styles.inputWithLeadingIcon} ${fieldErrors.fullName ? styles.inputError : ''}`}
              value={formData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              disabled={isLoading}
            />
          </div>
          {fieldErrors.fullName && <div className={styles.errorMessage}>{fieldErrors.fullName}</div>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="phoneNumber">
            Số điện thoại
          </label>
          <div className={styles.inputWithIcon}>
            <MobileIcon className={styles.inputIcon} />
            <input
              id="phoneNumber"
              placeholder="Nhập số điện thoại"
              className={`${styles.input} ${styles.inputWithLeadingIcon} ${fieldErrors.phoneNumber ? styles.inputError : ''}`}
              value={formData.phoneNumber}
              onChange={(e) => handleChange('phoneNumber', e.target.value)}
              disabled={isLoading}
            />
          </div>
          {fieldErrors.phoneNumber && <div className={styles.errorMessage}>{fieldErrors.phoneNumber}</div>}
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="dateOfBirth">
            Ngày sinh
          </label>
          <div ref={datePickerRef} className={styles.datePickerWrapper}>
            <button
              id="dateOfBirth"
              type="button"
              className={`${styles.input} ${styles.datePickerTrigger} ${fieldErrors.dateOfBirth ? styles.inputError : ''}`}
              onClick={() => !isLoading && setShowDatePicker((v) => !v)}
              disabled={isLoading}
              aria-label="Chọn ngày sinh"
            >
              <span className={!formData.dateOfBirth ? styles.dropdownPlaceholder : ''}>
                {formatDateDisplay(formData.dateOfBirth) || 'mm/dd/yyyy'}
              </span>
              <CalendarIcon className={styles.trailingDateIcon} />
            </button>

            {showDatePicker && (
              <div className={styles.datePickerPopup}>
                <DatePicker
                  value={parseDateFromApi(formData.dateOfBirth)}
                  onChange={(date) => {
                    handleChange('dateOfBirth', formatDateToApi(date));
                    setShowDatePicker(false);
                  }}
                  side="top"
                  title="Ngày sinh"
                />
              </div>
            )}
          </div>
          {fieldErrors.dateOfBirth && <div className={styles.errorMessage}>{fieldErrors.dateOfBirth}</div>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="gender-trigger">
            Giới tính
          </label>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild disabled={isLoading}>
              <button
                id="gender-trigger"
                type="button"
                className={`${styles.input} ${styles.dropdownTrigger} ${styles.inputWithLeadingIcon} ${fieldErrors.gender ? styles.inputError : ''}`}
              >
                <PersonIcon className={styles.inputIcon} />
                <span className={formData.gender ? '' : styles.dropdownPlaceholder}>{getGenderLabel(formData.gender)}</span>
                <ChevronDownIcon className={styles.dropdownChevron} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" sideOffset={6} className={styles.genderDropdownContent}>
              <DropdownMenuItem
                className={`${styles.genderDropdownItem} ${formData.gender === 'Male' ? styles.genderDropdownItemActive : ''}`}
                onClick={() => handleChange('gender', 'Male')}
              >
                Nam
              </DropdownMenuItem>
              <DropdownMenuItem
                className={`${styles.genderDropdownItem} ${formData.gender === 'Female' ? styles.genderDropdownItemActive : ''}`}
                onClick={() => handleChange('gender', 'Female')}
              >
                Nữ
              </DropdownMenuItem>
              <DropdownMenuItem
                className={`${styles.genderDropdownItem} ${formData.gender === 'Other' ? styles.genderDropdownItemActive : ''}`}
                onClick={() => handleChange('gender', 'Other')}
              >
                Khác
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {fieldErrors.gender && <div className={styles.errorMessage}>{fieldErrors.gender}</div>}
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="address">
            Địa chỉ
          </label>
          <div className={styles.inputWithIcon}>
            <HomeIcon className={styles.inputIcon} />
            <input
              id="address"
              placeholder="Nhập địa chỉ"
              className={`${styles.input} ${styles.inputWithLeadingIcon} ${fieldErrors.address ? styles.inputError : ''}`}
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              disabled={isLoading}
            />
          </div>
          {fieldErrors.address && <div className={styles.errorMessage}>{fieldErrors.address}</div>}
        </div>
      </div>

      <div className={styles.buttonWrapper}>
        <button type="submit" className={styles.submitButton} disabled={isLoading}>
          {isLoading ? 'Đang xử lý...' : 'Cập nhật thông tin'}
        </button>
      </div>
    </form>
  );
}
