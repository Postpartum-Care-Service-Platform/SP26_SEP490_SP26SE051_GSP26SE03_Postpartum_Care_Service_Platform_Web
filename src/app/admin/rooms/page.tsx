'use client';

import { useEffect, useState } from 'react';
import styles from './rooms.module.css';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import roomTypeService from '@/services/room-type.service';
import type { RoomType } from '@/types/room-type';
import { RoomCard } from './RoomCard';

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await roomTypeService.getAdminRoomTypes();
        setRooms(data);
      } catch (err: any) {
        setError(err?.message || 'Không thể tải danh sách phòng');
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleCreateRoom = async () => {
    const name = window.prompt('Tên loại phòng');
    if (!name || !name.trim()) {
      return;
    }

    const basePriceInput = window.prompt('Giá cơ bản', '0');
    if (basePriceInput == null) {
      return;
    }
    const basePrice = Number(basePriceInput);
    if (Number.isNaN(basePrice) || basePrice < 0) {
      return;
    }

    const capacityInput = window.prompt('Sức chứa', '1');
    if (capacityInput == null) {
      return;
    }
    const capacity = Number(capacityInput);
    if (Number.isNaN(capacity) || capacity < 0) {
      return;
    }

    const description = window.prompt('Mô tả', '') ?? '';

    try {
      setCreating(true);
      const created = await roomTypeService.createRoomType({
        name: name.trim(),
        basePrice,
        description,
        capacity,
      });
      setRooms((prev) => [created, ...prev]);
    } finally {
      setCreating(false);
    }
  };

  const handleEditRoom = async (room: RoomType) => {
    const name = window.prompt('Tên loại phòng', room.name);
    if (name == null || name.trim() === '') {
      return;
    }

    const basePriceInput = window.prompt('Giá cơ bản', String(room.basePrice));
    if (basePriceInput == null) {
      return;
    }
    const basePrice = Number(basePriceInput);
    if (Number.isNaN(basePrice) || basePrice < 0) {
      return;
    }

    const capacityInput = window.prompt('Sức chứa', room.capacity != null ? String(room.capacity) : '');
    if (capacityInput == null) {
      return;
    }
    const capacity = Number(capacityInput);
    if (Number.isNaN(capacity) || capacity < 0) {
      return;
    }

    const description = window.prompt('Mô tả', room.description ?? '') ?? '';

    try {
      setSavingId(room.id);
      const updated = await roomTypeService.updateRoomType(room.id, {
        name: name.trim(),
        basePrice,
        description,
        capacity,
      });
      setRooms((prev) => prev.map((r) => (r.id === room.id ? updated : r)));
    } finally {
      setSavingId(null);
    }
  };

  const handleDeleteRoom = async (room: RoomType) => {
    const confirmDelete = window.confirm('Bạn có chắc muốn xóa loại phòng này?');
    if (!confirmDelete) {
      return;
    }

    try {
      setSavingId(room.id);
      await roomTypeService.deleteRoomType(room.id);
      setRooms((prev) => prev.filter((r) => r.id !== room.id));
    } finally {
      setSavingId(null);
    }
  };

  const renderContent = () => {
    if (loading) {
      return <div className={styles.placeholderText}>Đang tải danh sách phòng...</div>;
    }

    if (error) {
      return <div className={styles.placeholderText}>{error}</div>;
    }

    if (!rooms.length) {
      return <div className={styles.placeholderText}>Chưa có loại phòng nào.</div>;
    }

    return (
      <div className={styles.cardsGrid}>
        {rooms.map((room, index) => (
          <RoomCard
            key={room.id}
            room={room}
            index={index}
            onEdit={() => handleEditRoom(room)}
            onDelete={() => handleDeleteRoom(room)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h4 className={styles.title}>Tất cả phòng</h4>
        <Breadcrumbs
          items={[
            { label: 'Trang quản trị', href: '/admin' },
            { label: 'All Rooms' },
          ]}
          homeHref="/admin"
        />
      </div>
      <div className={styles.actionsBar}>
        <button type="button" className={styles.addButton} onClick={handleCreateRoom} disabled={creating}>
          Thêm loại phòng
        </button>
      </div>
      <div className={styles.contentCard}>
        {renderContent()}
      </div>
    </div>
  );
}

