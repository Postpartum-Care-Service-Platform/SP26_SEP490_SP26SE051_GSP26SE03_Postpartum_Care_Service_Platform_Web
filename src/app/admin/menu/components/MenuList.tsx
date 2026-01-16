'use client';

import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import type { Menu } from '@/types/menu';
import styles from './menu-list.module.css';

type Props = {
  menus: Menu[];
  onEdit?: (menu: Menu) => void;
  onDelete?: (menu: Menu) => void;
};

export function MenuList({ menus, onEdit, onDelete }: Props) {
  return (
    <div className={styles.listContainer}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên thực đơn</th>
              <th>Loại thực đơn</th>
              <th>Mô tả</th>
              <th>Số món ăn</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {menus.length === 0 ? (
              <tr>
                <td colSpan={7} className={styles.emptyState}>
                  Chưa có thực đơn nào
                </td>
              </tr>
            ) : (
              menus.map((menu) => (
                <tr key={menu.id} className={styles.tableRow}>
                  <td>{menu.id}</td>
                  <td className={styles.menuName}>{menu.menuName}</td>
                  <td>
                    <span className={styles.menuType}>{menu.menuTypeName}</span>
                  </td>
                  <td className={styles.description}>{menu.description || '-'}</td>
                  <td>
                    <span className={styles.foodCount}>{menu.foods?.length || 0} món</span>
                  </td>
                  <td>
                    <span className={`${styles.statusBadge} ${menu.isActive ? styles.statusActive : styles.statusInactive}`}>
                      {menu.isActive ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <Button
                        variant="outline"
                        size="sm"
                        className={styles.editButton}
                        onClick={() => onEdit?.(menu)}
                        aria-label={`Chỉnh sửa ${menu.menuName}`}
                      >
                        <Pencil1Icon />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={styles.deleteButton}
                        onClick={() => onDelete?.(menu)}
                        aria-label={`Xóa ${menu.menuName}`}
                      >
                        <TrashIcon />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

