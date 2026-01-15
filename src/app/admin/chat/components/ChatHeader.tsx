'use client';

import { Breadcrumbs } from '@/components/ui/breadcrumbs';

import styles from './chat-header.module.css';

export function ChatHeader() {
  return (
    <div className={styles.header}>
      <h4 className={styles.title}>Chat</h4>
      <Breadcrumbs
        items={[
          { label: 'Apps', href: '/admin' },
          { label: 'Chat' },
        ]}
        homeHref="/admin"
      />
    </div>
  );
}

