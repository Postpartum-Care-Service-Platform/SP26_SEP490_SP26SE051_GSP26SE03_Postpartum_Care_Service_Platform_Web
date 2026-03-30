'use client';

import { usePathname } from 'next/navigation';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

import styles from './booking-header.module.css';

export function BookingHeader() {
  const pathname = usePathname();
  const isManager = pathname?.startsWith('/manager');
  const homeHref = isManager ? '/manager' : '/admin';

  return (
    <div className={styles.header}>
      <Breadcrumbs
        items={[
          { label: 'Đặt phòng' },
        ]}
        homeHref={homeHref}
      />
    </div>
  );
}

