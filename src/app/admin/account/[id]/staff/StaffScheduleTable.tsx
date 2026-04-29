'use client';

import React from 'react';

import type { StaffSchedule } from '@/types/staff-schedule';

interface StaffScheduleTableProps {
    schedules: StaffSchedule[];
    loading?: boolean;
    pageSize?: number;
}

function getStatusLabel(status: string): string {
    switch (status) {
        case 'Completed':
        case 'Done':
            return 'Hoàn thành';
        case 'Pending':
            return 'Chờ thực hiện';
        case 'InProgress':
            return 'Đang thực hiện';
        case 'Missed':
            return 'Bỏ lỡ';
        case 'Scheduled':
            return 'Đã lên lịch';
        default:
            return status;
    }
}

function getStatusStyle(status: string): React.CSSProperties {
    switch (status) {
        case 'Completed':
        case 'Done':
            return { background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' };
        case 'Pending':
            return { background: '#fefce8', color: '#a16207', border: '1px solid #fde68a' };
        case 'InProgress':
            return { background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' };
        case 'Missed':
            return { background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' };
        default:
            return { background: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb' };
    }
}

function getTargetLabel(target: string): string {
    switch (target) {
        case 'Mom': return 'Mẹ';
        case 'Baby': return 'Em bé';
        case 'Both': return 'Mẹ & Em bé';
        default: return target;
    }
}

export const StaffScheduleTable: React.FC<StaffScheduleTableProps> = ({
    schedules,
    loading,
    pageSize = 10,
}) => {
    const [page, setPage] = React.useState(1);

    // Reset to page 1 whenever the schedule list changes
    React.useEffect(() => {
        setPage(1);
    }, [schedules]);

    const totalPages = Math.max(1, Math.ceil(schedules.length / pageSize));
    const safePage = Math.min(page, totalPages);
    const pageStart = (safePage - 1) * pageSize;
    const pageRows = schedules.slice(pageStart, pageStart + pageSize);

    const tableStyle: React.CSSProperties = {
        background: '#fff',
        border: '1px solid #f1f3f5',
        borderRadius: 6,
        boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
        overflow: 'hidden',
    };

    const thStyle: React.CSSProperties = {
        padding: '10px 14px',
        fontSize: 11,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.07em',
        color: '#9ca3af',
        background: '#fafafa',
        borderBottom: '1px solid #f1f3f5',
        textAlign: 'left',
        whiteSpace: 'nowrap',
    };

    const tdStyle: React.CSSProperties = {
        padding: '10px 14px',
        fontSize: 13,
        color: '#374151',
        borderBottom: '1px solid #f9fafb',
        verticalAlign: 'middle',
    };

    const btnStyle = (disabled: boolean): React.CSSProperties => ({
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 28,
        height: 28,
        borderRadius: 6,
        border: '1px solid #e5e7eb',
        background: disabled ? '#f9fafb' : '#fff',
        color: disabled ? '#d1d5db' : '#374151',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: 14,
        fontWeight: 700,
        lineHeight: 1,
        transition: 'background 0.15s, border-color 0.15s',
        userSelect: 'none',
    });

    if (loading) {
        return (
            <div style={tableStyle}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f3f5' }}>
                    <div style={{ width: 200, height: 18, borderRadius: 4, background: '#f3f4f6' }} />
                </div>
                {[1, 2, 3].map((i) => (
                    <div key={i} style={{ padding: '12px 20px', borderBottom: '1px solid #f9fafb', display: 'flex', gap: 16 }}>
                        {[1, 2, 3, 4, 5].map((j) => (
                            <div key={j} style={{ flex: 1, height: 14, borderRadius: 4, background: '#f3f4f6' }} />
                        ))}
                    </div>
                ))}
            </div>
        );
    }

    if (schedules.length === 0) {
        return (
            <div style={{ ...tableStyle, padding: '32px 20px', textAlign: 'center', color: '#9ca3af', fontSize: 14 }}>
                Không có lịch làm việc trong tháng này
            </div>
        );
    }

    return (
        <div style={tableStyle}>
            {/* ── Header ── */}
            <div style={{
                padding: '14px 20px',
                borderBottom: '1px solid #f1f3f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
            }}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#111827' }}>
                    Lịch làm việc tháng này
                </h3>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {/* total badge */}
                    <span style={{ fontSize: 12, color: '#6b7280', background: '#f3f4f6', padding: '2px 10px', borderRadius: 12 }}>
                        {schedules.length} ca
                    </span>

                    {/* pagination controls */}
                    <button
                        style={btnStyle(safePage <= 1)}
                        disabled={safePage <= 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        aria-label="Trang trước"
                    >
                        ‹
                    </button>

                    <span style={{ fontSize: 12, color: '#374151', minWidth: 52, textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>
                        {safePage} / {totalPages}
                    </span>

                    <button
                        style={btnStyle(safePage >= totalPages)}
                        disabled={safePage >= totalPages}
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        aria-label="Trang sau"
                    >
                        ›
                    </button>
                </div>
            </div>

            {/* ── Table ── */}
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={thStyle}>Ngày làm việc</th>
                            <th style={thStyle}>Giờ</th>
                            <th style={thStyle}>Hoạt động</th>
                            <th style={thStyle}>Đối tượng</th>
                            <th style={thStyle}>Phòng</th>
                            <th style={thStyle}>Khách hàng</th>
                            <th style={thStyle}>Trạng thái</th>
                            <th style={thStyle}>Check-in</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageRows.map((s) => {
                            const fs = s.familyScheduleResponse;
                            const status = fs?.status ?? 'Pending';
                            return (
                                <tr key={s.id} style={{ transition: 'background 0.1s' }}>
                                    <td style={tdStyle}>
                                        <span style={{ fontWeight: 600, color: '#111827' }}>
                                            {fs?.workDate
                                                ? new Date(fs.workDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
                                                : '—'}
                                        </span>
                                    </td>
                                    <td style={tdStyle}>
                                        {fs?.startTime && fs?.endTime
                                            ? `${fs.startTime.substring(0, 5)} – ${fs.endTime.substring(0, 5)}`
                                            : '—'}
                                    </td>
                                    <td style={{ ...tdStyle, maxWidth: 200 }}>
                                        <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {fs?.activity ?? '—'}
                                        </span>
                                    </td>
                                    <td style={tdStyle}>
                                        <span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 10, background: '#f3f4f6', color: '#374151' }}>
                                            {getTargetLabel(fs?.target ?? '')}
                                        </span>
                                    </td>
                                    <td style={tdStyle}>{s.roomName ?? '—'}</td>
                                    <td style={tdStyle}>
                                        <span style={{ fontWeight: 500 }}>{fs?.customerName ?? '—'}</span>
                                    </td>
                                    <td style={tdStyle}>
                                        <span style={{
                                            fontSize: 11,
                                            fontWeight: 600,
                                            padding: '3px 8px',
                                            borderRadius: 10,
                                            ...getStatusStyle(status),
                                        }}>
                                            {getStatusLabel(status)}
                                        </span>
                                    </td>
                                    <td style={tdStyle}>
                                        {s.isChecked ? (
                                            <span style={{ color: '#15803d', fontSize: 12, fontWeight: 600 }}>
                                                ✓ {s.checkedAt ? new Date(s.checkedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : ''}
                                            </span>
                                        ) : (
                                            <span style={{ color: '#9ca3af', fontSize: 12 }}>Chưa check-in</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
