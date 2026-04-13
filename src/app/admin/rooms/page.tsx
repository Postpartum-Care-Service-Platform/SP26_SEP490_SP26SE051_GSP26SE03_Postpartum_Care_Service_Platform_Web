'use client';

import { ChevronDownIcon, MagnifyingGlassIcon, MixerHorizontalIcon, PlusIcon } from '@radix-ui/react-icons';
import { Download, Upload } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { AdminPageLayout } from '@/components/layout/admin/AdminPageLayout';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';
import { ConfirmModal } from '@/components/ui/modal/ConfirmModal';
import { Pagination } from '@/components/ui/pagination';
import { useToast } from '@/components/ui/toast/use-toast';
import roomTypeService from '@/services/room-type.service';
import type { RoomType } from '@/types/room-type';

import { RoomTypeModal } from './components/RoomTypeModal';
import { ImportRoomTypeModal } from './components/ImportRoomTypeModal';
import styles from './rooms.module.css';

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

const RestoreIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
  </svg>
);

const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

type StatusFilter = 'all' | 'active' | 'inactive';
type SortKey      = 'id-asc' | 'id-desc' | 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc';

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'id-desc',    label: 'STT: giảm dần' },
  { value: 'id-asc',     label: 'STT: tăng dần' },
  { value: 'name-asc',   label: 'Tên A → Z' },
  { value: 'name-desc',  label: 'Tên Z → A' },
  { value: 'price-asc',  label: 'Giá thấp → cao' },
  { value: 'price-desc', label: 'Giá cao → thấp' },
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

const formatPrice = (price: number) =>
  price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

const sortItems = (items: RoomType[], key: SortKey) => {
  const arr = [...items];
  switch (key) {
    case 'id-asc':     return arr.sort((a, b) => a.id - b.id);
    case 'id-desc':    return arr.sort((a, b) => b.id - a.id);
    case 'name-asc':   return arr.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':  return arr.sort((a, b) => b.name.localeCompare(a.name));
    case 'price-asc':  return arr.sort((a, b) => a.basePrice - b.basePrice);
    case 'price-desc': return arr.sort((a, b) => b.basePrice - a.basePrice);
    default: return arr;
  }
};


