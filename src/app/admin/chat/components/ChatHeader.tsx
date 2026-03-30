'use client';

import { usePathname } from 'next/navigation';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

import styles from './chat-header.module.css';

export function ChatHeader() {
  const pathname = usePathname();
  const isManager = pathname?.startsWith('/manager');
  const homeHref = isManager ? '/manager' : '/admin';
  const label = isManager ? 'Trò chuyện' : 'Chat';

  return (
    <div className={styles.header}>
      <Breadcrumbs
        items={[
          { label },
        ]}
        homeHref={homeHref}
      />
    </div>
  );
}

