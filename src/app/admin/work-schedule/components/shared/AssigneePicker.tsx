'use client';

import Image from 'next/image';
import React from 'react';

import { useToast } from '@/components/ui/toast/use-toast';
import userService from '@/services/user.service';
import type { Account } from '@/types/account';

import styles from './assignee-picker.module.css';

export type Assignee = {
  id: string;
  name: string;
  email?: string;
  initials?: string;
  color?: string;
  avatarUrl?: string | null;
  type: 'unassigned' | 'automatic' | 'user';
};

type Props = {
  value: Assignee | null;
  onChange: (value: Assignee | null) => void;
  onClose: () => void;
  hideSpecialOptions?: boolean;
  roleNameFilter?: string[];
};

const SPECIAL_ASSIGNEES: Assignee[] = [
  { id: 'unassigned', name: 'Unassigned', type: 'unassigned' },
  { id: 'automatic', name: 'Automatic', type: 'automatic' },
];

const COLOR_PALETTE = ['#DE350B', '#FF8B00', '#0C66E4', '#6554C0', '#00875A', '#0065FF'];

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]!.charAt(0)}${parts[parts.length - 1]!.charAt(0)}`.toUpperCase();
}

function getColorFromId(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }
  const idx = Math.abs(hash) % COLOR_PALETTE.length;
  return COLOR_PALETTE[idx] ?? '#6554C0';
}

function accountToAssignee(account: Account): Assignee {
  const name = account.ownerProfile?.fullName?.trim() || account.username?.trim() || account.email;
  return {
    id: account.id,
    name,
    email: account.email,
    initials: getInitials(name),
    color: getColorFromId(account.id),
    avatarUrl: account.ownerProfile?.avatarUrl || account.avatarUrl || null,
    type: 'user',
  };
}

function UnassignedAvatar() {
  return (
    <div className={styles.unassignedIcon} aria-hidden="true">
      <svg fill="none" viewBox="-4 -4 24 24" width="16" height="16">
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="M8 1.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4 4a4 4 0 1 1 8 0 4 4 0 0 1-8 0m-2 9a3.75 3.75 0 0 1 3.75-3.75h4.5A3.75 3.75 0 0 1 14 13v2h-1.5v-2a2.25 2.25 0 0 0-2.25-2.25h-4.5A2.25 2.25 0 0 0 3.5 13v2H2z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
}

function UserAvatar({
  initials,
  color,
  avatarUrl,
}: {
  initials?: string;
  color?: string;
  avatarUrl?: string | null;
}) {
  if (avatarUrl) {
    return (
      <Image
        src={avatarUrl}
        alt=""
        width={32}
        height={32}
        className={styles.avatarImage}
        aria-hidden="true"
      />
    );
  }
  return (
    <div className={styles.avatar} style={{ background: color || '#6554C0' }} aria-hidden="true">
      {initials || '?'}
    </div>
  );
}

export function AssigneePicker({
  value,
  onChange,
  onClose,
  hideSpecialOptions = false,
  roleNameFilter,
}: Props) {
  const [query, setQuery] = React.useState('');
  const [users, setUsers] = React.useState<Assignee[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  React.useEffect(() => {
    let mounted = true;

    async function fetchUsers() {
      setIsLoading(true);
      try {
        const accounts = await userService.getAllAccounts();
        const activeAccounts = accounts.filter((a) => a.isActive);

        const normalizedRoleFilter = roleNameFilter?.map((r) => r.trim().toLowerCase()).filter(Boolean);
        const filteredAccounts = normalizedRoleFilter?.length
          ? activeAccounts.filter((a) => normalizedRoleFilter.includes(a.roleName?.toLowerCase() ?? ''))
          : activeAccounts;

        const mapped = filteredAccounts.map(accountToAssignee);
        if (!mounted) return;
        setUsers(mapped);
      } catch (error) {
        console.error('Failed to fetch accounts:', error);
        const message =
          typeof error === 'object' && error && 'message' in error ? String((error as { message?: unknown }).message) : '';
        toast({ title: message || 'Không thể tải danh sách khách hàng', variant: 'error' });
        if (!mounted) return;
        setUsers([]);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    fetchUsers();

    return () => {
      mounted = false;
    };
  }, [roleNameFilter, toast]);

  const items = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = hideSpecialOptions ? users : [...SPECIAL_ASSIGNEES, ...users];
    if (!q) return base;

    return base.filter((a) => {
      if (a.type === 'user') {
        return `${a.name} ${a.email || ''}`.toLowerCase().includes(q);
      }
      return a.name.toLowerCase().includes(q);
    });
  }, [hideSpecialOptions, query, users]);

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
      className={styles.popoverContent}
      role="dialog"
      aria-label="Chọn người"
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
            placeholder={value?.name || 'Tìm người...'}
          />
          {value && (
            <button
              type="button"
              className={styles.clearBtn}
              onClick={() => {
                onChange(null);
                onClose();
              }}
              aria-label="Xóa người đã chọn"
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div className={styles.userList}>
        {isLoading && <div className={styles.userItem}>Đang tải...</div>}
        {!isLoading &&
          items.map((a) => {
            const selected = value?.id === a.id;

            return (
              <div
                key={a.id}
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
            );
          })}
      </div>
    </div>
  );
}
