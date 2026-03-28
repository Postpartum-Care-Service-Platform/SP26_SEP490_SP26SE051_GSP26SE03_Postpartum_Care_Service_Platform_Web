'use client';

import * as Popover from '@radix-ui/react-popover';
import * as Tooltip from '@radix-ui/react-tooltip';
import React from 'react';

import { AssigneePicker } from '../shared/AssigneePicker';
import { TaskTypePicker, TASK_TYPES, type TaskType } from '../TaskTypePicker';

import styles from './calendar-control-panel.module.css';
import { CalendarStatusDropdown, type CalendarStatusType } from './CalendarStatusDropdown';
import { CalendarViewDropdown, type CalendarViewMode } from './CalendarViewDropdown';
import { MonthYearPicker } from './MonthYearPicker';
import type { Assignee } from '../shared/AssigneePicker';

// Assignee type imported above from shared/AssigneePicker

function ChevronDownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4.18179 6.18181C4.35753 6.00608 4.64245 6.00608 4.81819 6.18181L7.99999 9.36362L11.1818 6.18181C11.3575 6.00608 11.6424 6.00608 11.8182 6.18181C11.9939 6.35755 11.9939 6.64247 11.8182 6.81821L8.35355 10.2828C8.15829 10.4781 7.84171 10.4781 7.64645 10.2828L4.18179 6.81821C4.00605 6.64247 4.00605 6.35755 4.18179 6.18181Z" fill="currentColor" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 2.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9ZM1 7a6 6 0 1 1 10.244 4.244l2.256 2.256a.75.75 0 1 1-1.06 1.06l-2.256-2.256A6 6 0 0 1 1 7Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg fill="none" viewBox="-8 -8 32 32" role="presentation" aria-hidden="true" width="16" height="16">
      <path
        fill="currentColor"
        d="m9.97 1.47-6 6a.75.75 0 0 0-.052 1.004l.052.056 6 6 1.06-1.06L5.56 8l5.47-5.47z"
      />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg fill="none" viewBox="-8 -8 32 32" role="presentation" aria-hidden="true" width="16" height="16">
      <path
        fill="currentColor"
        d="m6.03 1.47 6 6a.75.75 0 0 1 .052 1.004l-.052.056-6 6-1.06-1.06L10.44 8 4.97 2.53z"
      />
    </svg>
  );
}

