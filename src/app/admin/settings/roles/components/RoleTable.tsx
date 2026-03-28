'use client';

import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import type { Role } from '@/types/role';

import styles from './role-table.module.css';

const Edit2OutlineIcon = ({ fill = '#A47BC8', size = 16 }: { fill?: string; size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" className="eva eva-edit-2-outline" fill={fill}>
    <g data-name="Layer 2">
      <g data-name="edit-2">
        <rect width="24" height="24" opacity="0" />
        <path d="M19 20H5a1 1 0 0 0 0 2h14a1 1 0 0 0 0-2z" />
        <path d="M5 18h.09l4.17-.38a2 2 0 0 0 1.21-.57l9-9a1.92 1.92 0 0 0-.07-2.71L16.66 2.6A2 2 0 0 0 14 2.53l-9 9a2 2 0 0 0-.57 1.21L4 16.91a1 1 0 0 0 .29.8A1 1 0 0 0 5 18zM15.27 4L18 6.73l-2 1.95L13.32 6zm-8.9 8.91L12 7.32l2.7 2.7-5.6 5.6-3 .28z" />
      </g>
    </g>
  </svg>
);

const Trash2OutlineIcon = ({ fill = '#FD6161', size = 16 }: { fill?: string; size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" className="eva eva-trash-2-outline" fill={fill}>
    <g data-name="Layer 2">
      <g data-name="trash-2">
        <rect width="24" height="24" opacity="0" />
        <path d="M21 6h-5V4.33A2.42 2.42 0 0 0 13.5 2h-3A2.42 2.42 0 0 0 8 4.33V6H3a1 1 0 0 0 0 2h1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8h1a1 1 0 0 0 0-2zM10 4.33c0-.16.21-.33.5-.33h3c.29 0 .5.17.5.33V6h-4zM18 19a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V8h12z" />
        <path d="M9 17a1 1 0 0 0 1-1v-4a1 1 0 0 0-2 0v4a1 1 0 0 0 1 1z" />
        <path d="M15 17a1 1 0 0 0 1-1v-4a1 1 0 0 0-2 0v4a1 1 0 0 0 1 1z" />
      </g>
    </g>
  </svg>
);

type Props = {
  roles: Role[];
  onEdit?: (role: Role) => void;
  onDelete?: (role: Role) => void;
  deletingId?: number | null;
  pagination: {
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
  } catch {
    return dateString;
  }
};

export function RoleTable({ roles, onEdit, onDelete, deletingId, pagination }: Props) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.stickySttCol} title="Số thứ tự">STT</th>
            <th>Tên vai trò</th>
            <th>Mô tả</th>
            <th>Cập nhật</th>
            <th className={styles.stickyActionsCol}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
            {roles.length === 0 ? (
              <tr>
                <td colSpan={5} className={styles.emptyState}>
                  Chua co vai tro nao
                </td>
              </tr>
            ) : (
              roles.map((role, index) => {
                const stt = pagination
                  ? (pagination.currentPage - 1) * pagination.pageSize + index + 1
                  : index + 1;

                return (
                  <tr key={role.id} className={styles.tableRow}>
                    <td className={styles.stickySttCol}>
                      <span className={styles.sttCell} title={`ID gốc: ${role.id}`}>
                        {stt}
                      </span>
                    </td>
                    <td className={styles.name} title={role.roleName}>
                      {role.roleName}
                    </td>
                    <td className={styles.truncateCell} title={role.description}>
                      {role.description || '-'}
                    </td>
                    <td>{formatDate(role.updatedAt)}</td>
                    <td className={styles.stickyActionsCol}>
                      <div className={styles.actions}>
                        <div className={styles.tooltipWrapper}>
                          <Button
                            variant="outline"
                            size="sm"
                            className={`${styles.editButton} btn-icon btn-sm`}
                            onClick={() => onEdit?.(role)}
                            aria-label={`Chỉnh sửa ${role.roleName}`}
                          >
                            <Edit2OutlineIcon fill="#A47BC8" size={16} />
                          </Button>
                          <span className={styles.tooltip}>Chỉnh sửa</span>
                        </div>
                        <div className={styles.tooltipWrapper}>
                          <Button
                            variant="outline"
                            size="sm"
                            className={`${styles.deleteButton} btn-icon btn-sm`}
                            onClick={() => onDelete?.(role)}
                            aria-label={`Xóa ${role.roleName}`}
                            disabled={deletingId === role.id}
                          >
                            <Trash2OutlineIcon fill="#FD6161" size={16} />
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
  );
}
