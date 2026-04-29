'use client';

import { useParams } from 'next/navigation';
import React from 'react';

import statisticsService from '@/services/statistics.service';
import type {
    BestRatedStaffItem,
    StaffCompletionRateItem,
    StaffPerformanceItem,
} from '@/services/statistics.service';
import staffScheduleService from '@/services/staff-schedule.service';
import userService from '@/services/user.service';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import type { Account } from '@/types/account';
import type { FamilyProfile } from '@/types/family-profile';
import type { StaffSchedule } from '@/types/staff-schedule';

import { StaffProfileCard } from './StaffProfileCard';
import { StaffScheduleTable } from './StaffScheduleTable';
import { StaffStatCards } from './StaffStatCards';

import styles from '../account-overview.module.css';

interface StaffOverviewData {
    account: Account | null;
    staffProfile: FamilyProfile | null;
    schedules: StaffSchedule[];
    performance: StaffPerformanceItem | null;
    completionRate: StaffCompletionRateItem | null;
    bestRated: BestRatedStaffItem | null;
}

function getMonthRange(): { from: string; to: string } {
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth(), 1);
    const to = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const fmt = (d: Date) =>
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    return { from: fmt(from), to: fmt(to) };
}

export default function StaffProfilePage() {
    const params = useParams();
    const id = params.id as string;

    const [data, setData] = React.useState<StaffOverviewData>({
        account: null,
        staffProfile: null,
        schedules: [],
        performance: null,
        completionRate: null,
        bestRated: null,
    });
    const [profileLoading, setProfileLoading] = React.useState(true);
    const [statsLoading, setStatsLoading] = React.useState(true);
    const [scheduleLoading, setScheduleLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (!id) return;

        const { from, to } = getMonthRange();

        // ── Phase 1: profile data (fast) ──────────────────────────────────────
        setProfileLoading(true);
        Promise.all([
            userService.getAccountById(id).catch(() => null),
            userService.getStaffDetail(id).catch(() => [] as FamilyProfile[]),
        ])
            .then(([accountData, profilesData]) => {
                const profiles = Array.isArray(profilesData) ? profilesData : [];
                const ownerProfile = profiles.find((p) => p.isOwner) ?? profiles[0] ?? null;
                setData((prev) => ({ ...prev, account: accountData, staffProfile: ownerProfile }));
            })
            .catch((err) => setError(err?.message || 'Không thể tải thông tin nhân viên'))
            .finally(() => setProfileLoading(false));

        // ── Phase 2: schedule for current month ───────────────────────────────
        setScheduleLoading(true);
        staffScheduleService
            .getStaffSchedule({ staffId: id, from, to })
            .then((schedules) => setData((prev) => ({ ...prev, schedules: schedules ?? [] })))
            .catch(() => setData((prev) => ({ ...prev, schedules: [] })))
            .finally(() => setScheduleLoading(false));

        // ── Phase 3: statistics (may be slower, admin-only) ───────────────────
        setStatsLoading(true);
        Promise.all([
            statisticsService.getStaffPerformance().catch(() => [] as StaffPerformanceItem[]),
            statisticsService.getStaffCompletionRate().catch(() => ({ staff: [], startDate: null, endDate: null })),
            statisticsService.getBestRatedStaff().catch(() => ({ staff: [], startDate: null, endDate: null })),
        ])
            .then(([perfAll, completionAll, bestRatedAll]) => {
                const perf = Array.isArray(perfAll)
                    ? perfAll.find((s) => s.staffId === id) ?? null
                    : null;
                const completion = completionAll?.staff?.find((s) => s.staffId === id) ?? null;
                const bestRated = bestRatedAll?.staff?.find((s) => s.staffId === id) ?? null;
                setData((prev) => ({ ...prev, performance: perf, completionRate: completion, bestRated: bestRated }));
            })
            .catch(() => {/* stats are optional — silently ignore */ })
            .finally(() => setStatsLoading(false));
    }, [id]);

    const staffName =
        data.staffProfile?.fullName ||
        data.account?.username ||
        data.account?.email ||
        'Nhân viên';

    // Derive quick stats from schedule data as fallback when statistics API unavailable
    const scheduleStats = React.useMemo(() => {
        const total = data.schedules.length;
        const completed = data.schedules.filter(
            (s) => s.familyScheduleResponse?.status === 'Completed' || s.familyScheduleResponse?.status === 'Done'
        ).length;
        const missed = data.schedules.filter((s) => s.familyScheduleResponse?.status === 'Missed').length;
        const checkedIn = data.schedules.filter((s) => s.isChecked).length;
        return { total, completed, missed, checkedIn };
    }, [data.schedules]);

    // Merge: prefer statistics API data, fall back to schedule-derived data
    const mergedPerformance: StaffPerformanceItem | null = data.performance ?? (
        scheduleStats.total > 0
            ? {
                staffId: id,
                staffName: staffName,
                totalHours: 0,
                serviceCount: scheduleStats.completed,
                avgRating: null,
            }
            : null
    );

    const mergedCompletion: StaffCompletionRateItem | null = data.completionRate ?? (
        scheduleStats.total > 0
            ? {
                staffId: id,
                staffName: staffName,
                totalTasks: scheduleStats.total,
                completedTasks: scheduleStats.completed,
                missedTasks: scheduleStats.missed,
                cancelledTasks: 0,
                completionRate: scheduleStats.total > 0 ? (scheduleStats.completed / scheduleStats.total) * 100 : 0,
                missedRate: scheduleStats.total > 0 ? (scheduleStats.missed / scheduleStats.total) * 100 : 0,
            }
            : null
    );

    return (
        <div className={styles.pageContainer}>
            {/* ── Breadcrumb + Page title (sticky, never scrolls) ── */}
            <div className={styles.headerWrapper}>
                <Breadcrumbs
                    items={[
                        { label: 'Danh sách tài khoản', href: '/admin/account' },
                        { label: staffName },
                    ]}
                    homeHref="/admin"
                />
                <div style={{ marginTop: 8 }}>
                    <h1
                        style={{
                            fontSize: 22,
                            fontWeight: 700,
                            color: '#172b4d',
                            fontFamily: 'Lexend Deca, sans-serif',
                            margin: 0,
                        }}
                    >
                        Hồ sơ nhân viên
                    </h1>
                    <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4, marginBottom: 0 }}>
                        Thông tin chi tiết và hiệu suất làm việc của nhân viên
                    </p>
                </div>
            </div>

            <div className={styles.mainScrollArea}>
                {/* ── 4 Stat cards ── */}
                <StaffStatCards
                    performance={mergedPerformance}
                    completionRate={mergedCompletion}
                    bestRated={data.bestRated}
                    loading={statsLoading && scheduleLoading}
                />

                {/* ── Profile card (full width) ── */}
                <StaffProfileCard
                    account={data.account}
                    staffProfile={data.staffProfile}
                    loading={profileLoading}
                    onProfileUpdated={(updated) =>
                        setData((prev) => ({ ...prev, staffProfile: updated }))
                    }
                />

                {/* ── Schedule table ── */}
                <div style={{ marginTop: 20 }}>
                    <StaffScheduleTable
                        schedules={data.schedules}
                        loading={scheduleLoading}
                    />
                </div>

                {/* ── Error banner ── */}
                {error && (
                    <div
                        style={{
                            padding: '14px 16px',
                            color: '#b91c1c',
                            marginTop: 20,
                            background: '#fef2f2',
                            borderRadius: 4,
                            border: '1px solid #fee2e2',
                            fontSize: 14,
                        }}
                    >
                        <strong>Lưu ý:</strong> {error}
                    </div>
                )}
            </div>
        </div>
    );
}
