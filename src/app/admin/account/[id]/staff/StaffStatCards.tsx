'use client';

import { Award, CheckCircle, Clock, Star } from 'lucide-react';
import React from 'react';

import type {
  BestRatedStaffItem,
  StaffCompletionRateItem,
  StaffPerformanceItem,
} from '@/services/statistics.service';

interface StaffStatCardsProps {
  performance: StaffPerformanceItem | null;
  completionRate: StaffCompletionRateItem | null;
  bestRated: BestRatedStaffItem | null;
  loading?: boolean;
}

interface StatCardProps {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
  sub?: string;
  loading?: boolean;
}

function StatCard({ icon, iconBg, iconColor, label, value, sub, loading }: StatCardProps) {
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #f1f3f5',
        borderRadius: 6,
        boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
        padding: '18px 20px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 14,
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 10,
          background: iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          color: iconColor,
        }}
      >
        {icon}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
        <span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          {label}
        </span>
        {loading ? (
          <div style={{ width: 80, height: 22, borderRadius: 4, background: '#f3f4f6', animation: 'pulse 1.4s infinite' }} />
        ) : (
          <>
            <span style={{ fontSize: 22, fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>{value}</span>
            {sub && <span style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{sub}</span>}
          </>
        )}
      </div>
    </div>
  );
}

export const StaffStatCards: React.FC<StaffStatCardsProps> = ({
  performance,
  completionRate,
  bestRated,
  loading,
}) => {
  const totalHours = performance?.totalHours ?? 0;
  const serviceCount = performance?.serviceCount ?? 0;
  const completionRateVal = completionRate?.completionRate ?? null;
  const totalTasks = completionRate?.totalTasks ?? 0;
  const avgRating = bestRated?.avgRating ?? performance?.avgRating ?? null;
  const totalFeedback = bestRated?.totalFeedback ?? 0;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 14,
        marginTop: 20,
        marginBottom: 20,
      }}
    >
      <StatCard
        icon={<Clock size={20} />}
        iconBg="#eff6ff"
        iconColor="#2563eb"
        label="Tổng giờ làm việc"
        value={loading ? '—' : `${totalHours.toFixed(0)}h`}
        sub="Trong kỳ thống kê"
        loading={loading}
      />
      <StatCard
        icon={<Award size={20} />}
        iconBg="#f0fdf4"
        iconColor="#16a34a"
        label="Số dịch vụ đã thực hiện"
        value={loading ? '—' : `${serviceCount}`}
        sub="Booking đã hoàn thành"
        loading={loading}
      />
      <StatCard
        icon={<CheckCircle size={20} />}
        iconBg="#fefce8"
        iconColor="#ca8a04"
        label="Tỉ lệ hoàn thành"
        value={loading ? '—' : completionRateVal != null ? `${completionRateVal.toFixed(1)}%` : 'N/A'}
        sub={totalTasks > 0 ? `${completionRate?.completedTasks ?? 0}/${totalTasks} nhiệm vụ` : 'Chưa có dữ liệu'}
        loading={loading}
      />
      <StatCard
        icon={<Star size={20} />}
        iconBg="#fdf4ff"
        iconColor="#9333ea"
        label="Đánh giá trung bình"
        value={loading ? '—' : avgRating != null ? avgRating.toFixed(1) : 'N/A'}
        sub={totalFeedback > 0 ? `${totalFeedback} đánh giá` : 'Chưa có đánh giá'}
        loading={loading}
      />
    </div>
  );
};
