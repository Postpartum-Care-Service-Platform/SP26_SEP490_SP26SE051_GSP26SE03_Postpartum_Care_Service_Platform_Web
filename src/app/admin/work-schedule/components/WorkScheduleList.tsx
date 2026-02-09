'use client';

import React from 'react';
import { ColumnActionsDropdown } from './ColumnActionsDropdown';

import { DatePicker } from './DatePicker';
import { AssigneePicker } from './AssigneePicker';
import { TaskTypePicker, TASK_TYPES, type TaskType } from './TaskTypePicker';
import { StatusDropdown, type StatusType } from './StatusDropdown';

import styles from './work-schedule-list.module.css';

type Row = {
  id: string;
  iconUrl: string;
  workCode: string;
  workTitle: string;
  assignee: string;
  reporter: string;
  priority: string;
  status: string;
  resolution: string;
  created: string;
  updated: string;
  dueDate: string;
};

const demoRows: Row[] = [
  {
    id: '1',
    iconUrl: 'https://vominhtien0511.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/10306?size=small',
    workCode: 'ACSCM-26',
    workTitle: 'Handle Login Error Messages & Account ...',
    assignee: 'Vo Minh Tien',
    reporter: 'Vo Minh Tien',
    priority: 'Medium',
    status: 'TO DO',
    resolution: 'Unresolved',
    created: 'Aug 20, 2025, 5:07 AM',
    updated: 'Jan 26, 2026, 7:03 PM',
    dueDate: 'Dec 29, 2025',
  },
  {
    id: '2',
    iconUrl: 'https://vominhtien0511.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/10306?size=small',
    workCode: 'ACSCM-16',
    workTitle: 'Epic 6: Nutrition & Health Tracking',
    assignee: 'Vo Minh Tien',
    reporter: 'Vo Minh Tien',
    priority: 'Medium',
    status: 'TO DO',
    resolution: 'Unresolved',
    created: 'Aug 20, 2025, 4:41 AM',
    updated: 'Aug 20, 2025, 4:41 AM',
    dueDate: 'None',
  },
];

function Avatar({ initials }: { initials: string }) {
  return <span className={styles.avatar}>{initials}</span>;
}

function StatusPill({ value }: { value: StatusType }) {
  const [localValue, setLocalValue] = React.useState<StatusType>(value);

  React.useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <StatusDropdown
      value={localValue}
      onChange={(v) => setLocalValue(v)}
    />
  );
}

function PriorityMark() {
  return <span className={styles.priorityMark} />;
}

