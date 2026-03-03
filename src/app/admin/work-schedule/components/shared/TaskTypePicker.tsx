import Image from 'next/image';
import React from 'react';

import Epic16Icon from '../list/artifacts/glyph/epic/16';
import Story16Icon from '../list/artifacts/glyph/story/16';
import TaskBe16Icon from '../list/artifacts/glyph/task-be/16';
import TaskFe16Icon from '../list/artifacts/glyph/task-fe/16';

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
  types?: TaskType[];
  /** Vị trí popup so với trigger (mặc định mở lên trên như thanh tạo nhanh) */
  side?: 'top' | 'bottom';
};

export function TaskTypePicker({ selectedId, onSelect, types, side = 'top' }: Props) {
  const displayTypes = types ?? TASK_TYPES;
  return (
    <div
      className={`${styles.picker} ${side === 'bottom' ? styles.bottom : ''}`}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      {displayTypes.map((type) => (
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
