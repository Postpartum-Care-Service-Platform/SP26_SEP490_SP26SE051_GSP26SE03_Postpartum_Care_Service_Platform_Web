'use client';

import { Breadcrumbs } from '@/components/ui/breadcrumbs';

import styles from './food-list-header.module.css';

export function FoodListHeader() {
  return (
    <div className={styles.header}>
      <h4 className={styles.title}>Danh sách món ăn</h4>
      <Breadcrumbs
        items={[
          { label: 'Món ăn' },
        ]}
        homeHref="/admin"
      />
    </div>
  );
}

