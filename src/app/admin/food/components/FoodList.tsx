'use client';

import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import type { Food } from '@/types/food';
import styles from './food-list.module.css';

type Props = {
  foods: Food[];
  onEdit?: (food: Food) => void;
  onDelete?: (food: Food) => void;
};

const formatDate = (dateString: string) => {
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

export function FoodList({ foods, onEdit, onDelete }: Props) {
  return (
    <div className={styles.listContainer}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên món</th>
              <th>Loại</th>
              <th>Mô tả</th>
              <th>Hình ảnh</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {foods.length === 0 ? (
              <tr>
                <td colSpan={7} className={styles.emptyState}>
                  Chưa có món ăn nào
                </td>
              </tr>
            ) : (
              foods.map((food) => (
                <tr key={food.id} className={styles.tableRow}>
                  <td>{food.id}</td>
                  <td className={styles.foodName}>{food.name}</td>
                  <td>{food.type}</td>
                  <td className={styles.description}>{food.description || '-'}</td>
                  <td>
                    {food.imageUrl ? (
                      <img src={food.imageUrl} alt={food.name} className={styles.foodImage} />
                    ) : (
                      <span className={styles.noImage}>-</span>
                    )}
                  </td>
                  <td>
                    <span className={`${styles.statusBadge} ${food.isActive ? styles.statusActive : styles.statusInactive}`}>
                      {food.isActive ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <Button
                        variant="outline"
                        size="sm"
                        className={styles.editButton}
                        onClick={() => onEdit?.(food)}
                        aria-label={`Chỉnh sửa ${food.name}`}
                      >
                        <Pencil1Icon />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={styles.deleteButton}
                        onClick={() => onDelete?.(food)}
                        aria-label={`Xóa ${food.name}`}
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

