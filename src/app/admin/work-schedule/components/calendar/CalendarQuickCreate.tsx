'use client';

import * as Popover from '@radix-ui/react-popover';
import React from 'react';

import { AssigneePicker } from '../shared/AssigneePicker';
import { TaskTypePicker, TASK_TYPES, type TaskType } from '../TaskTypePicker';

import styles from './calendar-quick-create.module.css';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function CalendarQuickCreate({ open, onOpenChange, children }: Props) {
  const [summary, setSummary] = React.useState('');
  const [selectedTaskType, setSelectedTaskType] = React.useState<TaskType>(TASK_TYPES[TASK_TYPES.length - 1]);
  const [assignee, setAssignee] = React.useState<any>(null);
  const [showAssigneePicker, setShowAssigneePicker] = React.useState(false);
  const [showTaskTypePicker, setShowTaskTypePicker] = React.useState(false);

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (open) {
      setTimeout(() => textareaRef.current?.focus(), 0);
    } else {
      setSummary('');
    }
  }, [open]);

  return (
    <Popover.Root open={open} onOpenChange={onOpenChange}>
      <Popover.Trigger asChild>{children}</Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className={styles.popover}
          side="top"
          align="start"
          sideOffset={8}
          collisionPadding={12}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className={styles.container}>
            <textarea
              ref={textareaRef}
              className={styles.textarea}
              placeholder="What needs to be done?"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
            
            <div className={styles.controls}>
              <div className={styles.leftControls}>
                <div
                  className={styles.typeDropdown}
                  role="button"
                  tabIndex={0}
                  onClick={() => setShowTaskTypePicker(!showTaskTypePicker)}
                >
                  {selectedTaskType.imageUrl ? (
                    <img src={selectedTaskType.imageUrl} alt="" width={16} height={16} />
                  ) : (
                    <span className={styles.taskTypeSvg}>{selectedTaskType.icon}</span>
                  )}
                  <span className={styles.typeLabel}>{selectedTaskType.label}...</span>
                  <svg width="12" height="12" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.18179 6.18181C4.35753 6.00608 4.64245 6.00608 4.81819 6.18181L7.49999 8.86362L10.1818 6.18181C10.3575 6.00608 10.6424 6.00608 10.8182 6.18181C10.9939 6.35755 10.9939 6.64247 10.8182 6.81821L7.81819 9.81821C7.73379 9.9026 7.61934 9.95001 7.49999 9.95001C7.38064 9.95001 7.26618 9.9026 7.18179 9.81821L4.18179 6.81821C4.00605 6.64247 4.00605 6.35755 4.18179 6.18181Z" fill="currentColor" />
                  </svg>
                  {showTaskTypePicker && (
                    <div className={styles.typePickerWrapper}>
                      <TaskTypePicker
                        selectedId={selectedTaskType.id}
                        onSelect={(t) => {
                          setSelectedTaskType(t);
                          setShowTaskTypePicker(false);
                        }}
                      />
                    </div>
                  )}
                </div>

                <Popover.Root open={showAssigneePicker} onOpenChange={setShowAssigneePicker}>
                  <Popover.Trigger asChild>
                    <button type="button" className={styles.assigneeBtn}>
                      <svg fill="none" viewBox="-4 -4 24 24" width="16" height="16">
                        <path fill="currentColor" fillRule="evenodd" d="M8 1.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4 4a4 4 0 1 1 8 0 4 4 0 0 1-8 0m-2 9a3.75 3.75 0 0 1 3.75-3.75h4.5A3.75 3.75 0 0 1 14 13v2h-1.5v-2a2.25 2.25 0 0 0-2.25-2.25h-4.5A2.25 2.25 0 0 0 3.5 13v2H2z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </Popover.Trigger>
                  <Popover.Portal>
                    <Popover.Content side="bottom" align="center" sideOffset={4}>
                      <AssigneePicker
                        value={assignee}
                        onChange={(a) => {
                          setAssignee(a);
                          setShowAssigneePicker(false);
                        }}
                        onClose={() => setShowAssigneePicker(false)}
                      />
                    </Popover.Content>
                  </Popover.Portal>
                </Popover.Root>
              </div>

              <div className={styles.submitSection}>
                <button
                  type="button"
                  className={styles.createBtn}
                  disabled={!summary.trim()}
                  onClick={() => onOpenChange(false)}
                >
                  Create
                  <svg width="12" height="12" viewBox="0 0 24 16" fill="none">
                    <path d="M15.5 5.75V6.75C15.5 8.26878 14.2688 9.5 12.75 9.5H8.75C8.33579 9.5 8 9.16421 8 8.75C8 8.33579 8.33579 8 8.75 8H12.75C13.4404 8 14 7.44036 14 6.75V5.75C14 5.33579 14.3358 5 14.75 5C15.1642 5 15.5 5.33579 15.5 5.75Z" fill="currentColor" />
                    <path d="M9.28033 9.28033L11.0303 7.53033C11.3232 7.23744 11.3232 6.76256 11.0303 6.46967C10.7374 6.17678 10.2626 6.17678 9.96967 6.46967L8.21967 8.21967C7.92678 8.51256 7.92678 8.98744 8.21967 9.28033C8.51256 9.57322 8.98744 9.57322 9.28033 9.28033Z" fill="currentColor" />
                    <path d="M9.28033 8.21967L11.0303 9.96967C11.3232 10.2626 11.3232 10.7374 11.0303 11.0303C10.7374 11.3232 10.2626 11.3232 9.96967 11.0303L8.21967 9.28033C7.92678 8.98744 7.92678 8.51256 8.21967 8.21967C8.51256 7.92678 8.98744 7.92678 9.28033 8.21967Z" fill="currentColor" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
