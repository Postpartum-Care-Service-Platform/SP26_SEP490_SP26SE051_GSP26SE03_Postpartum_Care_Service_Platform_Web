'use client';

import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';
import * as Popover from '@radix-ui/react-popover';
import Image from 'next/image';
import React from 'react';

import { ColumnActionsDropdown } from '../ColumnActionsDropdown';
import { DatePicker } from '../DatePicker';
import { ProfileHoverCard } from '../ProfileHoverCard';
import { AssigneePicker } from '../shared/AssigneePicker';
import { StatusDropdown, type StatusType } from '../StatusDropdown';
import { TaskTypePicker, TASK_TYPES, type TaskType } from '../TaskTypePicker';

type Assignee = {
  id: string;
  name: string;
  email?: string;
  initials?: string;
  color?: string;
  type: 'unassigned' | 'automatic' | 'user';
};

import toolbarStyles from './bulk-actions-toolbar.module.css';
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

type ColumnId =
  | 'work'
  | 'assignee'
  | 'reporter'
  | 'priority'
  | 'status'
  | 'resolution'
  | 'created'
  | 'updated'
  | 'dueDate'
  | 'view'
  | 'actions';

const DEFAULT_COL_WIDTH: Record<ColumnId, number> = {
  work: 520,
  assignee: 180,
  reporter: 180,
  priority: 140,
  status: 140,
  resolution: 160,
  created: 190,
  updated: 190,
  dueDate: 150,
  view: 48,
  actions: 48,
};

const MIN_COL_WIDTH: Record<ColumnId, number> = (Object.keys(DEFAULT_COL_WIDTH) as ColumnId[]).reduce(
  (acc, k) => {
    acc[k] = Math.max(40, Math.round(DEFAULT_COL_WIDTH[k] * 0.4));
    return acc;
  },
  {} as Record<ColumnId, number>,
);

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

