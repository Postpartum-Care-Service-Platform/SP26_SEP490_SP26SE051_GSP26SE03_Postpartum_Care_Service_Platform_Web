'use client';

import type { MenuRecord } from '@/types/menu-record';
import type { Account } from '@/types/account';
import type { Menu } from '@/types/menu';
import styles from './menu-record-table.module.css';

const Edit2OutlineIcon = ({ size = 16 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" className="eva eva-edit-2-outline" fill="currentColor">
    <g data-name="Layer 2">
      <g data-name="edit-2">
        <rect width="24" height="24" opacity="0" />
        <path d="M19 20H5a1 1 0 0 0 0 2h14a1 1 0 0 0 0-2z" />
        <path d="M5 18h.09l4.17-.38a2 2 0 0 0 1.21-.57l9-9a1.92 1.92 0 0 0-.07-2.71L16.66 2.6A2 2 0 0 0 14 2.53l-9 9a2 2 0 0 0-.57 1.21L4 16.91a1 1 0 0 0 .29.8A1 1 0 0 0 5 18zM15.27 4L18 6.73l-2 1.95L13.32 6zm-8.9 8.91L12 7.32l2.7 2.7-5.6 5.6-3 .28z" />
      </g>
    </g>
  </svg>
);

const Trash2OutlineIcon = ({ size = 16 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" className="eva eva-trash-2-outline" fill="currentColor">
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
  menuRecords: MenuRecord[];
  accounts: Account[];
  menus: Menu[];
  onEdit?: (menuRecord: MenuRecord) => void;
  onDelete?: (menuRecord: MenuRecord) => void;
  deletingId?: number | null;
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

export function MenuRecordTable({ 
  menuRecords, 
  accounts,
  menus,
  onEdit, 
  onDelete, 
  deletingId, 
  currentPage, 
  pageSize 
}: Props) {
  const getAccountName = (id?: string | null) => {
    if (!id) return 'Hệ thống';
    const acc = accounts.find(a => a.id === id);
    return acc ? acc.username || acc.email : 'Ẩn danh';
  };

  const getMenuInfo = (id: number) => {
    const menu = menus.find(m => m.id === id);
    return menu ? { name: menu.menuName, type: menu.menuTypeName, foods: menu.foods || [] } : null;
  };

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.stickySTTCol}>STT</th>
            <th>Tài khoản</th>
            <th>Tên</th>
            <th>Thực đơn</th>
            <th>Ngày áp dụng</th>
            <th>Trạng thái</th>
            <th>Cập nhật</th>
            <th className={styles.stickyActionsCol}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {menuRecords.length === 0 ? (
            <tr>
              <td colSpan={8} className={styles.emptyState}>
                Chưa có bản ghi thực đơn nào
              </td>
            </tr>
          ) : (
            menuRecords.map((menuRecord, index) => {
              const stt = (currentPage - 1) * pageSize + index + 1;
              const menuInfo = getMenuInfo(menuRecord.menuId);
              
              return (
                <tr key={menuRecord.id} className={styles.tableRow}>
                  <td className={styles.stickySTTCol}>
                    <div className={styles.tooltipWrapper}>
                      <span className={styles.sttCell}>{stt}</span>
                      <span className={styles.tooltip}>ID gốc: {menuRecord.id}</span>
                    </div>
                  </td>
                  <td className={styles.accountCell}>
                    <div className={styles.tooltipWrapper}>
                      <span className={styles.truncateCell}>{getAccountName(menuRecord.accountId)}</span>
                      <span className={styles.tooltip}>ID tài khoản: {menuRecord.accountId || 'N/A'}</span>
                    </div>
                  </td>
                  <td className={styles.name}>
                    <div className={styles.tooltipWrapper}>
                      <span className={styles.nameTruncate}>{menuRecord.name || `Bản ghi thực đơn #${menuRecord.id}`}</span>
                      <span className={styles.tooltip}>{menuRecord.name || 'Không có tên'}</span>
                    </div>
                  </td>
                  <td className={styles.menuCell}>
                    {menuInfo ? (
                      <div className={styles.tooltipWrapper}>
                        <div className={styles.menuLabel}>
                          <span className={styles.menuNameText}>{menuInfo.name}</span>
                          <span className={styles.menuCountBadge}>{menuInfo.foods.length} món</span>
                        </div>
                        <span className={styles.tooltip}>
                          {menuInfo.type}: {menuInfo.foods.map(f => f.name).join(', ')}
                        </span>
                      </div>
                    ) : '-'}
                  </td>
                  <td className={styles.dateCell}>{formatDate(menuRecord.date)}</td>
                  <td>
                    <span
                      className={`${styles.statusBadge} ${
                        menuRecord.isActive ? styles.statusActive : styles.statusInactive
                      }`}
                    >
                      {menuRecord.isActive ? 'Hoạt động' : 'Tạm dừng'}
                    </span>
                  </td>
                  <td className={styles.dateCell}>{formatDate(menuRecord.updatedAt)}</td>
                  <td className={styles.stickyActionsCol}>
                    <div className={styles.actions}>
                      <div className={styles.tooltipWrapper}>
                        <button
                          className={`${styles.actionButton} ${styles.editButton}`}
                          onClick={() => onEdit?.(menuRecord)}
                          aria-label={`Chỉnh sửa ${menuRecord.name || ''}`}
                        >
                          <Edit2OutlineIcon size={16} />
                        </button>
                        <span className={styles.tooltip}>Chỉnh sửa</span>
                      </div>
                      <div className={styles.tooltipWrapper}>
                        <button
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          onClick={() => onDelete?.(menuRecord)}
                          aria-label={`Xóa ${menuRecord.name || ''}`}
                          disabled={deletingId === menuRecord.id}
                        >
                          <Trash2OutlineIcon size={16} />
                        </button>
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
