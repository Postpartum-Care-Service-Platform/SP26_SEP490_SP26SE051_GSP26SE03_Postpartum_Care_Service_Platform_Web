'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronDownIcon, MagnifyingGlassIcon, MixerHorizontalIcon, PlusIcon } from '@radix-ui/react-icons';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';
import { Pagination } from '@/components/ui/pagination';
import { useToast } from '@/components/ui/toast/use-toast';
import appointmentTypeService from '@/services/appointment-type.service';
import type { AppointmentTypeDetail } from '@/types/appointment-type';

import styles from './appointment-type.module.css';
import { AppointmentTypeModal } from './components/AppointmentTypeModal';

/* ── SVG icons ── */
const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
    <g data-name="Layer 2"><g data-name="edit-2">
      <rect width="24" height="24" opacity="0" />
      <path d="M19 20H5a1 1 0 0 0 0 2h14a1 1 0 0 0 0-2z" />
      <path d="M5 18h.09l4.17-.38a2 2 0 0 0 1.21-.57l9-9a1.92 1.92 0 0 0-.07-2.71L16.66 2.6A2 2 0 0 0 14 2.53l-9 9a2 2 0 0 0-.57 1.21L4 16.91a1 1 0 0 0 .29.8A1 1 0 0 0 5 18zM15.27 4L18 6.73l-2 1.95L13.32 6zm-8.9 8.91L12 7.32l2.7 2.7-5.6 5.6-3 .28z" />
    </g></g>
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
type StatusFilter = 'all' | 'active' | 'inactive';
type SortKey      = 'id-asc' | 'id-desc' | 'name-asc' | 'name-desc';

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'id-desc',   label: 'STT: giảm dần' },
  { value: 'id-asc',    label: 'STT: tăng dần' },
  { value: 'name-asc',  label: 'Tên A → Z' },
  { value: 'name-desc', label: 'Tên Z → A' },
];

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all',      label: 'Tất cả' },
  { value: 'active',   label: 'Hoạt động' },
  { value: 'inactive', label: 'Tạm dừng' },
];

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === 'object' && error !== null && 'message' in error &&
    typeof (error as { message?: unknown }).message === 'string')
    return (error as { message: string }).message;
  return fallback;
};

const sortItems = (items: AppointmentTypeDetail[], key: SortKey) => {
  const arr = [...items];
  switch (key) {
    case 'id-asc':    return arr.sort((a, b) => a.id - b.id);
    case 'id-desc':   return arr.sort((a, b) => b.id - a.id);
    case 'name-asc':  return arr.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc': return arr.sort((a, b) => b.name.localeCompare(a.name));
    default: return arr;
  }
};

export default function AdminAppointmentTypePage() {
  const [items, setItems]         = useState<AppointmentTypeDetail[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [searchQuery, setSearchQuery]   = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortKey, setSortKey]           = useState<SortKey>('id-desc');
  const [currentPage, setCurrentPage]   = useState(1);
  const [pageSize, setPageSize]         = useState(DEFAULT_PAGE_SIZE);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AppointmentTypeDetail | null>(null);

  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await appointmentTypeService.getAllAppointmentTypes();
      setItems(data);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Không thể tải danh sách loại lịch hẹn'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void fetchData(); }, [fetchData]);

  const filteredItems = useMemo(() => {
    let filtered = [...items];
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(q));
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter((item) => statusFilter === 'active' ? item.isActive : !item.isActive);
    }
    return sortItems(filtered, sortKey);
  }, [items, searchQuery, statusFilter, sortKey]);

  useEffect(() => { setCurrentPage(1); }, [searchQuery, statusFilter, sortKey]);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredItems.length / pageSize);

  const handleOpenCreate = () => { setEditingItem(null); setIsModalOpen(true); };
  const handleOpenEdit   = (item: AppointmentTypeDetail) => { setEditingItem(item); setIsModalOpen(true); };
  const handleModalClose = (open: boolean) => { setIsModalOpen(open); if (!open) setEditingItem(null); };

  const handleDelete = async (item: AppointmentTypeDetail) => {
    if (!window.confirm(`Bạn có chắc muốn xóa loại lịch hẹn "${item.name}"?`)) return;
    try {
      setDeletingId(item.id);
      await appointmentTypeService.deleteAppointmentType(item.id);
      await fetchData();
      toast({ title: 'Xóa loại lịch hẹn thành công', variant: 'success' });
    } catch (err) {
      toast({ title: getErrorMessage(err, 'Xóa loại lịch hẹn thất bại'), variant: 'error' });
    } finally {
      setDeletingId(null);
    }
  };

  const selectedSortLabel   = SORT_OPTIONS.find((o) => o.value === sortKey)?.label ?? 'Sắp xếp';
  const selectedStatusLabel = STATUS_OPTIONS.find((o) => o.value === statusFilter)?.label ?? 'Tất cả';

  return (
    <div className={styles.pageContainer}>
      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.controlsLeft}>
          <div className={styles.searchWrapper}>
            <MagnifyingGlassIcon className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Tìm kiếm loại lịch hẹn..."
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
                <DropdownMenuItem key={opt.value}
                  className={`${styles.dropdownItem} ${sortKey === opt.value ? styles.dropdownItemActive : ''}`}
                  onClick={() => setSortKey(opt.value)}>
                  {opt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className={styles.controlsRight}>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className={styles.statusButton}>
                {selectedStatusLabel}
                <ChevronDownIcon className={styles.chevronIcon} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={styles.dropdownContent}>
              {STATUS_OPTIONS.map((opt) => (
                <DropdownMenuItem key={opt.value}
                  className={`${styles.dropdownItem} ${statusFilter === opt.value ? styles.dropdownItemActive : ''}`}
                  onClick={() => setStatusFilter(opt.value)}>
                  {opt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="primary" size="sm" className={styles.createButton} onClick={handleOpenCreate}>
            <PlusIcon className={styles.plusIcon} />
            Loại mới
          </Button>
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
                  <th>Tên loại lịch hẹn</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {paginatedItems.length === 0 ? (
                  <tr><td colSpan={4} className={styles.emptyState}>
                    {searchQuery ? 'Không tìm thấy kết quả phù hợp.' : 'Chưa có loại lịch hẹn nào.'}
                  </td></tr>
                ) : (
                  paginatedItems.map((item, index) => {
                    const stt = (currentPage - 1) * pageSize + index + 1;
                    return (
                      <tr key={item.id}>
                        <td><span className={styles.sttCell} title={`ID gốc: ${item.id}`}>{stt}</span></td>
                        <td className={styles.nameCell}>{item.name}</td>
                        <td>
                          <span className={`${styles.statusBadge} ${item.isActive ? styles.statusActive : styles.statusInactive}`}>
                            {item.isActive ? 'Hoạt động' : 'Tạm dừng'}
                          </span>
                        </td>
                        <td>
                          <div className={styles.actions}>
                            <div className={styles.tooltipWrapper}>
                              <Button variant="outline" size="sm" className={styles.editButton}
                                onClick={() => handleOpenEdit(item)}>
                                <EditIcon />
                              </Button>
                              <span className={styles.tooltip}>Chỉnh sửa</span>
                            </div>
                            <div className={styles.tooltipWrapper}>
                              <Button variant="outline" size="sm" className={styles.deleteButton}
                                onClick={() => handleDelete(item)} disabled={deletingId === item.id}>
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
      </div>

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

      <AppointmentTypeModal
        open={isModalOpen}
        onOpenChange={handleModalClose}
        item={editingItem}
        onSuccess={fetchData}
      />
    </div>
  );
}
