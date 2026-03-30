'use client';

import type { Menu } from '@/types/menu';
import styles from './menu-table.module.css';

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
  menus: Menu[];
  onEdit?: (menu: Menu) => void;
  onDelete?: (menu: Menu) => void;
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

export function MenuTable({ menus, onEdit, onDelete, deletingId, currentPage, pageSize }: Props) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.stickySTTCol}>STT</th>
            <th>Tên thực đơn</th>
            <th>Loại thực đơn</th>
            <th>Mô tả</th>
            <th>Số món ăn</th>
            <th>Trạng thái</th>
            <th>Cập nhật</th>
            <th className={styles.stickyActionsCol}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {menus.length === 0 ? (
            <tr>
              <td colSpan={8} className={styles.emptyState}>
                Chưa có thực đơn nào
              </td>
            </tr>
          ) : (
            menus.map((menu, index) => {
              const stt = (currentPage - 1) * pageSize + index + 1;
              const foodNames = menu.foods?.map(f => f.name).join(', ') || 'Chưa có món';
              
              return (
                <tr key={menu.id} className={styles.tableRow}>
                  <td className={styles.stickySTTCol}>
                    <div className={styles.tooltipWrapper}>
                      <span className={styles.sttCell}>{stt}</span>
                      <span className={styles.tooltip}>ID gốc: {menu.id}</span>
                    </div>
                  </td>
                  <td className={styles.name}>
                    <div className={styles.nameContainer}>
                       <span className={styles.menuNameText}>{menu.menuName}</span>
                       <div className={styles.foodListSub}>
                         {menu.foods && menu.foods.length > 0 ? (
                           menu.foods.slice(0, 3).map(f => (
                             <span key={f.id} className={styles.foodTag}>{f.name}</span>
                           ))
                         ) : null}
                         {menu.foods && menu.foods.length > 3 && (
                           <span className={styles.moreFoods}>+{menu.foods.length - 3}</span>
                         )}
                       </div>
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.menuTypeBadge} ${styles['type' + menu.menuTypeName]}`}>
                      {menu.menuTypeName}
                    </span>
                  </td>
                  <td className={styles.instructionCell}>
                    {menu.description ? (
                      <div className={styles.tooltipWrapper}>
                        <span className={styles.truncateCell}>{menu.description}</span>
                        <span className={styles.tooltip}>{menu.description}</span>
                      </div>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>
                    <div className={styles.tooltipWrapper}>
                      <span className={styles.foodCount}>{menu.foods?.length || 0} món</span>
                      <span className={styles.tooltip}>{foodNames}</span>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`${styles.statusBadge} ${
                        menu.isActive ? styles.statusActive : styles.statusInactive
                      }`}
                    >
                      {menu.isActive ? 'Hoạt động' : 'Tạm dừng'}
                    </span>
                  </td>
                  <td className={styles.dateCell}>{formatDate(menu.updatedAt)}</td>
                  <td className={styles.stickyActionsCol}>
                    <div className={styles.actions}>
                      <div className={styles.tooltipWrapper}>
                        <button
                          className={`${styles.actionButton} ${styles.editButton}`}
                          onClick={() => onEdit?.(menu)}
                          aria-label={`Chỉnh sửa ${menu.menuName}`}
                        >
                          <Edit2OutlineIcon size={16} />
                        </button>
                        <span className={styles.tooltip}>Chỉnh sửa</span>
                      </div>
                      <div className={styles.tooltipWrapper}>
                        <button
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          onClick={() => onDelete?.(menu)}
                          aria-label={`Xóa ${menu.menuName}`}
                          disabled={deletingId === menu.id}
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
