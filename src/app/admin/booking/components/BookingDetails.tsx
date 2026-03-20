'use client';

import { usePathname } from 'next/navigation';
import React from 'react';

import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import styles from './booking-header.module.css';

interface BookingDetailsProps {
  id: string;
}

export function BookingDetails({ id }: BookingDetailsProps) {
  const pathname = usePathname();
  const isManager = pathname?.startsWith('/manager');
  const baseRoute = isManager ? '/manager' : '/admin';

  return (
    <div className={styles.detailsContainer}>
      <div className={styles.header}>
        <h4 className={styles.title}>Chi tiết đặt phòng #{id}</h4>
        <Breadcrumbs
          items={[
            { label: 'Đặt phòng', href: `${baseRoute}/booking` },
            { label: 'Chi tiết' },
          ]}
          homeHref={baseRoute}
        />
      </div>
      
      <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
        <p>Nội dung chi tiết booking sẽ được hiển thị ở đây...</p>
      </div>
    </div>
  );
}
