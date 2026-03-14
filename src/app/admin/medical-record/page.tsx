'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronDownIcon, MagnifyingGlassIcon, MixerHorizontalIcon } from '@radix-ui/react-icons';

import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';
import { Pagination } from '@/components/ui/pagination';
import { useToast } from '@/components/ui/toast/use-toast';
import medicalRecordService from '@/services/medical-record.service';
import type { MedicalRecord } from '@/types/medical-record';

import { MedicalRecordDetailModal } from './MedicalRecordDetailModal';
import { MedicalRecordEditModal } from './MedicalRecordEditModal';
import styles from './medical-record.module.css';

/* ── SVG icons ── */
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 5C7 5 2.73 8.11 1 12c1.73 3.89 6 7 11 7s9.27-3.11 11-7c-1.73-3.89-6-7-11-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
  </svg>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm17.71-10.21a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
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

const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

type SortKey = 'id-desc' | 'id-asc' | 'date-desc' | 'date-asc';

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'id-desc', label: 'STT: giảm dần' },
  { value: 'id-asc', label: 'STT: tăng dần' },
  { value: 'date-desc', label: 'Mới nhất' },
  { value: 'date-asc', label: 'Cũ nhất' },
];

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) return error.message;
  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message?: unknown }).message === 'string'
  )
    return (error as { message: string }).message;
  return fallback;
};

const sortItems = (items: MedicalRecord[], key: SortKey) => {
  const arr = [...items];
  switch (key) {
    case 'id-asc': return arr.sort((a, b) => a.id - b.id);
    case 'id-desc': return arr.sort((a, b) => b.id - a.id);
    case 'date-desc': return arr.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    case 'date-asc': return arr.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    default: return arr;
  }
};

