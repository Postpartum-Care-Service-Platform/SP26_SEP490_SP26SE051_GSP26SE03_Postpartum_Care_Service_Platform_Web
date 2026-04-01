'use client';

import { usePathname } from 'next/navigation';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

import styles from './profile-header.module.css';

export function ProfileHeader() {
  const pathname = usePathname();
  const isManager = pathname?.startsWith('/manager');
  const homeHref = isManager ? '/manager' : '/admin';

  return (
    <div className={styles.header}>
      <Breadcrumbs
        items={[
          { label: 'Hồ sơ' },
        ]}
        homeHref={homeHref}
      />
    </div>
  );
}
