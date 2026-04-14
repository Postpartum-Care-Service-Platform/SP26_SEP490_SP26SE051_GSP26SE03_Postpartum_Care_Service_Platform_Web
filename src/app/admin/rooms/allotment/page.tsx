'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronDownIcon, MixerHorizontalIcon, PlusIcon } from '@radix-ui/react-icons';
import { Download, Upload } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/ui/modal/ConfirmModal';
import { Pagination } from '@/components/ui/pagination';
import { useToast } from '@/components/ui/toast/use-toast';
import roomAllotmentService from '@/services/room-allotment.service';
import roomTypeService from '@/services/room-type.service';
import type { Room, RoomStatus } from '@/types/room-allotment';

import styles from './allotment.module.css';
import { RoomAllotmentModal } from './components/RoomAllotmentModal';
import { ImportRoomModal } from './components/ImportRoomModal';
import { AdminPageLayout } from '@/components/layout/admin/AdminPageLayout';
import { RoomTable } from './components/RoomTable';
import { RoomTableControls } from './components/RoomTableControls';
import { RoomAllotmentHeader } from './components/RoomAllotmentHeader';


/* ── Trạng thái phòng ── */
export const STATUS_MAP: Record<RoomStatus, { label: string; color: string }> = {
  'Available': { label: 'Có sẵn', color: '#15803d' },
  'Reserved': { label: 'Đã đặt', color: '#1d4ed8' },
  'Occupied': { label: 'Đang sử dụng', color: '#7c3aed' },
  'Cleaning Scheduled': { label: 'Lên lịch dọn dẹp', color: '#b45309' },
  'Needs Repair': { label: 'Cần sửa chữa', color: '#dc2626' },
  'Maintenance': { label: 'Bảo trì', color: '#6b7280' },
};

/* ── SVG icons ── */


const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

type SortKey = 'id-asc' | 'id-desc' | 'name-asc' | 'name-desc' | 'floor-asc' | 'floor-desc';

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'id-desc', label: 'STT: giảm dần' },
  { value: 'id-asc', label: 'STT: tăng dần' },
  { value: 'name-asc', label: 'Tên A → Z' },
  { value: 'name-desc', label: 'Tên Z → A' },
  { value: 'floor-asc', label: 'Tầng thấp → cao' },
  { value: 'floor-desc', label: 'Tầng cao → thấp' },
];

const ACTIVE_OPTIONS: { value: 'all' | 'active' | 'inactive'; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'active', label: 'Hoạt động' },
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
    case 'id-asc': return arr.sort((a, b) => a.id - b.id);
    case 'id-desc': return arr.sort((a, b) => b.id - a.id);
    case 'name-asc': return arr.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc': return arr.sort((a, b) => b.name.localeCompare(a.name));
    case 'floor-asc': return arr.sort((a, b) => a.floor - b.floor);
    case 'floor-desc': return arr.sort((a, b) => b.floor - a.floor);
    default: return arr;
  }
};

export default function AddRoomAllotmentPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionId, setActionId] = useState<number | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortKey, setSortKey] = useState<SortKey>('id-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Room | null>(null);

  const handleOpenCreate = () => { setEditingRoom(null); setIsModalOpen(true); };
  const handleOpenEdit = (room: Room) => { setEditingRoom(room); setIsModalOpen(true); };
  const { toast } = useToast();

  const handleExport = async () => {
    try {
      await roomAllotmentService.exportRooms();
      toast({ title: 'Xuất dữ liệu thành công', variant: 'success' });
    } catch (err) {
      toast({ title: 'Xuất dữ liệu thất bại', variant: 'error' });
    }
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      setActionId(itemToDelete.id);
      await roomAllotmentService.deleteRoom(itemToDelete.id);
      await fetchData();
      toast({ title: 'Xóa phòng thành công', variant: 'success' });
    } catch (err) {
      toast({ title: getErrorMessage(err, 'Xóa phòng thất bại'), variant: 'error' });
    } finally {
      setActionId(null);
      setItemToDelete(null);
      setIsConfirmModalOpen(false);
    }
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [data, roomTypesData] = await Promise.all([
        roomAllotmentService.getAllRooms(),
        roomTypeService.getAdminRoomTypes()
      ]);
      const roomTypeMap = new Map((roomTypesData || []).map(rt => [rt.id, rt.name]));

      const mappedData = Array.isArray(data) ? data.map(room => ({
        ...room,
        roomTypeName: room.roomTypeName || roomTypeMap.get(room.roomTypeId) || '-'
      })) : [];

      setRooms(mappedData);
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
    if (activeFilter !== 'all') {
      filtered = filtered.filter((r) => activeFilter === 'active' ? r.isActive : !r.isActive);
    }
    return sortItems(filtered, sortKey);
  }, [rooms, searchQuery, activeFilter, sortKey]);

  useEffect(() => { setCurrentPage(1); }, [searchQuery, activeFilter, sortKey]);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredItems.length / pageSize);

  /* ── Handlers ── */
  const handleModalClose = (open: boolean) => { setIsModalOpen(open); if (!open) setEditingRoom(null); };

  const handleDelete = async (room: Room) => {
    setItemToDelete(room);
    setIsConfirmModalOpen(true);
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

  const selectedSortLabel = SORT_OPTIONS.find((o) => o.value === sortKey)?.label ?? 'Sắp xếp';
  const selectedActiveLabel = ACTIVE_OPTIONS.find((o) => o.value === activeFilter)?.label ?? 'Tất cả';

  return (
    <div className="flex flex-col flex-1 h-full min-h-0">
      <AdminPageLayout
        header={<RoomAllotmentHeader />}
        controlPanel={

          <RoomTableControls
            onSearch={setSearchQuery}
            onSortChange={setSortKey}
            onActiveFilterChange={setActiveFilter}
            onNewRoom={handleOpenCreate}
            onImportClick={() => setIsImportModalOpen(true)}
            onExportClick={handleExport}
            activeSortKey={sortKey}
            activeFilter={activeFilter}
          />
        }
        pagination={
          totalPages > 0 ? (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={filteredItems.length}
              onPageChange={setCurrentPage}
              pageSizeOptions={[...PAGE_SIZE_OPTIONS]}
              onPageSizeChange={(size: number) => { setPageSize(size); setCurrentPage(1); }}
              showResultCount={true}
            />
          ) : null
        }
      >
        {loading ? (
          <div className={styles.placeholder}>Đang tải dữ liệu...</div>
        ) : error ? (
          <div className={styles.placeholder}>{error}</div>
        ) : (
          <RoomTable
            rooms={paginatedItems}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
            actionId={actionId}
            pagination={{ currentPage, pageSize }}
          />
        )}

        <RoomAllotmentModal
          open={isModalOpen}
          onOpenChange={handleModalClose}
          room={editingRoom}
          onSuccess={fetchData}
        />

        <ImportRoomModal
          open={isImportModalOpen}
          onOpenChange={setIsImportModalOpen}
          onSuccess={fetchData}
        />

        <ConfirmModal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Xác nhận xóa phòng"
          message={`Bạn có chắc chắn muốn xóa phòng "${itemToDelete?.name}"? Hành động này không thể hoàn tác.`}
          confirmLabel="Xóa ngay"
          cancelLabel="Suy nghĩ lại"
          variant="danger"
        />
      </AdminPageLayout>
    </div>
  );
}
