import React from 'react';
import { X, User, Calendar, ShieldCheck, Activity, Settings } from 'lucide-react';
import type { Room } from '@/types/room-allotment';
import { Button } from '@/components/ui/button';
import styles from './sidebar.module.css';

interface Props {
  room: Room | null;
  onClose: () => void;
  onUpdate: () => void;
}

export function RoomDetailsSidebar({ room, onClose, onUpdate }: Props) {
  if (!room) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.sidebar} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.headerInfo}>
            <h2>Phòng {room.name}</h2>
            <span>{room.roomTypeName} • Tầng {room.floor}</span>
          </div>
          <button className={styles.closeBtn} onClick={onClose}><X size={20} /></button>
        </div>

        <div className={styles.content}>
          <section className={styles.section}>
            <h3>Trạng thái hiện tại</h3>
            <div className={`${styles.statusCard} styles[room.status]`}>
              <div className={styles.statusLabel}>
                <div className={styles.dot} />
                <span>{room.status}</span>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h3>Thông tin chi tiết</h3>
            <div className={styles.infoList}>
              <div className={styles.infoItem}>
                <User size={16} />
                <div className={styles.infoText}>
                  <label>Người phụ trách</label>
                  <p>Chưa có dữ liệu</p>
                </div>
              </div>
              <div className={styles.infoItem}>
                <Calendar size={16} />
                <div className={styles.infoText}>
                  <label>Ngày dọn dẹp gần nhất</label>
                  <p>{new Date(room.updatedAt).toLocaleDateString('vi-VN')}</p>
                </div>
              </div>
              <div className={styles.infoItem}>
                <ShieldCheck size={16} />
                <div className={styles.infoText}>
                  <label>Mức độ ưu tiên</label>
                  <p>Bình thường</p>
                </div>
              </div>
            </div>
          </section>
          
          <section className={styles.section}>
             <h3>Tiện nghi</h3>
             <div className={styles.amenities}>
                <span>Wi-Fi</span>
                <span>Điều hòa</span>
                <span>Tivi</span>
                <span>Tủ lạnh</span>
             </div>
          </section>
        </div>

        <div className={styles.footer}>
          <Button variant="outline" className={styles.fullWidth} onClick={() => window.open(`/admin/rooms/allotment`, '_blank')}>
            <Settings size={16} /> Quản lý phân bổ
          </Button>
          <Button variant="primary" className={styles.fullWidth} onClick={onClose}>
            Xác nhận
          </Button>
        </div>
      </div>
    </div>
  );
}
