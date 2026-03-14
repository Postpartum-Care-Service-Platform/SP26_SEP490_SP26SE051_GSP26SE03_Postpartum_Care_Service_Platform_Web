'use client';

import React from 'react';

import type { StaffSchedule } from '@/types/staff-schedule';

import styles from './schedule-detail-drawer.module.css';
import { Drawer } from './Drawer';

interface ScheduleDetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schedule: StaffSchedule | null;
}

function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  return `${hours}:${minutes}`;
}

function formatDateVN(dateStr: string): string {
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

function formatDateTimeVN(dateTimeStr: string): string {
  const [date, time] = dateTimeStr.split('T');
  if (!date) return dateTimeStr;
  const dateFormatted = formatDateVN(date);
  const timeFormatted = time ? formatTime(time) : '';
  return timeFormatted ? `${dateFormatted} ${timeFormatted}` : dateFormatted;
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

export function ScheduleDetailDrawer({ open, onOpenChange, schedule }: ScheduleDetailDrawerProps) {
  if (!schedule) return null;

  const { familyScheduleResponse: fs } = schedule;
  const statusStyle = STATUS_COLORS[fs.status];

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title="Chi tiết lịch làm việc"
    >
      <div className={styles.container}>
        {/* Status Badge */}
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
        <div className={styles.section}>
          <div className={styles.field}>
            <span className={styles.label}>Hoạt động</span>
            <span className={styles.valueLarge}>{fs.activity}</span>
          </div>
        </div>

        {/* Time & Date */}
        <div className={styles.section}>
          <div className={styles.row}>
            <div className={styles.field}>
              <span className={styles.label}>Ngày</span>
              <span className={styles.value}>{formatDateVN(fs.workDate)}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Thứ ngày</span>
              <span className={styles.value}>Ngày {fs.dayNo}</span>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <span className={styles.label}>Giờ bắt đầu</span>
              <span className={styles.value}>{formatTime(fs.startTime)}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Giờ kết thúc</span>
              <span className={styles.value}>{formatTime(fs.endTime)}</span>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Thông tin khách hàng</h3>
          <div className={styles.row}>
            <div className={styles.field}>
              <span className={styles.label}>Tên khách hàng</span>
              <span className={styles.value}>{fs.customerName}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Đối tượng</span>
              <span className={styles.value}>{TARGET_LABELS[fs.target]}</span>
            </div>
          </div>
        </div>

        {/* Staff Info */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Thông tin nhân viên</h3>
          <div className={styles.row}>
            <div className={styles.field}>
              <span className={styles.label}>Nhân viên</span>
              <span className={styles.value}>{schedule.staffName}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Quản lý</span>
              <span className={styles.value}>{schedule.managerName}</span>
            </div>
          </div>
        </div>

        {/* Package Info */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Thông tin gói dịch vụ</h3>
          <div className={styles.row}>
            <div className={styles.field}>
              <span className={styles.label}>Tên gói</span>
              <span className={styles.value}>{fs.packageName}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Contract ID</span>
              <span className={styles.value}>#{fs.contractId}</span>
            </div>
          </div>
        </div>

        {/* Check Info */}
        {schedule.checkedAt && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Thông tin checkin</h3>
            <div className={styles.field}>
              <span className={styles.label}>Thời gian check</span>
              <span className={styles.value}>{formatDateTimeVN(schedule.checkedAt)}</span>
            </div>
          </div>
        )}

        {/* Note */}
        {fs.note && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Ghi chú</h3>
            <p className={styles.note}>{fs.note}</p>
          </div>
        )}
      </div>
    </Drawer>
  );
}
