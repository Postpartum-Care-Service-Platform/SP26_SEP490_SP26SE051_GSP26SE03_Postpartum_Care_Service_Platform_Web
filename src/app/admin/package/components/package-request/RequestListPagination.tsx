'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CustomDropdown } from '@/components/ui/custom-dropdown';
import styles from '../package-request-list-modal.module.css';

interface RequestListPaginationProps {
  pageSize: string;
  onPageSizeChange: (value: string) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  totalPages: number;
  pageSizeOptions: { label: string; value: string }[];
}

export const RequestListPagination: React.FC<RequestListPaginationProps> = ({
  pageSize,
  onPageSizeChange,
  currentPage,
  onPageChange,
  totalItems,
  totalPages,
  pageSizeOptions,
}) => {
  const startItem = (currentPage - 1) * parseInt(pageSize) + 1;
  const endItem = Math.min(currentPage * parseInt(pageSize), totalItems);

  return (
    <div className={styles.modalFooter}>
      <div className={styles.paginationLeft}>
        <div className={styles.pageSizeWrapper}>
          <span className={styles.paginationLabel}>Dòng/trang:</span>
          <CustomDropdown
            options={pageSizeOptions}
            value={pageSize}
            onChange={onPageSizeChange}
            triggerClassName={styles.pageSizeDropdownTrigger}
            contentClassName={styles.pageSizeDropdownContent}
          />
        </div>
        <span className={styles.paginationStats}>
          Hiển thị <span className={styles.highlight}>{startItem} - {endItem}</span> trên tổng <span className={styles.highlight}>{totalItems}</span> kết quả
        </span>
      </div>
      
      <div className={styles.paginationActions}>
        <button 
          className={styles.pageBtn} 
          onClick={() => onPageChange(Math.max(1, currentPage - 1))} 
          disabled={currentPage === 1}
          title="Trang trước"
        >
          <ChevronLeft size={16} />
        </button>
        
        <div className={styles.pageNumbers}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button 
              key={page} 
              className={`${styles.pageNumberBtn} ${currentPage === page ? styles.pageNumberBtnActive : ''}`} 
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          ))}
        </div>

        <button 
          className={styles.pageBtn} 
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} 
          disabled={currentPage === totalPages}
          title="Trang sau"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};