function CalendarPlusIcon() {
  return (
    <svg fill="none" viewBox="0 0 16 16" role="presentation" width="16" height="16" aria-hidden="true">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M4.5 2.5v2H6v-2h4v2h1.5v-2H13a.5.5 0 0 1 .5.5v3h-11V3a.5.5 0 0 1 .5-.5zm-2 5V13a.5.5 0 0 0 .5.5h4.5V15H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1.5V0H6v1h4V0h1.5v1H13a2 2 0 0 1 2 2v4.5zm9.75 4.75V10h1.5v2.25H16v1.5h-2.25V16h-1.5v-2.25H10v-1.5z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function SlidersIcon() {
  return (
    <svg fill="none" viewBox="-4 -4 24 24" role="presentation" width="16" height="16" aria-hidden="true">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M3 2.375C3 1.615 3.616 1 4.375 1h1.75c.76 0 1.375.616 1.375 1.375v4.25C7.5 7.385 6.884 8 6.125 8h-1.75C3.615 8 3 7.384 3 6.625V5.25H0v-1.5h3zm1.5.125v4H6v-4zM16 5.25H8.5v-1.5H16zM8.5 9.375C8.5 8.615 9.116 8 9.875 8h1.75C12.385 8 13 8.616 13 9.375v1.375h3v1.5h-3v1.375c0 .76-.616 1.375-1.375 1.375h-1.75c-.76 0-1.375-.616-1.375-1.375zM10 9.5v4h1.5v-4zM0 12.25v-1.5h7.5v1.5z"
        clipRule="evenodd"
      />
    </svg>
  );
}

type Props = {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  statusValue?: CalendarStatusType;
  onStatusChange?: (value: CalendarStatusType) => void;
  assigneeValue?: Assignee | null;
  onAssigneeChange?: (value: Assignee | null) => void;
  viewMode?: CalendarViewMode;
  onViewModeChange?: (value: CalendarViewMode, days?: number) => void;
  dayCount?: number;
  monthCursor?: Date;
  onMonthCursorChange?: (value: Date) => void;
  taskType?: TaskType | null;
  onTaskTypeChange?: (value: TaskType | null) => void;
  onTodayClick?: () => void;
  selectedDate?: Date;
  onSelectedDateChange?: (date: Date) => void;
};

export function CalendarControlPanel({
  searchValue = '',
  onSearchChange,
  statusValue = null,
  onStatusChange,
  assigneeValue = null,
  onAssigneeChange,
  viewMode = 'Month',
  onViewModeChange,
  dayCount = 1,
  monthCursor,
  onMonthCursorChange,
  taskType,
  onTaskTypeChange,
  onTodayClick,
  selectedDate,
  onSelectedDateChange,
}: Props) {
  const [isAssigneeOpen, setIsAssigneeIdOpen] = React.useState(false);

  const [isTaskTypeOpen, setIsTaskTypeOpen] = React.useState(false);
  const selectedTaskType = taskType ?? TASK_TYPES[TASK_TYPES.length - 1];

  function addMonths(base: Date, delta: number) {
    const d = new Date(base);
    d.setMonth(d.getMonth() + delta);
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  const handlePrevMonth = () => {
    if (onMonthCursorChange) {
      onMonthCursorChange(addMonths(monthCursor || new Date(), -1));
    }
  };

  const handleNextMonth = () => {
    if (onMonthCursorChange) {
      onMonthCursorChange(addMonths(monthCursor || new Date(), 1));
    }
  };

  const getInitials = (name: string) => {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <Tooltip.Provider delayDuration={350}>
      <div className={styles.wrap}>
        <div className={styles.left}>
          <div className={styles.search}>
            <span className={styles.searchIcon}><SearchIcon /></span>
            <input
              className={styles.searchInput}
              placeholder="Tìm kiếm lịch"
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
            />
          </div>

          <Popover.Root open={isAssigneeOpen} onOpenChange={setIsAssigneeIdOpen}>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <Popover.Trigger asChild>
                  <button type="button" className={styles.filterBtn}>
                    {assigneeValue && (
                      <div className={styles.avatarCircle}>
                        {assigneeValue.avatarUrl ? (
                          <img src={assigneeValue.avatarUrl} alt="" className={styles.avatarImg} />
                        ) : (
                          getInitials(assigneeValue.name)
                        )}
                      </div>
                    )}
                    <span>{assigneeValue ? assigneeValue.name : 'Người phụ trách'}</span>
                    <ChevronDownIcon />
                  </button>
                </Popover.Trigger>
              </Tooltip.Trigger>
              {assigneeValue && (
                <Tooltip.Portal>
                  <Tooltip.Content className={styles.tooltip} side="bottom" align="center" sideOffset={6}>
                    {assigneeValue.name}
                    <Tooltip.Arrow className={styles.tooltipArrow} />
                  </Tooltip.Content>
                </Tooltip.Portal>
              )}
            </Tooltip.Root>
            <Popover.Portal>
              <Popover.Content
                className={styles.popoverContent}
                side="bottom"
                align="start"
                sideOffset={6}
                collisionPadding={12}
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                <AssigneePicker
                  value={assigneeValue}
                  onChange={(a) => {
                    onAssigneeChange?.(a);
                    setIsAssigneeIdOpen(false);
                  }}
                  onClose={() => setIsAssigneeIdOpen(false)}
                />
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>

          <Popover.Root open={isTaskTypeOpen} onOpenChange={setIsTaskTypeOpen}>
            <Popover.Trigger asChild>
              <button type="button" className={styles.filterBtn}>
                <span>{selectedTaskType ? selectedTaskType.label : 'Loại'}</span>
                <ChevronDownIcon />
              </button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content
                className={styles.popoverContent}
                side="bottom"
                align="start"
                sideOffset={6}
                collisionPadding={12}
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                <TaskTypePicker
                  selectedId={selectedTaskType?.id ?? ''}
                  onSelect={(t) => {
                    onTaskTypeChange?.(t);
                    setIsTaskTypeOpen(false);
                  }}
                />
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>

          <CalendarStatusDropdown value={statusValue} onChange={onStatusChange}>
            <button type="button" className={styles.filterBtn}>
              <span>Trạng thái</span>
              <ChevronDownIcon />
            </button>
          </CalendarStatusDropdown>

        </div>

        <div className={styles.right}>
          <button type="button" className={styles.todayBtn} onClick={onTodayClick}>Hôm nay</button>

          <div className={styles.monthNav} aria-label="Month navigation">
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button
                  type="button"
                  className={styles.navArrow}
                  aria-label="Previous month"
                  onClick={handlePrevMonth}
                >
                  <ChevronLeftIcon />
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content className={styles.tooltip} side="bottom" align="center" sideOffset={6}>
                  Tháng trước
                  <Tooltip.Arrow className={styles.tooltipArrow} />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>

            <MonthYearPicker
              value={monthCursor || selectedDate || new Date()}
              viewMode={viewMode}
              onChange={(date) => {
                onMonthCursorChange?.(date);
                onSelectedDateChange?.(date);
              }}
            />

            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button
                  type="button"
                  className={styles.navArrow}
                  aria-label="Next month"
                  onClick={handleNextMonth}
                >
                  <ChevronRightIcon />
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content className={styles.tooltip} side="bottom" align="center" sideOffset={6}>
                  Tháng sau
                  <Tooltip.Arrow className={styles.tooltipArrow} />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </div>

          <CalendarViewDropdown
            value={viewMode}
            dayCount={dayCount}
            onChange={onViewModeChange || (() => { })}
          />

          <button type="button" className={styles.iconBtn} aria-label="Tạo lịch mới" title="Tạo lịch mới">
            <CalendarPlusIcon />
          </button>
        </div>
      </div>
    </Tooltip.Provider>
  );
}
