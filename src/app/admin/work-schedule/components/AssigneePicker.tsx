'use client';

import React from 'react';

import styles from './assignee-picker.module.css';

type Assignee = {
  id: string;
  name: string;
  email?: string;
  initials?: string;
  color?: string;
  type: 'unassigned' | 'automatic' | 'user';
};

type Props = {
  value: Assignee | null;
  onChange: (value: Assignee | null) => void;
  onClose: () => void;
};

const DEMO_ASSIGNEES: Assignee[] = [
  { id: 'unassigned', name: 'Unassigned', type: 'unassigned' },
  { id: 'automatic', name: 'Automatic', type: 'automatic' },
  { id: 'u1', name: 'Vo Minh Tien (Assign to me)', email: 'tienvmse182865@fpt.edu.vn', initials: 'VT', color: '#DE350B', type: 'user' },
  { id: 'u2', name: 'Thep Mai Tan', initials: 'TT', color: '#FF8B00', type: 'user' },
  { id: 'u3', name: 'nguyễn văn phúc', initials: 'NP', color: '#0C66E4', type: 'user' },
];

function UnassignedAvatar() {
  return (
    <div className={styles.unassignedIcon} aria-hidden="true">
      <svg fill="none" viewBox="-4 -4 24 24" width="16" height="16">
        <path fill="currentColor" fillRule="evenodd" d="M8 1.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4 4a4 4 0 1 1 8 0 4 4 0 0 1-8 0m-2 9a3.75 3.75 0 0 1 3.75-3.75h4.5A3.75 3.75 0 0 1 14 13v2h-1.5v-2a2.25 2.25 0 0 0-2.25-2.25h-4.5A2.25 2.25 0 0 0 3.5 13v2H2z" clipRule="evenodd"></path>
      </svg>
    </div>
  );
}

function UserAvatar({ initials, color }: { initials?: string; color?: string }) {
  return (
    <div className={styles.avatar} style={{ background: color || '#6554C0' }} aria-hidden="true">
      {initials || '?' }
    </div>
  );
}

export function AssigneePicker({ value, onChange, onClose }: Props) {
  const [query, setQuery] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const items = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return DEMO_ASSIGNEES;
    return DEMO_ASSIGNEES.filter((a) => {
      if (a.type === 'user') {
        return `${a.name} ${a.email || ''}`.toLowerCase().includes(q);
      }
      return a.name.toLowerCase().includes(q);
    });
  }, [query]);

  function handleSelect(a: Assignee) {
    if (a.type === 'unassigned') {
      onChange(null);
    } else {
      onChange(a);
    }
    onClose();
  }

  return (
    <div
      className={styles.assigneePicker}
      role="dialog"
      aria-label="Assignee picker"
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <div className={styles.searchWrapper}>
        <div className={styles.searchInputWrapper}>
          <UnassignedAvatar />
          <input
            ref={inputRef}
            className={styles.searchInput}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={value?.name || 'Unassigned'}
          />
        </div>
      </div>

      <div className={styles.userList}>
        {items.map((a, idx) => {
          const selected = (value?.id || 'unassigned') === a.id;
          const showDivider = idx === 1;

          return (
            <React.Fragment key={a.id}>
              {showDivider && <div className={styles.divider} />}
              <div
                className={`${styles.userItem} ${selected ? styles.selected : ''}`}
                onClick={() => handleSelect(a)}
                role="button"
                tabIndex={0}
              >
                {a.type === 'unassigned' || a.type === 'automatic' ? (
                  <UnassignedAvatar />
                ) : (
                  <UserAvatar initials={a.initials} color={a.color} />
                )}

                <div className={styles.userInfo}>
                  <div className={styles.userName}>{a.name}</div>
                  {a.email && <div className={styles.userEmail}>{a.email}</div>}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