export function WorkScheduleList() {
  const [isCreating, setIsCreating] = React.useState(false);
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [showAssigneePicker, setShowAssigneePicker] = React.useState(false);
  const [showTaskTypePicker, setShowTaskTypePicker] = React.useState(false);
  const [dueDate, setDueDate] = React.useState<Date | null>(null);
  const [assignee, setAssignee] = React.useState<any>(null);
  const [selectedTaskType, setSelectedTaskType] = React.useState<TaskType>(TASK_TYPES[TASK_TYPES.length - 1]); // Lấy phần tử cuối cùng an toàn hơn
  const footerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (footerRef.current && !footerRef.current.contains(event.target as Node)) {
        setIsCreating(false);
        setShowDatePicker(false);
        setShowAssigneePicker(false);
        setShowTaskTypePicker(false);
      }
    }

    if (isCreating) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCreating]);

  return (
    <div className={styles.wrap}>
      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.headerRow}>
              <th className={styles.thCheckbox}>
                <input type="checkbox" className={styles.checkbox} />
              </th>
              <th className={styles.th}>
                <div className={styles.thInner}>
                  <span>Work</span>
                  <ColumnActionsDropdown columnLabel="Work" />
                </div>
              </th>
              <th className={styles.th}>
                <div className={styles.thInner}>
                  <span>Assignee</span>
                  <ColumnActionsDropdown columnLabel="Assignee" />
                </div>
              </th>
              <th className={styles.th}>
                <div className={styles.thInner}>
                  <span>Reporter</span>
                  <ColumnActionsDropdown columnLabel="Reporter" />
                </div>
              </th>
              <th className={styles.th}>
                <div className={styles.thInner}>
                  <span>Priority</span>
                  <ColumnActionsDropdown columnLabel="Priority" />
                </div>
              </th>
              <th className={styles.th}>
                <div className={styles.thInner}>
                  <span>Status</span>
                  <ColumnActionsDropdown columnLabel="Status" />
                </div>
              </th>
              <th className={styles.th}>
                <div className={styles.thInner}>
                  <span>Resolution</span>
                  <ColumnActionsDropdown columnLabel="Resolution" />
                </div>
              </th>
              <th className={styles.th}>
                <div className={styles.thInner}>
                  <span>Created</span>
                  <span className={styles.sortIcon} aria-hidden="true" />
                  <ColumnActionsDropdown columnLabel="Created" />
                </div>
              </th>
              <th className={styles.th}>
                <div className={styles.thInner}>
                  <span>Updated</span>
                  <ColumnActionsDropdown columnLabel="Updated" />
                </div>
              </th>
              <th className={styles.th}>
                <div className={styles.thInner}>
                  <span>Due date</span>
                  <ColumnActionsDropdown columnLabel="Due date" />
                </div>
              </th>
              <th className={styles.thIcon} aria-label="View" />
              <th className={styles.thIcon} aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {demoRows.map((r, idx) => (
              <tr key={idx} className={styles.row}>
                <td className={styles.tdCheckbox}>
                  <input type="checkbox" className={styles.checkbox} />
                </td>
                <td className={styles.td}>
                  <div className={styles.workCell}>
                    <img src={r.iconUrl} alt="task icon" width={16} height={16} className={styles.workIconImg} />
                    <a href="#" className={styles.workCode}>{r.workCode}</a>
                    <span className={styles.workTitle} title={r.workTitle}>{r.workTitle}</span>
                  </div>
                </td>
                <td className={styles.td}>
                  <div className={styles.personCell}>
                    <Avatar initials="VT" />
                    <span>{r.assignee}</span>
                  </div>
                </td>
                <td className={styles.td}>
                  <div className={styles.personCell}>
                    <Avatar initials="VT" />
                    <span>{r.reporter}</span>
                  </div>
                </td>
                <td className={styles.td}>
                  <div className={styles.priorityCell}>
                    <PriorityMark />
                    <span>{r.priority}</span>
                  </div>
                </td>
                <td className={styles.td}>
                  <StatusPill value={r.status as StatusType} />
                </td>
                <td className={styles.td}>{r.resolution}</td>
                <td className={styles.td}>{r.created}</td>
                <td className={styles.td}>{r.updated}</td>
                <td className={styles.tdMuted}>{r.dueDate}</td>
                <td className={styles.tdIcon}>
                  <button type="button" className={styles.iconBtn} aria-label="View">
                    <span className={styles.viewIcon} />
                  </button>
                </td>
                <td className={styles.tdIcon}>
                  <button type="button" className={`${styles.iconBtn} ${styles.rowHoverOnly}`} aria-label="More">
                    <svg fill="none" viewBox="0 0 16 16" role="presentation" width="11.99" height="11.99" aria-hidden="true">
                      <path fill="currentColor" fillRule="evenodd" d="M0 8a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0m6.5 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0M13 8a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0" clipRule="evenodd" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div 
        ref={footerRef}
        className={`${styles.footer} ${isCreating ? styles.footerHasInput : ''}`}
      >
        {!isCreating && (
          <>
            <button 
              type="button" 
              className={styles.createBtn}
              onClick={() => setIsCreating(true)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span>Create</span>
            </button>

            <div className={styles.footerRight}>
              <span className={styles.footerCount}>10 of 10</span>
              <button type="button" className={styles.refreshBtn} aria-label="Refresh">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 12a9 9 0 1 1-2.64-6.36" />
                  <polyline points="21 3 21 9 15 9" />
                </svg>
              </button>
            </div>
          </>
        )}

        {isCreating && (
          <div className={styles.createTaskInner}>
            <div
              className={styles.typeDropdown}
              role="button"
              tabIndex={0}
              aria-label="Task type"
              onClick={() => setShowTaskTypePicker((v) => !v)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setShowTaskTypePicker((v) => !v);
                }
              }}
            >
              {selectedTaskType.imageUrl ? (
                <img
                  src={selectedTaskType.imageUrl}
                  alt={selectedTaskType.label}
                  width={16}
                  height={16}
                  className={styles.workIconImg}
                />
              ) : (
                <span className={styles.taskTypeSvg}>{selectedTaskType.icon}</span>
              )}
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M4.18179 6.18181C4.35753 6.00608 4.64245 6.00608 4.81819 6.18181L7.49999 8.86362L10.1818 6.18181C10.3575 6.00608 10.6424 6.00608 10.8182 6.18181C10.9939 6.35755 10.9939 6.64247 10.8182 6.81821L7.81819 9.81821C7.73379 9.9026 7.61934 9.95001 7.49999 9.95001C7.38064 9.95001 7.26618 9.9026 7.18179 9.81821L4.18179 6.81821C4.00605 6.64247 4.00605 6.35755 4.18179 6.18181Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
              </svg>
              {showTaskTypePicker && (
                <TaskTypePicker
                  selectedId={selectedTaskType.id}
                  onSelect={(t) => {
                    setSelectedTaskType(t);
                    setShowTaskTypePicker(false);
                  }}
                />
              )}
            </div>
            <input 
              type="text" 
              placeholder="What needs to be done?" 
              className={styles.createInput}
              autoFocus
            />
            <div className={styles.createActions}>
              <div
                className={styles.createActionBtn}
                role="button"
                tabIndex={0}
                aria-label="Due date"
                onClick={() => setShowDatePicker((v) => !v)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setShowDatePicker((v) => !v);
                  }
                }}
              >
                <svg fill="none" viewBox="0 0 16 16" width="16" height="16">
                  <path fill="currentColor" fillRule="evenodd" d="M4.5 2.5v2H6v-2h4v2h1.5v-2H13a.5.5 0 0 1 .5.5v3h-11V3a.5.5 0 0 1 .5-.5zm-2 5V13a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V7.5zm9-6.5H13a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1.5V0H6v1h4V0h1.5z" clipRule="evenodd"></path>
                </svg>
                {showDatePicker && (
                  <DatePicker
                    value={dueDate}
                    onChange={(d) => {
                      setDueDate(d);
                      setShowDatePicker(false);
                    }}
                  />
                )}
              </div>
              <div
                className={styles.createActionBtn}
                role="button"
                tabIndex={0}
                aria-label="Assignee"
                onClick={() => setShowAssigneePicker((v) => !v)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setShowAssigneePicker((v) => !v);
                  }
                }}
              >
                <svg fill="none" viewBox="-4 -4 24 24" width="16" height="16">
                  <path fill="currentColor" fillRule="evenodd" d="M8 1.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4 4a4 4 0 1 1 8 0 4 4 0 0 1-8 0m-2 9a3.75 3.75 0 0 1 3.75-3.75h4.5A3.75 3.75 0 0 1 14 13v2h-1.5v-2a2.25 2.25 0 0 0-2.25-2.25h-4.5A2.25 2.25 0 0 0 3.5 13v2H2z" clipRule="evenodd"></path>
                </svg>
                {showAssigneePicker && (
                  <AssigneePicker
                    value={assignee}
                    onChange={(a) => setAssignee(a)}
                    onClose={() => setShowAssigneePicker(false)}
                  />
                )}
              </div>
              <div className={styles.submitBtnGroup}>
                <button type="button" className={styles.submitBtn}>
                  <span>Create</span>
                  <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M3 0C1.34315 0 0 1.34315 0 3V13C0 14.6569 1.34315 16 3 16H21C22.6569 16 24 14.6569 24 13V3C24 1.34315 22.6569 0 21 0H3Z" fill="#00000029"></path>
                    <path d="M15.5 5.75V6.75C15.5 8.26878 14.2688 9.5 12.75 9.5H8.75C8.33579 9.5 8 9.16421 8 8.75C8 8.33579 8.33579 8 8.75 8H12.75C13.4404 8 14 7.44036 14 6.75V5.75C14 5.33579 14.3358 5 14.75 5C15.1642 5 15.5 5.33579 15.5 5.75Z" fill="#FFFFFF"></path>
                    <path d="M9.28033 9.28033L11.0303 7.53033C11.3232 7.23744 11.3232 6.76256 11.0303 6.46967C10.7374 6.17678 10.2626 6.17678 9.96967 6.46967L8.21967 8.21967C7.92678 8.51256 7.92678 8.98744 8.21967 9.28033C8.51256 9.57322 8.98744 9.57322 9.28033 9.28033Z" fill="#FFFFFF"></path>
                    <path d="M9.28033 8.21967L11.0303 9.96967C11.3232 10.2626 11.3232 10.7374 11.0303 11.0303C10.7374 11.3232 10.2626 11.3232 9.96967 11.0303L8.21967 9.28033C7.92678 8.98744 7.92678 8.51256 8.21967 8.21967C8.51256 7.92678 8.98744 7.92678 9.28033 8.21967Z" fill="#FFFFFF"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
