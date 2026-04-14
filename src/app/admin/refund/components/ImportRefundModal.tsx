'use client';

import { Cross1Icon, FileTextIcon, InfoCircledIcon, TrashIcon, UploadIcon } from '@radix-ui/react-icons';
import { useState, useRef } from 'react';

import { Spinner } from '@/components/ui/spinner';
import { useToast } from '@/components/ui/toast/use-toast';
import refundRequestService from '@/services/refund-request.service';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import styles from './import-refund-modal.module.css';

interface ImportRefundModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const ImportRefundModal: React.FC<ImportRefundModalProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (file: File) => {
    const isExcel = 
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
      file.type === 'application/vnd.ms-excel' ||
      file.name.endsWith('.xlsx') ||
      file.name.endsWith('.xls');

    if (!isExcel) {
      toast({ 
        title: 'Định dạng file không hợp lệ', 
        description: 'Vui lòng chọn file Excel (.xlsx hoặc .xls)', 
        variant: 'error' 
      });
      return;
    }

    setFile(file);
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    try {
      setIsUploading(true);
      await refundRequestService.importRefundRequests(file);
      
      toast({ 
        title: 'Nhập dữ liệu thành công', 
        description: `Đã nhập dữ liệu từ file ${file.name} thành công.`,
        variant: 'success' 
      });
      
      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      toast({ 
        title: 'Lỗi khi nhập dữ liệu', 
        description: err.message || 'Vui lòng kiểm tra lại định dạng file Excel.', 
        variant: 'error' 
      });
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!open) return null;

  return (
    <div className={styles.modalOverlay} onClick={() => !isUploading && onOpenChange(false)}>
      <div 
        className={styles.modalContent} 
        onClick={(e) => e.stopPropagation()}
        role="dialog" 
        aria-modal="true"
      >
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Nhập yêu cầu hoàn tiền từ Excel</h2>
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <button 
                onClick={() => onOpenChange(false)} 
                className={styles.closeButton} 
                disabled={isUploading}
              >
                <Cross1Icon />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              Đóng
            </TooltipContent>
          </Tooltip>
        </div>

        <div className={styles.modalBody}>
          <div 
            className={`${styles.dropZone} ${isDragActive ? styles.dropZoneActive : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              accept=".xlsx, .xls"
            />
            <div className={styles.uploadIconWrapper}>
              <UploadIcon width={24} height={24} />
            </div>
            <p className={styles.dropZoneTitle}>Kéo và thả file Excel vào đây</p>
            <p className={styles.dropZoneDesc}>Hoặc click để chọn file từ máy tính của bạn</p>
            <button type="button" className={styles.browseButton}>Chọn file</button>
          </div>

          {file && (
            <div className={styles.fileInfo}>
              <div className={styles.excelIconWrapper}>
                <FileTextIcon width={20} height={20} />
              </div>
              <div className={styles.fileDetails}>
                <span className={styles.fileName}>{file.name}</span>
                <span className={styles.fileSize}>{formatFileSize(file.size)}</span>
              </div>
              <button 
                className={styles.removeButton} 
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile();
                }}
                disabled={isUploading}
                title="Gỡ bỏ file"
              >
                <TrashIcon width={16} height={16} />
              </button>
            </div>
          )}

          <div className={styles.templateSection}>
            <InfoCircledIcon className={styles.infoIcon} width={18} height={18} />
            <div className={styles.templateText}>
              <span className={styles.templateTitle}>Sử dụng file mẫu</span>
              <p className={styles.templateDesc}>
                Để đảm bảo dữ liệu được nhập chính xác, vui lòng sử dụng file mẫu của hệ thống. 
                Bạn có thể <span className={styles.downloadLink}>tải file mẫu tại đây</span>.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button
            type="button"
            className={`${styles.button} ${styles.buttonOutline}`}
            onClick={() => onOpenChange(false)}
            disabled={isUploading}
          >
            Hủy
          </button>
          <button 
            type="button" 
            className={`${styles.button} ${styles.buttonPrimary}`} 
            disabled={!file || isUploading}
            onClick={handleSubmit}
          >
            {isUploading ? (
              <>
                <Spinner size="sm" />
                <span>Đang tải lên...</span>
              </>
            ) : (
              <>
                <UploadIcon />
                <span>Nhập dữ liệu</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
