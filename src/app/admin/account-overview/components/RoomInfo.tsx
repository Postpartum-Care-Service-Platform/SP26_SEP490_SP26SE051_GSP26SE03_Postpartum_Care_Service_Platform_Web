'use client';

import { SquareIcon, PersonIcon } from '@radix-ui/react-icons';
import Image from 'next/image';

import styles from './room-info.module.css';

const BedIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M2 4v16M2 8h18M6 8v8M18 8v8" />
  </svg>
);

export function RoomInfo() {
  return (
    <div className={styles.roomCard}>
      <div className={styles.header}>
        <h5 className={styles.title}>Room Info</h5>
        <a href="#" className={styles.viewDetailLink}>View Detail</a>
      </div>

      <div className={styles.roomImageWrapper}>
        <Image
          src="/placeholder-room.jpg"
          alt="Room"
          width={400}
          height={250}
          className={styles.roomImage}
        />
      </div>

      <div className={styles.roomSpecs}>
        <div className={styles.specItem}>
          <SquareIcon width={16} height={16} />
          <span>35 m²</span>
        </div>
        <div className={styles.specItem}>
          <BedIcon />
          <span>King Bed</span>
        </div>
        <div className={styles.specItem}>
          <PersonIcon width={16} height={16} />
          <span>2 guests</span>
        </div>
      </div>

      <div className={styles.priceSummary}>
        <div className={styles.priceHeader}>
          <h6 className={styles.priceTitle}>Price Summary</h6>
          <span className={styles.paidBadge}>Paid</span>
        </div>
        <div className={styles.priceRow}>
          <span className={styles.priceLabel}>Room and offer:</span>
          <span className={styles.priceValue}>$450.00</span>
        </div>
        <div className={styles.priceRow}>
          <span className={styles.priceLabel}>Extras:</span>
          <span className={styles.priceValue}>$0.00</span>
        </div>
        <div className={styles.priceRow}>
          <span className={styles.priceLabel}>8% VAT:</span>
          <span className={styles.priceValue}>$36.00</span>
        </div>
        <div className={styles.priceRow}>
          <span className={styles.priceLabel}>City Tax:</span>
          <span className={styles.priceValue}>$49.50</span>
        </div>
        <div className={styles.priceRowTotal}>
          <span className={styles.totalLabel}>Total Price:</span>
          <span className={styles.totalValue}>$535.50</span>
        </div>
      </div>

      <div className={styles.notesSection}>
        <h6 className={styles.notesTitle}>Notes</h6>
        <p className={styles.notesText}>
          Invoice sent to corporate account; payment confirmed by BIG Corporation
        </p>
      </div>
    </div>
  );
}
