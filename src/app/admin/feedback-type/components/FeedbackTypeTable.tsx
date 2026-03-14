'use client';

import { Edit2, RotateCcw, Trash2 } from 'lucide-react';
import { Pagination } from '@/components/ui/pagination';
import type { FeedbackType } from '@/types/feedback-type';

import styles from './feedback-type-table.module.css';

type Props = {
  items: FeedbackType[];
  onEdit?: (item: FeedbackType) => void;
  onDelete?: (item: FeedbackType) => void;
  onRestore?: (item: FeedbackType) => void;
  pagination?: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (page: number) => void;
  };
};

export function FeedbackTypeTable({ items, onEdit, onDelete, onRestore, pagination }: Props) {
  return (
    <div className={styles.tableWrapper}>
      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên loại phản hồi</th>
              <th>Mô tả</th>
              <th>Trạng thái</th>
              <th className={styles.actionCol}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className={styles.emptyState}>
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const isDeleted = !!item.isDeleted;
                return (
                  <tr key={item.id}>
                    <td className={styles.idCell}>{item.id}</td>
                    <td className={styles.nameCell}>{item.name}</td>
                    <td className={styles.descriptionCell} title={item.description || ''}>
                      <span className={styles.descriptionText}>{item.description || '-'}</span>
                    </td>
                    <td>
                      <span className={`${styles.statusBadge} ${isDeleted ? styles.statusDeleted : styles.statusActive}`}>
                        {isDeleted ? 'Đã ẩn' : 'Hoạt động'}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          type="button"
                          className={styles.actionButton}
                          onClick={() => onEdit?.(item)}
                          title="Sửa"
                        >
                          <Edit2 size={14} />
                          <span>Sửa</span>
                        </button>
                        {isDeleted ? (
                          <button
                            type="button"
                            className={`${styles.actionButton} ${styles.restoreButton}`}
                            onClick={() => onRestore?.(item)}
                            title="Khôi phục"
                          >
                            <RotateCcw size={14} />
                            <span>Khôi phục</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            className={`${styles.actionButton} ${styles.deleteButton}`}
                            onClick={() => onDelete?.(item)}
                            title="Ẩn"
                          >
                            <Trash2 size={14} />
                            <span>Ẩn</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalPages > 0 && (
        <div className={styles.paginationWrapper}>
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            pageSize={pagination.pageSize}
            totalItems={pagination.totalItems}
            onPageChange={pagination.onPageChange}
            pageSizeOptions={pagination.pageSizeOptions}
            onPageSizeChange={pagination.onPageSizeChange}
            showResultCount={true}
          />
        </div>
      )}
    </div>
  );
}
