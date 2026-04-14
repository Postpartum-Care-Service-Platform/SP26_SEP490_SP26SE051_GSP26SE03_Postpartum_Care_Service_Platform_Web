'use client';

import * as Popover from '@radix-ui/react-popover';
import * as Tooltip from '@radix-ui/react-tooltip';
import { MapPin } from 'lucide-react';
import React from 'react';

import type { StaffSchedule } from '@/types/staff-schedule';

import styles from './schedule-detail-popover.module.css';

interface ScheduleDetailPopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schedule: StaffSchedule | null;
  anchorRect?: DOMRect;
  sideOffset?: number;
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
  Scheduled: 'Đã lên lịch',
  Done: 'Đã hoàn thành',
  Missed: 'Đã bỏ lỡ',
  Cancelled: 'Đã hủy',
  Pending: 'Chờ xử lý',
  Completed: 'Hoàn thành',
  InProgress: 'Đang thực hiện',
} as const;

const STATUS_COLORS = {
  Scheduled: { bg: '#DBEAFE', text: '#1E40AF' }, // Blue
  Done: { bg: '#D1FAE5', text: '#065F46' },      // Green
  Missed: { bg: '#FEE2E2', text: '#991B1B' },    // Existing Red/Pink
  Cancelled: { bg: '#FEE2E2', text: '#B91C1C' }, // Strong Red
  Pending: { bg: '#FEF3C7', text: '#92400E' },
  Completed: { bg: '#D1FAE5', text: '#065F46' },
  InProgress: { bg: '#DBEAFE', text: '#1E40AF' },
} as const;

const TARGET_LABELS = {
  Mom: 'Mẹ',
  Baby: 'Em bé',
  Both: 'Mẹ & Em bé',
} as const;

const normalizeImages = (images: any): string[] => {
  if (!images) return [];
  if (Array.isArray(images)) return images;
  if (typeof images === 'string') {
    try {
      const parsed = JSON.parse(images);
      return normalizeImages(parsed);
    } catch {
      return [images];
    }
  }
  if (typeof images === 'object') return Object.values(images) as string[];
  return [];
};

