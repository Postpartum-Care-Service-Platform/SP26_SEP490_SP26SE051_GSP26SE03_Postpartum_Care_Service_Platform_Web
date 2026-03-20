'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import menuRecordService from '@/services/menu-record.service';
import menuService from '@/services/menu.service';
import type { MenuRecord } from '@/types/menu-record';
import type { Menu } from '@/types/menu';

import styles from './medical-history-table.module.css';

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


export function MedicalHistoryTable({ customerId }: { customerId: string | null }) {
  const [data, setData] = useState<MenuRecord[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const PAGE_SIZE_OPTIONS = [5, 10, 20];

  const fetchData = async () => {
    if (!customerId) return;
    try {
      setLoading(true);
      const [recordRes, menuRes] = await Promise.all([
        menuRecordService.getMenuRecordByCustomer(customerId),
        menuService.getAllMenus()
      ]);
      setData(recordRes);
      setMenus(menuRes);
    } catch (error) {
      console.error('Failed to fetch menu record:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [customerId]);

  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 0;

  const paginatedData = data.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEdit = (id: number) => {
    console.log('Edit:', id);
  };

  return (
    <div className={styles.tableWrapper}>
      <h5 className={styles.title}>Lịch sử thực đơn</h5>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Ngày</th>
            <th>Tên thực đơn</th>
            <th>Chi tiết thực đơn</th>
            <th>Trạng thái</th>
            <th>Ghi chú</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6} className={styles.emptyState}>
                Đang tải...
              </td>
            </tr>
          ) : paginatedData.length === 0 ? (
            <tr>
              <td colSpan={6} className={styles.emptyState}>
                Chưa có dữ liệu
              </td>
            </tr>
          ) : (
            paginatedData.map((record) => (
              <tr key={record.id} className={styles.tableRow}>
                <td>{formatDate(record.date)}</td>
                <td className={styles.diagnosis}>{record.name}</td>
                <td>{menus.find(m => m.id === record.menuId)?.menuName || `Menu #${record.menuId}`}</td>
                <td>
                  <span className={`${styles.statusBadge} ${record.isActive ? styles.statusRecovered : styles.statusOngoing}`}>
                    {record.isActive ? 'Hoạt động' : 'Tạm dừng'}
                  </span>
                </td>
                <td>Hệ thống</td>
                <td>
                  <div className={styles.actions}>
                    <div className={styles.tooltipWrapper}>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`${styles.editButton} btn-icon btn-sm`}
                        onClick={() => handleEdit(record.id)}
                        aria-label={`Chỉnh sửa ${record.name}`}
                      >
                        <Edit2OutlineIcon fill="#A47BC8" size={16} />
                      </Button>
                      <span className={styles.tooltip}>Chỉnh sửa</span>
                    </div>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {totalPages > 0 && (
        <div className={styles.paginationWrapper}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={handlePageChange}
            pageSizeOptions={PAGE_SIZE_OPTIONS}
            onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
            showResultCount={true}
          />
        </div>
      )}
    </div>
  );
}
