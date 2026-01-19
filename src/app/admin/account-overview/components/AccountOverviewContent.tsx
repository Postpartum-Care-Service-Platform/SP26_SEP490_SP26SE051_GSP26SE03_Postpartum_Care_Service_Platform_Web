'use client';

import Image from 'next/image';
import styles from './account-overview-content.module.css';

export function AccountOverviewContent() {
  return (
    <div className={styles.container}>
      <div className={styles.leftSection}>
        <div className={styles.profileCard}>
          <div className={styles.avatarWrapper}>
            <div className={styles.avatar}>
              <Image
                src="/placeholder-avatar.png"
                alt="Avatar"
                width={120}
                height={120}
                className={styles.avatarImage}
              />
            </div>
          </div>
          <h6 className={styles.name}>Alexandra Rodriguez</h6>
          <p className={styles.email}>alexandrarodriguez@gmail.com</p>
          <p className={styles.appointmentsTitle}>Appointments</p>
          <div className={styles.appointmentsStats}>
            <div className={styles.statItem}>
              <h4 className={styles.statValue}>10</h4>
              <span className={styles.statLabel}>Past</span>
            </div>
            <div className={styles.statItem}>
              <h4 className={styles.statValue}>3</h4>
              <span className={styles.statLabel}>Upcoming</span>
            </div>
          </div>
          <button type="button" className={styles.sendMessageButton}>
            Send Message
          </button>
        </div>
      </div>
      <div className={styles.rightSection}>
        <div className={styles.detailsCard}>
          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <p className={styles.detailLabel}>Gender</p>
              <p className={styles.detailValue}>Male</p>
            </div>
            <div className={styles.detailItem}>
              <p className={styles.detailLabel}>Birthday</p>
              <p className={styles.detailValue}>Jan 12, 1985</p>
            </div>
            <div className={styles.detailItem}>
              <p className={styles.detailLabel}>Phone number</p>
              <p className={styles.detailValue}>(123) 456-7890</p>
            </div>
            <div className={styles.detailItem}>
              <p className={styles.detailLabel}>Address</p>
              <p className={styles.detailValue}>123 Main St, Apt 4B</p>
            </div>
            <div className={styles.detailItem}>
              <p className={styles.detailLabel}>City</p>
              <p className={styles.detailValue}>New York</p>
            </div>
            <div className={styles.detailItem}>
              <p className={styles.detailLabel}>ZIP Code</p>
              <p className={styles.detailValue}>10001</p>
            </div>
            <div className={styles.detailItem}>
              <p className={styles.detailLabel}>Registration Date</p>
              <p className={styles.detailValue}>Mar 15, 2020</p>
            </div>
            <div className={styles.detailItem}>
              <p className={styles.detailLabel}>Status</p>
              <p className={styles.detailValue}>Active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