export default function AdminRoomsPage() {
  const [rooms, setRooms]         = useState<RoomType[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [searchQuery, setSearchQuery]   = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortKey, setSortKey]           = useState<SortKey>('id-desc');
  const [currentPage, setCurrentPage]   = useState(1);
  const [pageSize, setPageSize]         = useState(DEFAULT_PAGE_SIZE);

  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [editingRoom, setEditingRoom]   = useState<RoomType | null>(null);
  const [updatingStatusIds, setUpdatingStatusIds] = useState<Set<number>>(new Set());

  // Import Modal state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Confirm Modal state
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<RoomType | null>(null);

  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await roomTypeService.getAdminRoomTypes();
      setRooms(data);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Không thể tải danh sách loại phòng'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void fetchData(); }, [fetchData]);

  const filteredItems = useMemo(() => {
    let filtered = [...rooms];
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      filtered = filtered.filter(
        (r) => r.name.toLowerCase().includes(q) || (r.description || '').toLowerCase().includes(q),
      );
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter((r) => statusFilter === 'active' ? r.isActive : !r.isActive);
    }
    return sortItems(filtered, sortKey);
  }, [rooms, searchQuery, statusFilter, sortKey]);

  useEffect(() => { setCurrentPage(1); }, [searchQuery, statusFilter, sortKey]);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredItems.length / pageSize);

  /* ── Handlers ── */
  const handleOpenCreate = () => { setEditingRoom(null); setIsModalOpen(true); };
  const handleOpenEdit   = (room: RoomType) => { setEditingRoom(room); setIsModalOpen(true); };
  const handleModalClose = (open: boolean) => { setIsModalOpen(open); if (!open) setEditingRoom(null); };

  const handleDeleteTrigger = (room: RoomType) => {
    setItemToDelete(room);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      setDeletingId(itemToDelete.id);
      await roomTypeService.deleteRoomType(itemToDelete.id);
      await fetchData();
      toast({ title: 'Xóa loại phòng thành công', variant: 'success' });
    } catch (err) {
      toast({ title: getErrorMessage(err, 'Xóa loại phòng thất bại'), variant: 'error' });
    } finally {
      setDeletingId(null);
      setItemToDelete(null);
      setIsConfirmModalOpen(false);
    }
  };

  const handleRestore = async (room: RoomType) => {
    try {
      setDeletingId(room.id);
      await roomTypeService.restoreRoomType(room.id);
      await fetchData();
      toast({ title: 'Khôi phục loại phòng thành công', variant: 'success' });
    } catch (err) {
      toast({ title: getErrorMessage(err, 'Khôi phục loại phòng thất bại'), variant: 'error' });
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleStatus = async (item: RoomType, newStatus: boolean) => {
    if (item.isActive === newStatus || updatingStatusIds.has(item.id)) return;
    try {
      setUpdatingStatusIds(prev => {
        const next = new Set(prev);
        next.add(item.id);
        return next;
      });
      if (newStatus) {
        await roomTypeService.restoreRoomType(item.id);
        toast({ title: 'Khôi phục loại phòng thành công', variant: 'success' });
      } else {
        await roomTypeService.deleteRoomType(item.id);
        toast({ title: 'Tạm dừng loại phòng thành công', variant: 'success' });
      }
      await fetchData();
    } catch (err) {
      toast({ title: getErrorMessage(err, 'Cập nhật trạng thái thất bại'), variant: 'error' });
    } finally {
      setUpdatingStatusIds(prev => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
    }
  };

  const handleExport = async () => {
    try {
      await roomTypeService.exportRoomTypes();
      toast({ title: 'Xuất dữ liệu thành công', variant: 'success' });
    } catch (err) {
      toast({ title: getErrorMessage(err, 'Xuất dữ liệu thất bại'), variant: 'error' });
    }
  };

  const selectedSortLabel   = SORT_OPTIONS.find((o) => o.value === sortKey)?.label ?? 'Sắp xếp';
  const selectedStatusLabel = STATUS_OPTIONS.find((o) => o.value === statusFilter)?.label ?? 'Tất cả';

  const controlPanel = (
    <div className={styles.controls}>
      <div className={styles.controlsLeft}>
        <div className={styles.searchWrapper}>
          <MagnifyingGlassIcon className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Tìm kiếm loại phòng..."
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
              <DropdownMenuItem
                key={opt.value}
                className={`${styles.dropdownItem} ${statusFilter === opt.value ? styles.dropdownItemActive : ''}`}
                onClick={() => setStatusFilter(opt.value)}
              >
                {opt.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className={styles.exportButton}>
              <Download size={16} className={styles.exportIcon} />
              Nhập/Xuất
              <ChevronDownIcon className={styles.chevronIcon} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className={styles.dropdownContent} align="end">
            <DropdownMenuItem className={styles.dropdownItem} onClick={() => setIsImportModalOpen(true)}>
              <Upload size={16} className={styles.itemIcon} />
              Nhập từ Excel
            </DropdownMenuItem>
            <DropdownMenuItem className={styles.dropdownItem} onClick={handleExport}>
              <Download size={16} className={styles.itemIcon} />
              Xuất ra Excel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="primary" size="sm" className={styles.createButton} onClick={handleOpenCreate}>
          <PlusIcon className={styles.plusIcon} />
          Loại mới
        </Button>
      </div>
    </div>
  );

  const pagination = !loading && !error && filteredItems.length > 0 && totalPages > 0 ? (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      pageSize={pageSize}
      totalItems={filteredItems.length}
      onPageChange={(page) => { setCurrentPage(page); }}
      pageSizeOptions={[...PAGE_SIZE_OPTIONS]}
      onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
      showResultCount={true}
    />
  ) : null;

  return (
    <AdminPageLayout
      controlPanel={controlPanel}
      pagination={pagination}
    >
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: '50px' }}>STT</th>
              <th>Tên loại phòng</th>
              <th>Mô tả</th>
              <th>Sức chứa</th>
              <th>Giá cơ bản</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className={styles.placeholder}>Đang tải dữ liệu...</td></tr>
            ) : error ? (
              <tr><td colSpan={7} className={styles.placeholder}>{error}</td></tr>
            ) : paginatedItems.length === 0 ? (
              <tr>
                <td colSpan={7} className={styles.emptyState}>
                  {searchQuery ? 'Không tìm thấy kết quả phù hợp.' : 'Chưa có loại phòng nào.'}
                </td>
              </tr>
            ) : (
              paginatedItems.map((room, index) => {
                const stt = (currentPage - 1) * pageSize + index + 1;
                return (
                  <tr key={room.id}>
                    <td>
                      <span className={styles.sttCell}>{stt}</span>
                    </td>
                    <td className={styles.nameCell}>
                      <div className={styles.tooltipWrapper}>
                        <span className={styles.textTruncate}>{room.name}</span>
                        <span className={styles.tooltip}>{room.name}</span>
                      </div>
                    </td>
                    <td className={styles.descCell}>
                      {room.description ? (
                        <div className={styles.tooltipWrapper}>
                          <span className={styles.textTruncate}>{room.description}</span>
                          <span className={styles.tooltip}>{room.description}</span>
                        </div>
                      ) : '-'}
                    </td>
                    <td>{room.capacity ?? '-'}</td>
                    <td className={styles.priceCell}>{formatPrice(room.basePrice)}</td>
                    <td>
                      <div className={styles.tooltipWrapper}>
                        <DropdownMenu modal={false}>
                          <DropdownMenuTrigger asChild>
                            <button
                              type="button"
                              className={`${styles.plainTrigger} ${room.isActive ? styles.statusActive : styles.statusInactive}`}
                              disabled={updatingStatusIds.has(room.id)}
                            >
                              <div className={`${styles.statusIndicator} ${styles.statusAnimated}`}>
                                <span className={styles.statusCircle}></span>
                              </div>
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className={styles.statusMenu} align="start" sideOffset={4}>
                            <DropdownMenuItem className={styles.statusMenuItem} onClick={() => handleToggleStatus(room, true)}>
                              Hoạt động
                            </DropdownMenuItem>
                            <DropdownMenuItem className={styles.statusMenuItem} onClick={() => handleToggleStatus(room, false)}>
                              Tạm dừng
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <span className={styles.tooltip}>
                          {room.isActive ? 'Đang hoạt động' : 'Tạm dừng'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <div className={styles.tooltipWrapper}>
                          <Button
                            variant="outline" size="sm"
                            className={styles.editButton}
                            onClick={() => handleOpenEdit(room)}
                          >
                            <EditIcon />
                          </Button>
                          <span className={styles.tooltip}>Chỉnh sửa</span>
                        </div>
                        {room.isActive ? (
                          <div className={styles.tooltipWrapper}>
                            <Button
                              variant="outline" size="sm"
                              className={styles.deleteButton}
                              onClick={() => handleDeleteTrigger(room)}
                              disabled={deletingId === room.id}
                            >
                              <TrashIcon />
                            </Button>
                            <span className={styles.tooltip}>Xóa</span>
                          </div>
                        ) : (
                          <div className={styles.tooltipWrapper}>
                            <Button
                              variant="outline" size="sm"
                              className={styles.restoreButton}
                              onClick={() => handleRestore(room)}
                              disabled={deletingId === room.id}
                            >
                              <RestoreIcon />
                            </Button>
                            <span className={styles.tooltip}>Khôi phục</span>
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

      <RoomTypeModal
        open={isModalOpen}
        onOpenChange={handleModalClose}
        room={editingRoom}
        onSuccess={fetchData}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa loại phòng"
        message={`Bạn có chắc chắn muốn xóa loại phòng "${itemToDelete?.name}"? Hành động này không thể hoàn tác.`}
        confirmLabel="Xóa ngay"
        cancelLabel="Suy nghĩ lại"
        variant="danger"
      />

      <ImportRoomTypeModal
        open={isImportModalOpen}
        onOpenChange={setIsImportModalOpen}
        onSuccess={fetchData}
      />
    </AdminPageLayout>
  );
}
