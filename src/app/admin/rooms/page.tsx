'use client';

import { useEffect, useState } from 'react';

import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import roomTypeService from '@/services/room-type.service';
import type { RoomType } from '@/types/room-type';

import { RoomTypeModal } from './components/RoomTypeModal';
import { RoomCard } from './RoomCard';
import styles from './rooms.module.css';

const getErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === 'string' && error.trim()) return error;
  return fallbackMessage;
};

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, setSavingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await roomTypeService.getAdminRoomTypes();
        setRooms(data);
      } catch (error: unknown) {
        setError(getErrorMessage(error, 'Không thể tải danh sách phòng'));
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleCreateRoom = () => {
    setSelectedRoom(null);
    setIsModalOpen(true);
  };

  const handleEditRoom = (room: RoomType) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const handleModalSuccess = async () => {
    try {
      const data = await roomTypeService.getAdminRoomTypes();
      setRooms(data);
    } catch (error: unknown) {
      setError(getErrorMessage(error, 'Không thể tải danh sách phòng'));
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
        <button type="button" className={styles.addButton} onClick={handleCreateRoom}>
          Thêm loại phòng
        </button>
      </div>
      <div className={styles.contentCard}>
        {renderContent()}
      </div>
      <RoomTypeModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        room={selectedRoom}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}

