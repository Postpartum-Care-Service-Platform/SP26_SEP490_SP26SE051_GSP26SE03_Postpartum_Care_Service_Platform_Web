'use client';

import { StatCard } from '@/app/admin/package/components/StatCard';
import type { MenuTypeStats } from './types';

import styles from './menu-type-stats-cards.module.css';

type Props = {
  stats: MenuTypeStats;
};

export function MenuTypeStatsCards({ stats }: Props) {
  return (
    <div className={styles.container}>
      <StatCard
        value={stats.total}
        label="Tổng số loại"
        iconColor="#6366f1"
        backgroundColor="rgba(99, 102, 241, 0.1)"
      />
      <StatCard
        value={stats.active}
        label="Đang hoạt động"
        iconColor="#15803d"
        backgroundColor="rgba(21, 128, 61, 0.1)"
      />
      <StatCard
        value={stats.inactive}
        label="Tạm dừng"
        iconColor="#b91c1c"
        backgroundColor="rgba(185, 28, 28, 0.1)"
      />
    </div>
  );
}