export function ScheduleDetailPopover({ 
  open, 
  onOpenChange, 
  schedule, 
  anchorRect,
  sideOffset = 12
}: ScheduleDetailPopoverProps) {
  return (
    <Popover.Root open={open} onOpenChange={onOpenChange}>
      {anchorRect && (
        <Popover.Anchor
          style={{
            position: 'fixed',
            top: anchorRect.top,
            left: anchorRect.left,
            width: anchorRect.width,
            height: anchorRect.height,
            pointerEvents: 'none',
            zIndex: 1000,
          }}
        />
      )}
      <Popover.Portal>
        <Popover.Content
          className={styles.content}
          side="right"
          align="center"
          sideOffset={sideOffset}
          collisionPadding={16}
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
  const statusKey = (fs.status || 'Pending') as keyof typeof STATUS_COLORS;
  const statusLabelsKey = (fs.status || 'Pending') as keyof typeof STATUS_LABELS;
  const statusStyle = STATUS_COLORS[statusKey] || STATUS_COLORS.Pending;

  return (
    <div className={styles.container}>
      {/* Header with Title and Expand Button */}
      <div className={styles.header}>
        <Tooltip.Provider delayDuration={300}>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <h2 className={styles.title} style={{ cursor: 'help' }}>
                {fs.activity}
              </h2>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                className={styles.titleTooltip}
                side="top"
                align="start"
                sideOffset={5}
              >
                {fs.activity}
                <Tooltip.Arrow className={styles.titleTooltipArrow} />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
        <span className={styles.packageBadgeHeader}>
          {fs.packageName}
        </span>
      </div>

      {/* Time and Info Section */}
      <div className={styles.timeSection}>
        <div className={styles.timeRow}>
          <div className={styles.iconWrapper}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M7.50009 0.877014C3.84241 0.877014 0.877258 3.84216 0.877258 7.49984C0.877258 11.1575 3.8424 14.1227 7.50009 14.1227C11.1578 14.1227 14.1229 11.1575 14.1229 7.49984C14.1229 3.84216 11.1577 0.877014 7.50009 0.877014ZM1.82726 7.49984C1.82726 4.36683 4.36708 1.82701 7.50009 1.82701C10.6331 1.82701 13.1729 4.36683 13.1729 7.49984C13.1729 10.6328 10.6331 13.1727 7.50009 13.1727C4.36708 13.1727 1.82726 10.6328 1.82726 7.49984ZM8 4.50001C8 4.22387 7.77614 4.00001 7.5 4.00001C7.22386 4.00001 7 4.22387 7 4.50001V7.50001C7 7.63262 7.05268 7.7598 7.14645 7.85357L9.14645 9.85357C9.34171 10.0488 9.65829 10.0488 9.85355 9.85357C10.0488 9.65831 10.0488 9.34172 9.85355 9.14646L8 7.29291V4.50001Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className={styles.timeInfo}>
            <div className={styles.timeMainRow}>
              <span className={styles.timeLabel}>
                {formatDateVN(fs.workDate)} · {formatTime(fs.startTime)} - {formatTime(fs.endTime)}
              </span>
              <span className={styles.seriesTag}>Ngày thứ {fs.dayNo}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Room Location */}
      <div className={styles.locationSection}>
        <div className={styles.locationRow}>
          <div className={styles.iconWrapper}>
            <MapPin size={15} />
          </div>
          <span>{schedule.roomName || 'Chưa gán phòng'}</span>
        </div>
      </div>

      <div className={styles.divider} />

      {/* Customer Avatar and Info */}
      <div className={styles.customerAvatarSection}>
        <div className={styles.avatarWrapper}>
          <img
            src={fs.customerAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${fs.customerName}`}
            alt={fs.customerName}
            className={styles.avatarImage}
          />
        </div>
        <div className={styles.customerMainInfo}>
          <div className={styles.labelGroup}>
            <span className={styles.infoLabel}>Khách hàng</span>
            <span className={styles.customerNameText}>{fs.customerName}</span>
          </div>
          <div className={styles.targetBadgeWrapper}>
            <span className={styles.targetBadge}>
              {TARGET_LABELS[fs.target as keyof typeof TARGET_LABELS] || fs.target}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.divider} />

      {/* Staff Avatar and Info */}
      <div className={styles.customerAvatarSection}>
        <div className={styles.avatarWrapper} style={{ backgroundColor: '#EEF2FF' }}>
          {schedule.staffAvatar ? (
            <img
              src={schedule.staffAvatar}
              alt={schedule.staffName}
              className={styles.avatarImage}
            />
          ) : (
            <div style={{ color: '#6366F1' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
          )}
        </div>
        <div className={styles.customerMainInfo}>
          <div className={styles.labelGroup}>
            <span className={styles.infoLabel} style={{ color: '#6366F1' }}>Nhân viên thực hiện</span>
            <span className={styles.customerNameText}>{schedule.staffName || 'Chưa phân công'}</span>
          </div>
          <span className={styles.staffRoleBadge}>{schedule.staffMemberType || 'Chưa xác định'}</span>
        </div>
      </div>

      {/* Note Section - Always visible */}
      <>
        <div className={styles.divider} />
        <div className={styles.noteSection}>
          <div className={styles.noteRow}>
            <div className={styles.iconWrapper} style={{ marginTop: '2px' }}>
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 12.85L1 12.85L1 14.15L14 14.15L14 12.85ZM14 8.85002L1 8.85002L1 10.15L14 10.15L14 8.85002ZM1 4.85003L14 4.85003L14 6.15003L1 6.15002L1 4.85003ZM14 0.850025L1 0.850025L1 2.15002L14 2.15002L14 0.850025Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
              </svg>
            </div>
            <p className={styles.noteContent} style={{ background: 'transparent', padding: 0, fontStyle: fs.note ? 'normal' : 'italic', color: fs.note ? '#4B5563' : '#9CA3AF' }}>
              {fs.note || 'Chưa có ghi chú...'}
            </p>
          </div>
        </div>
      </>

      {/* Checkout Pictures Section - Only for completed tasks */}
      {schedule.isChecked && (
        <>
          <div className={styles.divider} />
          <div className={styles.imagesSection}>
            <div className={styles.metaLabel} style={{ marginBottom: '8px', color: '#10B981' }}>Hình ảnh hoàn thành công việc</div>
            {(() => {
              const images = normalizeImages(schedule.images);
              if (images.length > 0) {
                const displayImages = images.slice(0, 4);
                const hasMore = images.length > 4;
                
                return (
                  <div className={styles.imagesGrid}>
                    {displayImages.map((img, i) => {
                      const isLast = i === 3 && hasMore;
                      return (
                        <div key={i} className={styles.imageWrapperCheckout}>
                          <img src={img} alt={`Checkout proof ${i + 1}`} className={styles.thumbnail} />
                          {isLast && (
                            <div className={styles.imageOverlayBadge}>
                              +{images.length - 3}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              }
              return (
                <div className={styles.emptyStateImages}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <span>Chưa có ảnh hoàn thành</span>
                </div>
              );
            })()}
          </div>
        </>
      )}

      {/* Check Status Section */}
      <div className={styles.statusBadgeSection}>
        <div className={styles.badgeRow}>
          <span className={`${styles.workBadge} ${schedule.isChecked ? styles.checked : styles.unchecked}`}>
            {schedule.isChecked ? 'Đã thực hiện' : 'Chưa thực hiện'}
          </span>
          <div className={styles.completionInfo}>
            <div className={styles.iconWrapper} style={{ color: '#6B7280' }}>
              <svg width="14" height="14" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 1.5C4.18629 1.5 1.5 4.18629 1.5 7.5C1.5 10.8137 4.18629 13.5 7.5 13.5C10.8137 13.5 13.5 10.8137 13.5 7.5C13.5 4.18629 10.8137 1.5 7.5 1.5ZM0.5 7.5C0.5 3.63401 3.63401 0.5 7.5 0.5C11.366 0.5 14.5 3.63401 14.5 7.5C14.5 11.366 11.366 14.5 7.5 14.5C3.63401 14.5 0.5 11.366 0.5 7.5ZM7.5 4C7.77614 4 8 4.22386 8 4.5V7.5C8 7.63261 7.46739 7.75979 7.35355 7.85355L5.35355 9.85355C5.15829 10.0488 4.84171 10.0488 4.64645 9.85355C4.45118 9.65829 4.45118 9.34171 4.64645 9.14645L6.5 7.29289V4.5C6.5 4.22386 6.72386 4 7 4Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
              </svg>
            </div>
            <span className={styles.completionText}>
              {schedule.isChecked && schedule.checkedAt
                ? `Hoàn thành lúc: ${formatTime(schedule.checkedAt.split('T')[1]?.substring(0, 5) || '')}`
                : 'Chưa được check'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
