import React from 'react';
import type { Room } from '@/types/room-allotment';
import styles from './map.module.css';

interface Props {
  rooms: Room[];
  onSelectRoom: (room: Room) => void;
  selectedRoomId?: number;
}

const STATUS_CONFIG: Record<string, { color: string; label: string; bg: string }> = {
  'Available':          { color: '#22c55e', label: 'Trống', bg: '#f0fdf4' },
  'Reserved':           { color: '#3b82f6', label: 'Đã đặt', bg: '#eff6ff' },
  'Occupied':           { color: '#a855f7', label: 'Đang ở', bg: '#f5f3ff' },
  'Cleaning Scheduled': { color: '#f59e0b', label: 'Dọn dẹp', bg: '#fffbeb' },
  'Needs Repair':       { color: '#ef4444', label: 'Cần sửa', bg: '#fef2f2' },
  'Maintenance':        { color: '#64748b', label: 'Bảo trì', bg: '#f8fafc' },
};

export function RoomMapGrid({ rooms, onSelectRoom, selectedRoomId }: Props) {
  return (
    <div className={styles.grid}>
      {rooms.length > 0 ? (
        rooms.map((room) => {
          const config = STATUS_CONFIG[room.status] || STATUS_CONFIG['Maintenance'];
          const isSelected = selectedRoomId === room.id;

          return (
            <div
              key={room.id}
              className={`${styles.roomCard} ${isSelected ? styles.selected : ''}`}
              onClick={() => onSelectRoom(room)}
              style={{ 
                '--status-color': config.color,
                '--status-bg': config.bg 
              } as React.CSSProperties}
            >
              <div className={styles.roomHeader}>
                <span className={styles.roomName}>{room.name}</span>
                <div className={styles.statusDot} />
              </div>
              
              <div className={styles.roomBody}>
                <span className={styles.typeName}>{room.roomTypeName}</span>
                <span className={styles.statusBadge}>{config.label}</span>
              </div>

              {isSelected && <div className={styles.selectionIndicator} />}
            </div>
          );
        })
      ) : (
        <div className={styles.noRooms}>Không có dữ liệu phòng cho tầng này.</div>
      )}
    </div>
  );
}
