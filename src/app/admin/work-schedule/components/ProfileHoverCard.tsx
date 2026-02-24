'use client';

import React from 'react';
import * as HoverCard from '@radix-ui/react-hover-card';

import styles from './profile-hover-card.module.css';

type UserInfo = {
  name: string;
  email?: string;
  initials: string;
};

export function ProfileHoverCard({
  user,
  children,
  onOpenChange,
}: {
  user: UserInfo;
  children: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
}) {
  return (
    <HoverCard.Root openDelay={250} closeDelay={120} onOpenChange={onOpenChange}>
      <HoverCard.Trigger asChild>{children}</HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content
          className={styles.card}
          side="top"
          align="start"
          sideOffset={8}
          collisionPadding={12}
        >
          <div className={styles.container}>
            <div className={styles.bigAvatar}>{user.initials}</div>
            <div className={styles.info}>
              <div className={styles.name}>{user.name}</div>
              {user.email && (
                <div className={styles.emailRow}>
                  <span className={styles.emailIcon} aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        fill="currentColor"
                        fillRule="evenodd"
                        d="M2 3.5c0-.828.672-1.5 1.5-1.5h9c.828 0 1.5.672 1.5 1.5v9c0 .828-.672 1.5-1.5 1.5h-9C2.672 14 2 13.328 2 12.5zm1.5-.5a.5.5 0 0 0-.5.5v.7l5 2.5 5-2.5v-.7a.5.5 0 0 0-.5-.5zm9.5 2.32-4.72 2.36a.75.75 0 0 1-.56 0L3 5.32V12.5c0 .276.224.5.5.5h9a.5.5 0 0 0 .5-.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span className={styles.email}>{user.email}</span>
                </div>
              )}
            </div>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.btn}>
              View profile
            </button>
            <button type="button" className={styles.btn}>
              Assigned work items
            </button>
          </div>
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}
