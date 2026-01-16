'use client';

import { Cross1Icon } from '@radix-ui/react-icons';
import type { ContractCustomer } from '@/types/contract';
import styles from './contract-customer-info.module.css';

type Props = {
  customer: ContractCustomer | null;
  onClose?: () => void;
};

const getInitials = (name: string) => {
  if (!name) return '';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

export function ContractCustomerInfo({ customer, onClose }: Props) {
  if (!customer) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <p>Chọn một hợp đồng để xem thông tin khách hàng</p>
        </div>
      </div>
    );
  }

  const initials = getInitials(customer.username);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Đóng">
          <Cross1Icon className={styles.closeIcon} />
        </button>
        <div className={styles.profileSection}>
          <div className={styles.avatarWrapper}>
            <div className={styles.avatar}>
              {initials}
            </div>
          </div>
          <h4 className={styles.customerName}>{customer.username}</h4>
          <p className={styles.customerRole}>Khách hàng</p>
        </div>

        <div className={styles.contactSection}>
          <h5 className={styles.sectionTitle}>Contact Info</h5>
          <div className={styles.infoSection}>
            <div className={styles.infoRow}>
              <span className={styles.label}>Email:</span>
              <span className={styles.value}>{customer.email}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Phone:</span>
              <span className={styles.value}>{customer.phone || '-'}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>ID:</span>
              <span className={styles.value}>{customer.id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
