'use client';

import { Cross1Icon, ChevronDownIcon } from '@radix-ui/react-icons';
import { useState, useEffect } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';
import { useToast } from '@/components/ui/toast/use-toast';
import { Spinner } from '@/components/ui/spinner';
import { CustomDatePicker } from './CustomDatePicker';

import styles from './add-contract-modal.module.css';

const getErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === 'string' && error.trim()) return error;
  return fallbackMessage;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

const STATUS_OPTIONS = [
  { value: 'Draft', label: 'Bản nháp' },
  { value: 'Sent', label: 'Đã gửi' },
  { value: 'Signed', label: 'Đã ký' },
  { value: 'Cancelled', label: 'Đã hủy' },
  { value: 'Expired', label: 'Hết hạn' },
];

export function AddContractModal({ open, onOpenChange, onSuccess }: Props) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    contractCode: '',
    contractDate: '',
    effectiveFrom: '',
    effectiveTo: '',
    checkinDate: '',
    checkoutDate: '',
    signedDate: '',
    status: 'Draft',
    fileUrl: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      setFormData({
        contractCode: '',
        contractDate: '',
        effectiveFrom: '',
        effectiveTo: '',
        checkinDate: '',
        checkoutDate: '',
        signedDate: '',
        status: 'Draft',
        fileUrl: '',
      });
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      console.log('Create contract:', formData);
      toast({ title: 'Tạo hợp đồng thành công', variant: 'success' });
      onOpenChange(false);
      onSuccess?.();
    } catch (error: unknown) {
      toast({
        title: getErrorMessage(error, 'Tạo hợp đồng thất bại'),
        variant: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  const currentStatusLabel = STATUS_OPTIONS.find(opt => opt.value === formData.status)?.label || 'Bản nháp';

  return (
    <div className={styles.modalOverlay} onClick={() => onOpenChange(false)}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Thêm hợp đồng mới</h2>
          <button onClick={() => onOpenChange(false)} className={styles.closeButton} aria-label="Close">
            <Cross1Icon />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Mã hợp đồng <span className={styles.required}>*</span></label>
                <input
                  type="text"
                  className={styles.formControl}
                  value={formData.contractCode}
                  onChange={(e) => handleFieldChange('contractCode', e.target.value)}
                  placeholder="Nhập mã hợp đồng"
                  required
                />
              </div>

               <div className={styles.formGroup}>
                <label>Ngày hợp đồng <span className={styles.required}>*</span></label>
                <CustomDatePicker
                  date={formData.contractDate}
                  setDate={(val) => handleFieldChange('contractDate', val)}
                  placeholder="Chọn ngày hợp đồng"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Hiệu lực từ <span className={styles.required}>*</span></label>
                <CustomDatePicker
                  date={formData.effectiveFrom}
                  setDate={(val) => handleFieldChange('effectiveFrom', val)}
                  placeholder="Chọn ngày có hiệu lực"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Hiệu lực đến <span className={styles.required}>*</span></label>
                <CustomDatePicker
                  date={formData.effectiveTo}
                  setDate={(val) => handleFieldChange('effectiveTo', val)}
                  placeholder="Chọn ngày hết hạn"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Ngày check-in <span className={styles.required}>*</span></label>
                <CustomDatePicker
                  date={formData.checkinDate}
                  setDate={(val) => handleFieldChange('checkinDate', val)}
                  placeholder="Chọn ngày check-in"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Ngày check-out <span className={styles.required}>*</span></label>
                <CustomDatePicker
                  date={formData.checkoutDate}
                  setDate={(val) => handleFieldChange('checkoutDate', val)}
                  placeholder="Chọn ngày check-out"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Ngày ký</label>
                <CustomDatePicker
                  date={formData.signedDate}
                  setDate={(val) => handleFieldChange('signedDate', val)}
                  placeholder="Chọn ngày ký"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Trạng thái</label>
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <button type="button" className={styles.dropdownTrigger}>
                      <span className={formData.status ? styles.dropdownValueSelected : styles.dropdownPlaceholder}>
                        {currentStatusLabel}
                      </span>
                      <ChevronDownIcon className={styles.dropdownChevron} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className={styles.dropdownContent} align="start">
                    {STATUS_OPTIONS.map((opt) => (
                      <DropdownMenuItem
                        key={opt.value}
                        className={`${styles.dropdownItem} ${formData.status === opt.value ? styles.dropdownItemActive : ''}`}
                        onClick={() => handleFieldChange('status', opt.value)}
                      >
                        {opt.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label>File URL (Gắn link Cloudinary hoặc Drive)</label>
                <input
                  type="text"
                  className={styles.formControl}
                  value={formData.fileUrl}
                  onChange={(e) => handleFieldChange('fileUrl', e.target.value)}
                  placeholder="https://cloudinary.com/..."
                />
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
            <button
              type="submit"
              className={`${styles.button} ${styles.buttonPrimary}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner size="sm" />
                  <span style={{ marginLeft: '8px' }}>Đang tạo...</span>
                </>
              ) : 'Thêm hợp đồng'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
