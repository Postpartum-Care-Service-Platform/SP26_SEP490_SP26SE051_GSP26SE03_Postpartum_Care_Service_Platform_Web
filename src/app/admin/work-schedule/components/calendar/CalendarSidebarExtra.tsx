'use client';

import * as Tooltip from '@radix-ui/react-tooltip';
import React from 'react';
import styles from './calendar-sidebar-extra.module.css';
import type { StaffSchedule as TaskSchedule } from '@/types/staff-schedule';
import { format, isSameDay } from 'date-fns';

const STATUS_COLORS: Record<string, string> = {
  Scheduled: '#DDEBFF',
  Done: '#CDEFE1',
  Missed: '#FBE2E4',
  Cancelled: '#FBE2E4',
};

function getStatusColor(status: string): string {
  return STATUS_COLORS[status] || '#E9EDF5';
}

export function CalendarSidebarExtra({
  selectedDate,
  schedules,
}: {
  selectedDate: Date;
  schedules: TaskSchedule[];
}) {
  const todayTasks = React.useMemo(() => {
    return schedules.filter(s => {
      const workDate = new Date(s.familyScheduleResponse.workDate);
      return isSameDay(workDate, selectedDate);
    }).sort((a, b) => a.familyScheduleResponse.startTime.localeCompare(b.familyScheduleResponse.startTime));
  }, [schedules, selectedDate]);

  return (
    <div className={styles.container}>
      {/* Today's Tasks Section */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Lịch trình {format(selectedDate, 'dd/MM')}</h3>
        <div className={styles.taskList}>
          {todayTasks.length === 0 ? (
            <div className={styles.emptyState}>Không có lịch trình nào.</div>
          ) : (
            <Tooltip.Provider delayDuration={250}>
              {todayTasks.map((task) => (
                <Tooltip.Root key={task.id}>
                  <Tooltip.Trigger asChild>
                    <div 
                      className={styles.taskItem}
                      style={{ borderLeftColor: getStatusColor(task.familyScheduleResponse.status) }}
                    >
                      <span className={styles.taskTime}>
                        {task.familyScheduleResponse.startTime} - {task.familyScheduleResponse.endTime}
                      </span>
                      <span className={styles.taskTitle}>{task.familyScheduleResponse.activity}</span>
                      <span className={styles.taskMeta}>{task.familyScheduleResponse.customerName}</span>
                    </div>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content className={styles.tooltipContent} side="right" sideOffset={8}>
                      <div className={styles.tooltipTitle}>{task.familyScheduleResponse.activity}</div>
                      <div className={styles.tooltipLine}>Khách hàng: {task.familyScheduleResponse.customerName}</div>
                      <div className={styles.tooltipLine}>Gói: {task.familyScheduleResponse.packageName}</div>
                      <div className={styles.tooltipLine}>Thời gian: {task.familyScheduleResponse.startTime} - {task.familyScheduleResponse.endTime}</div>
                      <div className={styles.tooltipLine}>Trạng thái: {task.familyScheduleResponse.status}</div>
                      {task.familyScheduleResponse.note && (
                        <div className={styles.tooltipLine}>Ghi chú: {task.familyScheduleResponse.note}</div>
                      )}
                      <Tooltip.Arrow className={styles.tooltipArrow} />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              ))}
            </Tooltip.Provider>
          )}
        </div>
      </div>
    </div>
  );
}
