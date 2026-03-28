'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';
import type { AppointmentTypeDetail } from '@/types/appointment-type';
import styles from './appointment-type-table.module.css';

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
    <g data-name="Layer 2"><g data-name="edit-2">
      <rect width="24" height="24" opacity="0" />
      <path d="M19 20H5a1 1 0 0 0 0 2h14a1 1 0 0 0 0-2z" />
      <path d="M5 18h.09l4.17-.38a2 2 0 0 0 1.21-.57l9-9a1.92 1.92 0 0 0-.07-2.71L16.66 2.6A2 2 0 0 0 14 2.53l-9 9a2 2 0 0 0-.57 1.21L4 16.91a1 1 0 0 0 .29.8A1 1 0 0 0 5 18zM15.27 4L18 6.73l-2 1.95L13.32 6zm-8.9 8.91L12 7.32l2.7 2.7-5.6 5.6-3 .28z" />
    </g></g>
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
    <g data-name="Layer 2"><g data-name="trash-2">
      <rect width="24" height="24" opacity="0" />
      <path d="M21 6h-5V4.33A2.42 2.42 0 0 0 13.5 2h-3A2.42 2.42 0 0 0 8 4.33V6H3a1 1 0 0 0 0 2h1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8h1a1 1 0 0 0 0-2zM10 4.33c0-.16.21-.33.5-.33h3c.29 0 .5.17.5.33V6h-4zM18 19a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V8h12z" />
      <path d="M9 17a1 1 0 0 0 1-1v-4a1 1 0 0 0-2 0v4a1 1 0 0 0 1 1z" />
      <path d="M15 17a1 1 0 0 0 1-1v-4a1 1 0 0 0-2 0v4a1 1 0 0 0 1 1z" />
    </g></g>
  </svg>
);

type Props = {
  appointmentTypes: AppointmentTypeDetail[];
  onEdit?: (item: AppointmentTypeDetail) => void;
  onDelete?: (item: AppointmentTypeDetail) => void;
  onToggleStatus?: (item: AppointmentTypeDetail, newStatus: boolean) => void;
  deletingId?: number | null;
  updatingStatusIds?: Set<number>;
  pagination?: {
    currentPage: number;
    pageSize: number;
  };
};

const formatDate = (dateString?: string) => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  } catch { return dateString; }
};

export function AppointmentTypeTable({
  appointmentTypes,
  onEdit,
  onDelete,
  onToggleStatus,
  deletingId,
  updatingStatusIds = new Set(),
  pagination,
}: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.sttHeaderCell}>STT</th>
              <th>Tên loại lịch hẹn</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th className={styles.stickyActionsCol}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {appointmentTypes.length === 0 ? (
              <tr>
                <td colSpan={5} className={styles.emptyState}>
                  Chưa có loại lịch hẹn nào
                </td>
              </tr>
            ) : (
              appointmentTypes.map((item, index) => {
                const stt = pagination ? (pagination.currentPage - 1) * pagination.pageSize + index + 1 : index + 1;
                return (
                  <tr key={item.id}>
                    <td>
                      <div className={styles.tooltipWrapper}>
                        <span className={styles.sttCell}>{stt}</span>
                        <span className={styles.tooltip}>ID: {item.id}</span>
                      </div>
                    </td>
                    <td className={styles.nameCell} title={item.name}>{item.name}</td>
                    <td>
                      <div className={styles.tooltipWrapper}>
                        <DropdownMenu modal={false}>
                          <DropdownMenuTrigger asChild>
                            <button
                              type="button"
                              className={`${styles.plainTrigger} ${item.isActive ? styles.statusActive : styles.statusInactive}`}
                              disabled={updatingStatusIds.has(item.id)}
                            >
                              <div className={`${styles.statusIndicator} ${styles.statusAnimated}`}>
                                <span className={styles.statusCircle}></span>
                              </div>
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className={styles.statusMenu} align="start" sideOffset={4}>
                            <DropdownMenuItem className={styles.statusMenuItem} onClick={() => onToggleStatus?.(item, true)}>
                              Hoạt động
                            </DropdownMenuItem>
                            <DropdownMenuItem className={styles.statusMenuItem} onClick={() => onToggleStatus?.(item, false)}>
                              Tạm dừng
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <span className={styles.tooltip}>
                          {item.isActive ? 'Đang hoạt động' : 'Tạm dừng'}
                        </span>
                      </div>
                    </td>
                    <td>{formatDate(item.createdAt)}</td>
                    <td className={styles.stickyActionsCol}>
                      <div className={styles.actions}>
                        <div className={styles.tooltipWrapper}>
                          <Button
                            variant="outline"
                            size="sm"
                            className={styles.editButton}
                            onClick={() => onEdit?.(item)}
                          >
                            <EditIcon />
                          </Button>
                          <span className={styles.tooltip}>Chỉnh sửa</span>
                        </div>
                        <div className={styles.tooltipWrapper}>
                          <Button
                            variant="outline"
                            size="sm"
                            className={styles.deleteButton}
                            onClick={() => onDelete?.(item)}
                            disabled={deletingId === item.id}
                          >
                            <TrashIcon />
                          </Button>
                          <span className={styles.tooltip}>Xóa</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
