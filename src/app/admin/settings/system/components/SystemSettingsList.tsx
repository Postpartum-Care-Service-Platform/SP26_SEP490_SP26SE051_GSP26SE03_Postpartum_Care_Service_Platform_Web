'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';

import styles from './system-settings-list.module.css';

// Icon for edit action
const Edit2OutlineIcon = ({ fill = '#A47BC8', size = 16 }: { fill?: string; size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill={fill}>
    <g data-name="Layer 2">
      <g data-name="edit-2">
        <rect width="24" height="24" opacity="0" />
        <path d="M19 20H5a1 1 0 0 0 0 2h14a1 1 0 0 0 0-2z" />
        <path d="M5 18h.09l4.17-.38a2 2 0 0 0 1.21-.57l9-9a1.92 1.92 0 0 0-.07-2.71L16.66 2.6A2 2 0 0 0 14 2.53l-9 9a2 2 0 0 0-.57 1.21L4 16.91a1 1 0 0 0 .29.8A1 1 0 0 0 5 18zM15.27 4L18 6.73l-2 1.95L13.32 6zm-8.9 8.91L12 7.32l2.7 2.7-5.6 5.6-3 .28z" />
      </g>
    </g>
  </svg>
);

export type SystemSetting = {
  id: number;
  key: string;
  value: string;
  description: string;
  group: string;
  dataType: string;
  isEditable: boolean;
  updatedAt: string;
};

type Props = {
  settings: SystemSetting[];
  groupDisplayName?: string;
  onEdit?: (setting: SystemSetting) => void;
  currentPage: number;
  pageSize: number;
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
  } catch {
    return dateString;
  }
};

export function SystemSettingsList({
  settings,
  onEdit,
  currentPage,
  pageSize,
}: Props) {
  const paginatedSettings = settings.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th style={{ width: '60px' }}>STT</th>
            <th>Key</th>
            <th>Giá trị</th>
            <th>Mô tả</th>
            <th>Kiểu dữ liệu</th>
            <th>Cập nhật</th>
            <th style={{ width: '80px', textAlign: 'center' }}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {paginatedSettings.length === 0 ? (
            <tr>
              <td colSpan={7} className={styles.emptyState}>
                Chưa có cấu hình
              </td>
            </tr>
          ) : (
            paginatedSettings.map((setting, index) => {
              const isDisabled = !setting.isEditable;

              return (
                <tr key={setting.id}>
                  <td>{(currentPage - 1) * pageSize + index + 1}</td>
                  <td className={styles.keyCell} title={setting.key}>
                    {setting.key}
                  </td>
                  <td className={styles.valueCell} title={setting.value}>
                    {setting.value}
                  </td>
                  <td className={styles.descCell} title={setting.description}>
                    {setting.description || '-'}
                  </td>
                  <td>
                    <span className={styles.dataTypeBadge}>{setting.dataType}</span>
                  </td>
                  <td>{formatDate(setting.updatedAt)}</td>
                  <td style={{ textAlign: 'center' }}>
                    <div className={styles.actions} style={{ justifyContent: 'center' }}>
                      <div className={styles.tooltipWrapper}>
                        <Button
                          variant="outline"
                          size="sm"
                          className={`${styles.editButton} btn-icon btn-sm`}
                          onClick={() => onEdit?.(setting)}
                          disabled={!setting.isEditable}
                          aria-label={`Chỉnh sửa ${setting.key}`}
                        >
                          <Edit2OutlineIcon fill={setting.isEditable ? '#A47BC8' : '#9ca3af'} size={16} />
                        </Button>
                        <span className={styles.tooltip}>Chỉnh sửa</span>
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
  );
}
