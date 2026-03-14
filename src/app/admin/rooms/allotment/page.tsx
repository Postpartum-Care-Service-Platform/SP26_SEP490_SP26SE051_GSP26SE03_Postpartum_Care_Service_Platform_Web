'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronDownIcon, MagnifyingGlassIcon, MixerHorizontalIcon, PlusIcon } from '@radix-ui/react-icons';

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
import roomAllotmentService from '@/services/room-allotment.service';
import type { Room, RoomStatus } from '@/types/room-allotment';

import styles from './allotment.module.css';
import { RoomAllotmentModal } from './components/RoomAllotmentModal';

/* ── Trạng thái phòng ── */
export const STATUS_MAP: Record<RoomStatus, { label: string; color: string }> = {
  'Available':          { label: 'Có sẵn',               color: '#15803d' },
  'Reserved':           { label: 'Đã đặt',               color: '#1d4ed8' },
  'Occupied':           { label: 'Đang sử dụng',         color: '#7c3aed' },
  'Cleaning Scheduled': { label: 'Lên lịch dọn dẹp',    color: '#b45309' },
  'Needs Repair':       { label: 'Cần sửa chữa',        color: '#dc2626' },
  'Maintenance':        { label: 'Bảo trì',              color: '#6b7280' },
};

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

const WrenchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
    <path d="M21.71 20.29l-5.4-5.4A7.5 7.5 0 1 0 14.9 16.3l5.4 5.4a1 1 0 0 0 1.41-1.41zM5 10.5a5.5 5.5 0 1 1 5.5 5.5A5.5 5.5 0 0 1 5 10.5z"/>
  </svg>
);

const ActivateIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
  </svg>
);

const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

type SortKey      = 'id-asc' | 'id-desc' | 'name-asc' | 'name-desc' | 'floor-asc' | 'floor-desc';
type StatusFilter = 'all' | RoomStatus;

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'id-desc',    label: 'STT: giảm dần' },
  { value: 'id-asc',     label: 'STT: tăng dần' },
  { value: 'name-asc',   label: 'Tên A → Z' },
  { value: 'name-desc',  label: 'Tên Z → A' },
  { value: 'floor-asc',  label: 'Tầng thấp → cao' },
  { value: 'floor-desc', label: 'Tầng cao → thấp' },
];

const STATUS_FILTER_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all',                label: 'Tất cả' },
  { value: 'Available',          label: 'Có sẵn' },
  { value: 'Reserved',           label: 'Đã đặt' },
  { value: 'Occupied',           label: 'Đang sử dụng' },
  { value: 'Cleaning Scheduled', label: 'Lên lịch dọn dẹp' },
  { value: 'Needs Repair',       label: 'Cần sửa chữa' },
  { value: 'Maintenance',        label: 'Bảo trì' },
];

const ACTIVE_OPTIONS: { value: 'all' | 'active' | 'inactive'; label: string }[] = [
  { value: 'all',      label: 'Tất cả' },
  { value: 'active',   label: 'Hoạt động' },
  { value: 'inactive', label: 'Không hoạt động' },
];

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === 'object' && error !== null && 'message' in error &&
    typeof (error as { message?: unknown }).message === 'string')
    return (error as { message: string }).message;
  return fallback;
};

const sortItems = (items: Room[], key: SortKey) => {
  const arr = [...items];
  switch (key) {
    case 'id-asc':    return arr.sort((a, b) => a.id - b.id);
    case 'id-desc':   return arr.sort((a, b) => b.id - a.id);
    case 'name-asc':  return arr.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc': return arr.sort((a, b) => b.name.localeCompare(a.name));
    case 'floor-asc':  return arr.sort((a, b) => a.floor - b.floor);
    case 'floor-desc': return arr.sort((a, b) => b.floor - a.floor);
    default: return arr;
  }
};

