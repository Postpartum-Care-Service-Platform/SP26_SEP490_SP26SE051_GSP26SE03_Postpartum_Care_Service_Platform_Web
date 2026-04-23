'use client';

import React from 'react';
import styles from './management.module.css';
import { ColumnConfig } from './types';

interface GenericTableProps<T> {
  data: T[];
  columns: ColumnConfig<T>[];
  loading?: boolean;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  currentPage: number;
  pageSize: number;
}

export function GenericTable<T extends { id: any }>({
  data,
  columns,
  loading,
  onEdit,
  onDelete,
  currentPage,
  pageSize
}: GenericTableProps<T>) {
  if (loading) {
    return <div className={styles.loadingState}>Đang tải dữ liệu...</div>;
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.sttCol}>STT</th>
            {columns.map((col, index) => (
              <th 
                key={index} 
                style={{ width: col.width, textAlign: col.align || 'left' }}
              >
                {col.header}
              </th>
            ))}
            {(onEdit || onDelete) && <th className={styles.actionsCol}>Thao tác</th>}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 2} className={styles.emptyState}>
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr key={item.id}>
                <td className={styles.sttCol}>
                  {(currentPage - 1) * pageSize + index + 1}
                </td>
                {columns.map((col, colIndex) => (
                  <td key={colIndex} style={{ textAlign: col.align || 'left' }}>
                    {col.render 
                      ? col.render((item as any)[col.key], item)
                      : (item as any)[col.key]
                    }
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className={styles.actionsCol}>
                    <div className={styles.actionButtons}>
                      {onEdit && (
                        <button onClick={() => onEdit(item)} className={styles.editBtn}>
                          Sửa
                        </button>
                      )}
                      {onDelete && (
                        <button onClick={() => onDelete(item)} className={styles.deleteBtn}>
                          Xóa
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
