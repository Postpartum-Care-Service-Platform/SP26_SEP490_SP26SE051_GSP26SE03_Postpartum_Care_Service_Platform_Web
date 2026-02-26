'use client';

import { CheckIcon, GearIcon, Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';

import type { Room, RoomStatus } from '@/types/room-allotment';

import styles from './room-allotment-table.module.css';

type Props = {
  rooms: Room[];
  onEdit?: (room: Room) => void;
  onDelete?: (room: Room) => void;
  onMaintain?: (room: Room) => void;
  onActivate?: (room: Room) => void;
};

const getStatusClass = (status: RoomStatus) => {
  switch (status) {
    case 'Available':
      return styles.statusAvailable;
    case 'Reserved':
      return styles.statusReserved;
    case 'Occupied':
      return styles.statusOccupied;
    case 'Cleaning Scheduled':
      return styles.statusCleaningScheduled;
    case 'Needs Repair':
      return styles.statusNeedsRepair;
    case 'Maintenance':
      return styles.statusMaintenance;
    default:
      return '';
  }
};

const getStatusLabel = (status: RoomStatus) => {
  switch (status) {
    case 'Available':
      return 'Có sẵn';
    case 'Reserved':
      return 'Đã đặt';
    case 'Occupied':
      return 'Đang sử dụng';
    case 'Cleaning Scheduled':
      return 'Lên lịch dọn dẹp';
    case 'Needs Repair':
      return 'Cần sửa chữa';
    case 'Maintenance':
      return 'Bảo trì';
    default:
      return status;
  }
};

const formatDate = (isoString: string | null | undefined) => {
  if (!isoString) return '-';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '-';
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  } catch {
    return '-';
  }
};

export function RoomAllotmentTable({ rooms, onEdit, onDelete, onMaintain, onActivate }: Props) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Mã phòng</th>
            <th>Loại phòng</th>
            <th>Tên phòng</th>
            <th>Tầng</th>
            <th>Trạng thái</th>
            <th>Hoạt động</th>
            <th>Ngày tạo</th>
            <th>Ngày cập nhật</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {rooms.length === 0 ? (
            <tr>
              <td colSpan={9} className={styles.emptyState}>
                Chưa có dữ liệu phòng
              </td>
            </tr>
          ) : (
            rooms.map((room) => (
              <tr key={room.id}>
                <td className={styles.roomId}>{room.id}</td>
                <td>{room.roomTypeName || '-'}</td>
                <td>{room.name || '-'}</td>
                <td>{room.floor || '-'}</td>
                <td>
                  <span className={`${styles.statusBadge} ${getStatusClass(room.status)}`}>
                    {getStatusLabel(room.status)}
                  </span>
                </td>
                <td>
                  <span className={`${styles.activeBadge} ${room.isActive ? styles.active : styles.inactive}`}>
                    {room.isActive ? 'Hoạt động' : 'Ngừng hoạt động'}
                  </span>
                </td>
                <td>{formatDate(room.createdAt)}</td>
                <td>{formatDate(room.updatedAt)}</td>
                <td>
                  <div className={styles.actions}>
                    <button
                      className={styles.editButton}
                      onClick={() => onEdit?.(room)}
                      aria-label={`Chỉnh sửa ${room.name}`}
                    >
                      <Pencil1Icon />
                    </button>
                    <button
                      className={styles.activateButton}
                      onClick={() => onActivate?.(room)}
                      aria-label={`Kích hoạt ${room.name}`}
                    >
                      <CheckIcon />
                    </button>
                    <button
                      className={styles.maintainButton}
                      onClick={() => onMaintain?.(room)}
                      aria-label={`Bảo trì ${room.name}`}
                    >
                      <GearIcon />
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => onDelete?.(room)}
                      aria-label={`Xóa ${room.name}`}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

