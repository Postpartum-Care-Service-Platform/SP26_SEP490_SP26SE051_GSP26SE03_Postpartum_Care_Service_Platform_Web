'use client';

import * as Popover from '@radix-ui/react-popover';
import React from 'react';

import type { StaffSchedule } from '@/types/staff-schedule';

import styles from './schedule-detail-popover.module.css';

interface ScheduleDetailPopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schedule: StaffSchedule | null;
  anchorRect?: DOMRect;
}

function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  return `${hours}:${minutes}`;
}

function formatDateVN(dateStr: string): string {
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

const STATUS_LABELS = {
  Pending: 'Chờ xử lý',
  Completed: 'Hoàn thành',
  Missed: 'Đã bỏ lỡ',
  InProgress: 'Đang thực hiện',
} as const;

const STATUS_COLORS = {
  Pending: { bg: '#FEF3C7', text: '#92400E' },
  Completed: { bg: '#D1FAE5', text: '#065F46' },
  Missed: { bg: '#FEE2E2', text: '#991B1B' },
  InProgress: { bg: '#DBEAFE', text: '#1E40AF' },
} as const;

const TARGET_LABELS = {
  Mom: 'Mẹ',
  Baby: 'Em bé',
  Both: 'Mẹ & Em bé',
} as const;

export function ScheduleDetailPopover({ open, onOpenChange, schedule, anchorRect }: ScheduleDetailPopoverProps) {
  const popoverStyle: React.CSSProperties = anchorRect ? {
    position: 'fixed',
    top: `${anchorRect.top + window.scrollY}px`,
    left: `${anchorRect.right + window.scrollX + 8}px`,
  } : {};

  return (
    <Popover.Root open={open} onOpenChange={onOpenChange}>
      <Popover.Portal>
        <Popover.Content
          className={styles.content}
          style={popoverStyle}
          side="right"
          align="start"
          sideOffset={8}
          collisionPadding={12}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          {!schedule ? (
            <div className={styles.loading}>
              Đang tải...
            </div>
          ) : (
            <ScheduleContent schedule={schedule} />
          )}
          <Popover.Arrow className={styles.arrow} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

function ScheduleContent({ schedule }: { schedule: StaffSchedule }) {
  const { familyScheduleResponse: fs } = schedule;
  const statusStyle = STATUS_COLORS[fs.status];

  return (
    <div className={styles.container}>
      {/* Status */}
      <div className={styles.statusRow}>
        <span
          className={styles.statusBadge}
          style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
        >
          {STATUS_LABELS[fs.status]}
        </span>
        {schedule.isChecked && (
          <span className={styles.checkedBadge}>Đã check</span>
        )}
      </div>

      {/* Activity */}
      <div className={styles.activitySection}>
        <h3 className={styles.activityTitle}>{fs.activity}</h3>
      </div>

      {/* Time */}
      <div className={styles.timeSection}>
        <div className={styles.timeRow}>
          <svg className={styles.icon} viewBox="0 0 16 16" fill="none">
            <path d="M8 4C6.89543 4 6 4.89543 6 6C6 7.10457 6.89543 8 8 8C9.10457 8 10 7.10457 10 6C10 4.89543 9.10457 4 8 4Z" fill="currentColor"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1ZM7 4V8.5L10.5 10.5L11 9.69L8 8V4H7Z" fill="currentColor"/>
          </svg>
          <div className={styles.timeInfo}>
            <span className={styles.timeLabel}>
              {formatDateVN(fs.workDate)} · {formatTime(fs.startTime)} - {formatTime(fs.endTime)}
            </span>
            <span className={styles.dayNo}>Ngày thứ {fs.dayNo}</span>
          </div>
        </div>
      </div>

      {/* Customer Info */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Khách hàng</h4>
        <div className={styles.infoRow}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Tên</span>
            <span className={styles.infoValue}>{fs.customerName}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Đối tượng</span>
            <span className={styles.infoValue}>{TARGET_LABELS[fs.target]}</span>
          </div>
        </div>
      </div>

      {/* Package Info */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Gói dịch vụ</h4>
        <div className={styles.infoRow}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Tên gói</span>
            <span className={styles.infoValue}>{fs.packageName}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Contract</span>
            <span className={styles.infoValue}>#{fs.contractId}</span>
          </div>
        </div>
      </div>

      {/* Staff Info */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Nhân viên</h4>
        <div className={styles.infoRow}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Nhân viên</span>
            <span className={styles.infoValue}>{schedule.staffName}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Quản lý</span>
            <span className={styles.infoValue}>{schedule.managerName}</span>
          </div>
        </div>
      </div>

      {/* Note */}
      {fs.note && (
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Ghi chú</h4>
          <p className={styles.note}>{fs.note}</p>
        </div>
      )}
    </div>
  );
}
