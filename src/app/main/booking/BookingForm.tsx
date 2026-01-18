'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button/Button';
import { Input } from '@/components/ui/Input/Input';
import { Textarea } from '@/components/ui/textarea/Textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select/Select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

import packageService from '@/services/package.service';
import type { Package } from '@/types/package';

import styles from './booking.module.css';

export function BookingForm() {
  const searchParams = useSearchParams();
  const packageIdParam = searchParams.get('packageId');
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [loadingPackage, setLoadingPackage] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    nationality: '',
    phone: '',
    email: '',
    address: '',
    firstTime: '',
    dueDate: '',
    source: '',
    message: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  // Fetch package data nếu có packageId trong URL
  useEffect(() => {
    const fetchPackage = async () => {
      if (packageIdParam) {
        try {
          setLoadingPackage(true);
          const packageData = await packageService.getPackageById(parseInt(packageIdParam, 10));
          setSelectedPackage(packageData);
        } catch (err) {
          console.error('Lỗi khi tải thông tin gói dịch vụ:', err);
        } finally {
          setLoadingPackage(false);
        }
      }
    };

    fetchPackage();
  }, [packageIdParam]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Đặt lịch ngay</h1>

      {/* Hiển thị thông tin gói dịch vụ đã chọn */}
      {selectedPackage && (
        <div className={styles.selectedPackage}>
          <h3 className={styles.packageTitle}>Gói dịch vụ đã chọn</h3>
          <div className={styles.packageInfo}>
            <div className={styles.packageName}>{selectedPackage.packageName}</div>
            {selectedPackage.description && (
              <div className={styles.packageDescription}>{selectedPackage.description}</div>
            )}
            <div className={styles.packageDetails}>
              {selectedPackage.durationDays && (
                <span className={styles.duration}>Thời gian: {selectedPackage.durationDays} ngày</span>
              )}
              <span className={styles.price}>
                Giá: {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                }).format(selectedPackage.basePrice)}
              </span>
            </div>
          </div>
        </div>
      )}

      <form className={styles.form}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Thông tin liên hệ</h3>
          
          <div className={styles.twoCol}>
            <div className={styles.field}>
              <label htmlFor="fullName" className={styles.label}>
                Họ và Tên
              </label>
              <Input 
                id="fullName" 
                variant="profile" 
                placeholder="Nhập họ và tên" 
                className={styles.input}
                value={formData.fullName}
                onChange={handleInputChange}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="nationality" className={styles.label}>
                Quốc tịch
              </label>
              <Select value={formData.nationality} onValueChange={(value) => handleSelectChange('nationality', value)}>
                <SelectTrigger className={styles.selectTrigger}>
                  <SelectValue placeholder="Chọn quốc tịch" />
                </SelectTrigger>
                <SelectContent className={styles.selectContent} position="popper">
                  <SelectItem className={styles.selectItem} value="VN">
                    Việt Nam
                  </SelectItem>
                  <SelectItem className={styles.selectItem} value="Other">
                    Khác
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className={styles.twoCol}>
            <div className={styles.field}>
              <label htmlFor="phone" className={styles.label}>
                Số điện thoại
              </label>
              <Input 
                id="phone" 
                variant="profile" 
                placeholder="Nhập số điện thoại" 
                type="tel" 
                className={styles.input}
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <Input 
                id="email" 
                variant="profile" 
                placeholder="Nhập email" 
                type="email" 
                className={styles.input}
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="address" className={styles.label}>
              Quận/Huyện và Thành phố
            </label>
            <Input 
              id="address" 
              variant="profile" 
              placeholder="Nhập địa chỉ" 
              className={styles.input}
              value={formData.address}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Thông tin thai sản</h3>
          
          <div className={styles.twoCol}>
            <div className={styles.field}>
              <label htmlFor="firstTime" className={styles.label}>
                Đây là lần đầu bạn sinh con?
              </label>
              <Select value={formData.firstTime} onValueChange={(value) => handleSelectChange('firstTime', value)}>
                <SelectTrigger className={styles.selectTrigger}>
                  <SelectValue placeholder="Lựa chọn" />
                </SelectTrigger>
                <SelectContent className={styles.selectContent} position="popper">
                  <SelectItem className={styles.selectItem} value="yes">
                    Có
                  </SelectItem>
                  <SelectItem className={styles.selectItem} value="no">
                    Không
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className={styles.field}>
              <label htmlFor="dueDate" className={styles.label}>
                Tháng dự sinh
              </label>
              <Input 
                id="dueDate" 
                type="date"
                variant="profile" 
                className={styles.input}
                value={formData.dueDate}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Thông tin khác</h3>
          
          <div className={styles.field}>
            <label htmlFor="source" className={styles.label}>
              Bạn biết đến The Joyful Nest như thế nào?
            </label>
            <Select value={formData.source} onValueChange={(value) => handleSelectChange('source', value)}>
              <SelectTrigger className={styles.selectTrigger}>
                <SelectValue placeholder="Chọn phương thức" />
              </SelectTrigger>
              <SelectContent className={styles.selectContent} position="popper">
                <SelectItem className={styles.selectItem} value="facebook">
                  Facebook
                </SelectItem>
                <SelectItem className={styles.selectItem} value="instagram">
                  Instagram
                </SelectItem>
                <SelectItem className={styles.selectItem} value="google">
                  Google
                </SelectItem>
                <SelectItem className={styles.selectItem} value="friend">
                  Bạn bè giới thiệu
                </SelectItem>
                <SelectItem className={styles.selectItem} value="other">
                  Khác
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className={styles.field}>
            <label htmlFor="message" className={styles.label}>
              Lời nhắn
            </label>
            <Textarea
              id="message"
              variant="booking"
              placeholder="Ví dụ: Ngày giờ bạn muốn ghé thăm The Joyful Nest."
              className={styles.textarea}
              value={formData.message}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className={styles.actions}>
          <Button 
            type="button" 
            variant="outline" 
            onClick={handlePreview}
            className={styles.actionsButton}
          >
            Xem trước
          </Button>
          <Button 
            type="submit" 
            variant="booking" 
            size="booking" 
            className={styles.actionsButton}
          >
            Hoàn tất
          </Button>
        </div>
      </form>

      {/* Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className={styles.previewDialog}>
          <DialogHeader>
            <DialogTitle className={styles.previewTitle}>Xem trước thông tin đặt lịch</DialogTitle>
            <DialogDescription className={styles.previewDescription}>
              Vui lòng kiểm tra lại thông tin trước khi hoàn tất
            </DialogDescription>
          </DialogHeader>
          
          <div className={styles.previewContent}>
            {selectedPackage && (
              <div className={styles.previewSection}>
                <h4 className={styles.previewSectionTitle}>Gói dịch vụ</h4>
                <div className={styles.previewPackage}>
                  <div className={styles.previewPackageName}>{selectedPackage.packageName}</div>
                  <div className={styles.previewPackagePrice}>
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(selectedPackage.basePrice)}
                  </div>
                </div>
              </div>
            )}

            <div className={styles.previewSection}>
              <h4 className={styles.previewSectionTitle}>Thông tin liên hệ</h4>
              <div className={styles.previewInfo}>
                <div className={styles.previewRow}>
                  <span className={styles.previewLabel}>Họ và Tên:</span>
                  <span className={styles.previewValue}>{formData.fullName || 'Chưa nhập'}</span>
                </div>
                <div className={styles.previewRow}>
                  <span className={styles.previewLabel}>Quốc tịch:</span>
                  <span className={styles.previewValue}>
                    {formData.nationality === 'VN' ? 'Việt Nam' : formData.nationality === 'Other' ? 'Khác' : 'Chưa chọn'}
                  </span>
                </div>
                <div className={styles.previewRow}>
                  <span className={styles.previewLabel}>Số điện thoại:</span>
                  <span className={styles.previewValue}>{formData.phone || 'Chưa nhập'}</span>
                </div>
                <div className={styles.previewRow}>
                  <span className={styles.previewLabel}>Email:</span>
                  <span className={styles.previewValue}>{formData.email || 'Chưa nhập'}</span>
                </div>
                <div className={styles.previewRow}>
                  <span className={styles.previewLabel}>Địa chỉ:</span>
                  <span className={styles.previewValue}>{formData.address || 'Chưa nhập'}</span>
                </div>
              </div>
            </div>

            <div className={styles.previewSection}>
              <h4 className={styles.previewSectionTitle}>Thông tin thai sản</h4>
              <div className={styles.previewInfo}>
                <div className={styles.previewRow}>
                  <span className={styles.previewLabel}>Lần đầu sinh con:</span>
                  <span className={styles.previewValue}>
                    {formData.firstTime === 'yes' ? 'Có' : formData.firstTime === 'no' ? 'Không' : 'Chưa chọn'}
                  </span>
                </div>
                <div className={styles.previewRow}>
                  <span className={styles.previewLabel}>Tháng dự sinh:</span>
                  <span className={styles.previewValue}>{formData.dueDate || 'Chưa nhập'}</span>
                </div>
              </div>
            </div>

            <div className={styles.previewSection}>
              <h4 className={styles.previewSectionTitle}>Thông tin khác</h4>
              <div className={styles.previewInfo}>
                <div className={styles.previewRow}>
                  <span className={styles.previewLabel}>Biết đến qua:</span>
                  <span className={styles.previewValue}>
                    {formData.source === 'facebook' ? 'Facebook' :
                     formData.source === 'instagram' ? 'Instagram' :
                     formData.source === 'google' ? 'Google' :
                     formData.source === 'friend' ? 'Bạn bè giới thiệu' :
                     formData.source === 'other' ? 'Khác' : 'Chưa chọn'}
                  </span>
                </div>
                {formData.message && (
                  <div className={styles.previewRow}>
                    <span className={styles.previewLabel}>Lời nhắn:</span>
                    <span className={styles.previewValue}>{formData.message}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}