export default function AdminMedicalRecordPage() {
  const [items, setItems] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionId, setActionId] = useState<number | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('date-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const [viewingItem, setViewingItem] = useState<MedicalRecord | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MedicalRecord | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await medicalRecordService.getAllMedicalRecords();
      setItems(data);
    } catch (err) {
      setError(getErrorMessage(err, 'Không thể tải danh sách hồ sơ y tế'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void fetchData(); }, [fetchData]);

  const filteredItems = useMemo(() => {
    let filtered = [...items];
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      filtered = filtered.filter((item) =>
        (item.customerName?.toLowerCase().includes(q)) ||
        (item.customerEmail?.toLowerCase().includes(q)) ||
        (item.bloodType?.toLowerCase().includes(q)) ||
        (item.allergies?.toLowerCase().includes(q)),
      );
    }
    return sortItems(filtered, sortKey);
  }, [items, searchQuery, sortKey]);

  useEffect(() => { setCurrentPage(1); }, [searchQuery, sortKey]);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredItems.length / pageSize);

  const handleView = (item: MedicalRecord) => { setViewingItem(item); setIsDetailOpen(true); };
  const handleDetailClose = (open: boolean) => { setIsDetailOpen(open); if (!open) setViewingItem(null); };

  const handleEdit = (item: MedicalRecord) => { setEditingItem(item); setIsEditOpen(true); };
  const handleEditClose = (open: boolean) => { setIsEditOpen(open); if (!open) setEditingItem(null); };

  const handleEditSuccess = async () => {
    toast({ title: 'Cập nhật hồ sơ y tế thành công', variant: 'success' });
    await fetchData();
  };

  const handleDelete = async (item: MedicalRecord) => {
    if (
      !window.confirm(
        `Bạn có chắc muốn xoá hồ sơ y tế của "${item.customerName || item.customerEmail || `#${item.id}`}"?`,
      )
    )
      return;
    try {
      setActionId(item.id);
      await medicalRecordService.deleteMedicalRecord(item.id);
      await fetchData();
      toast({ title: 'Xoá hồ sơ y tế thành công', variant: 'success' });
    } catch (err) {
      toast({ title: getErrorMessage(err, 'Xoá hồ sơ y tế thất bại'), variant: 'error' });
    } finally {
      setActionId(null);
    }
  };

  const selectedSortLabel = SORT_OPTIONS.find((o) => o.value === sortKey)?.label ?? 'Sắp xếp';

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <div className={styles.header}>
        <h4 className={styles.title}>Quản lý hồ sơ y tế</h4>
        <Breadcrumbs items={[{ label: 'Hồ sơ y tế' }]} homeHref="/admin" />
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.controlsLeft}>
          <div className={styles.searchWrapper}>
            <MagnifyingGlassIcon className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Tìm theo tên, email, nhóm máu, dị ứng..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className={styles.filterButton}>
                <MixerHorizontalIcon className={styles.filterIcon} />
                {selectedSortLabel}
                <ChevronDownIcon className={styles.chevronIcon} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={styles.dropdownContent}>
              {SORT_OPTIONS.map((opt) => (
                <DropdownMenuItem
                  key={opt.value}
                  className={`${styles.dropdownItem} ${sortKey === opt.value ? styles.dropdownItemActive : ''}`}
                  onClick={() => setSortKey(opt.value)}
                >
                  {opt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableContainer}>
        {loading ? (
          <div className={styles.placeholder}>Đang tải dữ liệu...</div>
        ) : error ? (
          <div className={styles.placeholder}>{error}</div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th title="Số thứ tự">STT</th>
                  <th>Tên khách hàng</th>
                  <th>Email</th>
                  <th>Nhóm máu</th>
                  <th>Dị ứng</th>
                  <th>Ngày tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {paginatedItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className={styles.emptyState}>
                      {searchQuery ? 'Không tìm thấy kết quả phù hợp.' : 'Chưa có hồ sơ y tế nào.'}
                    </td>
                  </tr>
                ) : (
                  paginatedItems.map((item, index) => {
                    const stt = (currentPage - 1) * pageSize + index + 1;
                    const date = item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString('vi-VN')
                      : '—';
                    return (
                      <tr key={item.id}>
                        <td>
                          <span className={styles.sttCell} title={`ID gốc: ${item.id}`}>
                            {stt}
                          </span>
                        </td>
                        <td className={styles.textCell}>{item.customerName || '—'}</td>
                        <td className={styles.emailCell}>{item.customerEmail || '—'}</td>
                        <td>
                          {item.bloodType ? (
                            <span className={styles.bloodBadge}>{item.bloodType}</span>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td className={styles.textCell}>{item.allergies || '—'}</td>
                        <td className={styles.dateCell}>{date}</td>
                        <td>
                          <div className={styles.actions}>
                            <div className={styles.tooltipWrapper}>
                              <Button
                                variant="outline"
                                size="sm"
                                className={styles.viewButton}
                                onClick={() => handleView(item)}
                              >
                                <EyeIcon />
                              </Button>
                              <span className={styles.tooltip}>Xem chi tiết</span>
                            </div>
                            <div className={styles.tooltipWrapper}>
                              <Button
                                variant="outline"
                                size="sm"
                                className={styles.editButton}
                                onClick={() => handleEdit(item)}
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
                                onClick={() => void handleDelete(item)}
                                disabled={actionId === item.id}
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
        )}

        {/* Pagination */}
        {!loading && !error && filteredItems.length > 0 && totalPages > 0 && (
          <div className={styles.paginationWrapper}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={filteredItems.length}
              onPageChange={(page) => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              pageSizeOptions={[...PAGE_SIZE_OPTIONS]}
              onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
              showResultCount={true}
            />
          </div>
        )}
      </div>



      <MedicalRecordDetailModal
        open={isDetailOpen}
        onOpenChange={handleDetailClose}
        record={viewingItem}
      />

      <MedicalRecordEditModal
        open={isEditOpen}
        onOpenChange={handleEditClose}
        record={editingItem}
        onSuccess={() => void handleEditSuccess()}
        onError={(msg) => toast({ title: msg, variant: 'error' })}
      />
    </div>
  );
}
