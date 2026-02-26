import React from 'react';

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
    icon: null,
    imageUrl: 'https://vominhtien0511.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/10307?size=small',
  },
  {
    id: 'story',
    label: 'Story',
    icon: null,
    imageUrl: 'https://vominhtien0511.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/10315?size=small',
  },
  {
    id: 'epic',
    label: 'Epic',
    icon: null,
    imageUrl: 'https://vominhtien0511.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/10318?size=small',
  },
  {
    id: 'task-fe',
    label: 'Task FE',
    icon: null,
    imageUrl: 'https://vominhtien0511.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/10306?size=small',
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
              <img src={type.imageUrl} alt={type.label} width={16} height={16} />
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
