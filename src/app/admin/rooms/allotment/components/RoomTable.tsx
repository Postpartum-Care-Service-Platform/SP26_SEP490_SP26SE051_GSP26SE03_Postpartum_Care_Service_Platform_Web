'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import type { Room, RoomStatus } from '@/types/room-allotment';

import styles from './room-table.module.css';

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

const STATUS_MAP: Record<RoomStatus, { label: string; color: string }> = {
  'Available':          { label: 'Có sẵn',               color: '#15803d' },
  'Reserved':           { label: 'Đã đặt',               color: '#1d4ed8' },
  'Occupied':           { label: 'Đang sử dụng',         color: '#7c3aed' },
  'Cleaning Scheduled': { label: 'Lên lịch dọn dẹp',    color: '#b45309' },
  'Needs Repair':       { label: 'Cần sửa chữa',        color: '#dc2626' },
  'Maintenance':        { label: 'Bảo trì',              color: '#6b7280' },
};

interface RoomTableProps {
  rooms: Room[];
  onEdit: (room: Room) => void;
  onDelete: (room: Room) => void;
  actionId: number | null;
  pagination: {
    currentPage: number;
    pageSize: number;
  };
}

export function RoomTable({
  rooms,
  onEdit,
  onDelete,
  actionId,
  pagination,
}: RoomTableProps) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th style={{ width: '60px' }}>STT</th>
            <th style={{ width: '150px' }}>Tên phòng</th>
            <th style={{ width: '150px' }}>Loại phòng</th>
            <th style={{ width: '80px' }}>Tầng</th>
            <th style={{ width: '160px' }}>Trạng thái</th>
            <th style={{ width: '100px' }}>Hoạt động</th>
            <th className={styles.stickyActionsCol}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {rooms.length === 0 ? (
            <tr>
              <td colSpan={7} className={styles.emptyState}>
                Không có dữ liệu phòng nào.
              </td>
            </tr>
          ) : (
            rooms.map((room, index) => {
              const stt = (pagination.currentPage - 1) * pagination.pageSize + index + 1;
              const status = STATUS_MAP[room.status] ?? { label: room.status, color: '#6b7280' };
              
              return (
                <tr key={room.id}>
                  <td>
                    <div className={styles.tooltipWrapper}>
                      <span className={styles.sttCell}>{stt}</span>
                      <span className={styles.tooltip}>ID gốc: {room.id}</span>
                    </div>
                  </td>
                  <td className={styles.nameCell}>{room.name}</td>
                  <td>{room.roomTypeName}</td>
                  <td>{room.floor}</td>
                  <td>
                    <span 
                      className={styles.statusBadge} 
                      style={{ backgroundColor: `${status.color}1a`, color: status.color }}
                    >
                      {status.label}
                    </span>
                  </td>
                  <td>
                    <div className={styles.tooltipWrapper}>
                      <div className={room.isActive ? styles.statusActiveTrigger : styles.statusInactiveTrigger}>
                        <div className={`${styles.statusIndicator} ${styles.statusAnimated}`} style={{ backgroundColor: room.isActive ? '#10b981' : '#ef4444' }}>
                          <span className={styles.statusCircle}></span>
                        </div>
                      </div>
                      <span className={styles.tooltip}>
                        {room.isActive ? 'Đang hoạt động' : 'Tạm dừng'}
                      </span>
                    </div>
                  </td>
                  <td className={styles.stickyActionsCol}>
                    <div className={styles.actions}>
                      <div className={styles.tooltipWrapper}>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className={styles.editButton}
                          onClick={() => onEdit(room)}
                          disabled={actionId === room.id}
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
                          onClick={() => onDelete(room)}
                          disabled={actionId === room.id}
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
  );
}
