'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import type { Role } from '@/types/role';

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
  onUpdateRole?: (role: Role, newRoleName: string) => void;
  roles: Role[];
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
  groupDisplayName,
  onEdit,
  onUpdateRole,
  roles,
}: Props) {
  const [localValues, setLocalValues] = useState<Record<number, string>>({});
  const [savingId, setSavingId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const handleChange = (id: number, value: string) => {
    setLocalValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleSaveRole = async (role: Role) => {
    const newValue = localValues[role.id] ?? role.roleName;
    if (newValue === role.roleName || !onUpdateRole) return;

    try {
      setSavingId(role.id);
      await onUpdateRole(role, newValue);
      setLocalValues((prev) => {
        const updated = { ...prev };
        delete updated[role.id];
        return updated;
      });
    } finally {
      setSavingId(null);
    }
  };

  const paginatedSettings = settings.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(settings.length / pageSize);

  return (
    <div className={styles.container}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Key</th>
              <th>Giá trị</th>
              <th>Mô tả</th>
              <th>Kiểu dữ liệu</th>
              <th>Cập nhật</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {paginatedSettings.length === 0 ? (
              <tr>
                <td colSpan={6} className={styles.emptyState}>
                  Chưa có cấu hình
                </td>
              </tr>
            ) : (
              paginatedSettings.map((setting) => {
                const currentValue = localValues[setting.id] ?? setting.value;
                const isSaving = savingId === setting.id;
                const isDisabled = !setting.isEditable || isSaving;

                return (
                  <tr key={setting.id}>
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
                    <td>
                      <div className={styles.actions}>
                        {setting.group === 'Role' ? (
                          // Role row - keep inline edit
                          <>
                            <input
                              className={styles.valueInput}
                              type="text"
                              value={currentValue}
                              disabled={isDisabled}
                              onChange={(e) => handleChange(setting.id, e.target.value)}
                            />
                            <div className={styles.tooltipWrapper}>
                              <Button
                                variant="outline"
                                size="sm"
                                className={`${styles.saveButton} btn-icon btn-sm`}
                                disabled={isDisabled || currentValue === setting.value}
                                onClick={() => handleSaveRole(roles.find(r => r.id === setting.id) || roles[0])}
                                aria-label={`Lưu ${setting.key}`}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill={isDisabled || currentValue === setting.value ? '#9ca3af' : '#22c55e'}>
                                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                </svg>
                              </Button>
                              <span className={styles.tooltip}>Lưu</span>
                            </div>
                          </>
                        ) : (
                          // Regular setting - show edit button
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

      {totalPages > 1 && (
        <div className={styles.paginationWrapper}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={settings.length}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
