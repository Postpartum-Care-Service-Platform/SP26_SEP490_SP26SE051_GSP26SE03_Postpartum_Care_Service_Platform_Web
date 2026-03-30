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

function formatEventTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const hour = (hours ?? 0) % 12 || 12;
  const ampm = (hours ?? 0) >= 12 ? 'PM' : 'AM';
  return `${hour}:${(minutes ?? 0).toString().padStart(2, '0')} ${ampm}`;
}

function formatDateVN(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
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
              {todayTasks.map((task) => {
                const { familyScheduleResponse: fs } = task;
                return (
                  <Tooltip.Root key={task.id}>
                    <Tooltip.Trigger asChild>
                      <div 
                        className={styles.taskItem}
                        style={{ borderLeftColor: getStatusColor(fs.status) }}
                      >
                        <span className={styles.taskTime}>
                          {fs.startTime} - {fs.endTime}
                        </span>
                        <span className={styles.taskTitle}>{fs.activity}</span>
                        <span className={styles.taskMeta}>{fs.customerName}</span>
                      </div>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content className={styles.tooltipContent} side="right" sideOffset={8}>
                        <div className={styles.tooltipHeader}>
                          <div className={styles.tooltipTitle}>{fs.activity}</div>
                          <div 
                            className={styles.tooltipStatusBadge}
                            style={{ 
                              backgroundColor: 
                                fs.status === 'Done' ? '#CDEFE1' : 
                                fs.status === 'Missed' ? '#FBE2E4' : 
                                fs.status === 'Cancelled' ? '#F4F5F7' : '#DDEBFF',
                              color: 
                                fs.status === 'Done' ? '#006644' : 
                                fs.status === 'Missed' ? '#AE2E24' : 
                                fs.status === 'Cancelled' ? '#42526E' : '#0052CC'
                            }}
                          >
                            {fs.status === 'Done' ? 'Đã hoàn thành' : 
                             fs.status === 'Missed' ? 'Đã bỏ lỡ' : 
                             fs.status === 'Cancelled' ? 'Đã hủy' : 'Đã lên lịch'}
                          </div>
                        </div>

                        <div className={styles.tooltipCode}>{fs.customerName}</div>
                        <div className={styles.tooltipTime}>
                          {formatDateVN(fs.workDate)} • {formatEventTime(fs.startTime)} - {formatEventTime(fs.endTime)}
                        </div>
                        <div className={styles.tooltipCode}>{fs.packageName}</div>
                        {task.staffName && <div className={styles.tooltipCode}>{task.staffName}</div>}
                        {fs.note && <div className={styles.tooltipCode}>{fs.note}</div>}
                        
                        <Tooltip.Arrow className={styles.tooltipArrow} />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                );
              })}
            </Tooltip.Provider>
          )}
        </div>
      </div>
    </div>
  );
}
