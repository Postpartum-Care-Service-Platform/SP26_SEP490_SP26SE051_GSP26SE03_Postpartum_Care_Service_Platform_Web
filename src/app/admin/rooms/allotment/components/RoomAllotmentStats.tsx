'use client';

import { AlertTriangle, Box, Calendar, Heart, Users } from 'lucide-react';

import type { Room } from '@/types/room-allotment';

import styles from './room-allotment-stats.module.css';
import { RoomAllotmentStatCard } from './RoomAllotmentStatCard';

type Props = {
  rooms: Room[];
};

export function RoomAllotmentStats({ rooms }: Props) {
  const occupiedCount = rooms.filter((r) => r.status === 'Occupied').length;
  const availableCount = rooms.filter((r) => r.status === 'Available' && r.isActive).length;
  const reservedCount = rooms.filter((r) => r.status === 'Reserved').length;
  const needsRepairCount = rooms.filter((r) => r.status === 'Needs Repair').length;
  const cleaningScheduledCount = rooms.filter((r) => r.status === 'Cleaning Scheduled').length;

  const stats = [
    {
      title: 'Phòng đang sử dụng',
      value: occupiedCount,
      subtitle: 'Phòng đã được phân bổ',
      borderColor: '#fbbf24',
      icon: Users,
      iconBgColor: '#fef3c7',
      iconColor: '#d97706',
    },
    {
      title: 'Phòng có sẵn',
      value: availableCount,
      subtitle: 'Phòng sẵn sàng sử dụng',
      borderColor: '#3b82f6',
      icon: Box,
      iconBgColor: '#dbeafe',
      iconColor: '#2563eb',
    },
    {
      title: 'Phòng đã đặt',
      value: reservedCount,
      subtitle: 'Phòng đã được đặt trước',
      borderColor: '#10b981',
      icon: Calendar,
      iconBgColor: '#d1fae5',
      iconColor: '#059669',
    },
    {
      title: 'Cần sửa chữa',
      value: needsRepairCount,
      subtitle: 'Phòng cần bảo trì',
      borderColor: '#ef4444',
      icon: AlertTriangle,
      iconBgColor: '#fee2e2',
      iconColor: '#dc2626',
    },
    {
      title: 'Lên lịch dọn dẹp',
      value: cleaningScheduledCount,
      subtitle: 'Phòng đang được dọn dẹp',
      borderColor: '#a855f7',
      icon: Heart,
      iconBgColor: '#ede9fe',
      iconColor: '#7c3aed',
    },
  ];

  return (
    <div className={styles.statsGrid}>
      {stats.map((stat, index) => (
        <RoomAllotmentStatCard key={index} {...stat} />
      ))}
    </div>
  );
}

