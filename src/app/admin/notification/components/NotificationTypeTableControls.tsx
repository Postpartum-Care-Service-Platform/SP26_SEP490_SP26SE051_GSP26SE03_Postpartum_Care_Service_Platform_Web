'use client';

import { Button } from '@/components/ui/button';
import { PlusIcon } from '@radix-ui/react-icons';
import styles from './notification-type-table-controls.module.css';

type Props = {
  onCreateClick: () => void;
};

export function NotificationTypeTableControls({ onCreateClick }: Props) {
  return (
    <div className={styles.controls}>
      <h3 className={styles.title}>Danh sách loại thông báo</h3>
      <Button variant="primary" onClick={onCreateClick} className={styles.createButton}>
        <PlusIcon />
        Thêm loại thông báo
      </Button>
    </div>
  );
}

