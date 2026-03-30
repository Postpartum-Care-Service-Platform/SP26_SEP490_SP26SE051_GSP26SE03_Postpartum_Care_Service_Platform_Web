'use client';

import { usePathname } from 'next/navigation';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

import styles from './amenity-ticket-header.module.css';

export function AmenityTicketListHeader() {
  const pathname = usePathname();
  const isManager = pathname?.startsWith('/manager');
  const homeHref = isManager ? '/manager' : '/admin';
  const amenityHref = isManager ? '/manager/amenity-service' : '/admin/amenity-service';

  return (
    <div className={styles.header}>
      <Breadcrumbs
        items={[
          { label: 'Tiện ích', href: amenityHref },
          { label: 'Vé tiện ích' },
        ]}
        homeHref={homeHref}
      />
    </div>
  );
}
