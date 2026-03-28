'use client';

import * as Popover from '@radix-ui/react-popover';
import * as Tooltip from '@radix-ui/react-tooltip';
import { format } from 'date-fns';
import { X } from 'lucide-react';
import React from 'react';

import type { StaffSchedule } from '@/types/staff-schedule';

import styles from './day-schedules-popover.module.css';

interface DaySchedulesPopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: Date | null;
  schedules: StaffSchedule[];
  anchorRect?: DOMRect;
  onScheduleClick?: (schedule: StaffSchedule, rect: DOMRect) => void;
}

function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  return `${hours}:${minutes}`;
}

export function DaySchedulesPopover({
  open,
  onOpenChange,
  date,
  schedules,
  anchorRect,
  onScheduleClick,
}: DaySchedulesPopoverProps) {
  if (!date) return null;

  const sortedSchedules = [...schedules].sort((a, b) =>
    a.familyScheduleResponse.startTime.localeCompare(b.familyScheduleResponse.startTime)
  );

  const daysVi = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
  const monthsVi = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];

  const dayLabel = daysVi[date.getDay()];
  const dateLabel = `${date.getDate()} ${monthsVi[date.getMonth()]}, ${date.getFullYear()}`;

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
          align="start"
          sideOffset={8}
          collisionPadding={16}
        >
          <div className={styles.header}>
            <div className={styles.headerInfo}>
              <span className={styles.dayOfWeek}>
                {dayLabel}
              </span>
              <h3 className={styles.dateTitle}>
                {dateLabel}
              </h3>
            </div>
            <button
              className={styles.closeBtn}
              onClick={() => onOpenChange(false)}
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>

          <div className={styles.body}>
            {sortedSchedules.length === 0 ? (
              <div className={styles.empty}>Không có lịch làm việc</div>
            ) : (
              <Tooltip.Provider delayDuration={300}>
                <div className={styles.list}>
                  {sortedSchedules.map((item) => {
                    const statusLabel = 
                      item.familyScheduleResponse.status === 'Done' ? 'Đã hoàn thành' : 
                      item.familyScheduleResponse.status === 'Missed' ? 'Đã bỏ lỡ' : 'Đã lên lịch';
                    
                    return (
                      <div
                        key={item.id}
                        className={styles.listItem}
                        onClick={(e) => {
                          if (onScheduleClick) {
                            const rect = e.currentTarget.getBoundingClientRect();
                            onScheduleClick(item, rect);
                          }
                        }}
                        role="button"
                        tabIndex={0}
                      >
                        <span className={styles.itemTime}>
                          {formatTime(item.familyScheduleResponse.startTime)}
                        </span>
                        
                        <Tooltip.Root>
                          <Tooltip.Trigger asChild>
                            <div className={styles.itemAvatarWrapper}>
                              {item.staffAvatar ? (
                                <img
                                  src={item.staffAvatar}
                                  alt={item.staffName}
                                  className={styles.itemAvatar}
                                />
                              ) : (
                                <div className={styles.itemAvatarPlaceholder}>
                                  {item.staffName?.charAt(0) || 'S'}
                                </div>
                              )}
                            </div>
                          </Tooltip.Trigger>
                          <Tooltip.Portal>
                            <Tooltip.Content className={styles.miniTooltip} side="top" sideOffset={5}>
                              {item.staffName}
                              <Tooltip.Arrow className={styles.miniTooltipArrow} />
                            </Tooltip.Content>
                          </Tooltip.Portal>
                        </Tooltip.Root>

                        <div className={styles.itemContent}>
                          <div className={styles.itemActivity}>
                            {item.familyScheduleResponse.activity}
                          </div>
                          <div className={styles.itemCustomer}>
                            {item.familyScheduleResponse.customerName} · {item.familyScheduleResponse.packageName}
                          </div>
                        </div>

                        <Tooltip.Root>
                          <Tooltip.Trigger asChild>
                            <div
                              className={styles.statusDot}
                              style={{
                                backgroundColor:
                                  item.familyScheduleResponse.status === 'Done' ? '#10B981' :
                                    item.familyScheduleResponse.status === 'Missed' ? '#EF4444' : '#F97316'
                              }}
                            />
                          </Tooltip.Trigger>
                          <Tooltip.Portal>
                            <Tooltip.Content className={styles.miniTooltip} side="top" sideOffset={5}>
                              {statusLabel}
                              <Tooltip.Arrow className={styles.miniTooltipArrow} />
                            </Tooltip.Content>
                          </Tooltip.Portal>
                        </Tooltip.Root>
                      </div>
                    );
                  })}
                </div>
              </Tooltip.Provider>
            )}
          </div>
          <Popover.Arrow className={styles.arrow} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
