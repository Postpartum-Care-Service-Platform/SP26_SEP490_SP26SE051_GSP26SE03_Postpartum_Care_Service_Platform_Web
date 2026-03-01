'use client';

import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon, ChevronDownIcon, UpdateIcon, MixerHorizontalIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import React from 'react';

import styles from './work-schedule-detail-view.module.css';

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

// Reusing demoRows structure for consistency
const demoRows: Row[] = [
  {
    id: '1',
    iconUrl: 'https://vominhtien0511.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/10306?size=small',
    workCode: 'ACSCM-26',
    workTitle: 'Handle Login Error Messages & Account Lock',
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

export function WorkScheduleDetailView() {
  const [selectedTaskId, setSelectedTaskId] = React.useState<string>(demoRows[0].id);
  const [checkedIds, setCheckedIds] = React.useState<Set<string>>(new Set());

  const toggleCheck = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const next = new Set(checkedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setCheckedIds(next);
  };

  const selectedTask = demoRows.find(r => r.id === selectedTaskId);

  return (
    <div className={styles.container}>
      <div className={styles.leftPane}>
        <div className={styles.paneHeader}>
          <div className={styles.headerLeft}>
            <span>Created</span>
            <ChevronDownIcon />
          </div>
          <div className={styles.headerIcons}>
            <button className={styles.iconBtn} title="Sort"><MixerHorizontalIcon /></button>
            <button className={styles.iconBtn} title="Refresh"><UpdateIcon /></button>
          </div>
        </div>

        <div className={styles.taskList}>
          {demoRows.map((task) => (
            <div 
              key={task.id} 
              className={`${styles.taskCard} ${selectedTaskId === task.id ? styles.taskCardActive : ''}`}
              onClick={() => setSelectedTaskId(task.id)}
            >
              <div className={styles.cardTop}>
                <div className={styles.checkboxWrapper} onClick={(e) => toggleCheck(e, task.id)}>
                  <Checkbox.Root
                    className={styles.CheckboxRoot}
                    checked={checkedIds.has(task.id)}
                    onCheckedChange={() => {}} // Handled by onClick for better event control
                  >
                    <Checkbox.Indicator className={styles.CheckboxIndicator}>
                      <CheckIcon />
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                </div>
                <div className={styles.taskTitle}>{task.workTitle}</div>
              </div>
              <div className={styles.cardBottom}>
                <div className={styles.taskMeta}>
                  <Image src={task.iconUrl} alt="" className={styles.taskIconImg} width={16} height={16} />
                  <span className={styles.taskKey}>{task.workCode}</span>
                </div>
                <div className={styles.avatar}>VT</div>
              </div>
            </div>
          ))}
        </div>
        
        <div className={styles.footer}>
          {demoRows.length} of {demoRows.length}
        </div>
      </div>

      <div className={styles.rightPane}>
        {selectedTask ? (
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 500, marginBottom: '16px' }}>{selectedTask.workTitle}</h1>
            <div style={{ color: '#44546F', fontSize: '14px' }}>
              <p><strong>Key:</strong> {selectedTask.workCode}</p>
              <p><strong>Status:</strong> {selectedTask.status}</p>
              <p><strong>Assignee:</strong> {selectedTask.assignee}</p>
              {/* Add more details here as needed */}
            </div>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>Select a task to view details</p>
          </div>
        )}
      </div>
    </div>
  );
}
