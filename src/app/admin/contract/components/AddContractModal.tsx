'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/toast/use-toast';
import styles from './add-contract-modal.module.css';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

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
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    } else {
      document.body.style.paddingRight = '';
    }

    return () => {
      document.body.style.paddingRight = '';
    };
  }, [open]);

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      console.log('Create contract:', formData);
      toast({ title: 'Tạo hợp đồng thành công', variant: 'success' });
      onOpenChange(false);
      onSuccess?.();
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
    } catch (err: any) {
      toast({ title: err?.message || 'Tạo hợp đồng thất bại', variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
      <DialogContent className={styles.dialogContent}>
        <DialogHeader>
          <DialogTitle className={styles.dialogTitle}>Thêm hợp đồng mới</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            <div className={styles.formField}>
              <label className={styles.label}>Mã hợp đồng</label>
              <Input
                variant="booking"
                value={formData.contractCode}
                onChange={(e) => handleFieldChange('contractCode', e.target.value)}
                placeholder="Nhập mã hợp đồng"
                required
              />
            </div>

            <div className={styles.formField}>
              <label className={styles.label}>Ngày hợp đồng</label>
              <Input
                type="date"
                variant="booking"
                value={formData.contractDate}
                onChange={(e) => handleFieldChange('contractDate', e.target.value)}
                required
              />
            </div>

            <div className={styles.formField}>
              <label className={styles.label}>Hiệu lực từ</label>
              <Input
                type="date"
                variant="booking"
                value={formData.effectiveFrom}
                onChange={(e) => handleFieldChange('effectiveFrom', e.target.value)}
                required
              />
            </div>

            <div className={styles.formField}>
              <label className={styles.label}>Hiệu lực đến</label>
              <Input
                type="date"
                variant="booking"
                value={formData.effectiveTo}
                onChange={(e) => handleFieldChange('effectiveTo', e.target.value)}
                required
              />
            </div>

            <div className={styles.formField}>
              <label className={styles.label}>Ngày check-in</label>
              <Input
                type="date"
                variant="booking"
                value={formData.checkinDate}
                onChange={(e) => handleFieldChange('checkinDate', e.target.value)}
                required
              />
            </div>

            <div className={styles.formField}>
              <label className={styles.label}>Ngày check-out</label>
              <Input
                type="date"
                variant="booking"
                value={formData.checkoutDate}
                onChange={(e) => handleFieldChange('checkoutDate', e.target.value)}
                required
              />
            </div>

            <div className={styles.formField}>
              <label className={styles.label}>Ngày ký</label>
              <Input
                type="date"
                variant="booking"
                value={formData.signedDate}
                onChange={(e) => handleFieldChange('signedDate', e.target.value)}
              />
            </div>

            <div className={styles.formField}>
              <label className={styles.label}>Trạng thái</label>
              <Select value={formData.status} onValueChange={(value) => handleFieldChange('status', value)}>
                <SelectTrigger className={styles.selectTrigger}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Bản nháp</SelectItem>
                  <SelectItem value="Sent">Đã gửi</SelectItem>
                  <SelectItem value="Signed">Đã ký</SelectItem>
                  <SelectItem value="Cancelled">Đã hủy</SelectItem>
                  <SelectItem value="Expired">Hết hạn</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className={styles.formFieldFull}>
              <label className={styles.label}>File URL</label>
              <Input
                variant="booking"
                value={formData.fileUrl}
                onChange={(e) => handleFieldChange('fileUrl', e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>

          <DialogFooter className={styles.footer}>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Đang tạo...' : 'Thêm hợp đồng'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