export default function AddRoomAllotmentPage() {
  const [rooms, setRooms]         = useState<Room[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [actionId, setActionId]   = useState<number | null>(null);

  const [searchQuery, setSearchQuery]   = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortKey, setSortKey]           = useState<SortKey>('id-desc');
  const [currentPage, setCurrentPage]   = useState(1);
  const [pageSize, setPageSize]         = useState(DEFAULT_PAGE_SIZE);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  const handleOpenCreate = () => { setEditingRoom(null); setIsModalOpen(true); };
  const handleOpenEdit   = (room: Room) => { setEditingRoom(room); setIsModalOpen(true); };
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await roomAllotmentService.getAllRooms();
      setRooms(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Không thể tải danh sách phân bổ phòng'));
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
        (r) => r.name.toLowerCase().includes(q) || r.roomTypeName.toLowerCase().includes(q),
      );
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter((r) => r.status === statusFilter);
    }
    if (activeFilter !== 'all') {
      filtered = filtered.filter((r) => activeFilter === 'active' ? r.isActive : !r.isActive);
    }
    return sortItems(filtered, sortKey);
  }, [rooms, searchQuery, statusFilter, activeFilter, sortKey]);

  useEffect(() => { setCurrentPage(1); }, [searchQuery, statusFilter, activeFilter, sortKey]);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredItems.length / pageSize);

  /* ── Handlers ── */
  const handleModalClose = (open: boolean) => { setIsModalOpen(open); if (!open) setEditingRoom(null); };

  const handleDelete = async (room: Room) => {
    if (!window.confirm(`Bạn có chắc muốn xóa phòng "${room.name}"?`)) return;
    try {
      setActionId(room.id);
      await roomAllotmentService.deleteRoom(room.id);
      await fetchData();
      toast({ title: 'Xóa phòng thành công', variant: 'success' });
    } catch (err) {
      toast({ title: getErrorMessage(err, 'Xóa phòng thất bại'), variant: 'error' });
    } finally {
      setActionId(null);
    }
  };

  const handleMaintain = async (room: Room) => {
    try {
      setActionId(room.id);
      await roomAllotmentService.maintainRoom(room.id);
      await fetchData();
      toast({ title: 'Đưa phòng vào bảo trì thành công', variant: 'success' });
    } catch (err) {
      toast({ title: getErrorMessage(err, 'Thao tác thất bại'), variant: 'error' });
    } finally {
      setActionId(null);
    }
  };

  const handleActivate = async (room: Room) => {
    try {
      setActionId(room.id);
      await roomAllotmentService.activateRoom(room.id);
      await fetchData();
      toast({ title: 'Kích hoạt phòng thành công', variant: 'success' });
    } catch (err) {
      toast({ title: getErrorMessage(err, 'Thao tác thất bại'), variant: 'error' });
    } finally {
      setActionId(null);
    }
  };

  const selectedSortLabel   = SORT_OPTIONS.find((o) => o.value === sortKey)?.label ?? 'Sắp xếp';
  const selectedStatusLabel = STATUS_FILTER_OPTIONS.find((o) => o.value === statusFilter)?.label ?? 'Tất cả';
  const selectedActiveLabel = ACTIVE_OPTIONS.find((o) => o.value === activeFilter)?.label ?? 'Tất cả';

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <div className={styles.header}>
        <h4 className={styles.title}>Phân bổ phòng</h4>
        <Breadcrumbs items={[{ label: 'Phân bổ phòng' }]} homeHref="/admin" />
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.controlsLeft}>
          <div className={styles.searchWrapper}>
            <MagnifyingGlassIcon className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Tìm kiếm tên phòng, loại phòng..."
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
          {/* Filter trạng thái phòng */}
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className={styles.statusButton}>
                {selectedStatusLabel}
                <ChevronDownIcon className={styles.chevronIcon} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={styles.dropdownContent}>
              {STATUS_FILTER_OPTIONS.map((opt) => (
                <DropdownMenuItem key={opt.value}
                  className={`${styles.dropdownItem} ${statusFilter === opt.value ? styles.dropdownItemActive : ''}`}
                  onClick={() => setStatusFilter(opt.value)}>
                  {opt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Filter hoạt động */}
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className={styles.statusButton}>
                {selectedActiveLabel}
                <ChevronDownIcon className={styles.chevronIcon} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={styles.dropdownContent}>
              {ACTIVE_OPTIONS.map((opt) => (
                <DropdownMenuItem key={opt.value}
                  className={`${styles.dropdownItem} ${activeFilter === opt.value ? styles.dropdownItemActive : ''}`}
                  onClick={() => setActiveFilter(opt.value)}>
                  {opt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="primary" size="sm" className={styles.createButton} onClick={handleOpenCreate}>
            <PlusIcon className={styles.plusIcon} />
            Thêm phòng mới
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
                  <th>Tên phòng</th>
                  <th>Loại phòng</th>
                  <th>Tầng</th>
                  <th>Trạng thái</th>
                  <th>Hoạt động</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {paginatedItems.length === 0 ? (
                  <tr><td colSpan={7} className={styles.emptyState}>
                    {searchQuery ? 'Không tìm thấy kết quả phù hợp.' : 'Chưa có phòng nào.'}
                  </td></tr>
                ) : (
                  paginatedItems.map((room, index) => {
                    const stt    = (currentPage - 1) * pageSize + index + 1;
                    const status = STATUS_MAP[room.status] ?? { label: room.status, color: '#6b7280' };
                    return (
                      <tr key={room.id}>
                        <td><span className={styles.sttCell} title={`ID gốc: ${room.id}`}>{stt}</span></td>
                        <td className={styles.nameCell}>{room.name}</td>
                        <td>{room.roomTypeName}</td>
                        <td>{room.floor}</td>
                        <td>
                          <span className={styles.statusBadge} style={{ backgroundColor: `${status.color}1a`, color: status.color }}>
                            {status.label}
                          </span>
                        </td>
                        <td>
                          <span className={`${styles.activeBadge} ${room.isActive ? styles.activeOn : styles.activeOff}`}>
                            {room.isActive ? 'Hoạt động' : 'Dừng'}
                          </span>
                        </td>
                        <td>
                          <div className={styles.actions}>
                            <div className={styles.tooltipWrapper}>
                              <Button variant="outline" size="sm" className={styles.editButton}
                                onClick={() => handleOpenEdit(room)} disabled={actionId === room.id}>
                                <EditIcon />
                              </Button>
                              <span className={styles.tooltip}>Chỉnh sửa</span>
                            </div>
                            {room.status !== 'Maintenance' ? (
                              <div className={styles.tooltipWrapper}>
                                <Button variant="outline" size="sm" className={styles.maintainButton}
                                  onClick={() => handleMaintain(room)} disabled={actionId === room.id}>
                                  <WrenchIcon />
                                </Button>
                                <span className={styles.tooltip}>Bảo trì</span>
                              </div>
                            ) : (
                              <div className={styles.tooltipWrapper}>
                                <Button variant="outline" size="sm" className={styles.activateButton}
                                  onClick={() => handleActivate(room)} disabled={actionId === room.id}>
                                  <ActivateIcon />
                                </Button>
                                <span className={styles.tooltip}>Kích hoạt</span>
                              </div>
                            )}
                            <div className={styles.tooltipWrapper}>
                              <Button variant="outline" size="sm" className={styles.deleteButton}
                                onClick={() => handleDelete(room)} disabled={actionId === room.id}>
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

      <RoomAllotmentModal
        open={isModalOpen}
        onOpenChange={handleModalClose}
        room={editingRoom}
        onSuccess={fetchData}
      />
    </div>
  );
}
