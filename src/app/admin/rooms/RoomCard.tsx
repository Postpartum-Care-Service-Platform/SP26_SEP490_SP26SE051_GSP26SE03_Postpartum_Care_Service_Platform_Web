'use client';

import Image from 'next/image';
import styles from './room-card.module.css';
import type { RoomType } from '@/types/room-type';
import room1 from '@/assets/images/Room/room-1.png';
import room2 from '@/assets/images/Room/room-2.avif';
import room3 from '@/assets/images/Room/room-3.jpg';
import room4 from '@/assets/images/Room/room-4.jpg';
import room5 from '@/assets/images/Room/room-5.jpg';
import room6 from '@/assets/images/Room/room-6.png';

const ROOM_IMAGES = [room1, room2, room3, room4, room5, room6];

type Props = {
  room: RoomType;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
};

export function RoomCard({ room, index, onEdit, onDelete }: Props) {
  const image = ROOM_IMAGES[index % ROOM_IMAGES.length];
  const statusLabel = room.isActive ? 'Còn trống' : 'Ngừng sử dụng';

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image src={image} alt={room.name} fill className={styles.image} sizes="320px" />
      </div>
      <div className={styles.body}>
        <div className={styles.headerRow}>
          <div className={styles.roomName}>{room.name}</div>
          <span className={`${styles.statusBadge} ${room.isActive ? styles.statusAvailable : styles.statusInactive}`}>
            {statusLabel}
          </span>
        </div>
        <div className={styles.meta}>
          <span>{room.capacity ? `${room.capacity} khách` : 'Chưa cấu hình sức chứa'}</span>
        </div>
        <div className={styles.detailsGrid}>
          <div className={styles.detailBox}>
            <div className={styles.detailLabel}>Mã phòng</div>
            <div className={styles.detailValue}>{room.id}</div>
          </div>
          <div className={styles.detailBox}>
            <div className={styles.detailLabel}>Giá cơ bản</div>
            <div className={styles.detailValue}>{room.basePrice.toLocaleString('vi-VN')}</div>
          </div>
          <div className={styles.detailBox}>
            <div className={styles.detailLabel}>Sức chứa</div>
            <div className={styles.detailValue}>{room.capacity ?? '-'}</div>
          </div>
        </div>
        <div className={styles.description}>{room.description || 'Chưa có mô tả'}</div>
        <div className={styles.actionsRow}>
          <button className={styles.actionButtonPrimary} type="button" onClick={onEdit}>
            Chỉnh sửa
          </button>
          <button className={styles.actionButtonDanger} type="button" onClick={onDelete}>
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}