export function WorkScheduleList({ assigneeOnly }: { assigneeOnly: boolean }) {
  const [rows, setRows] = React.useState<Row[]>(demoRows);
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [isCreating, setIsCreating] = React.useState(false);
  const [openAssigneeId, setOpenAssigneeId] = React.useState<string | null>(null);

  const toggleAll = () => {
    if (selectedIds.size === rows.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(rows.map(r => r.id)));
}
  };

  const updateRowAssignee = (rowId: string, assignee: Assignee | null) => {
    setRows(prev => prev.map(r => 
      r.id === rowId ? { ...r, assignee: assignee ? assignee.name : 'Unassigned' } : r
    ));
    setOpenAssigneeId(null);
  };

  const toggleRow = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const [colWidths, setColWidths] = React.useState<Record<ColumnId, number>>(DEFAULT_COL_WIDTH);
  const [isResizing, setIsResizing] = React.useState(false);
  const resizingRef = React.useRef<{
    col: ColumnId;
    startX: number;
    startWidth: number;
  } | null>(null);

  const tableScrollRef = React.useRef<HTMLDivElement>(null);

  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [showAssigneePicker, setShowAssigneePicker] = React.useState(false);
  const [showTaskTypePicker, setShowTaskTypePicker] = React.useState(false);
  const [dueDate, setDueDate] = React.useState<Date | null>(null);
  const [assignee, setAssignee] = React.useState<Assignee | null>(null);
  const [selectedTaskType, setSelectedTaskType] = React.useState<TaskType>(TASK_TYPES[TASK_TYPES.length - 1]); // Lấy phần tử cuối cùng an toàn hơn
  const footerRef = React.useRef<HTMLDivElement>(null);

  function startResize(col: ColumnId, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    const startWidth = colWidths[col];
    resizingRef.current = { col, startX: e.clientX, startWidth };
    setIsResizing(true);
  }

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const r = resizingRef.current;
      if (!r) return;
      const delta = e.clientX - r.startX;
      const next = r.startWidth + delta;
      const min = MIN_COL_WIDTH[r.col];
      const clamped = Math.max(min, next);
      setColWidths((prev) => ({ ...prev, [r.col]: clamped }));
    };

    const handleMouseUp = () => {
      if (!resizingRef.current) return;
      resizingRef.current = null;
      setIsResizing(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    if (isResizing) {
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);


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

  const displayedRows = React.useMemo(() => {
    if (!assigneeOnly) return rows;
    return rows.filter((r) => r.assignee === 'Vo Minh Tien');
  }, [rows, assigneeOnly]);

  return (
    <div className={styles.wrap}>
      <div ref={tableScrollRef} className={styles.tableScroll}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.headerRow}>
              <th className={styles.thCheckbox}>
                <div className={styles.checkboxCenter}>
                  <Checkbox.Root
                    className={styles.CheckboxRoot}
                    checked={selectedIds.size === displayedRows.length && displayedRows.length > 0}
                    onCheckedChange={toggleAll}
                  >
                    <Checkbox.Indicator className={styles.CheckboxIndicator}>
                      <CheckIcon />
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                </div>
              </th>
              <th
                className={styles.th}
                style={{ width: colWidths.work, minWidth: MIN_COL_WIDTH.work }}
              >
                <div className={styles.thInner}>
                  <span>Work</span>
                  <ColumnActionsDropdown columnLabel="Work" />
                </div>
                <span
                  className={styles.resizer}
                  onMouseEnter={() => {}}
                  onMouseLeave={() => {}}
                  onMouseDown={(e) => startResize('work', e)}
                />
              </th>
              <th
                className={styles.th}
                style={{ width: colWidths.assignee, minWidth: MIN_COL_WIDTH.assignee }}
              >
                <div className={styles.thInner}>
                  <span>Assignee</span>
                  <ColumnActionsDropdown columnLabel="Assignee" />
                </div>
                <span
                  className={styles.resizer}
                  onMouseEnter={() => {}}
                  onMouseLeave={() => {}}
                  onMouseDown={(e) => startResize('assignee', e)}
                />
              </th>
              <th
                className={styles.th}
                style={{ width: colWidths.reporter, minWidth: MIN_COL_WIDTH.reporter }}
              >
                <div className={styles.thInner}>
                  <span>Reporter</span>
                  <ColumnActionsDropdown columnLabel="Reporter" />
                </div>
                <span
                  className={styles.resizer}
                  onMouseEnter={() => {}}
                  onMouseLeave={() => {}}
                  onMouseDown={(e) => startResize('reporter', e)}
                />
              </th>
              <th
                className={styles.th}
                style={{ width: colWidths.priority, minWidth: MIN_COL_WIDTH.priority }}
              >
                <div className={styles.thInner}>
                  <span>Priority</span>
                  <ColumnActionsDropdown columnLabel="Priority" />
                </div>
                <span
                  className={styles.resizer}
                  onMouseEnter={() => {}}
                  onMouseLeave={() => {}}
                  onMouseDown={(e) => startResize('priority', e)}
                />
              </th>
              <th
                className={styles.th}
                style={{ width: colWidths.status, minWidth: MIN_COL_WIDTH.status }}
              >
                <div className={styles.thInner}>
                  <span>Status</span>
                  <ColumnActionsDropdown columnLabel="Status" />
                </div>
                <span
                  className={styles.resizer}
                  onMouseEnter={() => {}}
                  onMouseLeave={() => {}}
                  onMouseDown={(e) => startResize('status', e)}
                />
              </th>
              <th
                className={styles.th}
                style={{ width: colWidths.resolution, minWidth: MIN_COL_WIDTH.resolution }}
              >
                <div className={styles.thInner}>
                  <span>Resolution</span>
                  <ColumnActionsDropdown columnLabel="Resolution" />
                </div>
                <span
                  className={styles.resizer}
                  onMouseEnter={() => {}}
                  onMouseLeave={() => {}}
                  onMouseDown={(e) => startResize('resolution', e)}
                />
              </th>
              <th
                className={styles.th}
                style={{ width: colWidths.created, minWidth: MIN_COL_WIDTH.created }}
              >
                <div className={styles.thInner}>
                  <span>Created</span>
                  <ColumnActionsDropdown columnLabel="Created" />
                </div>
                <span
                  className={styles.resizer}
                  onMouseEnter={() => {}}
                  onMouseLeave={() => {}}
                  onMouseDown={(e) => startResize('created', e)}
                />
              </th>
              <th
                className={styles.th}
                style={{ width: colWidths.updated, minWidth: MIN_COL_WIDTH.updated }}
              >
                <div className={styles.thInner}>
                  <span>Updated</span>
                  <ColumnActionsDropdown columnLabel="Updated" />
                </div>
                <span
                  className={styles.resizer}
                  onMouseEnter={() => {}}
                  onMouseLeave={() => {}}
                  onMouseDown={(e) => startResize('updated', e)}
                />
              </th>
              <th
                className={styles.th}
                style={{ width: colWidths.dueDate, minWidth: MIN_COL_WIDTH.dueDate }}
              >
                <div className={styles.thInner}>
                  <span>Due date</span>
                  <ColumnActionsDropdown columnLabel="Due date" />
                </div>
                <span
                  className={styles.resizer}
                  onMouseEnter={() => {}}
                  onMouseLeave={() => {}}
                  onMouseDown={(e) => startResize('dueDate', e)}
                />
              </th>
              <th
                className={styles.thIcon}
                aria-label="Actions"
                style={{ width: colWidths.actions, minWidth: MIN_COL_WIDTH.actions, position: 'relative' }}
              >
                <span
                  className={styles.resizer}
                  onMouseEnter={() => {}}
                  onMouseLeave={() => {}}
                  onMouseDown={(e) => startResize('actions', e)}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {displayedRows.map((r, idx) => (
              <tr key={idx} className={`${styles.row} ${selectedIds.has(r.id) ? styles.rowSelected : ''}`}>
                <td className={styles.tdCheckbox}>
                  <div className={styles.checkboxCenter}>
                    <Checkbox.Root
                      className={styles.CheckboxRoot}
                      checked={selectedIds.has(r.id)}
                      onCheckedChange={() => toggleRow(r.id)}
                    >
                      <Checkbox.Indicator className={styles.CheckboxIndicator}>
                        <CheckIcon />
                      </Checkbox.Indicator>
                    </Checkbox.Root>
                  </div>
                </td>
                <td className={styles.td} style={{ width: colWidths.work, minWidth: MIN_COL_WIDTH.work }}>
                  <div className={styles.workCell}>
                    <Image
                      src={r.iconUrl}
                      alt="task icon"
                      width={16}
                      height={16}
                      className={styles.workIconImg}
                    />
                    <a href="#" className={styles.workCode}>{r.workCode}</a>
                    <span className={styles.workTitle} title={r.workTitle}>{r.workTitle}</span>
                  </div>
                </td>
                <td className={styles.td} style={{ width: colWidths.assignee, minWidth: MIN_COL_WIDTH.assignee, padding: 0 }}>
                  <Popover.Root open={openAssigneeId === r.id} onOpenChange={(open) => setOpenAssigneeId(open ? r.id : null)}>
                    <Popover.Trigger asChild>
                      <div
                        className={styles.personCell}
                        role="button"
                        tabIndex={0}
                        style={{ cursor: 'pointer', width: '100%', height: '100%', padding: '10px 8px', boxSizing: 'border-box' }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setOpenAssigneeId(r.id);
                          }
                        }}
                      >
                        <ProfileHoverCard
                          user={{
                            name: r.assignee,
                            email: 'tienvmse182865@fpt.edu.vn',
                            initials: 'VT',
                          }}
                          onOpenChange={(open) => {
                            if (open) setOpenAssigneeId(null);
                          }}
                        >
                          <span
                            style={{ display: 'inline-flex', alignItems: 'center' }}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                          >
                    <Avatar initials="VT" />
                    </span>
                        </ProfileHoverCard>
                        <span>{r.assignee}</span>
                  </div>
                    </Popover.Trigger>
                    <Popover.Portal>
                      <Popover.Content
                        side="right"
                        align="start"
                        sideOffset={12}
                        collisionPadding={16}
                        onOpenAutoFocus={(e) => e.preventDefault()}
                      >
                        <AssigneePicker
                          value={r.assignee === 'Unassigned' ? null : { id: r.id, name: r.assignee, initials: 'VT', color: '#DE350B', type: 'user' }}
                          onChange={(a) => updateRowAssignee(r.id, a)}
                          onClose={() => setOpenAssigneeId(null)}
                        />
                      </Popover.Content>
                    </Popover.Portal>
                  </Popover.Root>
                </td>
                <td className={styles.td} style={{ width: colWidths.reporter, minWidth: MIN_COL_WIDTH.reporter }}>
                  <ProfileHoverCard
                    user={{
                      name: r.reporter,
                      email: 'tienvmse182865@fpt.edu.vn',
                      initials: 'VT',
                    }}
                  >
                  <div className={styles.personCell}>
                    <Avatar initials="VT" />
                      <span>{r.reporter}</span>
                  </div>
                  </ProfileHoverCard>
                </td>
                <td className={styles.td} style={{ width: colWidths.priority, minWidth: MIN_COL_WIDTH.priority }}>
                  <div className={styles.priorityCell}>
                    <PriorityMark />
                    <span>{r.priority}</span>
                  </div>
                </td>
                <td className={styles.td} style={{ width: colWidths.status, minWidth: MIN_COL_WIDTH.status }}>
                  <StatusPill value={r.status as StatusType} />
                </td>
                <td className={styles.td} style={{ width: colWidths.resolution, minWidth: MIN_COL_WIDTH.resolution }}>{r.resolution}</td>
                <td className={styles.td} style={{ width: colWidths.created, minWidth: MIN_COL_WIDTH.created }}>{r.created}</td>
                <td className={styles.td} style={{ width: colWidths.updated, minWidth: MIN_COL_WIDTH.updated }}>{r.updated}</td>
                <td className={styles.tdMuted} style={{ width: colWidths.dueDate, minWidth: MIN_COL_WIDTH.dueDate }}>{r.dueDate}</td>
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
      
      {selectedIds.size > 0 && (
        <div className={toolbarStyles.toolbarWrap}>
          <div className={toolbarStyles.toolbar}>
            <div className={toolbarStyles.countSection}>
              <span className={toolbarStyles.countBadge}>{selectedIds.size}</span>
              <span className={toolbarStyles.countText}>selected</span>
            </div>
            
            <div className={toolbarStyles.actionsSection}>
              <button className={toolbarStyles.actionBtn} onClick={toggleAll}>
                <span className={toolbarStyles.icon}>
                  <svg fill="none" viewBox="0 0 16 16" width="16" height="16">
                    <path fill="currentColor" fillRule="evenodd" d="M4.909 2.5a2.409 2.409 0 0 0-1.054 4.576l-.657 1.348a3.909 3.909 0 1 1 5.226-5.226l-1.348.657A2.41 2.41 0 0 0 4.909 2.5m-.19 2.22a.75.75 0 0 1 .786-.175l9 3.25a.75.75 0 0 1 .02 1.403l-3.822 1.505-1.505 3.822a.75.75 0 0 1-1.403-.02l-3.25-9a.75.75 0 0 1 .175-.785M6.5 6.498l2.032 5.628.896-2.276a.75.75 0 0 1 .423-.423l2.276-.896z" clipRule="evenodd" />
                  </svg>
                </span>
                Select all
              </button>
              
              <div className={toolbarStyles.divider} />
              
              <button className={toolbarStyles.actionBtn}>
                <span className={toolbarStyles.icon}>
                  <svg fill="none" viewBox="0 0 16 16" width="16" height="16">
                    <path fill="currentColor" fillRule="evenodd" d="M11.586.854a2 2 0 0 1 2.828 0l.732.732a2 2 0 0 1 0 2.828L10.01 9.551a2 2 0 0 1-.864.51l-3.189.91a.75.75 0 0 1-.927-.927l.91-3.189a2 2 0 0 1 .51-.864zm1.768 1.06a.5.5 0 0 0-.708 0l-.585.586L13.5 3.94l.586-.586a.5.5 0 0 0 0-.708zM12.439 5 11 3.56 7.51 7.052a.5.5 0 0 0-.128.216l-.54 1.891 1.89-.54a.5.5 0 0 0 .217-.127zM3 2.501a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V10H15v3.001a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-10a2 2 0 0 1 2-2h3v1.5z" clipRule="evenodd" />
                  </svg>
                </span>
                Edit fields
              </button>
              
              <button className={toolbarStyles.actionBtn}>
                <span className={toolbarStyles.icon}>
                  <svg fill="none" viewBox="0 0 16 16" width="16" height="16">
                    <path fill="currentColor" fillRule="evenodd" d="M0 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-.5a.5.5 0 0 0-.5.5v4a.5.5 0 0 0 .5.5h12a.5.5 0 0 0 .5-.5V6a.5.5 0 0 0-.5-.5zm11 3.25H3v-1.5h10z" clipRule="evenodd" />
                  </svg>
                </span>
                Change status
              </button>
              
              <button className={toolbarStyles.actionBtn}>
                <span className={toolbarStyles.icon}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </span>
                Watch options
              </button>
              
              <button className={toolbarStyles.actionBtn}>
                <span className={toolbarStyles.icon}>
                  <svg fill="none" viewBox="0 0 16 16" width="16" height="16">
                    <path fill="currentColor" fillRule="evenodd" d="M5 .75A.75.75 0 0 1 5.75 0h4.5a.75.75 0 0 1 .75.75V2.5h3.5V4h-1v10a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2V4h-1V2.5H5zM6.5 2.5h3v-1h-3zM4 4v10a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V4zm1.75 9V5.5h1.5V13zm3 0V5.5h1.5V13z" clipRule="evenodd" />
                  </svg>
                </span>
                Delete
              </button>
            </div>
            
            <div className={toolbarStyles.divider} />
            
            <div className={toolbarStyles.closeSection}>
              <button className={toolbarStyles.closeBtn} onClick={() => setSelectedIds(new Set())}>
                <span className={toolbarStyles.icon}>
                  <svg fill="none" viewBox="0 0 16 16" width="16" height="16">
                    <path fill="currentColor" d="M14.03 3.03 9.06 8l4.97 4.97-1.06 1.06L8 9.06l-4.97 4.97-1.06-1.06L6.94 8 1.97 3.03l1.06-1.06L8 6.94l4.97-4.97z" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

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
                <Image
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
              <Popover.Root open={showAssigneePicker} onOpenChange={setShowAssigneePicker}>
                <Popover.Trigger asChild>
                  <button
                    type="button"
                className={styles.createActionBtn}
                aria-label="Assignee"
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
                  </button>
                </Popover.Trigger>

                <Popover.Portal>
                  <Popover.Content
                    side="top"
                    align="end"
                    sideOffset={8}
                    collisionPadding={12}
                    onOpenAutoFocus={(e) => e.preventDefault()}
                  >
                  <AssigneePicker
                    value={assignee}
                    onChange={(a) => setAssignee(a)}
                    onClose={() => setShowAssigneePicker(false)}
                  />
                  </Popover.Content>
                </Popover.Portal>
              </Popover.Root>
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
