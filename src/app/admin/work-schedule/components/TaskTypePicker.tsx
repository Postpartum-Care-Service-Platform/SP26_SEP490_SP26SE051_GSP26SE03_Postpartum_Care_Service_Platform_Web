import Image from 'next/image';
import React from 'react';

import Epic16Icon from './list/artifacts/glyph/epic/16';
import Story16Icon from './list/artifacts/glyph/story/16';
import TaskBe16Icon from './list/artifacts/glyph/task-be/16';
import TaskFe16Icon from './list/artifacts/glyph/task-fe/16';
import styles from './task-type-picker.module.css';

export type TaskType = {
  id: string;
  label: string;
  icon?: React.ReactNode | null;
  imageUrl?: string;
};

export const TASK_TYPES: TaskType[] = [
  {
    id: 'task-be',
    label: 'Task BE',
    icon: <TaskBe16Icon />,
    imageUrl: undefined,
  },
  {
    id: 'story',
    label: 'Story',
    icon: <Story16Icon />,
    imageUrl: undefined,
  },
  {
    id: 'epic',
    label: 'Epic',
    icon: <Epic16Icon />,
    imageUrl: undefined,
  },
  {
    id: 'task-fe',
    label: 'Task FE',
    icon: <TaskFe16Icon />,
    imageUrl: undefined,
  },
];

type Props = {
  selectedId: string;
  onSelect: (type: TaskType) => void;
};

export function TaskTypePicker({ selectedId, onSelect }: Props) {
  return (
    <div className={styles.picker} onMouseDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}>
      {TASK_TYPES.map((type) => (
        <div
          key={type.id}
          className={`${styles.item} ${selectedId === type.id ? styles.selected : ''}`}
          onClick={() => onSelect(type)}
        >
          <div className={styles.iconWrapper}>
            {type.imageUrl ? (
              <Image src={type.imageUrl} alt={type.label} width={16} height={16} />
            ) : (
              type.icon
            )}
          </div>
          <span className={styles.label}>{type.label}</span>
        </div>
      ))}
    </div>
  );
}
