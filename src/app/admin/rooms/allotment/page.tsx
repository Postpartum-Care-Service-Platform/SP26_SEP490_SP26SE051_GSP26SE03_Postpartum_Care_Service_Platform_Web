'use client';

import { useEffect, useState } from 'react';

import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { useToast } from '@/components/ui/toast/use-toast';
import roomAllotmentService from '@/services/room-allotment.service';
import type { Room } from '@/types/room-allotment';

import styles from './allotment.module.css';
import { RoomAllotmentStats } from './components/RoomAllotmentStats';
import { RoomAllotmentStatusLegend } from './components/RoomAllotmentStatusLegend';
import { RoomAllotmentTable } from './components/RoomAllotmentTable';

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error) {
    return error.message || fallback;
  }
  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message?: unknown }).message === 'string'
  ) {
    return (error as { message: string }).message;
  }
  return fallback;
};

export default function AddRoomAllotmentPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, setSavingId] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
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
  };

  const handleEdit = async (room: Room) => {
    const statusOptions = ['Available', 'Reserved', 'Occupied', 'Cleaning Scheduled', 'Needs Repair', 'Maintenance'];
    const statusLabels = ['Có sẵn', 'Đã đặt', 'Đang sử dụng', 'Lên lịch dọn dẹp', 'Cần sửa chữa', 'Bảo trì'];
    const currentStatusIndex = statusOptions.indexOf(room.status);

    const nameInput = window.prompt('Tên phòng', room.name);
    if (nameInput == null) return;

    const floorInput = window.prompt('Tầng', String(room.floor));
    if (floorInput == null) return;
    const floor = Number(floorInput);
    if (Number.isNaN(floor) || floor < 0) {
      toast({ title: 'Tầng không hợp lệ', variant: 'error' });
      return;
    }

    const statusInput = window.prompt(
      `Trạng thái (0-5):\n${statusLabels.map((label, idx) => `${idx}: ${label}`).join('\n')}`,
      String(currentStatusIndex >= 0 ? currentStatusIndex : 0)
    );
    if (statusInput == null) return;
    const statusIndex = Number(statusInput);
    if (Number.isNaN(statusIndex) || statusIndex < 0 || statusIndex >= statusOptions.length) {
      toast({ title: 'Trạng thái không hợp lệ', variant: 'error' });
      return;
    }

    const isActive = room.isActive;

    try {
      setSavingId(room.id);
      await roomAllotmentService.updateRoom(room.id, {
        roomTypeId: room.roomTypeId,
        name: nameInput.trim(),
        floor,
        status: statusOptions[statusIndex] as Room['status'],
        isActive,
      });

      toast({ title: 'Cập nhật phòng thành công', variant: 'success' });
      await fetchRooms();
    } catch (err: unknown) {
      toast({ title: getErrorMessage(err, 'Cập nhật phòng thất bại'), variant: 'error' });
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (room: Room) => {
    try {
      setSavingId(room.id);
      await roomAllotmentService.deleteRoom(room.id);
      toast({ title: 'Xóa phòng thành công', variant: 'success' });
      await fetchRooms();
    } catch (err: unknown) {
      toast({ title: getErrorMessage(err, 'Xóa phòng thất bại'), variant: 'error' });
    } finally {
      setSavingId(null);
    }
  };

  const handleMaintain = async (room: Room) => {
    try {
      setSavingId(room.id);
      await roomAllotmentService.maintainRoom(room.id);
      toast({ title: 'Đưa phòng vào chế độ bảo trì thành công', variant: 'success' });
      await fetchRooms();
    } catch (err: unknown) {
      toast({ title: getErrorMessage(err, 'Đưa phòng vào chế độ bảo trì thất bại'), variant: 'error' });
    } finally {
      setSavingId(null);
    }
  };

  const handleActivate = async (room: Room) => {
    try {
      setSavingId(room.id);
      await roomAllotmentService.activateRoom(room.id);
      toast({ title: 'Kích hoạt phòng thành công', variant: 'success' });
      await fetchRooms();
    } catch (err: unknown) {
      toast({ title: getErrorMessage(err, 'Kích hoạt phòng thất bại'), variant: 'error' });
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h4 className={styles.title}>Phân bổ phòng</h4>
        <Breadcrumbs
          items={[
            { label: 'Trang quản trị', href: '/admin' },
            { label: 'Thêm phân bổ phòng' },
          ]}
          homeHref="/admin"
        />
      </div>

      <div className={styles.contentCard}>
        <RoomAllotmentStats rooms={rooms} />
      </div>

      <div className={styles.tableSection}>
        <RoomAllotmentStatusLegend />
        {loading ? (
          <div className={styles.placeholderText}>Đang tải danh sách phân bổ phòng...</div>
        ) : error ? (
          <div className={styles.placeholderText}>{error}</div>
        ) : (
          <RoomAllotmentTable rooms={rooms} onEdit={handleEdit} onDelete={handleDelete} onMaintain={handleMaintain} onActivate={handleActivate} />
        )}
      </div>
    </div>
  );
}


